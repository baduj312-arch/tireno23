import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, Car, Fuel, Battery, MapPin, AlertTriangle, Navigation, Radio, Bot, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';
import Header from '../components/Header';
import AIAssistant from '../components/AIAssistant';
import { useGeolocation } from '../hooks/useGeolocation';
import { supabase } from '../lib/supabase';
import { setStore } from '../hooks/useStore';

export default function SOS() {
  const navigate = useNavigate();
  const { position } = useGeolocation();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [address] = useState('Shell Station, Independence Ave, Accra');
  const [notes, setNotes] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [broadcasting, setBroadcasting] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const services = [
    { id: 'mechanic', icon: Wrench, label: 'Mechanic', desc: 'Car breakdown, engine issue' },
    { id: 'tow', icon: Car, label: 'Tow Truck', desc: 'Accident, cannot move' },
    { id: 'fuel', icon: Fuel, label: 'Fuel Delivery', desc: 'Out of fuel on road' },
    { id: 'battery', icon: Battery, label: 'Battery Jump', desc: 'Dead battery' },
  ];

  const activeService = services.find(s => s.id === selectedService);

  const handleBroadcast = async () => {
    setShowConfirm(false);
    setBroadcasting(true);
    setError(null);

    try {
      const { data, error: insertError } = await supabase
        .from('jobs')
        .insert({
          service_type: selectedService,
          status: 'pending',
          driver_name: 'Kwabena',
          driver_phone: '0244123456',
          price: 0,
          eta_minutes: 0,
          address,
          payment_method: 'MTN MoMo',
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setStore('currentJob', {
        id: data.job_code,
        dbId: data.id,
        serviceType: selectedService,
        address,
        notes,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
      navigate('/bidding');
    } catch (err: any) {
      setError(err.message);
      setBroadcasting(false);
    }
  };

  return (
    <Layout>
      <Header title="SOS Request" />
      <div className="p-4 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-dark p-4 mb-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-tireno-orange/10 flex items-center justify-center border border-tireno-orange/20">
              <MapPin size={16} className="text-tireno-orange" />
            </div>
            <div>
              <span className="text-white/40 text-xs font-medium tracking-wider uppercase">Your Location</span>
              <p className="text-white text-sm font-medium">{address}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/[0.04]">
            <Navigation size={14} className="text-white/30" />
            <span className="text-white/30 text-xs">GPS: {position.lat.toFixed(4)}, {position.lng.toFixed(4)}</span>
            <span className="text-tireno-green text-xs ml-auto">{position.accuracy ? `±${Math.round(position.accuracy)}m` : 'Live'}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-white font-semibold text-sm mb-3">What do you need?</h2>
          <div className="grid grid-cols-2 gap-2">
            {services.map((s, i) => {
              const active = selectedService === s.id;
              return (
                <motion.button
                  key={s.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedService(s.id)}
                  className={`card-dark p-4 flex flex-col items-center gap-2 text-center transition-all ${
                    active ? 'border-tireno-orange/40 ring-1 ring-tireno-orange/20' : ''
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                    active ? 'bg-tireno-orange/10 border border-tireno-orange/20' : 'bg-white/[0.03] border border-white/[0.06]'
                  }`}>
                    <s.icon size={24} className={active ? 'text-tireno-orange' : 'text-white/30'} />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${active ? 'text-white' : 'text-white/30'}`}>{s.label}</p>
                    <p className="text-white/20 text-xs">{s.desc}</p>
                  </div>
                  {active && (
                    <div className="w-2 h-2 rounded-full bg-tireno-orange animate-pulse" />
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {selectedService && activeService && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-dark p-4 mt-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={16} className="text-tireno-orange" />
              <span className="text-tireno-orange font-medium text-sm">Additional Info</span>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe your issue (e.g., flat tire on rear left, engine won't start, etc.)"
              className="w-full h-24 bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 text-white text-sm placeholder:text-white/20 resize-none"
            />
          </motion.div>
        )}

        {/* AI Assistant Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38 }}
          className="mb-3"
        >
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setAiOpen(true)}
            className="w-full card-dark p-4 flex items-center gap-3 card-hover border-l-2 border-l-violet-500"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center border border-violet-500/20">
              <Sparkles size={20} className="text-violet-400" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-white font-medium text-sm">Not sure what you need?</p>
              <p className="text-white/30 text-xs">AI will analyze your situation and recommend</p>
            </div>
            <Bot size={18} className="text-violet-400" />
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-4"
        >
          <motion.button
            whileTap={{ scale: 0.95 }}
            disabled={!selectedService || broadcasting}
            onClick={() => setShowConfirm(true)}
            className="w-full btn-orange py-5 text-base font-bold disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-center gap-3">
              {broadcasting ? (
                <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <div className="relative">
                  <Radio size={22} className="text-white" />
                  <div className="absolute inset-0 w-5 h-5 rounded-full bg-white/20 animate-ping" />
                </div>
              )}
              <span>{broadcasting ? 'Broadcasting...' : 'Broadcast SOS'}</span>
            </div>
          </motion.button>
          {error && <p className="text-tireno-red text-xs text-center mt-2">{error}</p>}
          <p className="text-white/20 text-xs text-center mt-3">Providers within 15km will be notified</p>
        </motion.div>
      </div>

      <AIAssistant isOpen={aiOpen} onClose={() => setAiOpen(false)} context="sos" />

      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 flex items-end justify-center"
          >
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="bg-tireno-dark rounded-t-2xl p-6 w-full max-w-lg border-t border-white/[0.06]"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-tireno-orange/10 flex items-center justify-center mx-auto mb-4 border border-tireno-orange/20">
                  <AlertTriangle size={32} className="text-tireno-orange" />
                </div>
                <h2 className="text-white font-bold text-xl mb-2">Confirm SOS</h2>
                <p className="text-white/40 text-sm">
                  You are about to broadcast a <span className="text-tireno-orange font-medium">{activeService?.label}</span> request to nearby providers.
                </p>
              </div>
              <div className="space-y-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBroadcast}
                  disabled={broadcasting}
                  className="w-full btn-orange py-4 text-base font-bold"
                >
                  Yes, Broadcast Now
                </motion.button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="w-full bg-white/[0.03] text-white/60 py-4 rounded-xl font-medium border border-white/[0.06]"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
