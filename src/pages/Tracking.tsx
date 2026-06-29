import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Phone, MessageSquare, Shield, Check, ChevronUp,
  ChevronDown, Star, Car, Navigation, Circle
} from 'lucide-react';

import GoogleMapComponent from '../components/GoogleMap';
import { useGeolocation, useSimulatedProviderMovement, useDistanceAndEta } from '../hooks/useGeolocation';
import { mockCurrentJob } from '../data/mock';

export default function Tracking() {
  const navigate = useNavigate();
  const { position: driverPos } = useGeolocation();
  const heading = driverPos.heading;
  const provider = mockCurrentJob.provider;

  const providerStart = { lat: driverPos.lat + 0.005, lng: driverPos.lng + 0.003 };
  const providerEnd = { lat: driverPos.lat + 0.0005, lng: driverPos.lng + 0.0003 };
  const providerPos = useSimulatedProviderMovement(
    providerStart.lat, providerStart.lng,
    providerEnd.lat, providerEnd.lng,
    120000
  );

  const { distance, eta } = useDistanceAndEta(driverPos, providerPos);

  const [sheetExpanded, setSheetExpanded] = useState(false);
  const [jobStatus] = useState<'en_route' | 'arrived' | 'in_progress' | 'completed'>('en_route');

  const steps = [
    { label: 'Request sent', done: true },
    { label: 'Provider assigned', done: true },
    { label: 'En route', done: jobStatus !== 'en_route', active: jobStatus === 'en_route' },
    { label: 'Arrived', done: jobStatus === 'arrived' || jobStatus === 'in_progress' || jobStatus === 'completed', active: jobStatus === 'arrived' },
    { label: 'Service in progress', done: jobStatus === 'in_progress' || jobStatus === 'completed', active: jobStatus === 'in_progress' },
    { label: 'Completed', done: jobStatus === 'completed', active: jobStatus === 'completed' },
  ];

  const [safetyContacts] = useState([
    { name: 'Dad', initial: 'D' },
    { name: 'Mom', initial: 'M' },
    { name: 'Wife', initial: 'W' },
  ]);

  // Close sheet on swipe down
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipe = 80;

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientY);
  const handleTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientY);
  const handleTouchEnd = () => {
    if (touchStart && touchEnd && touchEnd - touchStart > minSwipe) {
      setSheetExpanded(false);
    }
    if (touchStart && touchEnd && touchStart - touchEnd > minSwipe) {
      setSheetExpanded(true);
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  const statusConfig = {
    en_route: { label: 'En route', color: 'text-tireno-orange', bg: 'bg-tireno-orange', border: 'border-tireno-orange/20' },
    arrived: { label: 'Arrived', color: 'text-tireno-green', bg: 'bg-tireno-green', border: 'border-tireno-green/20' },
    in_progress: { label: 'In progress', color: 'text-tireno-blue', bg: 'bg-tireno-blue', border: 'border-tireno-blue/20' },
    completed: { label: 'Completed', color: 'text-tireno-green', bg: 'bg-tireno-green', border: 'border-tireno-green/20' },
  };
  const status = statusConfig[jobStatus];

  return (
    <div className="h-screen w-screen overflow-hidden relative bg-tireno-dark">
      {/* Full-screen map fills entire viewport */}
      <div className="absolute inset-0 z-0">
        <GoogleMapComponent
          driverLocation={driverPos}
          providerLocation={providerPos}
          showRoute={true}
          height="100vh"
          showProviderMarker={true}
          showDriverMarker={true}
          isUberStyle={true}
          heading={heading}
        />
      </div>

      {/* Floating back button - top left */}
      <div className="absolute top-4 left-4 z-20">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-tireno-dark/90 backdrop-blur-md border border-white/[0.08] flex items-center justify-center shadow-lg"
        >
          <ArrowLeft size={18} className="text-white" />
        </motion.button>
      </div>

      {/* Floating status pill - top center */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
        <div className="bg-tireno-dark/90 backdrop-blur-md rounded-full px-4 py-2 border border-white/[0.08] flex items-center gap-2 shadow-lg">
          <div className={`w-2 h-2 rounded-full ${status.bg} animate-pulse`} />
          <span className={`text-sm font-semibold ${status.color}`}>{status.label}</span>
          <span className="text-white/30 text-xs">|</span>
          <span className="text-white/60 text-sm">{eta.text}</span>
        </div>
      </div>

      {/* Floating recenter button - top right */}
      <div className="absolute top-4 right-4 z-20">
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 rounded-full bg-tireno-dark/90 backdrop-blur-md border border-white/[0.08] flex items-center justify-center shadow-lg"
        >
          <Navigation size={18} className="text-white" />
        </motion.button>
      </div>

      {/* Bottom Sheet - Uber style */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-30"
        initial={false}
        animate={{ y: 0 }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag handle / mini view */}
        <div className="flex items-center justify-center py-1">
          <button
            onClick={() => setSheetExpanded(!sheetExpanded)}
            className="w-10 h-1.5 rounded-full bg-white/20"
          />
        </div>

        <div className="bg-tireno-dark/95 backdrop-blur-xl border-t border-white/[0.06] rounded-t-3xl shadow-2xl">
          {/* Mini bar - always visible */}
          <button
            onClick={() => setSheetExpanded(!sheetExpanded)}
            className="w-full px-5 pt-2 pb-3 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-tireno-orange to-tireno-orangeDark flex items-center justify-center text-white font-bold text-sm shadow-md">
                {provider.avatar}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold text-sm">{provider.name}</span>
                  <div className="flex items-center gap-0.5 bg-tireno-yellow/10 rounded-full px-1.5 py-0.5">
                    <Star size={10} className="text-tireno-yellow fill-tireno-yellow" />
                    <span className="text-tireno-yellow text-[10px] font-bold">{provider.rating}</span>
                  </div>
                </div>
                <p className="text-white/40 text-xs">{eta.text} • {distance.text}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-white/30 text-xs">{sheetExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}</span>
            </div>
          </button>

          {/* Expanded content */}
          <AnimatePresence>
            {sheetExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5 space-y-4">
                  {/* Vehicle info */}
                  <div className="flex items-center gap-3 bg-white/[0.03] rounded-xl px-4 py-3 border border-white/[0.06]">
                    <div className="w-10 h-10 rounded-lg bg-tireno-orange/10 flex items-center justify-center border border-tireno-orange/20">
                      <Car size={20} className="text-tireno-orange" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-white text-sm font-medium">Toyota Hiace</p>
                      <p className="text-white/30 text-xs">GR-2847-21</p>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-3">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 flex items-center justify-center gap-2 bg-tireno-green/10 border border-tireno-green/20 rounded-xl py-3 text-tireno-green font-medium text-sm"
                    >
                      <Phone size={16} />
                      <span>Call</span>
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/chat/1')}
                      className="flex-1 flex items-center justify-center gap-2 bg-tireno-orange/10 border border-tireno-orange/20 rounded-xl py-3 text-tireno-orange font-medium text-sm"
                    >
                      <MessageSquare size={16} />
                      <span>Message</span>
                    </motion.button>
                  </div>

                  {/* Payment preview */}
                  <div className="bg-white/[0.03] rounded-xl px-4 py-3 border border-white/[0.06]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-tireno-yellow/10 flex items-center justify-center border border-tireno-yellow/20">
                          <span className="text-tireno-yellow text-xs font-bold">Mo</span>
                        </div>
                        <span className="text-white text-sm">MTN MoMo</span>
                      </div>
                      <span className="text-white font-bold text-sm">GH₵{mockCurrentJob.price}</span>
                    </div>
                  </div>

                  {/* Safety */}
                  <div className={`bg-tireno-green/5 border ${status.border} rounded-xl px-4 py-3`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Shield size={16} className="text-tireno-green" />
                      <span className="text-tireno-green font-medium text-sm">Ride-or-Tow Active</span>
                    </div>
                    <div className="flex gap-2">
                      {safetyContacts.map((c) => (
                        <div key={c.name} className="flex items-center gap-1.5 bg-white/[0.03] rounded-lg px-2 py-1 border border-white/[0.06]">
                          <div className="w-5 h-5 rounded-full bg-tireno-green/10 flex items-center justify-center border border-tireno-green/20">
                            <span className="text-tireno-green text-[10px] font-bold">{c.initial}</span>
                          </div>
                          <span className="text-white/60 text-xs">{c.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="bg-white/[0.03] rounded-xl px-4 py-3 border border-white/[0.06]">
                    <h3 className="text-white font-medium text-sm mb-3">Status</h3>
                    <div className="relative pl-3">
                      {steps.map((step, i) => (
                        <div key={step.label} className="flex items-start gap-3 mb-3 last:mb-0">
                          <div className="flex flex-col items-center relative">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 z-10 ${
                              step.done ? 'bg-tireno-green border-tireno-green' :
                              step.active ? 'bg-tireno-orange border-tireno-orange' :
                              'bg-transparent border-white/[0.15]'
                            }`}>
                              {step.done ? <Check size={10} className="text-white" /> :
                               step.active ? <Circle size={8} className="text-white" fill="white" /> :
                               <Circle size={8} className="text-white/30" />}
                            </div>
                            {i < steps.length - 1 && (
                              <div className={`absolute top-5 left-1/2 -translate-x-1/2 w-0.5 h-full ${step.done ? 'bg-tireno-green' : 'bg-white/[0.06]'}`} />
                            )}
                          </div>
                          <span className={`text-sm ${
                            step.done ? 'text-tireno-green' :
                            step.active ? 'text-tireno-orange' :
                            'text-white/30'
                          }`}>{step.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Complete button */}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/payment')}
                    className="w-full btn-orange py-3.5 text-sm font-bold"
                  >
                    Mark as Complete
                  </motion.button>

                  <button
                    onClick={() => navigate('/payment')}
                    className="w-full bg-tireno-red/5 border border-tireno-red/20 text-tireno-red py-3.5 rounded-xl font-medium text-sm transition-all hover:bg-tireno-red/10"
                  >
                    Cancel Job
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
