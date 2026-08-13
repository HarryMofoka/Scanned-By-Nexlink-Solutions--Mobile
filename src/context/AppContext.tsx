import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, UserStats, SocialLink } from '../types';

const INITIAL_PROFILE: UserProfile = {
  id: 'a7f3k9',
  name: 'Thabo Nkosi',
  email: 'thabo@email.com',
  phone: '+27 82 123 4567',
  avatarInitials: 'TN',
  qrCodeUrl: 'tapshare.app/p/a7f3k9',
  createdAt: new Date().toISOString(),
  links: [
    {
      id: 'l1',
      type: 'linkedin',
      title: 'LinkedIn',
      url: 'linkedin.com/in/thabo',
      iconName: 'linkedin',
      brandColor: '#0077B5',
    },
    {
      id: 'l2',
      type: 'instagram',
      title: 'Instagram',
      url: 'instagram.com/@thabo.nkosi',
      iconName: 'instagram',
      brandColor: '#E4405F',
    },
  ],
};

const INITIAL_STATS: UserStats = {
  totalViews: 1240,
  thisWeekViews: 47,
  vsLastMonthPercent: 18,
  scanSuccessRatePercent: 98,
  highestDayCount: 62,
  highestDayName: 'Wednesday',
  dailyData: [
    { day: 'M', fullDay: 'Monday', views: 18 },
    { day: 'T', fullDay: 'Tuesday', views: 34 },
    { day: 'W', fullDay: 'Wednesday', views: 62, isPeak: true },
    { day: 'T', fullDay: 'Thursday', views: 47 },
    { day: 'F', fullDay: 'Friday', views: 29 },
    { day: 'S', fullDay: 'Saturday', views: 41 },
    { day: 'S', fullDay: 'Sunday', views: 15 },
  ],
};

interface AppContextType {
  isLoggedIn: boolean;
  user: UserProfile;
  stats: UserStats;
  nfcWriteState: 'idle' | 'writing' | 'success' | 'error';
  login: (email?: string) => Promise<void>;
  signup: (email?: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updated: Partial<UserProfile>) => Promise<void>;
  addLink: (link: Omit<SocialLink, 'id'>) => Promise<void>;
  removeLink: (linkId: string) => Promise<void>;
  deleteCard: () => Promise<void>;
  incrementProfileViews: (profileId: string) => void;
  setNfcState: (state: 'idle' | 'writing' | 'success' | 'error') => void;
  hasCompletedSetup: boolean;
  setHasCompletedSetup: (val: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [hasCompletedSetup, setHasCompletedSetup] = useState<boolean>(true);
  const [user, setUser] = useState<UserProfile>(INITIAL_PROFILE);
  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);
  const [nfcWriteState, setNfcWriteState] = useState<'idle' | 'writing' | 'success' | 'error'>('idle');

  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('@tapshare_user');
      const storedAuth = await AsyncStorage.getItem('@tapshare_auth');
      const storedStats = await AsyncStorage.getItem('@tapshare_stats');
      
      if (storedUser) setUser(JSON.parse(storedUser));
      if (storedAuth !== null) setIsLoggedIn(JSON.parse(storedAuth));
      if (storedStats) setStats(JSON.parse(storedStats));
    } catch (e) {
      console.warn('Failed to load storage', e);
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

  const login = async (email?: string) => {
    setIsLoggedIn(true);
    await AsyncStorage.setItem('@tapshare_auth', JSON.stringify(true));
    if (email && email !== user.email) {
      const initials = email.substring(0, 2).toUpperCase();
      const updated = { ...user, email, avatarInitials: initials };
      await saveUser(updated);
    }
  };

  const signup = async (email?: string, name?: string) => {
    setIsLoggedIn(true);
    setHasCompletedSetup(false);
    await AsyncStorage.setItem('@tapshare_auth', JSON.stringify(true));
    const newInitials = name
      ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
      : 'TN';
    const updated = {
      ...user,
      name: name || 'New User',
      email: email || 'user@tapshare.app',
      avatarInitials: newInitials,
    };
    await saveUser(updated);
  };

  const logout = async () => {
    setIsLoggedIn(false);
    await AsyncStorage.setItem('@tapshare_auth', JSON.stringify(false));
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
    const resetUser: UserProfile = {
      ...user,
      name: '',
      phone: '',
      links: [],
    };
    await saveUser(resetUser);
    setHasCompletedSetup(false);
  };

  const incrementProfileViews = (profileId: string) => {
    setStats(prev => {
      const newTotal = prev.totalViews + 1;
      const newThisWeek = prev.thisWeekViews + 1;
      const updatedDaily = prev.dailyData.map(d => 
        d.day === 'W' ? { ...d, views: d.views + 1 } : d
      );
      const updated = {
        ...prev,
        totalViews: newTotal,
        thisWeekViews: newThisWeek,
        dailyData: updatedDaily,
      };
      AsyncStorage.setItem('@tapshare_stats', JSON.stringify(updated)).catch(() => {});
      return updated;
    });
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
        nfcWriteState,
        login,
        signup,
        logout,
        updateProfile,
        addLink,
        removeLink,
        deleteCard,
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
