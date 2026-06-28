import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { setStore } from '../hooks/useStore';

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [userType, setUserType] = useState<'driver' | 'provider'>('driver');
  const [error, setError] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !phone || !password) {
      setError('Please fill in all fields');
      return;
    }
    setStore('currentUser', { id: '1', name, email, phone, type: userType });
    setStore('userType', userType);
    if (userType === 'provider') {
      navigate('/provider-register');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-tireno-dark flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl gradient-orange mx-auto mb-4 flex items-center justify-center">
            <span className="text-white font-bold text-2xl">T</span>
          </div>
          <h1 className="text-white font-bold text-2xl">Create Account</h1>
          <p className="text-tireno-gray text-sm mt-1">Join Tireno today</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          {error && (
            <div className="bg-tireno-red/10 border border-tireno-red/30 rounded-xl p-3 text-tireno-red text-sm text-center">
              {error}
            </div>
          )}

          <div className="flex gap-2 mb-2">
            <button
              type="button"
              onClick={() => setUserType('driver')}
              className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                userType === 'driver'
                  ? 'bg-tireno-orange text-white'
                  : 'bg-tireno-surface text-tireno-gray border border-tireno-surfaceLight'
              }`}
            >
              Driver
            </button>
            <button
              type="button"
              onClick={() => setUserType('provider')}
              className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                userType === 'provider'
                  ? 'bg-tireno-orange text-white'
                  : 'bg-tireno-surface text-tireno-gray border border-tireno-surfaceLight'
              }`}
            >
              Provider
            </button>
          </div>

          <div>
            <label className="text-tireno-grayLight text-sm font-medium mb-1 block">Full Name</label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-tireno-gray" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Kwabena Owusu"
                className="input-dark w-full pl-10"
              />
            </div>
          </div>
          <div>
            <label className="text-tireno-grayLight text-sm font-medium mb-1 block">Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-tireno-gray" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="input-dark w-full pl-10"
              />
            </div>
          </div>
          <div>
            <label className="text-tireno-grayLight text-sm font-medium mb-1 block">Phone</label>
            <div className="relative">
              <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-tireno-gray" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+233 54 XXX XXXX"
                className="input-dark w-full pl-10"
              />
            </div>
          </div>
          <div>
            <label className="text-tireno-grayLight text-sm font-medium mb-1 block">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-tireno-gray" />
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-dark w-full pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-tireno-gray"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button type="submit" className="w-full btn-orange py-4 text-base font-bold">
            Sign Up
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-tireno-gray text-sm">
            Already have an account?{' '}
            <button onClick={() => navigate('/login')} className="text-tireno-orange font-medium">
              Sign In
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
