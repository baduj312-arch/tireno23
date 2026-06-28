import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import GoogleMap from '../components/GoogleMap';
import {
  LayoutDashboard, Users, DollarSign, BarChart3, Bell,
  AlertTriangle, Activity, Percent,
  ClipboardList, Settings, Send, Calendar, Shield
} from 'lucide-react';

export default function Admin() {
  const navigate = useNavigate();
  const [pin, setPin] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'providers' | 'finance' | 'analytics' | 'alerts'>('overview');
  const [broadcastType, setBroadcastType] = useState('info');
  const [broadcastRegion, setBroadcastRegion] = useState('all');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastAudience, setBroadcastAudience] = useState('all');

  const handlePin = (digit: string) => {
    const newPin = pin + digit;
    if (newPin.length <= 4) {
      setPin(newPin);
      if (newPin.length === 4) {
        if (newPin === '1234') {
          setTimeout(() => setAuthenticated(true), 300);
        } else {
          setTimeout(() => setPin(''), 500);
        }
      }
    }
  };

  const clearPin = () => setPin('');

  const statCards = [
    { label: 'Active Jobs', value: '47', change: '+12%', color: 'orange', icon: Activity },
    { label: 'Online Providers', value: '132', change: '+8%', color: 'green', icon: Users },
    { label: 'Today Revenue', value: 'GH₵12,580', change: '+23%', color: 'blue', icon: DollarSign },
    { label: 'Commission', value: '10%', change: 'steady', color: 'yellow', icon: Percent },
  ];

  const recentJobs = [
    { id: 'TRN-3847', service: 'Mechanic', provider: 'Kwame Osei', status: 'active', amount: 85, time: '2 min ago' },
    { id: 'TRN-3846', service: 'Tow', provider: 'Ama Mensah', status: 'completed', amount: 150, time: '15 min ago' },
    { id: 'TRN-3845', service: 'Fuel', provider: 'Yaw Addo', status: 'active', amount: 45, time: '28 min ago' },
    { id: 'TRN-3844', service: 'Battery', provider: 'Kofi B.', status: 'completed', amount: 60, time: '45 min ago' },
  ];

  const providers = [
    { name: 'Kwame Osei', id: 'verified', docs: { id: true, workshop: true, license: true }, fraud: null },
    { name: 'Ama Mensah', id: 'verified', docs: { id: true, workshop: true, license: false }, fraud: null },
    { name: 'Yaw Addo', id: 'pending', docs: { id: true, workshop: false, license: false }, fraud: 'duplicate' },
    { name: 'Kofi B.', id: 'verified', docs: { id: true, workshop: true, license: true }, fraud: 'gps' },
  ];

  const revenueRegions = [
    { name: 'Accra', percent: 57, amount: 7167 },
    { name: 'Kumasi', percent: 27, amount: 3397 },
    { name: 'Nairobi', percent: 10, amount: 1258 },
    { name: 'Other', percent: 6, amount: 755 },
  ];

  const payouts = [
    { name: 'Kwame Osei', amount: 765, status: 'paid', date: 'Jun 28' },
    { name: 'Ama Mensah', amount: 540, status: 'processing', date: 'Jun 28' },
    { name: 'Yaw Addo', amount: 990, status: 'paid', date: 'Jun 27' },
  ];

  const peakHours = [
    { hour: '6AM', level: 2 }, { hour: '8AM', level: 5 }, { hour: '10AM', level: 7 },
    { hour: '12PM', level: 9 }, { hour: '2PM', level: 8 }, { hour: '4PM', level: 6 },
    { hour: '6PM', level: 7 }, { hour: '8PM', level: 5 }, { hour: '10PM', level: 3 },
    { hour: '12AM', level: 1 }, { hour: '2AM', level: 1 }, { hour: '4AM', level: 1 },
  ];

  const zoneAlerts = [
    { zone: 'Tema Motorway', status: 'critical', message: '0 providers within 5km' },
    { zone: 'East Legon', status: 'warning', message: 'Only 2 providers available' },
    { zone: 'Labadi', status: 'warning', message: '3 providers, high demand' },
  ];

  const broadcasts = [
    { type: 'urgent', message: 'Severe weather alert - Accra region', date: 'Jun 28, 10:30 AM', audience: 'All' },
    { type: 'info', message: 'New pricing policy effective July 1', date: 'Jun 27, 2:00 PM', audience: 'Providers' },
    { type: 'promo', message: '10% discount on first tow', date: 'Jun 26, 9:00 AM', audience: 'Drivers' },
  ];

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-tireno-dark flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-tireno-surface mx-auto mb-4 flex items-center justify-center border border-tireno-surfaceLight">
              <Shield size={28} className="text-tireno-orange" />
            </div>
            <h1 className="text-white font-bold text-xl">Admin Access</h1>
            <p className="text-tireno-gray text-sm mt-1">Enter your 4-digit PIN</p>
          </div>

          {/* PIN dots */}
          <div className="flex justify-center gap-4 mb-8">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-4 h-4 rounded-full transition-all ${
                  i < pin.length ? 'bg-tireno-orange' : 'bg-tireno-surfaceLight'
                }`}
              />
            ))}
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'DEL'].map((key) => (
              <button
                key={key}
                onClick={() => {
                  if (key === 'C') clearPin();
                  else if (key === 'DEL') setPin(pin.slice(0, -1));
                  else handlePin(key);
                }}
                className={`h-14 rounded-xl font-bold text-lg transition-all ${
                  key === 'C' || key === 'DEL'
                    ? 'bg-tireno-surface text-tireno-orange text-sm'
                    : 'bg-tireno-surface text-white hover:bg-tireno-surfaceLight'
                }`}
              >
                {key}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-tireno-dark pb-20">
      {/* Admin Header */}
      <header className="sticky top-0 z-40 bg-tireno-dark/95 backdrop-blur-md border-b border-tireno-surfaceLight">
        <div className="max-w-lg mx-auto flex items-center h-14 px-4">
          <h1 className="text-white font-bold text-lg">Tireno Admin</h1>
          <div className="ml-auto flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-tireno-green animate-pulse" />
            <span className="text-tireno-green text-xs font-medium">Live</span>
          </div>
        </div>
      </header>

      {/* Admin Nav */}
      <div className="max-w-lg mx-auto px-4 pt-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { id: 'overview' as const, label: 'Overview', icon: LayoutDashboard },
            { id: 'providers' as const, label: 'Providers', icon: Users },
            { id: 'finance' as const, label: 'Finance', icon: DollarSign },
            { id: 'analytics' as const, label: 'Analytics', icon: BarChart3 },
            { id: 'alerts' as const, label: 'Alerts', icon: Bell },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-tireno-orange text-white'
                  : 'bg-tireno-surface text-tireno-gray'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4 pb-6">
        <AnimatePresence mode="wait">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Stat Cards */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {statCards.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="card-dark p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <stat.icon size={18} className={`text-tireno-${stat.color}`} />
                      <span className={`text-xs font-medium ${
                        stat.change.startsWith('+') ? 'text-tireno-green' : 'text-tireno-gray'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                    <p className="text-white font-bold text-xl">{stat.value}</p>
                    <p className="text-tireno-gray text-xs">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Live SOS Map */}
              <div className="card-dark p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-semibold text-sm">Live SOS Map</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-tireno-orange animate-pulse" />
                    <span className="text-tireno-orange text-xs font-medium">47 active</span>
                  </div>
                </div>
                <GoogleMap
                  isAdmin={true}
                  height="240px"
                  driverLocation={{ lat: 5.6037, lng: -0.1870 }}
                  showDriverMarker={false}
                  showProviderMarker={false}
                  showNearbyProviders={[]}
                  sosMarkers={[
                    { lat: 5.6040, lng: -0.1875, type: 'mechanic', id: '1' },
                    { lat: 5.6050, lng: -0.1860, type: 'tow', id: '2' },
                    { lat: 5.6025, lng: -0.1880, type: 'fuel', id: '3' },
                    { lat: 5.6030, lng: -0.1850, type: 'battery', id: '4' },
                    { lat: 5.6060, lng: -0.1890, type: 'mechanic', id: '5' },
                  ]}
                />
                <div className="flex items-center gap-4 mt-2 text-white/30 text-[10px]">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-tireno-orange" /> Mechanic</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-tireno-blue" /> Tow</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-tireno-yellow" /> Fuel</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-tireno-green" /> Battery</span>
                </div>
              </div>

              {/* KPI Progress */}
              <div className="card-dark p-4 mb-4">
                <h3 className="text-white font-semibold text-sm mb-3">KPIs</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Response Time', value: 3.2, max: 5, unit: 'min' },
                    { label: 'Completion Rate', value: 94, max: 100, unit: '%' },
                    { label: 'Satisfaction', value: 4.7, max: 5, unit: 'stars' },
                  ].map((kpi) => (
                    <div key={kpi.label}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-tireno-gray text-xs">{kpi.label}</span>
                        <span className="text-white text-xs font-medium">{kpi.value}{kpi.unit}</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-bar-fill" style={{ width: `${(kpi.value / kpi.max) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Jobs */}
              <div className="card-dark p-4">
                <h3 className="text-white font-semibold text-sm mb-3">Recent Jobs</h3>
                <div className="space-y-2">
                  {recentJobs.map((job) => (
                    <div key={job.id} className="flex items-center gap-3 p-2 rounded-lg bg-tireno-dark/50">
                      <div className={`w-2 h-2 rounded-full ${job.status === 'active' ? 'bg-tireno-orange animate-pulse' : 'bg-tireno-green'}`} />
                      <div className="flex-1">
                        <p className="text-white text-xs font-medium">{job.id} | {job.service}</p>
                        <p className="text-tireno-gray text-[10px]">{job.provider}</p>
                      </div>
                      <span className="text-white text-xs font-medium">GH₵{job.amount}</span>
                      <span className="text-tireno-gray text-[10px]">{job.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* PROVIDERS TAB */}
          {activeTab === 'providers' && (
            <motion.div
              key="providers"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h3 className="text-white font-semibold text-sm mb-3">Verification Queue</h3>
              <div className="space-y-3 mb-6">
                {providers.map((p, i) => (
                  <motion.div
                    key={p.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="card-dark p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full gradient-orange flex items-center justify-center text-white font-bold text-sm">
                          {p.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{p.name}</p>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                            p.id === 'verified' ? 'bg-tireno-green/20 text-tireno-green' : 'bg-tireno-yellow/20 text-tireno-yellow'
                          }`}>
                            {p.id === 'verified' ? 'Verified' : 'Pending'}
                          </span>
                        </div>
                      </div>
                      {p.id === 'pending' && (
                        <div className="flex gap-2">
                          <button className="bg-tireno-green text-white text-xs font-medium px-3 py-1.5 rounded-lg">Approve</button>
                          <button className="bg-tireno-red text-white text-xs font-medium px-3 py-1.5 rounded-lg">Reject</button>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <span className={`text-[10px] px-2 py-1 rounded-full ${p.docs.id ? 'bg-tireno-green/20 text-tireno-green' : 'bg-tireno-red/20 text-tireno-red'}`}>
                        ID {p.docs.id ? '✓' : '✗'}
                      </span>
                      <span className={`text-[10px] px-2 py-1 rounded-full ${p.docs.workshop ? 'bg-tireno-green/20 text-tireno-green' : 'bg-tireno-red/20 text-tireno-red'}`}>
                        Workshop {p.docs.workshop ? '✓' : '✗'}
                      </span>
                      <span className={`text-[10px] px-2 py-1 rounded-full ${p.docs.license ? 'bg-tireno-green/20 text-tireno-green' : 'bg-tireno-red/20 text-tireno-red'}`}>
                        Licence {p.docs.license ? '✓' : '✗'}
                      </span>
                    </div>
                    {p.fraud && (
                      <div className={`mt-3 flex items-center gap-2 p-2 rounded-lg ${
                        p.fraud === 'duplicate' ? 'bg-tireno-yellow/10' : 'bg-tireno-red/10'
                      }`}>
                        <AlertTriangle size={14} className={p.fraud === 'duplicate' ? 'text-tireno-yellow' : 'text-tireno-red'} />
                        <span className={`text-xs font-medium ${p.fraud === 'duplicate' ? 'text-tireno-yellow' : 'text-tireno-red'}`}>
                          {p.fraud === 'duplicate' ? 'Duplicate account detected' : 'GPS spoofing alert'}
                        </span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* FINANCE TAB */}
          {activeTab === 'finance' && (
            <motion.div
              key="finance"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Revenue Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="card-dark p-4">
                  <p className="text-tireno-gray text-xs mb-1">Today Revenue</p>
                  <p className="text-white font-bold text-xl">GH₵12,580</p>
                  <p className="text-tireno-green text-xs">+23% vs yesterday</p>
                </div>
                <div className="card-dark p-4">
                  <p className="text-tireno-gray text-xs mb-1">Commission (10%)</p>
                  <p className="text-white font-bold text-xl">GH₵1,258</p>
                  <p className="text-tireno-green text-xs">+23% vs yesterday</p>
                </div>
              </div>

              {/* Regional Revenue */}
              <div className="card-dark p-4 mb-4">
                <h3 className="text-white font-semibold text-sm mb-3">Regional Revenue</h3>
                <div className="space-y-3">
                  {revenueRegions.map((r) => (
                    <div key={r.name}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white text-xs">{r.name}</span>
                        <span className="text-tireno-gray text-xs">{r.percent}% (GH₵{r.amount})</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-bar-fill" style={{ width: `${r.percent}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payouts */}
              <div className="card-dark p-4">
                <h3 className="text-white font-semibold text-sm mb-3">Provider Payouts</h3>
                <div className="space-y-2">
                  {payouts.map((p) => (
                    <div key={p.name} className="flex items-center gap-3 p-2 rounded-lg bg-tireno-dark/50">
                      <div className="w-8 h-8 rounded-full bg-tireno-surfaceLight flex items-center justify-center text-white font-bold text-xs">
                        {p.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-xs font-medium">{p.name}</p>
                        <p className="text-tireno-gray text-[10px]">{p.date}</p>
                      </div>
                      <span className="text-white text-xs font-medium">GH₵{p.amount}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                        p.status === 'paid' ? 'bg-tireno-green/20 text-tireno-green' : 'bg-tireno-yellow/20 text-tireno-yellow'
                      }`}>
                        {p.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ANALYTICS TAB */}
          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* User Growth */}
              <div className="card-dark p-4 mb-4">
                <h3 className="text-white font-semibold text-sm mb-3">User Growth</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-tireno-dark/50 rounded-xl">
                    <p className="text-white font-bold text-lg">2,847</p>
                    <p className="text-tireno-gray text-xs">Total Drivers</p>
                  </div>
                  <div className="text-center p-3 bg-tireno-dark/50 rounded-xl">
                    <p className="text-white font-bold text-lg">342</p>
                    <p className="text-tireno-gray text-xs">Providers</p>
                  </div>
                  <div className="text-center p-3 bg-tireno-dark/50 rounded-xl">
                    <p className="text-tireno-green font-bold text-lg">+12%</p>
                    <p className="text-tireno-gray text-xs">This Month</p>
                  </div>
                </div>
              </div>

              {/* Peak Hours */}
              <div className="card-dark p-4 mb-4">
                <h3 className="text-white font-semibold text-sm mb-3">Peak Hours</h3>
                <div className="flex items-end gap-1 h-32">
                  {peakHours.map((h, i) => {
                    const colors = ['bg-tireno-green', 'bg-tireno-green', 'bg-tireno-yellow', 'bg-tireno-orange', 'bg-tireno-orange', 'bg-tireno-yellow', 'bg-tireno-orange', 'bg-tireno-yellow', 'bg-tireno-green', 'bg-tireno-green', 'bg-tireno-green', 'bg-tireno-green'];
                    return (
                      <div key={h.hour} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className={`w-full rounded-t ${colors[i]}`}
                          style={{ height: `${h.level * 10}%` }}
                        />
                        <span className="text-tireno-gray text-[10px] -rotate-45 origin-top-left translate-y-2">{h.hour}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Zone Alerts */}
              <div className="card-dark p-4">
                <h3 className="text-white font-semibold text-sm mb-3">Provider Shortage Zones</h3>
                <div className="space-y-2">
                  {zoneAlerts.map((z) => (
                    <div key={z.zone} className={`p-3 rounded-lg flex items-center gap-3 ${
                      z.status === 'critical' ? 'bg-tireno-red/10 border border-tireno-red/20' : 'bg-tireno-yellow/10 border border-tireno-yellow/20'
                    }`}>
                      <AlertTriangle size={16} className={z.status === 'critical' ? 'text-tireno-red' : 'text-tireno-yellow'} />
                      <div className="flex-1">
                        <p className="text-white text-xs font-medium">{z.zone}</p>
                        <p className={`text-xs ${z.status === 'critical' ? 'text-tireno-red' : 'text-tireno-yellow'}`}>{z.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ALERTS TAB */}
          {activeTab === 'alerts' && (
            <motion.div
              key="alerts"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Broadcast Composer */}
              <div className="card-dark p-4 mb-4">
                <h3 className="text-white font-semibold text-sm mb-3">Broadcast Message</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-tireno-gray text-xs mb-1 block">Type</label>
                    <select
                      value={broadcastType}
                      onChange={(e) => setBroadcastType(e.target.value)}
                      className="input-dark w-full text-sm"
                    >
                      <option value="info">Info</option>
                      <option value="urgent">Urgent</option>
                      <option value="promo">Promo</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-tireno-gray text-xs mb-1 block">Region</label>
                    <select
                      value={broadcastRegion}
                      onChange={(e) => setBroadcastRegion(e.target.value)}
                      className="input-dark w-full text-sm"
                    >
                      <option value="all">All Regions</option>
                      <option value="accra">Accra</option>
                      <option value="kumasi">Kumasi</option>
                      <option value="nairobi">Nairobi</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-tireno-gray text-xs mb-1 block">Audience</label>
                    <div className="flex gap-2">
                      {['all', 'drivers', 'providers'].map((aud) => (
                        <button
                          key={aud}
                          onClick={() => setBroadcastAudience(aud)}
                          className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                            broadcastAudience === aud
                              ? 'bg-tireno-orange text-white'
                              : 'bg-tireno-dark text-tireno-gray border border-tireno-surfaceLight'
                          }`}
                        >
                          {aud.charAt(0).toUpperCase() + aud.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-tireno-gray text-xs mb-1 block">Message</label>
                    <textarea
                      value={broadcastMessage}
                      onChange={(e) => setBroadcastMessage(e.target.value)}
                      placeholder="Enter broadcast message..."
                      className="input-dark w-full h-24 resize-none text-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 btn-orange py-3 text-sm font-bold flex items-center justify-center gap-2">
                      <Send size={16} />
                      Broadcast Now
                    </button>
                    <button className="flex-1 btn-ghost py-3 text-sm font-medium flex items-center justify-center gap-2">
                      <Calendar size={16} />
                      Schedule
                    </button>
                  </div>
                </div>
              </div>

              {/* Broadcast Log */}
              <div className="card-dark p-4">
                <h3 className="text-white font-semibold text-sm mb-3">Recent Broadcasts</h3>
                <div className="space-y-3">
                  {broadcasts.map((b, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-tireno-dark/50">
                      <div className={`w-2 h-2 rounded-full mt-1.5 ${
                        b.type === 'urgent' ? 'bg-tireno-red' :
                        b.type === 'promo' ? 'bg-tireno-green' : 'bg-tireno-blue'
                      }`} />
                      <div className="flex-1">
                        <p className="text-white text-xs font-medium">{b.message}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-tireno-gray text-[10px]">{b.date}</span>
                          <span className="text-tireno-gray text-[10px]">|</span>
                          <span className="text-tireno-orange text-[10px]">{b.audience}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Admin Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-tireno-dark/95 backdrop-blur-md border-t border-tireno-surfaceLight">
        <div className="max-w-lg mx-auto flex items-center justify-around py-2 px-4">
          {[
            { icon: LayoutDashboard, label: 'Dashboard', tab: 'overview' as const },
            { icon: Users, label: 'Providers', tab: 'providers' as const },
            { icon: ClipboardList, label: 'Disputes', tab: 'providers' as const },
            { icon: Settings, label: 'Settings', tab: 'overview' as const },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => item.label === 'Disputes' ? navigate('/dispute') : setActiveTab(item.tab)}
              className="flex flex-col items-center gap-0.5 py-1 px-3"
            >
              <item.icon size={20} className="text-tireno-gray" />
              <span className="text-tireno-gray text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
