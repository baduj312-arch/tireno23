import { useState, useEffect, useRef, useCallback } from 'react';

export interface GeoPosition {
  lat: number;
  lng: number;
  accuracy: number;
  heading: number | null;
  speed: number | null;
  timestamp: number;
}

export function useGeolocation() {
  const [position, setPosition] = useState<GeoPosition>({
    lat: 5.6037,
    lng: -0.1870,
    accuracy: 10,
    heading: null,
    speed: null,
    timestamp: Date.now(),
  });
  const [error, setError] = useState<string | null>(null);
  const [permission, setPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const watchId = useRef<number | null>(null);

  const startWatching = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }

    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
    }

    watchId.current = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          heading: pos.coords.heading,
          speed: pos.coords.speed,
          timestamp: pos.timestamp,
        });
        setError(null);
        setPermission('granted');
      },
      (err) => {
        setError(err.message);
        if (err.code === 1) setPermission('denied');
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      }
    );
  }, []);

  const getCurrentPosition = useCallback(() => {
    return new Promise<GeoPosition>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          heading: pos.coords.heading,
          speed: pos.coords.speed,
          timestamp: pos.timestamp,
        }),
        (err) => reject(err),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  }, []);

  useEffect(() => {
    startWatching();
    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
  }, [startWatching]);

  return { position, error, permission, startWatching, getCurrentPosition };
}

export function useSimulatedProviderMovement(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
  durationMs: number = 300000
) {
  const [providerPos, setProviderPos] = useState({ lat: startLat, lng: startLng });
  const startTime = useRef(Date.now());
  const raf = useRef<number | null>(null);

  useEffect(() => {
    startTime.current = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime.current;
      const progress = Math.min(elapsed / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic

      setProviderPos({
        lat: startLat + (endLat - startLat) * eased,
        lng: startLng + (endLng - startLng) * eased,
      });

      if (progress < 1) {
        raf.current = requestAnimationFrame(animate);
      }
    };

    raf.current = requestAnimationFrame(animate);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [startLat, startLng, endLat, endLng, durationMs]);

  return providerPos;
}

export function useDistanceAndEta(
  driverPos: { lat: number; lng: number },
  providerPos: { lat: number; lng: number }
) {
  const [distance, setDistance] = useState({ km: 2.3, text: '2.3 km' });
  const [eta, setEta] = useState({ minutes: 4, text: '4 min' });

  useEffect(() => {
    const R = 6371; // km
    const dLat = ((providerPos.lat - driverPos.lat) * Math.PI) / 180;
    const dLng = ((providerPos.lng - driverPos.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((driverPos.lat * Math.PI) / 180) *
        Math.cos((providerPos.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const km = R * c;

    // Average speed ~30 km/h in city
    const minutes = Math.max(1, Math.round((km / 30) * 60));

    setDistance({
      km: Math.round(km * 10) / 10,
      text: km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`,
    });
    setEta({
      minutes,
      text: minutes < 1 ? '< 1 min' : `${minutes} min`,
    });
  }, [driverPos.lat, driverPos.lng, providerPos.lat, providerPos.lng]);

  return { distance, eta };
}
