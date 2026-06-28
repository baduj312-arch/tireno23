import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Siren, ClipboardList, MessageSquare, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const current = location.pathname;

  const isActive = (path: string) => {
    if (path === '/') return current === '/';
    return current.startsWith(path);
  };

  const items = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Siren, label: 'SOS', path: '/sos' },
    { icon: ClipboardList, label: 'Jobs', path: '/history' },
    { icon: MessageSquare, label: 'Chat', path: '/chat' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-tireno-dark/80 backdrop-blur-xl border-t border-white/[0.06]">
      <div className="max-w-lg mx-auto flex items-center justify-around py-2 px-4">
        {items.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="relative flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all"
            >
              {active && (
                <motion.div
                  layoutId="bottomNavPill"
                  className="absolute inset-0 bg-white/[0.06] rounded-xl"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <div className="relative">
                <item.icon
                  size={22}
                  strokeWidth={active ? 2.5 : 1.5}
                  className={active ? 'text-tireno-orange' : 'text-white/30'}
                />
                {active && item.path === '/chat' && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-tireno-red" />
                )}
              </div>
              <span
                className={`text-[10px] font-medium ${
                  active ? 'text-tireno-orange' : 'text-white/30'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
