import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Circle, Shield, X } from 'lucide-react';

import GoogleMapComponent from '../components/GoogleMap';
import { useGeolocation, useSimulatedProviderMovement, useDistanceAndEta } from '../hooks/useGeolocation';
import { mockCurrentJob } from '../data/mock';

export default function Tracking() {
  const navigate = useNavigate();
  const { position: driverPos } = useGeolocation();
  const provider = mockCurrentJob.provider;

  // Provider starts away and moves toward driver (simulated)
  const providerStart = { lat: driverPos.lat + 0.005, lng: driverPos.lng + 0.003 };
  const providerEnd = { lat: driverPos.lat + 0.0005, lng: driverPos.lng + 0.0003 };
  const providerPos = useSimulatedProviderMovement(
    providerStart.lat, providerStart.lng,
    providerEnd.lat, providerEnd.lng,
    120000 // 2 minutes simulation
  );

  const { distance, eta } = useDistanceAndEta(driverPos, providerPos);

  const [steps, setSteps] = useState([
    { label: 'Request Sent', done: true, active: false },
    { label: 'Provider Assigned', done: true, active: false },
    { label: 'En Route', done: false, active: true },
    { label: 'In Progress', done: false, active: false },
    { label: 'Completed', done: false, active: false },
  ]);

  const [showTimeline, setShowTimeline] = useState(false);

  const handleComplete = useCallback(() => {
    setSteps(prev => prev.map((s, i) => ({
      ...s,
      done: i < 4,
      active: i === 4,
    })));
    setTimeout(() => navigate('/payment'), 1000);
  }, [navigate]);

  const safetyContacts = [
    { name: 'Dad', phone: '0244...' },
    { name: 'Mom', phone: '0245...' },
    { name: 'Wife', phone: '0246...' },
  ];

  return (
    <div className="min-h-screen bg-tireno-dark flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-tireno-dark/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-lg mx-auto flex items-center h-14 px-4">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 -ml-1 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center hover:bg-white/[0.06] transition-colors"
          >
            <X size={18} className="text-white/70" />
          </button>
          <h1 className="flex-1 text-center text-lg font-semibold text-white pr-8">Live Tracking</h1>
        </div>
      </header>

      {/* Full-screen Map */}
      <div className="flex-1 relative" style={{ minHeight: '50vh' }}>
        <GoogleMapComponent
          driverLocation={driverPos}
          providerLocation={providerPos}
          showRoute={true}
          height="100%"
          showProviderMarker={true}
          showDriverMarker={true}
          isUberStyle={true}
          providerInfo={{
            name: provider.name,
            avatar: provider.avatar,
            rating: provider.rating,
            carModel: 'Toyota Hiace',
            plateNumber: 'GR-2847-21',
            phone: provider.phone,
          }}
          onPhoneClick={() => {}}
          onChatClick={() => navigate('/chat/1')}
          etaText={eta.text}
          distanceText={distance.text}
        />
      </div>

      {/* Timeline Toggle */}
      <div className="max-w-lg mx-auto w-full px-4 -mt-6 relative z-10">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowTimeline(!showTimeline)}
          className="w-full card-dark p-3 flex items-center justify-between border border-white/[0.06]"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-tireno-orange animate-pulse" />
            <span className="text-white text-sm font-medium">{steps.find(s => s.active)?.label || 'En Route'}</span>
          </div>
          <span className="text-white/30 text-xs">Tap for details</span>
        </motion.button>
      </div>

      {/* Expandable Timeline */}
      {showTimeline && (
        <motion.div
          initial={{ opacity: 1, height: 1 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="max-w-lg mx-auto w-full px-4 pb-4"
        >
          <div className="card-dark p-4 mt-2">
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
        </motion.div>
      )}

      {/* Safety Card */}
      <div className="max-w-lg mx-auto w-full px-4 pb-4">
        <div className="card-dark p-4 border border-tireno-green/20">
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
      </div>

      {/* Payment Summary */}
      <div className="max-w-lg mx-auto w-full px-4 pb-4">
        <div className="card-dark p-4">
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
      </div>

      {/* Complete Job Button */}
      <div className="max-w-lg mx-auto w-full px-4 pb-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleComplete}
          className="w-full btn-orange py-4 text-base font-bold mb-3"
        >
          Mark as Complete
        </motion.button>
        <button className="w-full bg-tireno-red/5 border border-tireno-red/20 text-tireno-red py-4 rounded-xl font-semibold transition-all hover:bg-tireno-red/10 hover:border-tireno-red/30">
          Cancel Job
        </button>
      </div>
    </div>
  );
}
