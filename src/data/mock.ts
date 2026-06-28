import { Provider, Bid, Message, Job, WalletTransaction, DisputeCase, AdminStats, ProviderRegistration } from '../types';

export const mockProviders: Provider[] = [
  {
    id: '1',
    name: 'Kwame Osei',
    avatar: 'KO',
    rating: 4.8,
    reviewCount: 127,
    trustScore: 94,
    eta: '4 min',
    successRate: 98,
    jobsToday: 12,
    price: 85,
    isVerified: true,
    isOnline: true,
    category: 'Mechanic',
    distance: '2.3 km',
    phone: '+233 54 123 4567',
  },
  {
    id: '2',
    name: 'Ama Mensah',
    avatar: 'AM',
    rating: 4.6,
    reviewCount: 89,
    trustScore: 88,
    eta: '6 min',
    successRate: 95,
    jobsToday: 8,
    price: 92,
    isVerified: true,
    isOnline: true,
    category: 'Mechanic',
    distance: '3.1 km',
    phone: '+233 54 234 5678',
  },
  {
    id: '3',
    name: 'Yaw Addo',
    avatar: 'YA',
    rating: 4.9,
    reviewCount: 203,
    trustScore: 97,
    eta: '5 min',
    successRate: 99,
    jobsToday: 15,
    price: 110,
    isVerified: true,
    isOnline: true,
    category: 'Mechanic',
    distance: '4.0 km',
    phone: '+233 54 345 6789',
  },
];

export const mockBids: Bid[] = [
  {
    id: 'bid-1',
    provider: mockProviders[0],
    price: 85,
    eta: '4 min',
    isBestValue: true,
  },
  {
    id: 'bid-2',
    provider: mockProviders[1],
    price: 92,
    eta: '6 min',
    isBestValue: false,
  },
  {
    id: 'bid-3',
    provider: mockProviders[2],
    price: 110,
    eta: '5 min',
    isBestValue: false,
  },
];

export const mockMessages: Message[] = [
  { id: '1', sender: 'provider', text: 'Hello! I\'m on my way to your location. ETA is about 4 minutes.', timestamp: '10:32 AM', isRead: true },
  { id: '2', sender: 'driver', text: 'Great, thanks! I\'m near the Shell station on Independence Ave.', timestamp: '10:33 AM', isRead: true },
  { id: '3', sender: 'provider', text: 'I can see you. Turning onto your street now. I\'m in a blue Toyota pickup.', timestamp: '10:35 AM', isRead: true },
  { id: '4', sender: 'driver', text: 'Perfect, I see you! I\'m the silver Honda with hazard lights on.', timestamp: '10:36 AM', isRead: true },
  { id: '5', sender: 'provider', text: 'Got it! Let me take a quick look at the issue.', timestamp: '10:37 AM', isRead: true },
];

export const mockCurrentJob: Job = {
  id: 'TRN-3847',
  serviceType: 'Mechanic',
  status: 'en_route',
  provider: mockProviders[0],
  price: 85,
  eta: '4 min',
  address: 'Shell Station, Independence Ave, Accra',
  paymentMethod: 'MTN MoMo ···· 2847',
  createdAt: '2026-06-28T10:30:00',
};

export const mockWalletTransactions: WalletTransaction[] = [
  { id: '1', type: 'credit', amount: 500, description: 'Top Up - MTN MoMo', date: 'Jun 25, 2026', icon: 'topup' },
  { id: '2', type: 'debit', amount: 85, description: 'Payment - Kwame Osei', date: 'Jun 24, 2026', icon: 'payment' },
  { id: '3', type: 'credit', amount: 200, description: 'Refund - Dispute #DIS-2847', date: 'Jun 22, 2026', icon: 'refund' },
  { id: '4', type: 'debit', amount: 120, description: 'Payment - Ama Mensah', date: 'Jun 20, 2026', icon: 'payment' },
  { id: '5', type: 'credit', amount: 1000, description: 'Wallet Transfer - Yaw Addo', date: 'Jun 18, 2026', icon: 'transfer' },
  { id: '6', type: 'debit', amount: 45, description: 'Payment - Yaw Addo', date: 'Jun 15, 2026', icon: 'payment' },
];

export const mockDispute: DisputeCase = {
  id: 'DIS-2847',
  jobId: 'TRN-3847',
  category: 'Overcharged',
  description: 'The provider charged me more than the quoted price without explanation.',
  status: 'review',
  createdAt: '2026-06-28',
  evidence: ['receipt.jpg', 'chat_log.txt'],
};

export const mockAdminStats: AdminStats = {
  activeJobs: 47,
  onlineProviders: 132,
  todayRevenue: 12580,
  commission: 10,
  responseTime: 3.2,
  completionRate: 94,
  satisfaction: 4.7,
};

export const mockProviderReg: ProviderRegistration = {
  businessName: 'Osei Auto Repair',
  category: 'Mechanic',
  yearsInBusiness: 8,
  serviceRadius: 15,
  workshopAddress: '45 Spintex Road, Accra',
  basePrice: 50,
  openTime: '08:00',
  closeTime: '18:00',
  workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  surgePricing: ['Late night'],
  documents: {
    nationalId: true,
    workshopPhoto: true,
    businessLicense: false,
  },
};
