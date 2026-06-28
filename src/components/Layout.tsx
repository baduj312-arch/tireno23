import BottomNav from './BottomNav';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  hideNav?: boolean;
  hideNavPaths?: string[];
}

const noNavPaths = ['/chat', '/login', '/register', '/admin', '/provider-register', '/provider-dashboard', '/bidding', '/payment', '/rating', '/dispute'];

export default function Layout({ children, hideNav, hideNavPaths }: LayoutProps) {
  const location = useLocation();
  const shouldHideNav = hideNav || hideNavPaths?.includes(location.pathname) || noNavPaths.includes(location.pathname);

  return (
    <div className="min-h-screen bg-tireno-dark">
      <div className="max-w-lg mx-auto min-h-screen bg-tireno-dark relative">
        {children}
        {!shouldHideNav && <BottomNav />}
        {!shouldHideNav && <div className="h-16" />}
      </div>
    </div>
  );
}
