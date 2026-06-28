import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Building2, Wrench, Car, Fuel, Battery, MapPin, Clock, Calendar,
  Check, Shield, Moon, MapPinOff
} from 'lucide-react';
import CredentialUpload from '../components/CredentialUpload';

export default function ProviderRegister() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('');
  const [years, setYears] = useState('');
  const [radius, setRadius] = useState('');
  const [address, setAddress] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [openTime, setOpenTime] = useState('08:00');
  const [closeTime, setCloseTime] = useState('18:00');
  const [workingDays, setWorkingDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [surgePricing, setSurgePricing] = useState<string[]>([]);

  const [caseId] = useState('REG-' + Math.floor(100000 + Math.random() * 900000));

  const services = [
    { id: 'mechanic', icon: Wrench, label: 'Mechanic' },
    { id: 'tow', icon: Car, label: 'Tow Truck' },
    { id: 'fuel', icon: Fuel, label: 'Fuel Delivery' },
    { id: 'battery', icon: Battery, label: 'Battery Jump' },
  ];

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const toggleDay = (day: string) => {
    setWorkingDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const toggleSurge = (type: string) => {
    setSurgePricing(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };



  const steps = [
    { num: 1, label: 'Business' },
    { num: 2, label: 'Pricing' },
    { num: 3, label: 'Documents' },
    { num: 4, label: 'Done' },
  ];

  return (
    <div className="min-h-screen bg-tireno-dark">
      <header className="sticky top-0 z-40 bg-tireno-dark/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-lg mx-auto flex items-center h-14 px-4">
          <button onClick={() => navigate(-1)} className="w-9 h-9 -ml-1 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center hover:bg-white/[0.06] transition-colors">
            <ArrowLeft size={18} className="text-white/70" />
          </button>
          <h1 className="flex-1 text-center text-lg font-semibold text-white pr-8">Provider Registration</h1>
        </div>
      </header>

      <div className="max-w-lg mx-auto p-4 pb-6">
        {/* Dot Progress */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full transition-all ${
                s.num <= step ? 'bg-tireno-orange' : 'bg-white/[0.06]'
              }`} />
              {i < steps.length - 1 && (
                <div className={`w-8 h-0.5 rounded-full transition-all ${
                  s.num < step ? 'bg-tireno-orange' : 'bg-white/[0.06]'
                }`} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: Business Info */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-white font-semibold text-lg mb-1">Business Info</h2>
              <p className="text-white/30 text-sm mb-4">Tell us about your business</p>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-white/30 text-xs font-medium tracking-wider uppercase mb-2 block">Business Name</label>
                  <div className="relative">
                    <Building2 size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="Osei Auto Repair"
                      className="input-dark w-full pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-white/30 text-xs font-medium tracking-wider uppercase mb-2 block">Service Category</label>
                  <div className="grid grid-cols-2 gap-2">
                    {services.map((s) => {
                      const active = category === s.id;
                      return (
                        <button
                          key={s.id}
                          onClick={() => setCategory(s.id)}
                          className={`card-dark p-3 flex items-center gap-2 transition-all ${
                            active ? 'border-tireno-orange/40 ring-1 ring-tireno-orange/20' : ''
                          }`}
                        >
                          <s.icon size={16} className={active ? 'text-tireno-orange' : 'text-white/30'} />
                          <span className={`text-sm ${active ? 'text-white' : 'text-white/30'}`}>{s.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-white/30 text-xs font-medium tracking-wider uppercase mb-2 block">Years in Business</label>
                    <input
                      type="number"
                      value={years}
                      onChange={(e) => setYears(e.target.value)}
                      placeholder="5"
                      className="input-dark w-full"
                    />
                  </div>
                  <div>
                    <label className="text-white/30 text-xs font-medium tracking-wider uppercase mb-2 block">Service Radius (km)</label>
                    <input
                      type="number"
                      value={radius}
                      onChange={(e) => setRadius(e.target.value)}
                      placeholder="15"
                      className="input-dark w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-white/30 text-xs font-medium tracking-wider uppercase mb-2 block">Workshop Address</label>
                  <div className="relative">
                    <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="45 Spintex Road, Accra"
                      className="input-dark w-full pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-white/30 text-xs font-medium tracking-wider uppercase mb-2 block">Base Price (GH₵)</label>
                  <input
                    type="number"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    placeholder="50"
                    className="input-dark w-full"
                  />
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!businessName || !category || !years || !radius || !address || !basePrice}
                className="w-full btn-orange py-4 text-base font-bold disabled:opacity-50"
              >
                Next
              </button>
            </motion.div>
          )}

          {/* STEP 2: Pricing & Hours */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-white font-semibold text-lg mb-1">Pricing & Hours</h2>
              <p className="text-white/30 text-sm mb-4">Set your availability</p>

              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-white/30 text-xs font-medium tracking-wider uppercase mb-2 block">Open Time</label>
                    <div className="relative">
                      <Clock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
                      <input
                        type="time"
                        value={openTime}
                        onChange={(e) => setOpenTime(e.target.value)}
                        className="input-dark w-full pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-white/30 text-xs font-medium tracking-wider uppercase mb-2 block">Close Time</label>
                    <div className="relative">
                      <Clock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
                      <input
                        type="time"
                        value={closeTime}
                        onChange={(e) => setCloseTime(e.target.value)}
                        className="input-dark w-full pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-white/30 text-xs font-medium tracking-wider uppercase mb-2 block">Working Days</label>
                  <div className="flex gap-2 flex-wrap">
                    {days.map((day) => (
                      <button
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          workingDays.includes(day)
                            ? 'bg-tireno-orange text-white'
                            : 'bg-white/[0.03] text-white/30 border border-white/[0.06]'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-white/30 text-xs font-medium tracking-wider uppercase mb-2 block">Surge Pricing</label>
                  <div className="space-y-2">
                    <button
                      onClick={() => toggleSurge('Late night')}
                      className={`w-full card-dark p-4 flex items-center gap-3 text-left transition-all ${
                        surgePricing.includes('Late night') ? 'border-tireno-orange/40' : ''
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        surgePricing.includes('Late night') ? 'bg-tireno-orange/10 border border-tireno-orange/20' : 'bg-white/[0.03] border border-white/[0.06]'
                      }`}>
                        <Moon size={18} className={surgePricing.includes('Late night') ? 'text-tireno-orange' : 'text-white/30'} />
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">Late Night</p>
                        <p className="text-white/30 text-xs">+25% after 10 PM</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        surgePricing.includes('Late night') ? 'border-tireno-orange' : 'border-white/[0.08]'
                      }`}>
                        {surgePricing.includes('Late night') && <div className="w-2.5 h-2.5 rounded-full bg-tireno-orange" />}
                      </div>
                    </button>
                    <button
                      onClick={() => toggleSurge('Remote area')}
                      className={`w-full card-dark p-4 flex items-center gap-3 text-left transition-all ${
                        surgePricing.includes('Remote area') ? 'border-tireno-orange/40' : ''
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        surgePricing.includes('Remote area') ? 'bg-tireno-orange/10 border border-tireno-orange/20' : 'bg-white/[0.03] border border-white/[0.06]'
                      }`}>
                        <MapPinOff size={18} className={surgePricing.includes('Remote area') ? 'text-tireno-orange' : 'text-white/30'} />
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">Remote Area</p>
                        <p className="text-white/30 text-xs">+15% outside city center</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        surgePricing.includes('Remote area') ? 'border-tireno-orange' : 'border-white/[0.08]'
                      }`}>
                        {surgePricing.includes('Remote area') && <div className="w-2.5 h-2.5 rounded-full bg-tireno-orange" />}
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 btn-ghost py-4 text-base font-medium">
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 btn-orange py-4 text-base font-bold"
                >
                  Next
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Documents */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-white font-semibold text-lg mb-1">Documents</h2>
              <p className="text-white/30 text-sm mb-4">Upload your credentials for verification</p>

              <CredentialUpload onUploadComplete={() => {}} />

              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(2)} className="flex-1 btn-ghost py-4 text-base font-medium">
                  Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="flex-1 btn-orange py-4 text-base font-bold"
                >
                  Submit for Review
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Confirmation */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center py-6"
            >
              <div className="text-6xl mb-4">🛡️</div>
              <h2 className="text-white font-bold text-xl mb-2">Application Submitted!</h2>
              <p className="text-tireno-orange font-mono text-lg mb-6">{caseId}</p>

              <div className="bg-tireno-green/5 border border-tireno-green/20 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Check size={16} className="text-tireno-green" />
                  <span className="text-tireno-green font-medium text-sm">48-hour review</span>
                </div>
                <p className="text-white/30 text-sm">Our team will verify your documents and notify you via SMS.</p>
              </div>

              <div className="space-y-3 mb-8 text-left">
                <div className="card-dark p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-tireno-orange/10 flex items-center justify-center border border-tireno-orange/20">
                    <Calendar size={16} className="text-tireno-orange" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Re-verification required</p>
                    <p className="text-white/30 text-xs">Every 6 months</p>
                  </div>
                </div>
                <div className="card-dark p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-tireno-blue/10 flex items-center justify-center border border-tireno-blue/20">
                    <Shield size={16} className="text-tireno-blue" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">SMS notification</p>
                    <p className="text-white/30 text-xs">You will receive updates on your phone</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/provider-dashboard')}
                className="w-full btn-orange py-4 text-base font-bold"
              >
                Go to Provider Dashboard
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
