/**
 * AppContext.tsx — Global application state for TapShare.
 *
 * This is the single-user MVP state layer. It manages:
 *   - User profile (name, phone, email, links, avatar initials)
 *   - Live scan count fetched from CountAPI's read-only GET endpoint
 *   - NFC write state machine (idle → writing → success/error)
 *   - CRUD operations for profile fields and social links
 *
 * Data flow:
 *   1. On mount, loads any previously-saved profile from AsyncStorage.
 *   2. Fetches live scan count from CountAPI (read-only, does not increment).
 *   3. Profile edits are persisted to AsyncStorage immediately.
 *   4. QR codes and NFC tags read from `user` state via useApp() hook,
 *      so edits are reflected instantly in generated payloads.
 *
 * No database, ORM, or authentication is involved — this is intentional
 * for the single-user MVP. Multi-user support is deferred.
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, UserStats, SocialLink } from '../types';
import { PROFILE_CONFIG } from '../config/profile';

const EMPTY_PROFILE: UserProfile = {
  id: 'user_profile',
  name: '',
  email: '',
  phone: '',
  avatarInitials: '',
  qrCodeUrl: '',
  createdAt: new Date().toISOString(),
  links: [],
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
  isInitialized: boolean;
  hasCompletedSetup: boolean;
  setHasCompletedSetup: (val: boolean) => void;
  user: UserProfile;
  stats: UserStats;
  liveScanCount: number;
  isLoadingScans: boolean;
  nfcWriteState: 'idle' | 'writing' | 'success' | 'error';
  /** Optional deployed endpoint URL for tracked sharing (e.g. https://my-app.vercel.app/api/card). */
  trackingUrl: string;
  setTrackingUrl: (url: string) => Promise<void>;
  updateProfile: (updated: Partial<UserProfile>) => Promise<void>;
  addLink: (link: Omit<SocialLink, 'id'>) => Promise<void>;
  removeLink: (linkId: string) => Promise<void>;
  deleteCard: () => Promise<void>;
  fetchLiveScanCount: () => Promise<void>;
  setNfcState: (state: 'idle' | 'writing' | 'success' | 'error') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [hasCompletedSetup, setHasCompletedSetup] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile>(EMPTY_PROFILE);
  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);
  const [liveScanCount, setLiveScanCount] = useState<number>(0);
  const [isLoadingScans, setIsLoadingScans] = useState<boolean>(true);
  const [nfcWriteState, setNfcWriteState] = useState<'idle' | 'writing' | 'success' | 'error'>('idle');
  const [trackingUrl, setTrackingUrlState] = useState<string>('');

  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('@tapshare_user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed && parsed.name && parsed.name.trim().length > 0) {
          setUser(parsed);
          setHasCompletedSetup(true);
        } else {
          setHasCompletedSetup(false);
        }
      } else {
        setHasCompletedSetup(false);
      }

      // Load persisted tracking URL (may be empty string = tracking off)
      const storedTrackingUrl = await AsyncStorage.getItem('@tapshare_tracking_url');
      if (storedTrackingUrl) {
        setTrackingUrlState(storedTrackingUrl);
      }
    } catch (e) {
      console.warn('Failed to load stored data', e);
      setHasCompletedSetup(false);
    } finally {
      setIsInitialized(true);
      fetchLiveScanCount();
    }
  };

  /**
   * Fetches the live scan count from CountAPI.
   * Only makes a network call if a trackingUrl is configured;
   * otherwise sets count to 0 with no network request.
   */
  const fetchLiveScanCount = async () => {
    // Read the latest tracking URL from storage (state may not have hydrated yet on first call)
    let url = trackingUrl;
    if (!url) {
      try {
        const stored = await AsyncStorage.getItem('@tapshare_tracking_url');
        if (stored) url = stored;
      } catch (_) { /* ignore */ }
    }

    // No tracking URL configured → no network call, no scan count
    if (!url) {
      setLiveScanCount(0);
      setIsLoadingScans(false);
      return;
    }

    setIsLoadingScans(true);
    try {
      // Derive CountAPI namespace from tracking URL hostname or profile config
      let countApiKey = PROFILE_CONFIG.countApiKey || 'tapshare-thabo';
      try {
        const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
        const hostKey = parsed.hostname.replace(/\.vercel\.app$/, '').replace(/[^a-zA-Z0-9-_]/g, '-');
        if (hostKey && hostKey !== 'localhost') {
          countApiKey = hostKey;
        }
      } catch (_) {
        // Use default countApiKey if URL parsing fails
      }

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
        setLiveScanCount(0);
      }
    } catch (e) {
      console.warn('CountAPI fetch failed, falling back gracefully to 0', e);
      setLiveScanCount(0);
    } finally {
      setIsLoadingScans(false);
    }
  };

  /** Persist the user's deployed endpoint URL and re-fetch scan count. */
  const setTrackingUrl = async (url: string) => {
    const trimmed = url.trim();
    setTrackingUrlState(trimmed);
    try {
      if (trimmed) {
        await AsyncStorage.setItem('@tapshare_tracking_url', trimmed);
      } else {
        await AsyncStorage.removeItem('@tapshare_tracking_url');
      }
    } catch (e) {
      console.warn('Failed to save tracking URL', e);
    }
    // Re-fetch scan count with the new URL state
    // (use a small delay so React state has flushed)
    setTimeout(() => fetchLiveScanCount(), 100);
  };

  const saveUser = async (newUser: UserProfile) => {
    setUser(newUser);
    try {
      await AsyncStorage.setItem('@tapshare_user', JSON.stringify(newUser));
    } catch (e) {
      console.warn('Failed to save user', e);
    }
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

  /** Clears all on-device profile and tracking data, returning to first-run setup. */
  const deleteCard = async () => {
    setUser(EMPTY_PROFILE);
    setHasCompletedSetup(false);
    setLiveScanCount(0);
    setTrackingUrlState('');
    try {
      await AsyncStorage.removeItem('@tapshare_user');
      await AsyncStorage.removeItem('@tapshare_tracking_url');
    } catch (e) {
      console.warn('Failed to clear stored profile', e);
    }
  };

  const setNfcState = (state: 'idle' | 'writing' | 'success' | 'error') => {
    setNfcWriteState(state);
  };

  return (
    <AppContext.Provider
      value={{
        isInitialized,
        hasCompletedSetup,
        setHasCompletedSetup,
        user,
        stats,
        liveScanCount,
        isLoadingScans,
        nfcWriteState,
        trackingUrl,
        setTrackingUrl,
        updateProfile,
        addLink,
        removeLink,
        deleteCard,
        fetchLiveScanCount,
        setNfcState,
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
