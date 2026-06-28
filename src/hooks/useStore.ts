import { useState, useCallback } from 'react';

export interface AppStore {
  currentJob: any;
  setCurrentJob: (job: any) => void;
  walletBalance: number;
  setWalletBalance: (b: number) => void;
  userType: 'driver' | 'provider' | null;
  setUserType: (t: 'driver' | 'provider' | null) => void;
  currentUser: any;
  setCurrentUser: (u: any) => void;
  unreadMessages: number;
  setUnreadMessages: (n: number) => void;
}

let storeState = {
  currentJob: null,
  walletBalance: 240,
  userType: null as 'driver' | 'provider' | null,
  currentUser: null,
  unreadMessages: 0,
};

const listeners = new Set<() => void>();

export function getStore() {
  return { ...storeState };
}

export function setStore(key: keyof typeof storeState, value: any) {
  storeState = { ...storeState, [key]: value };
  listeners.forEach(l => l());
}

export function useStore(): AppStore {
  const [, forceUpdate] = useState(0);

  const subscribe = useCallback(() => {
    const listener = () => forceUpdate(n => n + 1);
    listeners.add(listener);
    return () => listeners.delete(listener);
  }, []);

  subscribe();

  return {
    currentJob: storeState.currentJob,
    setCurrentJob: (job) => setStore('currentJob', job),
    walletBalance: storeState.walletBalance,
    setWalletBalance: (b) => setStore('walletBalance', b),
    userType: storeState.userType,
    setUserType: (t) => setStore('userType', t),
    currentUser: storeState.currentUser,
    setCurrentUser: (u) => setStore('currentUser', u),
    unreadMessages: storeState.unreadMessages,
    setUnreadMessages: (n) => setStore('unreadMessages', n),
  };
}
