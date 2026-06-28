import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bot, Sparkles } from 'lucide-react';
import Layout from '../components/Layout';
import Header from '../components/Header';
import SmartMatch from '../components/SmartMatch';
import AIAssistant from '../components/AIAssistant';
import { setStore } from '../hooks/useStore';

export default function Bidding() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(180);
  const [showAI, setShowAI] = useState(false);
  const [jobId] = useState('TRN-' + Math.floor(1000 + Math.random() * 9000));

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(c => Math.max(0, c - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const handleAccept = (providerId: string) => {
    setStore('currentJob', {
      id: jobId,
      serviceType: 'Mechanic',
      status: 'assigned',
      provider: { id: providerId, name: 'Kwame Osei', avatar: 'KO', rating: 4.8, eta: '4 min', phone: '+233 54 123 4567' },
      price: 85,
      eta: '4 min',
      address: 'Shell Station, Independence Ave, Accra',
      paymentMethod: 'MTN MoMo ···· 2847',
      createdAt: new Date().toISOString(),
    });
    navigate('/tracking');
  };

  return (
    <Layout>
      <Header
        title="AI Smart Matching"
        right={
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowAI(true)}
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/20 flex items-center justify-center"
          >
            <Bot size={18} className="text-violet-400" />
          </motion.button>
        }
      />
      <div className="p-4 pb-6">
        {/* Status Bar */}
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: countdown < 30 ? [1, 1, 0.5, 1] : 1, y: 1 }}
          className="card-dark p-4 mb-4 border-t-2 border-tireno-orange"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-3 h-3 rounded-full bg-tireno-orange animate-pulse" />
            <span className="text-tireno-orange font-semibold text-sm">Broadcasting SOS</span>
            <span className="text-white/20 text-xs ml-auto">{jobId}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/40 text-sm">Mechanic request</span>
            <span className="text-white font-mono font-bold text-lg">{formatTime(countdown)}</span>
          </div>
        </motion.div>

        {/* AI Matching Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <h2 className="text-white font-semibold text-sm">AI Smart Matching</h2>
            <p className="text-white/20 text-xs">Analyzing providers, traffic, ratings & availability</p>
          </div>
        </div>

        {/* Smart Match Results */}
        <SmartMatch
          serviceType="mechanic"
          urgency="normal"
          onAccept={handleAccept}
        />
      </div>

      <AIAssistant isOpen={showAI} onClose={() => setShowAI(false)} context="sos" />
    </Layout>
  );
}
