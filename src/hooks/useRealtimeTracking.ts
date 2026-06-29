import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';

export interface Position {
  id: string;
  user_id: string;
  user_type: 'driver' | 'provider';
  lat: number;
  lng: number;
  heading: number | null;
  speed: number | null;
  accuracy: number | null;
  is_online: boolean;
  updated_at: string;
}

export interface LiveJob {
  id: string;
  job_code: string;
  service_type: string;
  status: string;
  driver_name: string;
  driver_phone: string;
  provider_id: string | null;
  price: number;
  eta_minutes: number;
  address: string;
  payment_method: string;
  created_at: string;
  completed_at: string | null;
  providers?: { id: string; name: string; lat: number; lng: number }[];
}

export function useRealtimePositions(userId: string = 'guest') {
  const [driverPos, setDriverPos] = useState({ lat: 5.6037, lng: -0.1870, heading: null as number | null });
  const [providerPositions, setProviderPositions] = useState<Record<string, { lat: number; lng: number; heading: number | null }>>({});
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Upsert driver position
  const updatePosition = useCallback(async (lat: number, lng: number, heading: number | null = null, speed: number | null = null, accuracy: number | null = null) => {
    try {
      await supabase.from('positions').upsert(
        {
          user_id: userId,
          user_type: 'driver',
          lat,
          lng,
          heading,
          speed,
          accuracy,
          is_online: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,user_type' }
      );
    } catch (err) {
      console.error('Position update failed:', err);
    }
  }, [userId]);

  // Fetch all provider positions
  const fetchProviderPositions = useCallback(async () => {
    const { data, error } = await supabase
      .from('positions')
      .select('user_id, lat, lng, heading')
      .eq('user_type', 'provider')
      .eq('is_online', true);

    if (error) {
      setError(error.message);
      return;
    }

    const positions: Record<string, { lat: number; lng: number; heading: number | null }> = {};
    data?.forEach((p) => {
      positions[p.user_id] = { lat: p.lat, lng: p.lng, heading: p.heading };
    });
    setProviderPositions(positions);
  }, []);

  // Subscribe to real-time provider position changes
  useEffect(() => {
    const channel = supabase
      .channel('positions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'positions', filter: 'user_type=eq.provider' }, (payload) => {
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          const newPos = payload.new as Position;
          setProviderPositions((prev) => ({
            ...prev,
            [newPos.user_id]: { lat: newPos.lat, lng: newPos.lng, heading: newPos.heading },
          }));
        } else if (payload.eventType === 'DELETE') {
          const oldPos = payload.old as Position;
          setProviderPositions((prev) => {
            const next = { ...prev };
            delete next[oldPos.user_id];
            return next;
          });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Poll provider positions every 5 seconds as fallback
  useEffect(() => {
    fetchProviderPositions();
    intervalRef.current = setInterval(fetchProviderPositions, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchProviderPositions]);

  // Watch geolocation and sync to Supabase
  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const h = pos.coords.heading;
        const s = pos.coords.speed;
        const a = pos.coords.accuracy;
        setDriverPos({ lat, lng, heading: h });
        await updatePosition(lat, lng, h, s, a);
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [updatePosition]);

  return { driverPos, providerPositions, updatePosition, error };
}

export function useRealtimeJob(jobId?: string) {
  const [job, setJob] = useState<LiveJob | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!jobId) {
      setLoading(false);
      return;
    }

    const fetchJob = async () => {
      const { data } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .maybeSingle();
      if (data) setJob(data as LiveJob);
      setLoading(false);
    };
    fetchJob();

    const channel = supabase
      .channel('jobs')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'jobs', filter: `id=eq.${jobId}` }, (payload) => {
        if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
          setJob(payload.new as LiveJob);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [jobId]);

  return { job, loading };
}

export function useRealtimeBids(jobId?: string) {
  const [bids, setBids] = useState<any[]>([]);

  useEffect(() => {
    if (!jobId) return;

    const fetchBids = async () => {
      const { data } = await supabase
        .from('bids')
        .select('*, providers(name, rating, avatar, trust_score, success_rate)')
        .eq('job_id', jobId)
        .order('price', { ascending: true });
      if (data) setBids(data);
    };
    fetchBids();

    const channel = supabase
      .channel('bids')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bids', filter: `job_id=eq.${jobId}` }, () => {
        fetchBids();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [jobId]);

  return bids;
}
