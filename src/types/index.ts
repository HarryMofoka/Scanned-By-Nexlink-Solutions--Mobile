/**
 * types/index.ts — TypeScript data models for TapShare.
 *
 * All interfaces used across the app are defined here.
 * These types are consumed by AppContext, screens, and the vCard generator.
 */

/** A single social/website link attached to the user's profile. */
export interface SocialLink {
  id: string;
  type: 'linkedin' | 'instagram' | 'x' | 'whatsapp' | 'email' | 'website' | 'github' | 'youtube' | 'facebook' | 'custom';
  title: string;
  url: string;
  iconName: string;
  brandColor?: string;
}

/** The app owner's complete profile, persisted in AsyncStorage. */
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarInitials: string;
  links: SocialLink[];
  qrCodeUrl: string;
  createdAt: string;
}

/** A single day's scan data (currently unused — CountAPI only provides a running total). */
export interface DailyStat {
  day: string; // 'M', 'T', 'W', etc.
  fullDay: string; // 'Monday', etc.
  views: number;
  isPeak?: boolean;
}

/** Aggregated scan statistics displayed on the Dashboard and Stats screens. */
export interface UserStats {
  totalViews: number;
  thisWeekViews: number;
  vsLastMonthPercent: number;
  scanSuccessRatePercent: number;
  highestDayCount: number;
  highestDayName: string;
  dailyData: DailyStat[];
}

/** React Navigation route parameter definitions for the root stack navigator. */
export type RootStackParamList = {
  Splash: undefined;
  GetStarted: undefined;
  Login: { isSignUp?: boolean } | undefined;
  ProfileSetup: undefined;
  MainTabs: undefined;
  QRCodeReady: undefined;
  QRCodeView: undefined;
  NFCTagSharing: undefined;
  EditProfile: undefined;
  Settings: undefined;
  Stats: undefined;
  QRScanner: undefined;
  PublicProfile: { profileId: string };
};
