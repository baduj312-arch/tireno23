import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wrench, CreditCard, Wallet, Banknote, Smartphone, Info } from 'lucide-react';
import Layout from '../components/Layout';
import Header from '../components/Header';
import { mockCurrentJob } from '../data/mock';

export default function Payment() {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState('momo');

  const baseService = 60;
  const distanceFee = 15;
  const platformFee = Math.round(baseService * 0.1);
  const total = baseService + distanceFee + platformFee;

  const methods = [
    { id: 'momo', label: 'MTN MoMo', detail: '···· 2847', icon: Smartphone },
    { id: 'visa', label: 'Visa Card', detail: '···· 4521', icon: CreditCard },
    { id: 'cod', label: 'Cash on Delivery', detail: 'Pay provider directly', icon: Banknote },
    { id: 'wallet', label: 'Tireno Wallet', detail: 'GH₵240.00 available', icon: Wallet },
  ];

  return (
    <Layout>
      <Header title="Payment" />
      <div className="p-4 pb-6">
        {/* Receipt Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-dark p-5 mb-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-tireno-orange/10 flex items-center justify-center border border-tireno-orange/20">
              <Wrench size={24} className="text-tireno-orange" />
            </div>
            <div>
              <p className="text-white font-medium">{mockCurrentJob.provider.name}</p>
              <p className="text-white/30 text-sm">{mockCurrentJob.id}</p>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/40">Base service</span>
              <span className="text-white">GH₵{baseService}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/40">Distance fee</span>
              <span className="text-white">GH₵{distanceFee}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/40">Platform fee (10%)</span>
              <span className="text-white">GH₵{platformFee}</span>
            </div>
          </div>

          <div className="border-t border-white/[0.04] pt-3 flex items-center justify-between">
            <span className="text-white font-medium">Total</span>
            <span className="text-tireno-orange font-bold text-xl">GH₵{total}</span>
          </div>
        </motion.div>

        {/* Payment Method Selector */}
        <h3 className="text-white font-semibold text-sm mb-3">Payment Method</h3>
        <div className="space-y-2 mb-4">
          {methods.map((m) => {
            const active = selectedMethod === m.id;
            return (
              <motion.button
                key={m.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedMethod(m.id)}
                className={`w-full card-dark p-4 flex items-center gap-3 text-left transition-all ${
                  active ? 'border-tireno-orange/40 ring-1 ring-tireno-orange/20' : ''
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  active ? 'bg-tireno-orange/10 border border-tireno-orange/20' : 'bg-white/[0.03] border border-white/[0.06]'
                }`}>
                  <m.icon size={20} className={active ? 'text-tireno-orange' : 'text-white/30'} />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium text-sm">{m.label}</p>
                  <p className="text-white/30 text-xs">{m.detail}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  active ? 'border-tireno-orange' : 'border-white/[0.08]'
                }`}>
                  {active && <div className="w-2.5 h-2.5 rounded-full bg-tireno-orange" />}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Escrow Info */}
        <div className="bg-tireno-blue/5 border border-tireno-blue/20 rounded-xl p-4 mb-6 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-tireno-blue/10 flex items-center justify-center border border-tireno-blue/20 shrink-0 mt-0.5">
            <Info size={18} className="text-tireno-blue" />
          </div>
          <div>
            <p className="text-tireno-blue text-sm font-medium">Payment held in escrow</p>
            <p className="text-tireno-blue/60 text-xs mt-1">Your payment is secure. Funds will be released to the provider only after you confirm the job is complete.</p>
          </div>
        </div>

        {/* Pay Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/rating')}
          className="w-full btn-orange py-4 text-base font-bold"
        >
          Pay GH₵{total.toFixed(2)} Securely
        </motion.button>
      </div>
    </Layout>
  );
}
