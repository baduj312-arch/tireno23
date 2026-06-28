import { useEffect, useRef, useState, useCallback } from 'react';
import { GoogleMap as GoogleMapComponent, useJsApiLoader, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { Navigation, Car } from 'lucide-react';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '16px',
};

const mapOptions = {
  mapTypeId: 'roadmap',
  disableDefaultUI: true,
  zoomControl: false,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
  styles: [
    { elementType: 'geometry', stylers: [{ color: '#1a1a2e' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1a2e' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#6B7280' }] },
    { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#9CA3AF' }] },
    { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#6B7280' }] },
    { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#1e2a1e' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2d2d3d' }] },
    { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#1a1a2e' }] },
    { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#3d3d5d' }] },
    { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#2d2d3d' }] },
    { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#2d2d3d' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#1a2a3e' }] },
    { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#4B5563' }] },
  ],
};

const libraries: ("places" | "geometry" | "drawing" | "visualization")[] = ['places'];

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
}

export default function GoogleMap({
  driverLocation = { lat: 5.6037, lng: -0.1870 },
  providerLocation,
  showRoute = false,
  height = '200px',
  showProviderMarker = true,
  showDriverMarker = true,
  showNearbyProviders = [],
  onMapClick,
  isAdmin = false,
  sosMarkers = [],
}: GoogleMapProps) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyDummyKeyForDemo',
    libraries,
  });

  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [userLocation, setUserLocation] = useState(driverLocation);

  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null);

  // Get user's real location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => {
          // Fallback to default Accra location
        },
        { enableHighAccuracy: true }
      );

      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => {},
        { enableHighAccuracy: true, maximumAge: 10000 }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  // Calculate route
  const calculateRoute = useCallback(() => {
    if (!isLoaded || !providerLocation || !userLocation) return;

    if (!directionsServiceRef.current) {
      directionsServiceRef.current = new google.maps.DirectionsService();
    }

    directionsServiceRef.current.route(
      {
        origin: userLocation,
        destination: providerLocation,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          setDirections(result);
        }
      }
    );
  }, [isLoaded, providerLocation, userLocation]);

  useEffect(() => {
    if (showRoute && providerLocation) {
      calculateRoute();
    }
  }, [showRoute, providerLocation, calculateRoute]);

  // Center map on user
  useEffect(() => {
    if (map && userLocation) {
      map.panTo(userLocation);
    }
  }, [map, userLocation]);

  if (!isLoaded) {
    return (
      <div className="w-full rounded-2xl bg-[#1a1a2e] flex items-center justify-center" style={{ height }}>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full border-2 border-tireno-orange/30 border-t-tireno-orange animate-spin" />
          <span className="text-white/40 text-sm">Loading map...</span>
        </div>
      </div>
    );
  }

  const markerIcon = (color: string) => ({
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: color,
    fillOpacity: 1,
    strokeColor: '#fff',
    strokeWeight: 2,
    scale: 8,
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

  return (
    <div className="relative w-full rounded-2xl overflow-hidden" style={{ height }}>
      <GoogleMapComponent
        mapContainerStyle={mapContainerStyle}
        center={userLocation}
        zoom={15}
        options={mapOptions}
        onLoad={setMap}
        onClick={onMapClick}
      >
        {/* Driver Marker */}
        {showDriverMarker && (
          <Marker
            position={userLocation}
            icon={markerIcon('#FF6B2C')}
            animation={google.maps.Animation.BOUNCE}
          />
        )}

        {/* Provider Marker */}
        {showProviderMarker && providerLocation && (
          <Marker
            position={providerLocation}
            icon={markerIcon('#22C55E')}
          />
        )}

        {/* Nearby Providers */}
        {showNearbyProviders.map((p, i) => (
          <Marker
            key={i}
            position={{ lat: p.lat, lng: p.lng }}
            icon={markerIcon('#3B82F6')}
            title={p.name}
          />
        ))}

        {/* SOS Markers for Admin */}
        {isAdmin && sosMarkers.map((sos, i) => (
          <Marker
            key={i}
            position={{ lat: sos.lat, lng: sos.lng }}
            icon={markerIcon(getSosColor(sos.type))}
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
                strokeWeight: 4,
                strokeOpacity: 0.8,
              },
            }}
          />
        )}
      </GoogleMapComponent>

      {/* Map Overlay - ETA Card */}
      {showRoute && providerLocation && directions && (
        <div className="absolute bottom-3 left-3 right-3 bg-tireno-dark/90 backdrop-blur-sm rounded-xl p-3 border border-white/[0.06]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Navigation size={16} className="text-tireno-orange" />
              <span className="text-white text-sm font-medium">
                {directions.routes[0]?.legs[0]?.duration?.text || '4 min'}
              </span>
              <span className="text-white/30 text-xs">
                {directions.routes[0]?.legs[0]?.distance?.text || '2.3 km'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Car size={14} className="text-tireno-green" />
              <span className="text-tireno-green text-xs">En Route</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
