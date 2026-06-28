import { useEffect, useRef, useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation, Phone, MessageSquare, Car, Clock, Shield, Star } from 'lucide-react';

const mapContainerStyle = { width: '100%', height: '100%', borderRadius: '0px' };

const darkMapStyles = [
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

const libraries: ("places" | "geometry" | "drawing" | "visualization")[] = ['geometry'];

interface GoogleMapProps {
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
}

export default function GoogleMapComponent({
  driverLocation = { lat: 5.6037, lng: -0.1870 },
  providerLocation,
  showRoute = false,
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
}: GoogleMapProps) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyDummyKeyForDemo',
    libraries,
  });

  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [center, setCenter] = useState(driverLocation);
  const [showBottomSheet, setShowBottomSheet] = useState(isUberStyle);
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null);

  // Update center when driver moves
  useEffect(() => {
    setCenter(driverLocation);
    if (map) {
      map.panTo(driverLocation);
    }
  }, [driverLocation, map]);

  // Calculate route
  const calculateRoute = useCallback(() => {
    if (!isLoaded || !providerLocation || !driverLocation) return;
    if (!directionsServiceRef.current) {
      directionsServiceRef.current = new google.maps.DirectionsService();
    }
    directionsServiceRef.current.route(
      {
        origin: driverLocation,
        destination: providerLocation,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          setDirections(result);
        }
      }
    );
  }, [isLoaded, providerLocation, driverLocation]);

  useEffect(() => {
    if (showRoute && providerLocation) {
      calculateRoute();
    }
  }, [showRoute, providerLocation, calculateRoute]);

  // Fit bounds to show both markers
  useEffect(() => {
    if (map && providerLocation && driverLocation) {
      const bounds = new google.maps.LatLngBounds();
      bounds.extend(driverLocation);
      bounds.extend(providerLocation);
      map.fitBounds(bounds, { top: 50, bottom: 200, left: 50, right: 50 });
    }
  }, [map, providerLocation, driverLocation]);

  const getMarkerIcon = (color: string, isPulse = false) => ({
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: color,
    fillOpacity: isPulse ? 0.3 : 1,
    strokeColor: '#fff',
    strokeWeight: 2,
    scale: isPulse ? 16 : 10,
  });

  const getSosColor = (type: string) => {
    switch (type) {
      case 'mechanic': return '#FF6B2C';
      case 'tow': return '#3B82F6';
      case 'fuel': return '#EAB308';
      case 'battery': return '#22C55E';
      default: return '#EF4444';
    }
  };

  if (!isLoaded) {
    return (
      <div className="w-full h-full bg-[#0f0f1a] flex flex-col items-center justify-center">
        <div className="w-10 h-10 rounded-xl bg-tireno-orange/10 flex items-center justify-center mb-3">
          <div className="w-5 h-5 rounded-full border-2 border-tireno-orange/30 border-t-tireno-orange animate-spin" />
        </div>
        <p className="text-white/40 text-sm">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <GoogleMap
        mapContainerStyle={{ ...mapContainerStyle, height }}
        center={center}
        zoom={15}
        options={{
          mapTypeId: 'roadmap',
          disableDefaultUI: true,
          zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          styles: darkMapStyles,
          gestureHandling: 'greedy',
        }}
        onLoad={setMap}
        onClick={onMapClick}
      >
        {/* Driver Marker with pulse ring */}
        {showDriverMarker && (
          <>
            <Marker
              position={driverLocation}
              icon={getMarkerIcon('#FF6B2C', true)}
              zIndex={10}
            />
            <Marker
              position={driverLocation}
              icon={getMarkerIcon('#FF6B2C', false)}
              zIndex={11}
            />
          </>
        )}

        {/* Provider Marker with car icon */}
        {showProviderMarker && providerLocation && (
          <Marker
            position={providerLocation}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: '#22C55E',
              fillOpacity: 1,
              strokeColor: '#fff',
              strokeWeight: 3,
              scale: 12,
            }}
            zIndex={12}
            animation={google.maps.Animation.BOUNCE}
          />
        )}

        {/* Nearby Providers */}
        {showNearbyProviders.map((p, i) => (
          <Marker
            key={i}
            position={{ lat: p.lat, lng: p.lng }}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: '#3B82F6',
              fillOpacity: 0.7,
              strokeColor: '#fff',
              strokeWeight: 1,
              scale: 8,
            }}
            title={p.name}
          />
        ))}

        {/* SOS Markers for Admin */}
        {isAdmin && sosMarkers.map((sos, i) => (
          <Marker
            key={i}
            position={{ lat: sos.lat, lng: sos.lng }}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: getSosColor(sos.type),
              fillOpacity: 1,
              strokeColor: '#fff',
              strokeWeight: 2,
              scale: 10,
            }}
            animation={google.maps.Animation.BOUNCE}
          />
        ))}

        {/* Route */}
        {showRoute && directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: true,
              polylineOptions: {
                strokeColor: '#FF6B2C',
                strokeWeight: 5,
                strokeOpacity: 0.9,
              },
            }}
          />
        )}
      </GoogleMap>

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

      {/* Uber-style Bottom Sheet */}
      <AnimatePresence>
        {isUberStyle && showBottomSheet && providerInfo && (
          <motion.div
            initial={{ y: 300 }}
            animate={{ y: 0 }}
            exit={{ y: 300 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute bottom-0 left-0 right-0 bg-tireno-dark/95 backdrop-blur-xl border-t border-white/[0.06] rounded-t-3xl overflow-hidden"
            style={{ maxHeight: '60%' }}
          >
            {/* Drag handle */}
            <div className="flex items-center justify-center py-2">
              <button
                onClick={() => setShowBottomSheet(!showBottomSheet)}
                className="w-12 h-1 rounded-full bg-white/20"
              />
            </div>

            {/* Provider Info */}
            <div className="px-4 pb-6">
              {/* ETA Banner */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="bg-tireno-orange/10 rounded-full px-4 py-2 border border-tireno-orange/20 flex items-center gap-2">
                  <Car size={16} className="text-tireno-orange" />
                  <span className="text-tireno-orange font-bold text-sm">Arriving in {etaText || '4 min'}</span>
                </div>
                <div className="bg-white/[0.03] rounded-full px-4 py-2 border border-white/[0.06] flex items-center gap-2">
                  <Navigation size={14} className="text-white/40" />
                  <span className="text-white/40 text-sm">{distanceText || '2.3 km'}</span>
                </div>
              </div>

              {/* Provider Card */}
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

              {/* Safety Badge */}
              <div className="flex items-center gap-2 bg-white/[0.03] rounded-xl px-4 py-3 border border-white/[0.06]">
                <Shield size={18} className="text-tireno-green" />
                <span className="text-white/60 text-sm">Ride-or-Tow safety active</span>
                <span className="text-tireno-green text-xs ml-auto">3 contacts</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
