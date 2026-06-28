import { useNavigate } from 'react-router-dom';
import { Siren, Wrench, Car, Fuel, Battery, Shield, Star, Bell, MapPin, Navigation, ChevronRight, Zap, TrendingUp, Clock, Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Layout from '../components/Layout';
import AIAssistant from '../components/AIAssistant';
import { mockCurrentJob } from '../data/mock';

export default function Home() {
  const navigate = useNavigate();
  const [aiOpen, setAiOpen] = useState(false);

  const services = [
    { icon: Wrench, label: 'Mechanic', sub: 'Engine repair', color: 'from-orange-500/20 to-orange-600/10' },
    { icon: Car, label: 'Tow', sub: 'Accident recovery', color: 'from-blue-500/20 to-blue-600/10' },
    { icon: Fuel, label: 'Fuel', sub: 'Emergency delivery', color: 'from-yellow-500/20 to-yellow-600/10' },
    { icon: Battery, label: 'Battery', sub: 'Jump start', color: 'from-green-500/20 to-green-600/10' },
  ];

  const stats = [
    { label: 'Response', value: '3.2m', icon: Clock },
    { label: 'Success', value: '98%', icon: TrendingUp },
    { label: 'Providers', value: '342', icon: Zap },
  ];

  return (
    <Layout>
      <div className="relative">
        {/* Background ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-tireno-orange/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="p-4 pb-6 relative">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-6"
          >
            <div>
              <p className="text-white/40 text-xs font-medium tracking-wider uppercase">Welcome back</p>
              <h1 className="text-white font-bold text-xl mt-0.5">Kwabena</h1>
            </div>
            <div className="flex items-center gap-3">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setAiOpen(true)}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/20 flex items-center justify-center hover:from-violet-500/30 hover:to-fuchsia-500/30 transition-all"
              >
                <Bot size={18} className="text-violet-400" />
              </motion.button>
              <button className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center hover:bg-white/[0.06] transition-colors">
                <Bell size={18} className="text-white/60" />
              </button>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-tireno-orange to-tireno-orangeDark flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-tireno-orange/20">
                KO
              </div>
            </div>
          </motion.div>

          {/* Mini Map Teaser */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-dark rounded-2xl h-32 mb-4 relative overflow-hidden"
            onClick={() => navigate('/sos')}
          >
            <div className="absolute inset-0" style={{
              backgroundImage: 'linear-gradient(rgba(255,107,44,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,44,0.06) 1px, transparent 1px)',
              backgroundSize: '28px 28px'
            }} />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-tireno-dark/90" />
            <div className="absolute top-3 left-3 flex items-center gap-2 bg-tireno-dark/80 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/[0.06]">
              <MapPin size={14} className="text-tireno-orange" />
              <span className="text-white/80 text-xs font-medium">Accra, Ghana</span>
            </div>
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-tireno-green/10 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-tireno-green/20">
              <div className="w-2 h-2 rounded-full bg-tireno-green animate-pulse" />
              <span className="text-tireno-green text-xs font-medium">132 online</span>
            </div>
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <span className="text-white/60 text-xs">Tap to request help</span>
              <Navigation size={16} className="text-tireno-orange" />
            </div>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="grid grid-cols-3 gap-2 mb-5"
          >
            {stats.map((s) => (
              <div key={s.label} className="card-dark p-3 flex flex-col items-center">
                <s.icon size={14} className="text-tireno-orange/60 mb-1" />
                <p className="text-white font-bold text-sm">{s.value}</p>
                <p className="text-white/30 text-[10px] uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Active Job */}
          {mockCurrentJob && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card-dark p-4 mb-5 cursor-pointer card-hover"
              onClick={() => navigate('/tracking')}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-tireno-orange" />
                  <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-tireno-orange animate-ping" />
                </div>
                <span className="text-tireno-orange text-sm font-semibold">Active Job</span>
                <span className="text-white/20 text-xs ml-auto">{mockCurrentJob.id}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-tireno-orange to-tireno-orangeDark flex items-center justify-center text-white font-bold text-sm">
                  KO
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium text-sm">{mockCurrentJob.provider.name}</p>
                  <p className="text-white/40 text-xs">{mockCurrentJob.serviceType} En Route</p>
                </div>
                <div className="flex items-center gap-1 bg-tireno-orange/10 rounded-full px-2 py-1">
                  <Star size={12} className="text-tireno-yellow fill-tireno-yellow" />
                  <span className="text-white text-xs font-medium">{mockCurrentJob.provider.rating}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <span className="badge-orange">ETA {mockCurrentJob.eta}</span>
                <span className="text-white/30 text-xs">{mockCurrentJob.address}</span>
              </div>
            </motion.div>
          )}

          {/* Emergency SOS Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25, type: 'spring', stiffness: 200 }}
            className="mb-5"
          >
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate('/sos')}
              className="w-full relative overflow-hidden rounded-2xl py-5 group"
              style={{ background: 'linear-gradient(135deg, #FF6B2C 0%, #E55A1F 100%)' }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />
              <div className="relative flex items-center justify-center gap-3">
                <div className="relative">
                  <Siren size={28} className="text-white" />
                  <div className="absolute inset-0 w-7 h-7 rounded-full bg-white/20 animate-ping" />
                </div>
                <div className="text-left">
                  <span className="text-white font-bold text-lg block leading-tight">Emergency SOS</span>
                  <span className="text-white/70 text-xs">Broadcast to nearby providers</span>
                </div>
              </div>
            </motion.button>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-white font-semibold text-sm">Services</h2>
              <button className="text-tireno-orange text-xs font-medium">See all</button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {services.map((s, i) => (
                <motion.button
                  key={s.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + i * 0.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/sos')}
                  className="card-dark p-3 flex flex-col items-center gap-2 card-hover"
                >
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center`}>
                    <s.icon size={20} className="text-white" />
                  </div>
                  <span className="text-white text-xs font-medium">{s.label}</span>
                  <span className="text-white/30 text-[10px] leading-tight">{s.sub}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Safety Banner */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card-dark p-4 mt-4 flex items-center gap-3 border-l-2 border-l-tireno-green cursor-pointer card-hover"
            onClick={() => navigate('/profile')}
          >
            <div className="w-10 h-10 rounded-xl bg-tireno-green/10 flex items-center justify-center border border-tireno-green/20">
              <Shield size={20} className="text-tireno-green" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium text-sm">Ride-or-Tow Safety</p>
              <p className="text-white/40 text-xs">3 contacts tracking your location</p>
            </div>
            <ChevronRight size={18} className="text-white/20" />
          </motion.div>

          {/* Recent Jobs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="mt-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-white font-semibold text-sm">Recent Jobs</h2>
              <button onClick={() => navigate('/history')} className="text-tireno-orange text-xs font-medium">History</button>
            </div>
            <div className="card-dark p-4 flex items-center justify-between card-hover cursor-pointer" onClick={() => navigate('/history')}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-tireno-orange to-tireno-orangeDark flex items-center justify-center text-white font-bold text-sm">
                  KO
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{mockCurrentJob.provider.name}</p>
                  <p className="text-white/40 text-xs">{mockCurrentJob.serviceType} | GH₵{mockCurrentJob.price}</p>
                </div>
              </div>
              <span className="badge-green">Completed</span>
            </div>
          </motion.div>
        </div>
      </div>

      <AIAssistant isOpen={aiOpen} onClose={() => setAiOpen(false)} context="dashboard" />
    </Layout>
  );
}
