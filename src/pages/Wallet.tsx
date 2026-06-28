import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, ArrowUpRight, Send, ArrowDownLeft, ArrowUpRight as ArrowUpRight2, CreditCard, Smartphone, Link, Shield, Check } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { mockWalletTransactions } from '../data/mock';

export default function Wallet() {
  const navigate = useNavigate();
  const { walletBalance, setWalletBalance } = useStore();
  const [activeTab, setActiveTab] = useState<'transactions' | 'topup' | 'accounts'>('transactions');
  const [topUpAmount, setTopUpAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('momo');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleTopUp = () => {
    const amount = parseFloat(topUpAmount);
    if (amount > 0) {
      setWalletBalance(walletBalance + amount);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      setTopUpAmount('');
    }
  };

  const quickAmounts = [50, 100, 200, 500];

  const linkedAccounts = [
    { id: 'momo', name: 'MTN MoMo', detail: '···· 2847', primary: true, icon: Smartphone },
    { id: 'visa', name: 'Visa Card', detail: '···· 4521', primary: false, icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-tireno-dark">
      <header className="sticky top-0 z-40 bg-tireno-dark/95 backdrop-blur-md border-b border-tireno-surfaceLight">
        <div className="max-w-lg mx-auto flex items-center h-14 px-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-lg hover:bg-tireno-surface">
            <ArrowLeft size={20} className="text-white" />
          </button>
          <h1 className="flex-1 text-center text-lg font-semibold text-white pr-8">Wallet</h1>
        </div>
      </header>

      <div className="max-w-lg mx-auto p-4 pb-6">
        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-6 mb-6 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #FF6B2C 0%, #E55A1F 100%)' }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative">
            <p className="text-white/80 text-sm font-medium mb-1">Available Balance</p>
            <p className="text-white font-bold text-4xl mb-1">GH₵{walletBalance.toFixed(2)}</p>
            <p className="text-white/80 text-sm mb-4">Kwabena Owusu</p>
            <div className="flex gap-3">
              <button className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl py-2.5 text-white text-sm font-medium flex items-center justify-center gap-2">
                <Plus size={16} />
                Top Up
              </button>
              <button className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl py-2.5 text-white text-sm font-medium flex items-center justify-center gap-2">
                <ArrowUpRight size={16} />
                Withdraw
              </button>
              <button className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl py-2.5 text-white text-sm font-medium flex items-center justify-center gap-2">
                <Send size={16} />
                Send
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {[
            { id: 'transactions' as const, label: 'Transactions' },
            { id: 'topup' as const, label: 'Top Up' },
            { id: 'accounts' as const, label: 'Linked Accounts' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-tireno-orange text-white'
                  : 'bg-tireno-surface text-tireno-gray'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'transactions' && (
            <motion.div
              key="transactions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-2"
            >
              {mockWalletTransactions.map((tx) => (
                <div key={tx.id} className="card-dark p-4 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    tx.type === 'credit' ? 'bg-tireno-green/20' : 'bg-tireno-red/20'
                  }`}>
                    {tx.type === 'credit' ? (
                      <ArrowDownLeft size={18} className="text-tireno-green" />
                    ) : (
                      <ArrowUpRight2 size={18} className="text-tireno-red" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{tx.description}</p>
                    <p className="text-tireno-gray text-xs">{tx.date}</p>
                  </div>
                  <span className={`font-bold text-sm ${
                    tx.type === 'credit' ? 'text-tireno-green' : 'text-tireno-red'
                  }`}>
                    {tx.type === 'credit' ? '+' : '-'}GH₵{tx.amount}
                  </span>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'topup' && (
            <motion.div
              key="topup"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {/* Quick Amounts */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {quickAmounts.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setTopUpAmount(amt.toString())}
                    className={`card-dark py-3 rounded-xl text-sm font-medium transition-all ${
                      topUpAmount === amt.toString() ? 'border-tireno-orange ring-1 ring-tireno-orange' : ''
                    }`}
                  >
                    GH₵{amt}
                  </button>
                ))}
              </div>

              {/* Custom Amount */}
              <div className="mb-4">
                <label className="text-tireno-grayLight text-sm font-medium mb-2 block">Custom Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-tireno-gray text-lg">GH₵</span>
                  <input
                    type="number"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    placeholder="0.00"
                    className="input-dark w-full pl-14 text-lg"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <label className="text-tireno-grayLight text-sm font-medium mb-2 block">Payment Method</label>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedMethod('momo')}
                    className={`w-full card-dark p-4 flex items-center gap-3 text-left transition-all ${
                      selectedMethod === 'momo' ? 'border-tireno-orange' : ''
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-tireno-yellow/20 flex items-center justify-center">
                      <Smartphone size={20} className="text-tireno-yellow" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">MTN MoMo</p>
                      <p className="text-tireno-gray text-xs">···· 2847</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedMethod === 'momo' ? 'border-tireno-orange' : 'border-tireno-surfaceLight'
                    }`}>
                      {selectedMethod === 'momo' && <div className="w-2.5 h-2.5 rounded-full bg-tireno-orange" />}
                    </div>
                  </button>
                </div>
              </div>

              {/* Top Up Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleTopUp}
                disabled={!topUpAmount || parseFloat(topUpAmount) <= 0}
                className="w-full btn-orange py-4 text-base font-bold disabled:opacity-50"
              >
                Top Up Wallet
              </motion.button>

              {/* Success Toast */}
              <AnimatePresence>
                {showSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-tireno-green rounded-xl px-6 py-3 flex items-center gap-2 shadow-lg"
                  >
                    <Check size={18} className="text-white" />
                    <span className="text-white font-medium text-sm">Top up successful!</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {activeTab === 'accounts' && (
            <motion.div
              key="accounts"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-2"
            >
              {linkedAccounts.map((acc) => (
                <div key={acc.id} className="card-dark p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-tireno-surfaceLight flex items-center justify-center">
                    <acc.icon size={20} className="text-tireno-orange" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-white text-sm font-medium">{acc.name}</p>
                      {acc.primary && (
                        <span className="bg-tireno-orange/20 text-tireno-orange text-[10px] font-medium px-2 py-0.5 rounded-full">
                          Primary
                        </span>
                      )}
                    </div>
                    <p className="text-tireno-gray text-xs">{acc.detail}</p>
                  </div>
                </div>
              ))}

              {/* Link New */}
              <button className="w-full border-2 border-dashed border-tireno-surfaceLight rounded-xl p-4 flex items-center gap-3 text-tireno-gray hover:text-tireno-orange hover:border-tireno-orange/50 transition-colors">
                <Link size={18} />
                <span className="text-sm font-medium">Link new account</span>
              </button>

              {/* Security Note */}
              <div className="bg-tireno-blue/10 border border-tireno-blue/20 rounded-xl p-4 mt-4 flex items-start gap-3">
                <Shield size={18} className="text-tireno-blue shrink-0 mt-0.5" />
                <div>
                  <p className="text-tireno-blueLight text-sm font-medium">Secure Payments</p>
                  <p className="text-tireno-blue/70 text-xs mt-1">Your payment details are encrypted and never stored on our servers.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
