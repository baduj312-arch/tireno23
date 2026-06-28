import { useNavigate } from 'react-router-dom';
import { Wrench, Car, Fuel, Battery, Star, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import Header from '../components/Header';

const jobs = [
  {
    id: 'TRN-3847',
    type: 'mechanic',
    icon: Wrench,
    label: 'Mechanic',
    provider: 'Kwame Osei',
    avatar: 'KO',
    price: 85,
    status: 'completed',
    rating: 4.8,
    date: 'Jun 28, 2026',
    address: 'Shell Station, Independence Ave',
  },
  {
    id: 'TRN-3842',
    type: 'tow',
    icon: Car,
    label: 'Tow Truck',
    provider: 'Ama Mensah',
    avatar: 'AM',
    price: 150,
    status: 'completed',
    rating: 4.5,
    date: 'Jun 24, 2026',
    address: 'Tema Motorway',
  },
  {
    id: 'TRN-3839',
    type: 'fuel',
    icon: Fuel,
    label: 'Fuel Delivery',
    provider: 'Yaw Addo',
    avatar: 'YA',
    price: 45,
    status: 'completed',
    rating: 5.0,
    date: 'Jun 20, 2026',
    address: 'East Legon',
  },
  {
    id: 'TRN-3835',
    type: 'battery',
    icon: Battery,
    label: 'Battery Jump',
    provider: 'Kwame Osei',
    avatar: 'KO',
    price: 60,
    status: 'disputed',
    rating: null,
    date: 'Jun 15, 2026',
    address: 'Accra Mall',
  },
];

export default function History() {
  const navigate = useNavigate();

  return (
    <Layout>
      <Header title="Job History" />
      <div className="p-4 pb-6">
        <div className="space-y-3">
          {jobs.map((job, i) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card-dark p-4 cursor-pointer"
              onClick={() => {
                if (job.status === 'disputed') navigate('/dispute');
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-tireno-surfaceLight flex items-center justify-center">
                    <job.icon size={16} className="text-tireno-orange" />
                  </div>
                  <span className="text-white font-medium text-sm">{job.label}</span>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  job.status === 'completed' ? 'bg-tireno-green/20 text-tireno-green' :
                  job.status === 'disputed' ? 'bg-tireno-red/20 text-tireno-red' :
                  'bg-tireno-yellow/20 text-tireno-yellow'
                }`}>
                  {job.status === 'completed' ? 'Completed' : job.status === 'disputed' ? 'Disputed' : 'Pending'}
                </span>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-tireno-surfaceLight flex items-center justify-center text-white font-bold text-xs">
                  {job.avatar}
                </div>
                <div>
                  <p className="text-white text-sm">{job.provider}</p>
                  <p className="text-tireno-gray text-xs">{job.id} | {job.date}</p>
                </div>
                <div className="ml-auto">
                  <p className="text-white font-bold">GH₵{job.price}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-tireno-gray text-xs">
                  <MapPin size={12} />
                  <span>{job.address}</span>
                </div>
                {job.rating && (
                  <div className="flex items-center gap-1">
                    <Star size={12} className="text-tireno-yellow fill-tireno-yellow" />
                    <span className="text-white text-xs">{job.rating}</span>
                  </div>
                )}
                {job.status === 'disputed' && (
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate('/dispute'); }}
                    className="text-tireno-red text-xs font-medium"
                  >
                    View Dispute
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
