import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import Layout from '../components/Layout';
import Header from '../components/Header';
import { mockProviders } from '../data/mock';

export default function Rating() {
  const navigate = useNavigate();
  const provider = mockProviders[0];
  const [overallRating, setOverallRating] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [priceFairness, setPriceFairness] = useState(0);
  const [professionalism, setProfessionalism] = useState(0);
  const [review, setReview] = useState('');

  const categories = [
    { label: 'Speed', value: speed, set: setSpeed },
    { label: 'Price Fairness', value: priceFairness, set: setPriceFairness },
    { label: 'Professionalism', value: professionalism, set: setProfessionalism },
  ];

  const StarRating = ({ value, setValue, size = 'lg' }: { value: number; setValue: (v: number) => void; size?: 'lg' | 'sm' }) => {
    const s = size === 'lg' ? 36 : 20;
    return (
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            whileTap={{ scale: 0.8 }}
            onClick={() => setValue(star)}
            className="focus:outline-none"
          >
            <Star
              size={s}
              className={`transition-all ${
                star <= value
                  ? 'text-tireno-yellow fill-tireno-yellow'
                  : 'text-white/[0.08]'
              }`}
            />
          </motion.button>
        ))}
      </div>
    );
  };

  return (
    <Layout>
      <Header title="Rate Job" />
      <div className="p-4 pb-6 flex flex-col items-center">
        {/* Celebration */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="text-6xl mb-4"
        >
          🎉
        </motion.div>
        <h2 className="text-white font-bold text-xl mb-1">Job Complete!</h2>
        <p className="text-white/30 text-sm mb-6">Payment confirmed</p>

        {/* Provider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-14 h-14 rounded-xl gradient-orange flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-tireno-orange/20">
            {provider.avatar}
          </div>
          <div>
            <p className="text-white font-medium">{provider.name}</p>
            <p className="text-white/30 text-xs">{provider.category}</p>
          </div>
        </div>

        {/* Overall Rating */}
        <div className="mb-8">
          <p className="text-white/30 text-sm text-center mb-3">How was your experience?</p>
          <StarRating value={overallRating} setValue={setOverallRating} size="lg" />
        </div>

        {/* Category Ratings */}
        <div className="w-full max-w-sm space-y-4 mb-6">
          {categories.map((cat) => (
            <div key={cat.label} className="flex items-center justify-between">
              <span className="text-white text-sm">{cat.label}</span>
              <StarRating value={cat.value} setValue={cat.set} size="sm" />
            </div>
          ))}
        </div>

        {/* Review Text */}
        <div className="w-full max-w-sm mb-6">
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Write a review..."
            className="input-dark w-full h-24 resize-none"
          />
        </div>

        {/* Submit */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="w-full max-w-sm btn-orange py-4 text-base font-bold mb-3"
        >
          Submit Review
        </motion.button>
        <button
          onClick={() => navigate('/')}
          className="text-white/30 text-sm font-medium hover:text-white transition-colors"
        >
          Skip for now
        </button>
      </div>
    </Layout>
  );
}
