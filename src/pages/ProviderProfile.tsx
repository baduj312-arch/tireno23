import { useParams } from 'react-router-dom';
import { Star, Phone, MessageSquare, MapPin, Shield, Check, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import Header from '../components/Header';
import { mockProviders } from '../data/mock';

export default function ProviderProfile() {
  const { id } = useParams();
  const provider = mockProviders.find(p => p.id === id) || mockProviders[0];

  const reviews = [
    { name: 'Kofi B.', rating: 5, text: 'Very professional and fast. Fixed my car in under 30 minutes!', date: 'Jun 25, 2026' },
    { name: 'Abena D.', rating: 4, text: 'Good service, slightly expensive but worth it for the quality.', date: 'Jun 20, 2026' },
    { name: 'Yaw K.', rating: 5, text: 'Arrived earlier than expected. Highly recommend!', date: 'Jun 15, 2026' },
  ];

  return (
    <Layout>
      <Header title="Provider Profile" />
      <div className="p-4 pb-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-dark p-5 mb-4"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full gradient-orange flex items-center justify-center text-white font-bold text-2xl">
                {provider.avatar}
              </div>
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-tireno-green rounded-full border-2 border-tireno-surface flex items-center justify-center">
                <Check size={14} className="text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-white font-bold text-xl">{provider.name}</h2>
              <p className="text-tireno-orange text-sm font-medium">{provider.category}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-tireno-yellow fill-tireno-yellow" />
                  <span className="text-white text-sm font-medium">{provider.rating}</span>
                </div>
                <span className="text-tireno-gray text-xs">({provider.reviewCount} reviews)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-3 bg-tireno-surfaceLight rounded-xl">
              <p className="text-white font-bold text-lg">{provider.successRate}%</p>
              <p className="text-tireno-gray text-xs">Success</p>
            </div>
            <div className="text-center p-3 bg-tireno-surfaceLight rounded-xl">
              <p className="text-white font-bold text-lg">{provider.jobsToday}</p>
              <p className="text-tireno-gray text-xs">Today</p>
            </div>
            <div className="text-center p-3 bg-tireno-surfaceLight rounded-xl">
              <p className="text-white font-bold text-lg">{provider.trustScore}</p>
              <p className="text-tireno-gray text-xs">Trust</p>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-tireno-gray text-sm">
              <MapPin size={16} className="text-tireno-orange" />
              <span>{provider.distance} away</span>
            </div>
            <div className="flex items-center gap-2 text-tireno-gray text-sm">
              <Clock size={16} className="text-tireno-orange" />
              <span>ETA {provider.eta}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="flex-1 btn-orange py-3 flex items-center justify-center gap-2">
              <Phone size={16} />
              Call
            </button>
            <button className="flex-1 btn-ghost py-3 flex items-center justify-center gap-2">
              <MessageSquare size={16} />
              Chat
            </button>
          </div>
        </motion.div>

        {/* Trust Score */}
        <div className="card-dark p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Shield size={18} className="text-tireno-green" />
            <h3 className="text-white font-semibold text-sm">Trust Score</h3>
            <span className="text-tireno-green font-bold ml-auto">{provider.trustScore}/100</span>
          </div>
          <div className="progress-bar mb-2">
            <div className="progress-bar-fill" style={{ width: `${provider.trustScore}%` }} />
          </div>
          <div className="flex justify-between text-tireno-gray text-xs">
            <span>Rating ×0.5</span>
            <span>Success ×0.3</span>
            <span>Response ×0.2</span>
          </div>
        </div>

        {/* Reviews */}
        <h3 className="text-white font-semibold text-sm mb-3">Recent Reviews</h3>
        <div className="space-y-3">
          {reviews.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card-dark p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-tireno-surfaceLight flex items-center justify-center text-white font-bold text-xs">
                    {r.name.charAt(0)}
                  </div>
                  <span className="text-white text-sm font-medium">{r.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={12} className="text-tireno-yellow fill-tireno-yellow" />
                  <span className="text-white text-xs">{r.rating}</span>
                </div>
              </div>
              <p className="text-tireno-gray text-sm mb-1">{r.text}</p>
              <p className="text-tireno-gray text-xs">{r.date}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
