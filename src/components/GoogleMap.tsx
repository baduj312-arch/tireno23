import { useEffect, useRef, useState } from 'react';
import { importLibrary, setOptions } from '@googlemaps/js-api-loader';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageSquare, Car, Clock, Shield, Star, MapPin, AlertTriangle } from 'lucide-react';

const darkMapStyles: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#0f0f1a' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0f0f1a' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8b8b9e' }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#b4b4c7' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#6b6b7e' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#0d1f0d' }] },
  { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#4a5d4a' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1e1e2e' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#151520' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#2a2a3e' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#1a1a2e' }] },
  { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#6b6b8e' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#1a1a2e' }] },
  { featureType: 'transit.station', elementType: 'labels.text.fill', stylers: [{ color: '#8b8b9e' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0a1a2e' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#4a5d7e' }] },
  { featureType: 'water', elementType: 'labels.text.stroke', stylers: [{ color: '#0a1a2e' }] },
];

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const HAS_REAL_KEY = API_KEY && API_KEY !== 'YOUR_GOOGLE_MAPS_API_KEY' && !API_KEY.includes('Dummy');

export interface GoogleMapProps {
  driverLocation?: { lat: number; lng: number };
  providerLocation?: { lat: number; lng: number };
  showRoute?: boolean;
  height?: string;
  showProviderMarker?: boolean;
  showDriverMarker?: boolean;
  showNearbyProviders?: { lat: number; lng: number; name: string; category: string }[];
  onMapClick?: (e: google.maps.MapMouseEvent) => void;
  isAdmin?: boolean;
  sosMarkers?: { lat: number; lng: number; type: string; id: string }[];
  isUberStyle?: boolean;
  providerInfo?: {
    name: string;
    avatar: string;
    rating: number;
    carModel?: string;
    plateNumber?: string;
    phone?: string;
  };
  onPhoneClick?: () => void;
  onChatClick?: () => void;
  etaText?: string;
  distanceText?: string;
  heading?: number | null;
}

export default function GoogleMapComponent({
  driverLocation = { lat: 5.6037, lng: -0.1870 },
  providerLocation,
  height = '100%',
  showProviderMarker = true,
  showDriverMarker = true,
  showNearbyProviders = [],
  onMapClick,
  isAdmin = false,
  sosMarkers = [],
  isUberStyle = false,
  providerInfo,
  onPhoneClick,
  onChatClick,
  etaText,
  distanceText,
  heading = null,
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [showBottomSheet, setShowBottomSheet] = useState(isUberStyle);
  const [loadError, setLoadError] = useState(!HAS_REAL_KEY);
  const [isLoaded, setIsLoaded] = useState(false);

  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const trafficLayerRef = useRef<google.maps.TrafficLayer | null>(null);
  const driverMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const providerMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const nearbyMarkersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const sosMarkersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);

  // Load Google Maps SDK natively using v2 functional API
  useEffect(() => {
    if (!HAS_REAL_KEY) {
      setLoadError(true);
      return;
    }
    if (isLoaded) return;

    setOptions({ key: API_KEY, v: 'weekly', libraries: ['geometry', 'marker'] });

    importLibrary('maps')
      .then(() => importLibrary('marker'))
      .then(() => importLibrary('geometry'))
      .then(() => {
        setIsLoaded(true);
      })
      .catch(() => {
        setLoadError(true);
      });
  }, [isLoaded]);

  // Initialize native map
  useEffect(() => {
    if (!isLoaded || !mapRef.current || map) return;

    const nativeMap = new google.maps.Map(mapRef.current, {
      center: driverLocation,
      zoom: 15,
      mapTypeId: 'roadmap',
      disableDefaultUI: true,
      zoomControl: false,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
      styles: darkMapStyles,
      gestureHandling: 'greedy',
      tilt: isUberStyle ? 45 : 0,
    });

    setMap(nativeMap);

    if (onMapClick) {
      nativeMap.addListener('click', onMapClick);
    }
  }, [isLoaded, map, driverLocation, isUberStyle, onMapClick]);

  // Add traffic layer
  useEffect(() => {
    if (!map || !isUberStyle) return;
    const traffic = new google.maps.TrafficLayer();
    traffic.setMap(map);
    trafficLayerRef.current = traffic;
  }, [map, isUberStyle]);

  // Smooth camera pan to center both driver and provider
  useEffect(() => {
    if (!map || !providerLocation || !driverLocation) return;

    const dLat = Math.abs(driverLocation.lat - providerLocation.lat);
    const dLng = Math.abs(driverLocation.lng - providerLocation.lng);
    const zoom = dLat < 0.005 && dLng < 0.005 ? 17 : 15;

    map.panTo({
      lat: (driverLocation.lat + providerLocation.lat) / 2,
      lng: (driverLocation.lng + providerLocation.lng) / 2,
    });

    const listener = google.maps.event.addListenerOnce(map, 'idle', () => {
      map.setZoom(zoom);
    });

    return () => {
      google.maps.event.removeListener(listener);
    };
  }, [map, driverLocation, providerLocation]);

  // Calculate and render route using native DirectionsService
  useEffect(() => {
    if (!map || !providerLocation || !driverLocation || !isLoaded) return;

    if (!directionsServiceRef.current) {
      directionsServiceRef.current = new google.maps.DirectionsService();
    }
    if (!directionsRendererRef.current) {
      directionsRendererRef.current = new google.maps.DirectionsRenderer({
        map,
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: '#FF6B2C',
          strokeWeight: 5,
          strokeOpacity: 0.9,
        },
      });
    }

    directionsServiceRef.current.route(
      {
        origin: driverLocation,
        destination: providerLocation,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          directionsRendererRef.current?.setDirections(result);
        }
      }
    );
  }, [map, isLoaded, providerLocation, driverLocation]);

  // Create / update driver marker using native AdvancedMarkerElement
  useEffect(() => {
    if (!map || !showDriverMarker || !isLoaded) return;

    const h = heading || 0;
    const svg = `data:image/svg+xml;utf8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="10" fill="#FF6B2C" stroke="#fff" stroke-width="2"/><circle cx="16" cy="16" r="4" fill="white" opacity="0.5"/><polygon points="16,6 18,14 16,12 14,14" fill="white" transform="rotate(${h}, 16, 16)"/></svg>`
    )}`;

    if (driverMarkerRef.current) {
      driverMarkerRef.current.position = driverLocation;
      if (driverMarkerRef.current.content) {
        const img = driverMarkerRef.current.content as HTMLElement;
        img.style.transform = `rotate(${h}deg)`;
      }
    } else {
      const el = document.createElement('img');
      el.src = svg;
      el.style.width = '32px';
      el.style.height = '32px';
      el.style.transform = `rotate(${h}deg)`;
      el.style.transition = 'transform 0.3s ease';
      driverMarkerRef.current = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: driverLocation,
        content: el,
        zIndex: 100,
      });
    }
  }, [map, driverLocation, heading, showDriverMarker, isLoaded]);

  // Create / update provider marker using native AdvancedMarkerElement
  useEffect(() => {
    if (!map || !showProviderMarker || !providerLocation || !isLoaded) return;

    const svg = `data:image/svg+xml;utf8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28"><rect x="4" y="8" width="20" height="12" rx="3" fill="#22C55E" stroke="#fff" stroke-width="2"/><rect x="8" y="12" width="4" height="4" rx="1" fill="white" opacity="0.7"/><rect x="16" y="12" width="4" height="4" rx="1" fill="white" opacity="0.7"/><rect x="10" y="6" width="8" height="4" rx="2" fill="#22C55E" stroke="#fff" stroke-width="1.5"/></svg>`
    )}`;

    if (providerMarkerRef.current) {
      providerMarkerRef.current.position = providerLocation;
    } else {
      const el = document.createElement('img');
      el.src = svg;
      el.style.width = '28px';
      el.style.height = '28px';
      providerMarkerRef.current = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: providerLocation,
        content: el,
        zIndex: 101,
      });
    }
  }, [map, providerLocation, showProviderMarker, isLoaded]);

  // Nearby provider markers
  useEffect(() => {
    if (!map || !isLoaded) return;

    // Clear old
    nearbyMarkersRef.current.forEach(m => m.map = null);
    nearbyMarkersRef.current = [];

    showNearbyProviders.forEach((p) => {
      const el = document.createElement('div');
      el.style.width = '16px';
      el.style.height = '16px';
      el.style.borderRadius = '50%';
      el.style.background = '#3B82F6';
      el.style.border = '1px solid white';
      el.style.opacity = '0.7';
      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: { lat: p.lat, lng: p.lng },
        content: el,
        title: p.name,
      });
      nearbyMarkersRef.current.push(marker);
    });
  }, [map, showNearbyProviders, isLoaded]);

  // SOS markers for admin
  useEffect(() => {
    if (!map || !isAdmin || !isLoaded) return;

    sosMarkersRef.current.forEach(m => m.map = null);
    sosMarkersRef.current = [];

    const getSosColor = (type: string) => {
      switch (type) {
        case 'mechanic': return '#FF6B2C';
        case 'tow': return '#3B82F6';
        case 'fuel': return '#EAB308';
        case 'battery': return '#22C55E';
        default: return '#EF4444';
      }
    };

    sosMarkers.forEach((sos) => {
      const el = document.createElement('div');
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%';
      el.style.background = getSosColor(sos.type);
      el.style.border = '2px solid white';
      el.style.animation = 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite';
      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: { lat: sos.lat, lng: sos.lng },
        content: el,
      });
      sosMarkersRef.current.push(marker);
    });
  }, [map, isAdmin, sosMarkers, isLoaded]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      driverMarkerRef.current?.map && (driverMarkerRef.current.map = null);
      providerMarkerRef.current?.map && (providerMarkerRef.current.map = null);
      nearbyMarkersRef.current.forEach(m => m.map = null);
      sosMarkersRef.current.forEach(m => m.map = null);
      directionsRendererRef.current?.setMap(null);
      trafficLayerRef.current?.setMap(null);
    };
  }, []);

  // Fallback map when no API key
  const FallbackMap = () => {
    const dLat = driverLocation?.lat ?? 5.6037;
    const dLng = driverLocation?.lng ?? -0.1870;
    const pLat = providerLocation?.lat ?? dLat + 0.003;
    const pLng = providerLocation?.lng ?? dLng + 0.002;

    return (
      <div className="relative w-full h-full bg-[#0f0f1a] overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255,107,44,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,44,0.04) 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }} />
        <div className="absolute top-[30%] left-0 right-0 h-[2px] bg-[#1e1e2e]" />
        <div className="absolute top-[60%] left-0 right-0 h-[2px] bg-[#1e1e2e]" />
        <div className="absolute top-0 bottom-0 left-[25%] w-[2px] bg-[#1e1e2e]" />
        <div className="absolute top-0 bottom-0 left-[70%] w-[2px] bg-[#1e1e2e]" />

        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <motion.path
            d={`M ${20 + (dLng + 0.187) * 2000} ${75 - (dLat - 5.603) * 2000} Q 50 50 ${20 + (pLng + 0.187) * 2000} ${75 - (pLat - 5.603) * 2000}`}
            stroke="#FF6B2C"
            strokeWidth="0.5"
            strokeDasharray="2 2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />
        </svg>

        <div
          className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${20 + (dLng + 0.187) * 2000}%`, top: `${75 - (dLat - 5.603) * 2000}%` }}
        >
          <div className="relative w-full h-full">
            <div className="absolute inset-0 rounded-full bg-tireno-orange/30 animate-ping" />
            <div className="absolute inset-1 rounded-full bg-tireno-orange border-2 border-white flex items-center justify-center">
              <MapPin size={14} className="text-white" />
            </div>
          </div>
        </div>

        <div
          className="absolute w-7 h-7 -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${20 + (pLng + 0.187) * 2000}%`, top: `${75 - (pLat - 5.603) * 2000}%` }}
        >
          <div className="w-full h-full rounded-full bg-tireno-green border-2 border-white flex items-center justify-center">
            <Car size={14} className="text-white" />
          </div>
        </div>

        {showNearbyProviders.map((p, i) => (
          <div
            key={i}
            className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-tireno-blue/70 border border-white/50"
            style={{ left: `${20 + (p.lng + 0.187) * 2000}%`, top: `${75 - (p.lat - 5.603) * 2000}%` }}
          />
        ))}

        {isAdmin && sosMarkers.map((sos, i) => (
          <div
            key={i}
            className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white animate-ping"
            style={{ left: `${20 + (sos.lng + 0.187) * 2000}%`, top: `${75 - (sos.lat - 5.603) * 2000}%`, backgroundColor: sos.type === 'mechanic' ? '#FF6B2C' : sos.type === 'tow' ? '#3B82F6' : sos.type === 'fuel' ? '#EAB308' : '#22C55E' }}
          />
        ))}

        <div className="absolute top-[30%] left-[25%] w-[45%] h-[2px] bg-tireno-red/30" />
        <div className="absolute top-[60%] left-[70%] w-[10%] h-[2px] bg-tireno-green/30" />

        <div className="absolute top-4 left-4 right-4">
          <div className="bg-tireno-dark/90 backdrop-blur-sm rounded-xl px-4 py-2 border border-tireno-yellow/20 flex items-center gap-2">
            <AlertTriangle size={14} className="text-tireno-yellow shrink-0" />
            <span className="text-tireno-yellow text-xs">Add a Google Maps API key to enable real maps</span>
          </div>
        </div>
      </div>
    );
  };

  if (!isLoaded && !loadError) {
    return (
      <div className="w-full h-full bg-[#0f0f1a] flex flex-col items-center justify-center">
        <div className="w-10 h-10 rounded-xl bg-tireno-orange/10 flex items-center justify-center mb-3">
          <div className="w-5 h-5 rounded-full border-2 border-tireno-orange/30 border-t-tireno-orange animate-spin" />
        </div>
        <p className="text-white/40 text-sm">Loading map...</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="relative w-full h-full">
        <FallbackMap />
        {isUberStyle && (
          <>
            <div className="absolute top-0 left-0 right-0 p-4">
              <div className="flex items-center justify-between">
                <div className="bg-tireno-dark/90 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-tireno-orange animate-pulse" />
                    <span className="text-white text-sm font-medium">Live Tracking</span>
                  </div>
                </div>
                <div className="bg-tireno-dark/90 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-tireno-orange" />
                    <span className="text-white text-sm font-medium">{etaText || '4 min'}</span>
                  </div>
                </div>
              </div>
            </div>
            <BottomSheet
              providerInfo={providerInfo}
              etaText={etaText}
              distanceText={distanceText}
              onPhoneClick={onPhoneClick}
              onChatClick={onChatClick}
              showBottomSheet={showBottomSheet}
              setShowBottomSheet={setShowBottomSheet}
            />
          </>
        )}
        {isAdmin && (
          <div className="absolute bottom-4 left-4 bg-tireno-dark/80 backdrop-blur-sm rounded-xl p-3 border border-white/[0.06]">
            <div className="flex items-center gap-3 text-white/40 text-[10px]">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-tireno-orange" /> Mechanic</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-tireno-blue" /> Tow</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-tireno-yellow" /> Fuel</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-tireno-green" /> Battery</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} style={{ width: '100%', height, position: 'absolute', inset: 0 }} />

      {/* Uber-style Overlay - Top bar */}
      {isUberStyle && (
        <div className="absolute top-0 left-0 right-0 p-4">
          <div className="flex items-center justify-between">
            <div className="bg-tireno-dark/90 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/[0.06]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-tireno-orange animate-pulse" />
                <span className="text-white text-sm font-medium">Live Tracking</span>
              </div>
            </div>
            <div className="bg-tireno-dark/90 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-tireno-orange" />
                <span className="text-white text-sm font-medium">{etaText || '4 min'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Sheet */}
      <BottomSheet
        providerInfo={providerInfo}
        etaText={etaText}
        distanceText={distanceText}
        onPhoneClick={onPhoneClick}
        onChatClick={onChatClick}
        showBottomSheet={showBottomSheet}
        setShowBottomSheet={setShowBottomSheet}
      />

      {/* Map legend for admin */}
      {isAdmin && (
        <div className="absolute bottom-4 left-4 bg-tireno-dark/80 backdrop-blur-sm rounded-xl p-3 border border-white/[0.06]">
          <div className="flex items-center gap-3 text-white/40 text-[10px]">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-tireno-orange" /> Mechanic</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-tireno-blue" /> Tow</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-tireno-yellow" /> Fuel</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-tireno-green" /> Battery</span>
          </div>
        </div>
      )}
    </div>
  );
}

function BottomSheet({
  providerInfo,
  etaText,
  distanceText,
  onPhoneClick,
  onChatClick,
  showBottomSheet,
  setShowBottomSheet,
}: {
  providerInfo?: GoogleMapProps['providerInfo'];
  etaText?: string;
  distanceText?: string;
  onPhoneClick?: () => void;
  onChatClick?: () => void;
  showBottomSheet: boolean;
  setShowBottomSheet: (v: boolean) => void;
}) {
  if (!providerInfo) return null;

  return (
    <AnimatePresence>
      {showBottomSheet && (
        <motion.div
          initial={{ y: 300 }}
          animate={{ y: 0 }}
          exit={{ y: 300 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="absolute bottom-0 left-0 right-0 bg-tireno-dark/95 backdrop-blur-xl border-t border-white/[0.06] rounded-t-3xl overflow-hidden"
          style={{ maxHeight: '60%' }}
        >
          <div className="flex items-center justify-center py-2">
            <button
              onClick={() => setShowBottomSheet(!showBottomSheet)}
              className="w-12 h-1 rounded-full bg-white/20"
            />
          </div>

          <div className="px-4 pb-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="bg-tireno-orange/10 rounded-full px-4 py-2 border border-tireno-orange/20 flex items-center gap-2">
                <Car size={16} className="text-tireno-orange" />
                <span className="text-tireno-orange font-bold text-sm">Arriving in {etaText || '4 min'}</span>
              </div>
              <div className="bg-white/[0.03] rounded-full px-4 py-2 border border-white/[0.06] flex items-center gap-2">
                <MapPin size={14} className="text-white/40" />
                <span className="text-white/40 text-sm">{distanceText || '2.3 km'}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-tireno-orange to-tireno-orangeDark flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-tireno-orange/20">
                {providerInfo.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold text-base">{providerInfo.name}</span>
                  <div className="flex items-center gap-1 bg-tireno-yellow/10 rounded-full px-2 py-0.5">
                    <Star size={12} className="text-tireno-yellow fill-tireno-yellow" />
                    <span className="text-tireno-yellow text-xs font-bold">{providerInfo.rating}</span>
                  </div>
                </div>
                <p className="text-white/40 text-sm">{providerInfo.carModel || 'Toyota Pickup'} • {providerInfo.plateNumber || 'GR-1234-20'}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={onPhoneClick}
                  className="w-12 h-12 rounded-full bg-tireno-green/10 flex items-center justify-center border border-tireno-green/20 hover:bg-tireno-green/20 transition-colors"
                >
                  <Phone size={20} className="text-tireno-green" />
                </button>
                <button
                  onClick={onChatClick}
                  className="w-12 h-12 rounded-full bg-tireno-orange/10 flex items-center justify-center border border-tireno-orange/20 hover:bg-tireno-orange/20 transition-colors"
                >
                  <MessageSquare size={20} className="text-tireno-orange" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white/[0.03] rounded-xl px-4 py-3 border border-white/[0.06]">
              <Shield size={18} className="text-tireno-green" />
              <span className="text-white/60 text-sm">Ride-or-Tow safety active</span>
              <span className="text-tireno-green text-xs ml-auto">3 contacts</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
