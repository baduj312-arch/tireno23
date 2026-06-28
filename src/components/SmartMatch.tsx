import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, Clock, MapPin, TrendingUp, Zap, BrainCircuit, ChevronRight, Check } from 'lucide-react';
import { mockProviders } from '../data/mock';

interface SmartMatchProps {
  jobId?: string;
  serviceType: string;
  urgency?: 'normal' | 'urgent' | 'emergency';
  onAccept?: (providerId: string) => void;
}

interface MatchResult {
  provider: typeof mockProviders[0];
  matchScore: number;
  reasons: string[];
  estimatedPrice: number;
  estimatedEta: number;
  fareBreakdown: { label: string; amount: number }[];
}

export default function SmartMatch({ serviceType, urgency = 'normal', onAccept }: SmartMatchProps) {
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // AI matching algorithm
  useEffect(() => {
    const timer = setTimeout(() => {
      const results = mockProviders.map(p => {
        // AI scoring algorithm
        const distanceScore = Math.max(0, 100 - (parseFloat(p.distance || '2.3')) * 20);
        const ratingScore = (p.rating / 5) * 100;
        const successScore = p.successRate;
        const trustScore = p.trustScore;
        const availabilityScore = p.isOnline ? 100 : 30;
        const responseScore = Math.max(0, 100 - (parseInt(p.eta) || 4) * 10);
        
        // Weighted AI scoring (like Uber's algorithm)
        const matchScore = Math.round(
          distanceScore * 0.25 +
          ratingScore * 0.20 +
          successScore * 0.20 +
          trustScore * 0.15 +
          availabilityScore * 0.10 +
          responseScore * 0.10
        );

        // Dynamic pricing based on demand
        const basePrice = p.price || 50;
        const demandMultiplier = urgency === 'emergency' ? 1.5 : urgency === 'urgent' ? 1.25 : 1.0;
        const distanceFee = (parseFloat(p.distance || '2.3')) * 5;
        const platformFee = basePrice * 0.1;
        const estimatedPrice = Math.round((basePrice + distanceFee + platformFee) * demandMultiplier);

        // Smart ETA prediction
        const trafficFactor = urgency === 'emergency' ? 0.7 : 1.0;
        const estimatedEta = Math.round(((parseFloat(p.distance || '2.3')) / 0.5) * trafficFactor);

        const reasons = [
          `${matchScore}% match score`,
          `${parseFloat(p.distance || '2.3')}km away`,
          `${p.rating} star rating`,
          p.isOnline ? 'Currently online' : 'Recently active',
        ];

        return {
          provider: p,
          matchScore,
          reasons,
          estimatedPrice,
          estimatedEta,
          fareBreakdown: [
            { label: 'Base service', amount: basePrice },
            { label: 'Distance fee', amount: distanceFee },
            { label: 'Platform fee (10%)', amount: platformFee },
            { label: urgency === 'emergency' ? 'Emergency surcharge' : urgency === 'urgent' ? 'Urgent surcharge' : 'Standard rate', amount: Math.round((basePrice + distanceFee + platformFee) * (demandMultiplier - 1)) },
          ],
        };
      });

      setMatches(results.sort((a, b) => b.matchScore - a.matchScore));
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [serviceType, urgency]);

  if (loading) {
    return (
      <div className="card-dark p-6 flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
          <BrainCircuit size={24} className="text-white animate-pulse" />
        </div>
        <p className="text-white font-medium text-sm">AI Finding Best Matches...</p>
        <div className="w-full max-w-[200px] h-1 bg-white/[0.06] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />
        </div>
        <p className="text-white/20 text-xs">Analyzing 342 providers, traffic, ratings, and availability</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-violet-400" />
          <h3 className="text-white font-semibold text-sm">AI Smart Matches</h3>
        </div>
        <span className="text-white/20 text-xs">{matches.length} providers found</span>
      </div>

      <AnimatePresence>
        {matches.map((match, i) => {
          const p = match.provider;
          const isSelected = selectedId === p.id;
          const isBest = i === 0;

          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.15 }}
              className={`card-dark p-4 cursor-pointer transition-all ${
                isSelected ? 'border-violet-500/40 ring-1 ring-violet-500/20' : ''
              } ${isBest ? 'border-t-2 border-t-violet-500' : ''}`}
              onClick={() => setSelectedId(isSelected ? null : p.id)}
            >
              {isBest && (
                <div className="absolute -top-2 left-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  AI Best Match
                </div>
              )}

              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full gradient-orange flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-tireno-orange/20">
                    {p.avatar}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-tireno-green rounded-full border-2 border-tireno-dark flex items-center justify-center">
                    <Check size={12} className="text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium text-sm">{p.name}</span>
                    <span className="badge-green text-[10px]">Verified</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex items-center gap-1">
                      <Star size={12} className="text-tireno-yellow fill-tireno-yellow" />
                      <span className="text-white text-xs">{p.rating}</span>
                    </div>
                    <span className="text-white/20 text-xs">({p.reviewCount} reviews)</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 mb-1">
                    <Zap size={12} className="text-violet-400" />
                    <span className="text-violet-400 font-bold text-sm">{match.matchScore}%</span>
                  </div>
                  <p className="text-white font-bold text-lg">GH₵{match.estimatedPrice}</p>
                </div>
              </div>

              {/* AI Match Reasons */}
              <div className="flex gap-2 flex-wrap mb-3">
                {match.reasons.map((reason, ri) => (
                  <span key={ri} className="bg-white/[0.03] text-white/40 text-[10px] px-2 py-1 rounded-full border border-white/[0.06]">
                    {reason}
                  </span>
                ))}
              </div>

              {/* Trust Score Bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white/20 text-xs">Trust Score</span>
                  <span className="text-tireno-green text-xs font-medium">{p.trustScore}/100</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{ width: `${p.trustScore}%` }} />
                </div>
              </div>

              {/* ETA & Stats */}
              <div className="flex items-center gap-2 mb-3">
                <span className="badge-orange flex items-center gap-1">
                  <Clock size={12} />
                  {match.estimatedEta} min
                </span>
                <span className="badge-green flex items-center gap-1">
                  <TrendingUp size={12} />
                  {p.successRate}% success
                </span>
                <span className="badge-blue flex items-center gap-1">
                  <MapPin size={12} />
                  {p.jobsToday} today
                </span>
              </div>

              {/* Fare Breakdown (expandable) */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-white/[0.02] rounded-xl p-3 mb-3 border border-white/[0.04]">
                      <p className="text-white/30 text-xs font-medium mb-2 uppercase tracking-wider">AI Fare Breakdown</p>
                      {match.fareBreakdown.map((item, fi) => (
                        <div key={fi} className="flex items-center justify-between py-1">
                          <span className="text-white/40 text-xs">{item.label}</span>
                          <span className="text-white text-xs">{item.amount >= 0 ? '+' : ''}GH₵{item.amount}</span>
                        </div>
                      ))}
                      <div className="border-t border-white/[0.04] pt-2 mt-1 flex items-center justify-between">
                        <span className="text-white text-xs font-medium">Total</span>
                        <span className="text-tireno-orange font-bold text-sm">GH₵{match.estimatedPrice}</span>
                      </div>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => { e.stopPropagation(); onAccept?.(p.id); }}
                      className="w-full btn-orange py-3 text-sm font-bold"
                    >
                      Accept Match
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>

              {!isSelected && (
                <div className="flex items-center justify-center text-white/20 text-xs gap-1">
                  <span>Tap to see AI fare breakdown</span>
                  <ChevronRight size={12} />
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
