import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { setStore } from '../hooks/useStore';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setStore('currentUser', { id: '1', name: 'Kwabena', email, type: 'driver' });
    setStore('userType', 'driver');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-tireno-dark flex items-center justify-center p-4 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-tireno-orange/5 rounded-full blur-[120px] pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm relative"
      >
        <div className="text-center mb-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-tireno-orange to-tireno-orangeDark mx-auto mb-4 flex items-center justify-center shadow-lg shadow-tireno-orange/20"
          >
            <span className="text-white font-bold text-2xl">T</span>
          </motion.div>
          <h1 className="text-white font-bold text-2xl">Tireno</h1>
          <p className="text-white/30 text-sm mt-1">Roadside Assistance</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="bg-tireno-red/5 border border-tireno-red/20 rounded-xl p-3 text-tireno-red text-sm text-center">
              {error}
            </div>
          )}
          <div>
            <label className="text-white/30 text-xs font-medium tracking-wider uppercase mb-2 block">Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
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
            <label className="text-white/30 text-xs font-medium tracking-wider uppercase mb-2 block">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button type="submit" className="w-full btn-orange py-4 text-base font-bold">
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-white/30 text-sm">
            No account?{' '}
            <button onClick={() => navigate('/register')} className="text-tireno-orange font-medium">
              Sign Up
            </button>
          </p>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            onClick={() => { setStore('userType', 'driver'); navigate('/'); }}
            className="flex-1 btn-ghost py-3 text-sm"
          >
            Guest Driver
          </button>
          <button
            onClick={() => { setStore('userType', 'provider'); navigate('/provider-dashboard'); }}
            className="flex-1 btn-ghost py-3 text-sm"
          >
            Guest Provider
          </button>
        </div>
      </motion.div>
    </div>
  );
}
