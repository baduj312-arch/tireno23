import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, Car, Fuel, Battery, MapPin, AlertTriangle, Navigation, X, Radio, Bot, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';
import Header from '../components/Header';
import AIAssistant from '../components/AIAssistant';
import { setStore } from '../hooks/useStore';

export default function SOS() {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [address] = useState('Shell Station, Independence Ave, Accra');
  const [notes, setNotes] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [broadcasting, setBroadcasting] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);

  const services = [
    { id: 'mechanic', icon: Wrench, label: 'Mechanic', desc: 'Car breakdown, engine issue' },
    { id: 'tow', icon: Car, label: 'Tow Truck', desc: 'Accident, cannot move' },
    { id: 'fuel', icon: Fuel, label: 'Fuel Delivery', desc: 'Out of fuel on road' },
    { id: 'battery', icon: Battery, label: 'Battery Jump', desc: 'Dead battery' },
  ];

  const activeService = services.find(s => s.id === selectedService);

  const handleBroadcast = () => {
    setShowConfirm(false);
    setBroadcasting(true);
    setTimeout(() => {
      setStore('currentJob', {
        id: 'TRN-' + Math.floor(1000 + Math.random() * 9000),
        serviceType: selectedService,
        address,
        notes,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
      navigate('/bidding');
    }, 1500);
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
            <span className="text-white/30 text-xs">GPS accuracy: 3m</span>
            <span className="text-tireno-green text-xs ml-auto">Live tracking</span>
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
                  transition={{ delay: 0.15 + i * 0.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedService(s.id)}
                  className={`card-dark p-4 flex flex-col items-start gap-2 transition-all duration-300 ${active ? 'border-tireno-orange/40 ring-1 ring-tireno-orange/20' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center transition-all ${active ? 'scale-110' : ''}`}>
                    <s.icon size={20} className={active ? 'text-tireno-orange' : 'text-white/60'} />
                  </div>
                  <div>
                    <p className={`text-sm font-semibold transition-colors ${active ? 'text-white' : 'text-white/70'}`}>{s.label}</p>
                    <p className="text-white/30 text-xs">{s.desc}</p>
                  </div>
                  {active && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2 w-5 h-5 rounded-full bg-tireno-orange flex items-center justify-center"
                    >
                      <span className="text-white text-xs font-bold">✓</span>
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4"
        >
          <label className="text-white/40 text-xs font-medium tracking-wider uppercase mb-2 block">Additional notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Describe the issue..."
            className="input-dark w-full h-28 resize-none text-sm"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="card-dark p-4 mt-4 flex items-start gap-3 border-l-2 border-l-tireno-yellow"
        >
          <div className="w-8 h-8 rounded-lg bg-tireno-yellow/10 flex items-center justify-center border border-tireno-yellow/20 shrink-0 mt-0.5">
            <AlertTriangle size={16} className="text-tireno-yellow" />
          </div>
          <div>
            <p className="text-white font-medium text-sm">Stay safe</p>
            <p className="text-white/30 text-xs mt-1 leading-relaxed">Stay in your vehicle if on a busy road. Turn on hazard lights. Your location is shared with providers.</p>
          </div>
        </motion.div>

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
            disabled={!selectedService}
            onClick={() => setShowConfirm(true)}
            className="w-full btn-orange py-5 text-base font-bold disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-center gap-3">
              <div className="relative">
                <Radio size={22} className="text-white" />
                <div className="absolute inset-0 w-5 h-5 rounded-full bg-white/20 animate-ping" />
              </div>
              <span>Broadcast SOS</span>
            </div>
          </motion.button>
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
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-tireno-dark rounded-2xl p-6 w-full max-w-sm border border-white/[0.06]"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold text-lg">Confirm SOS</h3>
                <button onClick={() => setShowConfirm(false)} className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center hover:bg-white/[0.06] transition-colors">
                  <X size={16} className="text-white/50" />
                </button>
              </div>
              <div className="card-dark p-3 mb-4 border-l-2 border-l-tireno-orange">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-tireno-orange text-sm font-semibold">{activeService?.label}</span>
                </div>
                <p className="text-white/40 text-xs">{address}</p>
                {notes && <p className="text-white/30 text-xs mt-1">{notes}</p>}
              </div>
              <p className="text-white/40 text-sm mb-4 leading-relaxed">This will broadcast your request to nearby providers. You will receive bids within 3 minutes.</p>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleBroadcast}
                className="w-full btn-orange py-4 font-bold"
              >
                {broadcasting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    <span>Broadcasting...</span>
                  </div>
                ) : (
                  'Confirm & Broadcast'
                )}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
