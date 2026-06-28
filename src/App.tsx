import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import SOS from './pages/SOS';
import Bidding from './pages/Bidding';
import Tracking from './pages/Tracking';
import Chat from './pages/Chat';
import Payment from './pages/Payment';
import Rating from './pages/Rating';
import Wallet from './pages/Wallet';
import Dispute from './pages/Dispute';
import Admin from './pages/Admin';
import ProviderRegister from './pages/ProviderRegister';
import ProviderDashboard from './pages/ProviderDashboard';
import Profile from './pages/Profile';
import History from './pages/History';
import Login from './pages/Login';
import Register from './pages/Register';
import ProviderProfile from './pages/ProviderProfile';
import ChatList from './pages/ChatList';

function App() {
  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sos" element={<SOS />} />
          <Route path="/bidding" element={<Bidding />} />
          <Route path="/tracking" element={<Tracking />} />
          <Route path="/chat/:id" element={<Chat />} />
          <Route path="/chat" element={<ChatList />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/rating" element={<Rating />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/dispute" element={<Dispute />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/provider-register" element={<ProviderRegister />} />
          <Route path="/provider-dashboard" element={<ProviderDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/history" element={<History />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/provider-profile/:id" element={<ProviderProfile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  );
}

export default App;
