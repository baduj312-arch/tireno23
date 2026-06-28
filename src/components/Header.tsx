import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  right?: React.ReactNode;
  onBack?: () => void;
  subtitle?: string;
}

export default function Header({ title, showBack = true, right, onBack, subtitle }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-tireno-dark/80 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="max-w-lg mx-auto flex items-center h-14 px-4">
        {showBack && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onBack ? onBack() : navigate(-1)}
            className="w-9 h-9 -ml-1 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center hover:bg-white/[0.06] transition-colors"
          >
            <ArrowLeft size={18} className="text-white/70" />
          </motion.button>
        )}
        <div className="flex-1 text-center pr-8">
          <h1 className="text-white font-semibold text-base">{title}</h1>
          {subtitle && <p className="text-white/30 text-[10px] mt-0.5">{subtitle}</p>}
        </div>
        {right && <div className="absolute right-4">{right}</div>}
      </div>
    </header>
  );
}
