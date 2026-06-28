export interface Provider {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  trustScore: number;
  eta: string;
  successRate: number;
  jobsToday: number;
  price: number;
  isVerified: boolean;
  isOnline: boolean;
  category: string;
  distance: string;
  phone: string;
}

export interface Bid {
  id: string;
  provider: Provider;
  price: number;
  eta: string;
  isBestValue: boolean;
}

export interface Message {
  id: string;
  sender: 'driver' | 'provider';
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface Job {
  id: string;
  serviceType: string;
  status: 'pending' | 'assigned' | 'en_route' | 'in_progress' | 'completed' | 'cancelled';
  provider: Provider;
  price: number;
  eta: string;
  address: string;
  paymentMethod: string;
  createdAt: string;
  completedAt?: string;
}

export interface WalletTransaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
  icon: string;
}

export interface DisputeCase {
  id: string;
  jobId: string;
  category: string;
  description: string;
  status: 'pending' | 'review' | 'resolved';
  createdAt: string;
  evidence: string[];
}

export interface AdminStats {
  activeJobs: number;
  onlineProviders: number;
  todayRevenue: number;
  commission: number;
  responseTime: number;
  completionRate: number;
  satisfaction: number;
}

export interface ProviderRegistration {
  businessName: string;
  category: string;
  yearsInBusiness: number;
  serviceRadius: number;
  workshopAddress: string;
  basePrice: number;
  openTime: string;
  closeTime: string;
  workingDays: string[];
  surgePricing: string[];
  documents: {
    nationalId: boolean;
    workshopPhoto: boolean;
    businessLicense: boolean;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  type: 'driver' | 'provider' | 'admin';
  walletBalance: number;
  safetyContacts: SafetyContact[];
}

export interface SafetyContact {
  id: string;
  name: string;
  phone: string;
  relation: string;
}
