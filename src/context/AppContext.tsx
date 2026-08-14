import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, UserStats, SocialLink } from '../types';
import { PROFILE_CONFIG } from '../config/profile';

const INITIAL_PROFILE: UserProfile = {
  id: 'tapshare-thabo',
  name: PROFILE_CONFIG.name,
  email: PROFILE_CONFIG.email,
  phone: PROFILE_CONFIG.phone,
  avatarInitials: PROFILE_CONFIG.avatarInitials,
  qrCodeUrl: PROFILE_CONFIG.cardUrl,
  createdAt: new Date().toISOString(),
  links: PROFILE_CONFIG.links.map((link, idx) => ({
    id: `l_${idx + 1}`,
    type: link.label.toLowerCase().includes('linkedin')
      ? 'linkedin'
      : link.label.toLowerCase().includes('instagram')
      ? 'instagram'
      : link.label.toLowerCase().includes('github')
      ? 'github'
      : 'website',
    title: link.label,
    url: link.url,
    iconName: link.label.toLowerCase(),
  })),
};

const INITIAL_STATS: UserStats = {
  totalViews: 0,
  thisWeekViews: 0,
  vsLastMonthPercent: 0,
  scanSuccessRatePercent: 100,
  highestDayCount: 0,
  highestDayName: 'Total',
  dailyData: [],
};

interface AppContextType {
  isLoggedIn: boolean;
  user: UserProfile;
  stats: UserStats;
  liveScanCount: number;
  isLoadingScans: boolean;
  nfcWriteState: 'idle' | 'writing' | 'success' | 'error';
  login: (email?: string) => Promise<void>;
  signup: (email?: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updated: Partial<UserProfile>) => Promise<void>;
  addLink: (link: Omit<SocialLink, 'id'>) => Promise<void>;
  removeLink: (linkId: string) => Promise<void>;
  deleteCard: () => Promise<void>;
  fetchLiveScanCount: () => Promise<void>;
  incrementProfileViews: (profileId: string) => void;
  setNfcState: (state: 'idle' | 'writing' | 'success' | 'error') => void;
  hasCompletedSetup: boolean;
  setHasCompletedSetup: (val: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn] = useState<boolean>(true);
  const [hasCompletedSetup, setHasCompletedSetup] = useState<boolean>(true);
  const [user, setUser] = useState<UserProfile>(INITIAL_PROFILE);
  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);
  const [liveScanCount, setLiveScanCount] = useState<number>(0);
  const [isLoadingScans, setIsLoadingScans] = useState<boolean>(true);
  const [nfcWriteState, setNfcWriteState] = useState<'idle' | 'writing' | 'success' | 'error'>('idle');

  useEffect(() => {
    loadStoredData();
    fetchLiveScanCount();
  }, []);

  const loadStoredData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('@tapshare_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.warn('Failed to load stored user', e);
    }
  };

  const fetchLiveScanCount = async () => {
    setIsLoadingScans(true);
    try {
      // Task 3: Use CountAPI's read-only 'get' endpoint (does not increment) to pull current total
      const countApiKey = PROFILE_CONFIG.countApiKey || 'tapshare-thabo';
      const response = await fetch(`https://api.countapi.xyz/get/${countApiKey}/scans`);
      
      if (response.ok) {
        const data = await response.json();
        const count = typeof data?.value === 'number' ? data.value : 0;
        setLiveScanCount(count);
        setStats(prev => ({
          ...prev,
          totalViews: count,
          thisWeekViews: count,
        }));
      } else {
        // Fallback for key not created yet or 0 state
        setLiveScanCount(0);
      }
    } catch (e) {
      console.warn('CountAPI fetch failed, falling back gracefully to 0', e);
      setLiveScanCount(0);
    } finally {
      setIsLoadingScans(false);
    }
  };

  const saveUser = async (newUser: UserProfile) => {
    setUser(newUser);
    try {
      await AsyncStorage.setItem('@tapshare_user', JSON.stringify(newUser));
    } catch (e) {
      console.warn('Failed to save user', e);
    }
  };

  const login = async () => {
    // Single-user MVP: always logged in as owner profile
  };

  const signup = async () => {
    // Single-user MVP: always logged in as owner profile
  };

  const logout = async () => {
    // Reset to default single-user profile
    setUser(INITIAL_PROFILE);
    await AsyncStorage.removeItem('@tapshare_user');
  };

  const updateProfile = async (updated: Partial<UserProfile>) => {
    let newInitials = user.avatarInitials;
    if (updated.name) {
      newInitials = updated.name
        .trim()
        .split(' ')
        .filter(Boolean)
        .map(n => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase() || 'TN';
    }
    const nextUser = {
      ...user,
      ...updated,
      avatarInitials: newInitials,
    };
    await saveUser(nextUser);
  };

  const addLink = async (linkData: Omit<SocialLink, 'id'>) => {
    const newLink: SocialLink = {
      ...linkData,
      id: 'link_' + Date.now(),
    };
    const nextLinks = [...user.links, newLink];
    await saveUser({ ...user, links: nextLinks });
  };

  const removeLink = async (linkId: string) => {
    const nextLinks = user.links.filter(l => l.id !== linkId);
    await saveUser({ ...user, links: nextLinks });
  };

  const deleteCard = async () => {
    await saveUser(INITIAL_PROFILE);
  };

  const incrementProfileViews = () => {
    setLiveScanCount(prev => prev + 1);
    setStats(prev => ({
      ...prev,
      totalViews: prev.totalViews + 1,
      thisWeekViews: prev.thisWeekViews + 1,
    }));
  };

  const setNfcState = (state: 'idle' | 'writing' | 'success' | 'error') => {
    setNfcWriteState(state);
  };

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        user,
        stats,
        liveScanCount,
        isLoadingScans,
        nfcWriteState,
        login,
        signup,
        logout,
        updateProfile,
        addLink,
        removeLink,
        deleteCard,
        fetchLiveScanCount,
        incrementProfileViews,
        setNfcState,
        hasCompletedSetup,
        setHasCompletedSetup,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
