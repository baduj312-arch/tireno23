import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, ClipboardList, DollarSign, User, Star,
  TrendingUp, Clock, CheckCircle, X, Wrench, MapPin,
  Shield, ArrowUpRight, ArrowDownLeft, ChevronRight,
  ToggleLeft, ToggleRight, Navigation
} from 'lucide-react';
import GoogleMapComponent from '../components/GoogleMap';
import { useGeolocation } from '../hooks/useGeolocation';
import { useRealtimePositions } from '../hooks/useRealtimeTracking';
import { supabase } from '../lib/supabase';

export default function ProviderDashboard() {
  const navigate = useNavigate();
  const { position } = useGeolocation();
  const { driverPos, updatePosition } = useRealtimePositions('provider_1');
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showBidModal, setShowBidModal] = useState(false);
  const [bidAmount, setBidAmount] = useState('85');
  const [bidEta, setBidEta] = useState('5');
  const [pendingJobs, setPendingJobs] = useState<any[]>([]);
  const [myJobs, setMyJobs] = useState<any[]>([]);

  const earnings = [
    { day: 'Mon', amount: 120 },
    { day: 'Tue', amount: 85 },
    { day: 'Wed', amount: 200 },
    { day: 'Thu', amount: 150 },
    { day: 'Fri', amount: 95 },
    { day: 'Sat', amount: 180 },
    { day: 'Sun', amount: 60 },
  ];
  const maxEarning = Math.max(...earnings.map(e => e.amount));

  const stats = [
    { label: 'Bid Win Rate', value: '68%', icon: TrendingUp },
    { label: 'Avg Rating', value: '4.8', icon: Star },
    { label: 'Acceptance', value: '94%', icon: CheckCircle },
    { label: 'Response Time', value: '3.2m', icon: Clock },
  ];

  // Fetch pending jobs from Supabase
  useEffect(() => {
    const fetchPending = async () => {
      const { data } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(5);
      if (data) setPendingJobs(data);
    };
    fetchPending();

    const channel = supabase
      .channel('pending_jobs')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'jobs' }, () => fetchPending())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // Fetch provider's assigned jobs
  useEffect(() => {
    const fetchMyJobs = async () => {
      const { data } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'assigned')
        .order('created_at', { ascending: false })
        .limit(5);
      if (data) setMyJobs(data);
    };
    fetchMyJobs();
  }, []);

  // Sync provider position to Supabase
  useEffect(() => {
    if (!position || position.lat === 5.6037) return;
    updatePosition(position.lat, position.lng, position.heading, position.speed, position.accuracy);
  }, [position, updatePosition]);

  const trustScore = 94;
  const trustBreakdown = {
    rating: 4.8 * 10 * 0.5,
    success: 98 * 0.3,
    response: Math.max(0, (5 - 3.2) * 20 * 0.2),
  };

  const handleSubmitBid = async () => {
    const selectedJob = pendingJobs[0];
    if (!selectedJob) return;

    const { error } = await supabase.from('bids').insert({
      job_id: selectedJob.id,
      provider_id: 'provider_1',
      price: parseFloat(bidAmount),
      eta_minutes: parseInt(bidEta),
      status: 'pending',
    });

    if (!error) setShowBidModal(false);
  };

  return (
    <div className="min-h-screen bg-tireno-dark">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-tireno-dark/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-lg mx-auto flex items-center h-14 px-4">
          <h1 className="text-white font-bold text-lg">Provider Dashboard</h1>
          <div className="ml-auto flex items-center gap-2">
            <span className={`text-xs font-medium ${isOpen ? 'text-tireno-green' : 'text-white/30'}`}>
              {isOpen ? 'Open' : 'Closed'}
            </span>
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <ToggleRight size={28} className="text-tireno-green" /> : <ToggleLeft size={28} className="text-white/30" />}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto p-4 pb-6">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Earnings Card */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl p-5 mb-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #FF6B2C 0%, #E55A1F 100%)' }}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div><p className="text-white/80 text-sm">Today</p><p className="text-white font-bold text-3xl">GH₵765</p></div>
                    <div className="text-right"><p className="text-white/80 text-sm">Jobs</p><p className="text-white font-bold text-xl">9</p></div>
                  </div>
                  <p className="text-white/70 text-xs mb-3">10% platform fee deducted</p>
                  <div className="flex items-end gap-1 h-12">
                    {earnings.map((e) => (
                      <div key={e.day} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full rounded-t bg-white/30" style={{ height: `${(e.amount / maxEarning) * 100}%` }} />
                        <span className="text-white/60 text-[8px]">{e.day}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {stats.map((s, i) => (
                  <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card-dark p-4">
                    <s.icon size={16} className="text-tireno-orange mb-2" />
                    <p className="text-white font-bold text-xl">{s.value}</p>
                    <p className="text-white/30 text-xs">{s.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Live Map with SOS Requests */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-semibold text-sm">Live SOS Requests</h3>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-tireno-orange animate-pulse" />
                    <span className="text-tireno-orange text-xs font-medium">{pendingJobs.length} new</span>
                  </div>
                </div>
                <div className="card-dark rounded-2xl overflow-hidden h-48">
                  <GoogleMapComponent
                    driverLocation={position}
                    height="100%"
                    showDriverMarker={true}
                    showProviderMarker={false}
                    showNearbyProviders={pendingJobs.map(j => ({
                      lat: driverPos.lat + (Math.random() - 0.5) * 0.01,
                      lng: driverPos.lng + (Math.random() - 0.5) * 0.01,
                      name: j.service_type || 'Unknown',
                      category: j.service_type || 'mechanic',
                    }))}
                  />
                </div>
              </div>

              {/* SOS Cards from real jobs */}
              <div className="space-y-3 mb-4">
                {pendingJobs.length === 0 && (
                  <div className="card-dark p-6 text-center">
                    <p className="text-white/30 text-sm">No active SOS requests nearby</p>
                    <p className="text-white/20 text-xs mt-1">Stay online to receive notifications</p>
                  </div>
                )}
                {pendingJobs.map((job, i) => (
                  <motion.div key={job.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="card-dark p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-tireno-orange/10 flex items-center justify-center">
                          <Wrench size={16} className="text-tireno-orange" />
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium capitalize">{job.service_type}</p>
                          <p className="text-white/20 text-xs">{job.job_code}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-white/30 text-xs mb-3">
                      <MapPin size={12} />
                      <span>{job.address}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/30 text-xs">Est: GH₵{job.price || 60}-{job.price || 90}</span>
                      <div className="flex gap-2">
                        <button onClick={() => { setShowBidModal(true); }} className="bg-tireno-orange text-white text-xs font-bold px-4 py-2 rounded-lg">Place Bid</button>
                        <button className="bg-white/[0.03] text-white/30 text-xs font-medium px-4 py-2 rounded-lg border border-white/[0.06]">Skip</button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Trust Score */}
              <div className="card-dark p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Shield size={18} className="text-tireno-green" />
                    <h3 className="text-white font-semibold text-sm">Trust Score</h3>
                  </div>
                  <span className="text-tireno-green font-bold">{trustScore}/100</span>
                </div>
                <div className="progress-bar mb-3">
                  <div className="progress-bar-fill" style={{ width: `${trustScore}%` }} />
                </div>
                <div className="flex justify-between text-white/30 text-xs">
                  <span>Rating ({trustBreakdown.rating.toFixed(1)})</span>
                  <span>Success ({trustBreakdown.success.toFixed(1)})</span>
                  <span>Response ({trustBreakdown.response.toFixed(1)})</span>
                </div>
                <p className="text-white/20 text-[10px] mt-2">Formula: Rating×0.5 + Success×0.3 + Response×0.2</p>
              </div>
            </motion.div>
          )}

          {activeTab === 'jobs' && (
            <motion.div key="jobs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              <h3 className="text-white font-semibold text-sm mb-2">My Jobs</h3>
              {myJobs.length === 0 && (
                <div className="card-dark p-6 text-center">
                  <p className="text-white/30 text-sm">No assigned jobs</p>
                  <p className="text-white/20 text-xs mt-1">Jobs you win will appear here</p>
                </div>
              )}
              {myJobs.map((job, i) => (
                <motion.div key={job.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card-dark p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm font-medium">{job.job_code}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-tireno-orange/10 text-tireno-orange">
                      {job.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm capitalize">{job.service_type}</p>
                      <p className="text-white/30 text-xs">{job.driver_name}</p>
                    </div>
                    <span className="text-white font-bold text-sm">GH₵{job.price}</span>
                  </div>
                  <p className="text-white/30 text-xs mt-2">{job.eta_minutes} min ETA</p>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'earnings' && (
            <motion.div key="earnings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="card-dark p-4">
                  <p className="text-white/30 text-xs mb-1">This Week</p>
                  <p className="text-white font-bold text-xl">GH₵890</p>
                </div>
                <div className="card-dark p-4">
                  <p className="text-white/30 text-xs mb-1">This Month</p>
                  <p className="text-white font-bold text-xl">GH₵3,450</p>
                </div>
              </div>
              <h3 className="text-white font-semibold text-sm mb-2">Transactions</h3>
              <div className="space-y-2">
                {[
                  { id: '1', type: 'credit', amount: 85, description: 'Job TRN-3847', date: 'Jun 28' },
                  { id: '2', type: 'debit', amount: 8.5, description: 'Platform fee (10%)', date: 'Jun 28' },
                  { id: '3', type: 'credit', amount: 150, description: 'Job TRN-3842', date: 'Jun 24' },
                  { id: '4', type: 'debit', amount: 15, description: 'Platform fee (10%)', date: 'Jun 24' },
                ].map((tx) => (
                  <div key={tx.id} className="card-dark p-4 flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === 'credit' ? 'bg-tireno-green/10' : 'bg-tireno-red/10'}`}>
                      {tx.type === 'credit' ? <ArrowDownLeft size={18} className="text-tireno-green" /> : <ArrowUpRight size={18} className="text-tireno-red" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{tx.description}</p>
                      <p className="text-white/30 text-xs">{tx.date}</p>
                    </div>
                    <span className={`font-bold text-sm ${tx.type === 'credit' ? 'text-tireno-green' : 'text-tireno-red'}`}>
                      {tx.type === 'credit' ? '+' : '-'}GH₵{tx.amount}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-6">
              <div className="w-20 h-20 rounded-full gradient-orange mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-tireno-orange/20">KO</div>
              <h2 className="text-white font-bold text-xl mb-1">Kwame Osei</h2>
              <p className="text-tireno-orange text-sm mb-6">Mechanic | Verified</p>
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="card-dark p-3"><p className="text-white font-bold text-lg">203</p><p className="text-white/30 text-xs">Total Jobs</p></div>
                <div className="card-dark p-3"><p className="text-white font-bold text-lg">4.8</p><p className="text-white/30 text-xs">Rating</p></div>
                <div className="card-dark p-3"><p className="text-white font-bold text-lg">2yr</p><p className="text-white/30 text-xs">Member</p></div>
              </div>
              <div className="space-y-2 text-left">
                <button className="w-full card-dark p-4 flex items-center gap-3 text-left">
                  <Navigation size={18} className="text-tireno-orange" />
                  <span className="text-white text-sm">Settings</span>
                  <ChevronRight size={18} className="text-white/20 ml-auto" />
                </button>
                <button onClick={() => navigate('/login')} className="w-full card-dark p-4 flex items-center gap-3 text-tireno-red text-left">
                  <X size={18} />
                  <span className="text-sm">Log Out</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bid Modal */}
      <AnimatePresence>
        {showBidModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/70 flex items-end justify-center">
            <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="bg-tireno-dark rounded-t-2xl p-6 w-full max-w-lg border-t border-white/[0.06]">
              <h3 className="text-white font-bold text-lg mb-4">Place Your Bid</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-white/30 text-xs font-medium tracking-wider uppercase mb-2 block">Your Price (GH₵)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-lg">GH₵</span>
                    <input type="number" value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} className="input-dark w-full pl-14 text-lg" />
                  </div>
                </div>
                <div>
                  <label className="text-white/30 text-xs font-medium tracking-wider uppercase mb-2 block">ETA (minutes)</label>
                  <div className="relative">
                    <Clock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
                    <input type="number" value={bidEta} onChange={(e) => setBidEta(e.target.value)} className="input-dark w-full pl-10" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 text-sm">min</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowBidModal(false)} className="flex-1 btn-ghost py-4 text-base font-medium">Cancel</button>
                <button onClick={handleSubmitBid} className="flex-1 btn-orange py-4 text-base font-bold">Submit Bid</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-tireno-dark/80 backdrop-blur-xl border-t border-white/[0.06]">
        <div className="max-w-lg mx-auto flex items-center justify-around py-2 px-4">
          {[
            { icon: LayoutDashboard, label: 'Dashboard', tab: 'dashboard' },
            { icon: ClipboardList, label: 'Jobs', tab: 'jobs' },
            { icon: DollarSign, label: 'Earnings', tab: 'earnings' },
            { icon: User, label: 'Profile', tab: 'profile' },
          ].map((item) => {
            const active = activeTab === item.tab;
            return (
              <button key={item.tab} onClick={() => setActiveTab(item.tab)} className="flex flex-col items-center gap-0.5 py-1 px-3">
                <item.icon size={22} className={active ? 'text-tireno-orange' : 'text-white/30'} />
                <span className={`text-[10px] font-medium ${active ? 'text-tireno-orange' : 'text-white/30'}`}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
      <div className="h-16" />
    </div>
  );
}
