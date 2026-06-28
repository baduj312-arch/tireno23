import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, MessageSquare, Check, Circle, Shield } from 'lucide-react';
import Layout from '../components/Layout';
import Header from '../components/Header';
import { mockCurrentJob } from '../data/mock';
import GoogleMap from '../components/GoogleMap';

export default function Tracking() {
  const navigate = useNavigate();
  const provider = mockCurrentJob.provider;
  const safetyContacts = [
    { name: 'Dad', phone: '0244...' },
    { name: 'Mom', phone: '0245...' },
    { name: 'Wife', phone: '0246...' },
  ];

  const [driverLocation, setDriverLocation] = useState({ lat: 5.6037, lng: -0.1870 });
  const [providerLocation, setProviderLocation] = useState({ lat: 5.6057, lng: -0.1850 });
  const [eta, setEta] = useState('4 min');

  const [steps, setSteps] = useState([
    { label: 'Request Sent', done: true, active: false },
    { label: 'Provider Assigned', done: true, active: false },
    { label: 'En Route', done: false, active: true },
    { label: 'In Progress', done: false, active: false },
    { label: 'Completed', done: false, active: false },
  ]);

  // Simulate real-time provider movement
  useEffect(() => {
    const interval = setInterval(() => {
      setProviderLocation(prev => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.0005,
        lng: prev.lng + (Math.random() - 0.5) * 0.0005,
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Simulate ETA countdown
  useEffect(() => {
    const interval = setInterval(() => {
      const currentMinutes = parseInt(eta.split(' ')[0]);
      if (currentMinutes > 1) {
        setEta(`${currentMinutes - 1} min`);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [eta]);

  // Get driver's real location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setDriverLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => {},
        { enableHighAccuracy: true }
      );

      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setDriverLocation({
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

  const handleComplete = useCallback(() => {
    setSteps(prev => prev.map((s, i) => ({
      ...s,
      done: i < 4,
      active: i === 4,
    })));
    setTimeout(() => navigate('/payment'), 1000);
  }, [navigate]);

  return (
    <Layout>
      <Header
        title="Live Tracking"
        right={
          <button onClick={() => navigate('/chat/1')} className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center hover:bg-white/[0.06] transition-colors">
            <MessageSquare size={18} className="text-tireno-orange" />
          </button>
        }
      />
      <div className="p-4 pb-6">
        {/* Google Map */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <GoogleMap
            driverLocation={driverLocation}
            providerLocation={providerLocation}
            showRoute={true}
            height="280px"
            showProviderMarker={true}
            showDriverMarker={true}
          />
        </motion.div>

        {/* Provider Mini Card */}
        <div className="card-dark p-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full gradient-orange flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-tireno-orange/20">
              {provider.avatar}
            </div>
            <div className="flex-1">
              <p className="text-white font-medium text-sm">{provider.name}</p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-tireno-orange animate-pulse" />
                <span className="text-tireno-orange text-xs font-medium">En Route ETA {eta}</span>
              </div>
            </div>
            <button className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center hover:bg-white/[0.06] transition-colors">
              <Phone size={18} className="text-tireno-green" />
            </button>
            <button
              onClick={() => navigate('/chat/1')}
              className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center hover:bg-white/[0.06] transition-colors"
            >
              <MessageSquare size={18} className="text-tireno-orange" />
            </button>
          </div>
        </div>

        {/* Timeline */}
        <div className="card-dark p-4 mb-4">
          <h3 className="text-white font-semibold text-sm mb-4">Job Status</h3>
          <div className="relative">
            {steps.map((step, i) => (
              <div key={step.label} className="flex items-start gap-3 mb-4 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    step.done ? 'bg-tireno-green' :
                    step.active ? 'bg-tireno-orange animate-pulse' :
                    'bg-white/[0.06]'
                  }`}>
                    {step.done ? <Check size={14} className="text-white" /> :
                     step.active ? <Circle size={14} className="text-white" /> :
                     <Circle size={14} className="text-white/30" />}
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`w-0.5 h-6 mt-1 ${
                      step.done ? 'bg-tireno-green' : 'bg-white/[0.06]'
                    }`} />
                  )}
                </div>
                <div className="pt-0.5">
                  <span className={`text-sm font-medium ${
                    step.done ? 'text-tireno-green' :
                    step.active ? 'text-tireno-orange' :
                    'text-white/30'
                  }`}>
                    {step.label}
                  </span>
                  {step.active && (
                    <span className="text-tireno-orange text-xs block mt-0.5">In progress</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Card */}
        <div className="card-dark p-4 mb-4 border border-tireno-green/20">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-tireno-green/10 flex items-center justify-center border border-tireno-green/20">
              <Shield size={18} className="text-tireno-green" />
            </div>
            <h3 className="text-tireno-green font-semibold text-sm">Ride-or-Tow Active</h3>
          </div>
          <p className="text-white text-sm mb-3">3 contacts tracking your location</p>
          <div className="flex gap-2 flex-wrap">
            {safetyContacts.map((c) => (
              <div key={c.name} className="bg-white/[0.03] rounded-lg px-3 py-1.5 flex items-center gap-2 border border-white/[0.06]">
                <div className="w-5 h-5 rounded-full bg-tireno-green/10 flex items-center justify-center border border-tireno-green/20">
                  <span className="text-tireno-green text-xs font-medium">{c.name[0]}</span>
                </div>
                <span className="text-white text-xs">{c.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Summary */}
        <div className="card-dark p-4 mb-4">
          <h3 className="text-white font-semibold text-sm mb-3">Payment Summary</h3>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-tireno-yellow/10 flex items-center justify-center border border-tireno-yellow/20">
                <span className="text-tireno-yellow text-xs font-bold">Mo</span>
              </div>
              <span className="text-white text-sm">MTN MoMo</span>
            </div>
            <span className="text-white/40 text-sm">···· 2847</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
            <span className="text-white/40 text-sm">Amount</span>
            <span className="text-white font-bold text-lg">GH₵{mockCurrentJob.price}</span>
          </div>
        </div>

        {/* Complete Job Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleComplete}
          className="w-full btn-orange py-4 text-base font-bold mb-3"
        >
          Mark as Complete
        </motion.button>

        {/* Cancel Button */}
        <button className="w-full bg-tireno-red/5 border border-tireno-red/20 text-tireno-red py-4 rounded-xl font-semibold transition-all hover:bg-tireno-red/10 hover:border-tireno-red/30">
          Cancel Job
        </button>
      </div>
    </Layout>
  );
}
