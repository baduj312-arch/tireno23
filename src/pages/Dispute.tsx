import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronDown, Upload, FileText, ClipboardList, Check, AlertCircle, Clock, MessageSquare, Shield } from 'lucide-react';

export default function Dispute() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [files] = useState<string[]>(['receipt.jpg']);
  const [caseId] = useState('DIS-' + Math.floor(100000 + Math.random() * 900000));

  const categories = ['Overcharged', 'Incomplete repair', 'No-show', 'Unprofessional', 'Damage', 'Other'];
  const steps = [
    { num: 1, label: 'Describe' },
    { num: 2, label: 'Evidence' },
    { num: 3, label: 'Confirm' },
  ];

  return (
    <div className="min-h-screen bg-tireno-dark">
      <header className="sticky top-0 z-40 bg-tireno-dark/95 backdrop-blur-md border-b border-tireno-surfaceLight">
        <div className="max-w-lg mx-auto flex items-center h-14 px-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-lg hover:bg-tireno-surface">
            <ArrowLeft size={20} className="text-white" />
          </button>
          <h1 className="flex-1 text-center text-lg font-semibold text-white pr-8">Dispute Resolution</h1>
        </div>
      </header>

      <div className="max-w-lg mx-auto p-4 pb-6">
        {/* Progress Bar */}
        <div className="flex gap-2 mb-6">
          {steps.map((s) => (
            <div key={s.num} className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-medium ${s.num <= step ? 'text-tireno-orange' : 'text-tireno-gray'}`}>
                  {s.label}
                </span>
              </div>
              <div className={`h-2 rounded-full transition-all ${
                s.num <= step ? 'bg-tireno-orange' : 'bg-tireno-surfaceLight'
              }`} />
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-white font-semibold text-lg mb-1">What went wrong?</h2>
              <p className="text-tireno-gray text-sm mb-4">Help us understand the issue so we can resolve it fairly.</p>

              {/* Job Reference */}
              <div className="card-dark p-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-tireno-surfaceLight flex items-center justify-center">
                    <ClipboardList size={18} className="text-tireno-orange" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Job TRN-3835</p>
                    <p className="text-tireno-gray text-xs">Battery Jump | Yaw Addo</p>
                  </div>
                </div>
              </div>

              {/* Category */}
              <div className="mb-4">
                <label className="text-tireno-grayLight text-sm font-medium mb-2 block">Issue Category</label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="input-dark w-full appearance-none"
                  >
                    <option value="">Select category...</option>
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-tireno-gray pointer-events-none" />
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="text-tireno-grayLight text-sm font-medium mb-2 block">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what happened in detail..."
                  className="input-dark w-full h-32 resize-none"
                />
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!category || !description}
                className="w-full btn-orange py-4 text-base font-bold disabled:opacity-50"
              >
                Next
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-white font-semibold text-lg mb-1">Upload Evidence</h2>
              <p className="text-tireno-gray text-sm mb-4">Add photos, receipts, or any supporting documents.</p>

              {/* Upload Box */}
              <div className="border-2 border-dashed border-tireno-surfaceLight rounded-xl p-8 mb-4 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-xl bg-tireno-orange/20 flex items-center justify-center mb-3">
                  <Upload size={24} className="text-tireno-orange" />
                </div>
                <p className="text-white font-medium text-sm mb-1">Drop files here</p>
                <p className="text-tireno-gray text-xs">JPG, PNG, PDF up to 10MB</p>
              </div>

              {/* File Thumbnails */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {files.map((f, i) => (
                  <div key={i} className="card-dark p-3 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-tireno-orange/20 flex items-center justify-center">
                      <FileText size={16} className="text-tireno-orange" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs truncate">{f}</p>
                      <p className="text-tireno-gray text-[10px]">2.4 MB</p>
                    </div>
                    <Check size={14} className="text-tireno-green" />
                  </div>
                ))}
                <div className="card-dark p-3 flex items-center gap-2 border-tireno-orange/30">
                  <div className="w-8 h-8 rounded-lg bg-tireno-orange/20 flex items-center justify-center">
                    <MessageSquare size={16} className="text-tireno-orange" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs truncate">Chat log</p>
                    <p className="text-tireno-orange text-[10px]">Auto-attached</p>
                  </div>
                  <Check size={14} className="text-tireno-green" />
                </div>
              </div>

              <button
                onClick={() => setStep(3)}
                className="w-full btn-orange py-4 text-base font-bold"
              >
                Submit Dispute
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center py-6"
            >
              <div className="text-6xl mb-4">📋</div>
              <h2 className="text-white font-bold text-xl mb-2">Dispute Submitted</h2>
              <p className="text-tireno-orange font-mono text-lg mb-6">{caseId}</p>

              <div className="bg-tireno-green/10 border border-tireno-green/20 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Shield size={16} className="text-tireno-green" />
                  <span className="text-tireno-green font-medium text-sm">Mediator assigned</span>
                </div>
                <p className="text-tireno-gray text-sm">24h review period</p>
              </div>

              {/* Info Rows */}
              <div className="space-y-3 mb-8 text-left">
                <div className="flex items-center gap-3 card-dark p-4">
                  <div className="w-8 h-8 rounded-lg bg-tireno-orange/20 flex items-center justify-center">
                    <Clock size={16} className="text-tireno-orange" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Provider has 24h</p>
                    <p className="text-tireno-gray text-xs">To respond to your dispute</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 card-dark p-4">
                  <div className="w-8 h-8 rounded-lg bg-tireno-green/20 flex items-center justify-center">
                    <Check size={16} className="text-tireno-green" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Mediator assigned</p>
                    <p className="text-tireno-gray text-xs">Neutral third party review</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 card-dark p-4">
                  <div className="w-8 h-8 rounded-lg bg-tireno-blue/20 flex items-center justify-center">
                    <AlertCircle size={16} className="text-tireno-blue" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Refund in 3-5 days</p>
                    <p className="text-tireno-gray text-xs">If dispute is resolved in your favor</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/')}
                className="w-full btn-orange py-4 text-base font-bold"
              >
                Back to Home
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
