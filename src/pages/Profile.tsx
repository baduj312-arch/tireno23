import { useNavigate } from 'react-router-dom';
import { ChevronRight, Wallet, Shield, Bell, HelpCircle, LogOut, Star, ClipboardList, Wrench } from 'lucide-react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import Header from '../components/Header';
import { useStore } from '../hooks/useStore';

export default function Profile() {
  const navigate = useNavigate();
  const { walletBalance, userType } = useStore();

  const menuItems = [
    { icon: Wallet, label: 'Tireno Wallet', value: `GH₵${walletBalance.toFixed(2)}`, path: '/wallet', color: 'text-tireno-orange' },
    { icon: ClipboardList, label: 'Job History', path: '/history', color: 'text-white' },
    { icon: Shield, label: 'Safety Contacts', path: '#', color: 'text-white' },
    { icon: Bell, label: 'Notifications', path: '#', color: 'text-white' },
    { icon: HelpCircle, label: 'Help & Support', path: '#', color: 'text-white' },
  ];

  return (
    <Layout>
      <Header title="Profile" />
      <div className="p-4 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-dark p-5 mb-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-tireno-orange/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-tireno-orange to-tireno-orangeDark flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-tireno-orange/20">
              KO
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">Kwabena Owusu</h2>
              <p className="text-white/40 text-sm">Driver | Accra, Ghana</p>
              <div className="flex items-center gap-1 mt-1">
                <Star size={14} className="text-tireno-yellow fill-tireno-yellow" />
                <span className="text-white text-sm font-medium">4.9</span>
                <span className="text-white/30 text-xs">(12 jobs)</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/[0.04]">
            <div className="text-center">
              <p className="text-white font-bold text-lg">12</p>
              <p className="text-white/30 text-xs uppercase tracking-wider">Jobs</p>
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-lg">4.9</p>
              <p className="text-white/30 text-xs uppercase tracking-wider">Rating</p>
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-lg">2yr</p>
              <p className="text-white/30 text-xs uppercase tracking-wider">Member</p>
            </div>
          </div>
        </motion.div>

        <div className="space-y-2 mb-6">
          {menuItems.map((item, i) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => item.path !== '#' && navigate(item.path)}
              className="w-full card-dark p-4 flex items-center gap-3 text-left card-hover"
            >
              <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                <item.icon size={18} className="text-tireno-orange" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium text-sm">{item.label}</p>
                {item.value && <p className="text-tireno-orange text-xs font-medium">{item.value}</p>}
              </div>
              <ChevronRight size={18} className="text-white/20" />
            </motion.button>
          ))}
        </div>

        {userType !== 'provider' && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/provider-register')}
            className="w-full card-dark p-4 flex items-center gap-3 mb-6 border-tireno-orange/20 card-hover"
          >
            <div className="w-10 h-10 rounded-xl bg-tireno-orange/10 flex items-center justify-center border border-tireno-orange/20">
              <Wrench size={18} className="text-tireno-orange" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium text-sm">Become a Provider</p>
              <p className="text-white/30 text-xs">Earn money helping drivers</p>
            </div>
            <ChevronRight size={18} className="text-tireno-orange" />
          </motion.button>
        )}

        <button
          onClick={() => navigate('/login')}
          className="w-full card-dark p-4 flex items-center gap-3 text-tireno-red hover:bg-tireno-red/5 transition-colors"
        >
          <LogOut size={18} />
          <span className="font-medium text-sm">Log Out</span>
        </button>
      </div>
    </Layout>
  );
}
