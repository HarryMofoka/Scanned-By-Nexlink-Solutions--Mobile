export interface SocialLink {
  id: string;
  type: 'linkedin' | 'instagram' | 'x' | 'whatsapp' | 'email' | 'website' | 'github' | 'youtube' | 'facebook' | 'custom';
  title: string;
  url: string;
  iconName: string;
  brandColor?: string;
}

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

export interface DailyStat {
  day: string; // 'M', 'T', 'W', etc.
  fullDay: string; // 'Monday', etc.
  views: number;
  isPeak?: boolean;
}

export interface UserStats {
  totalViews: number;
  thisWeekViews: number;
  vsLastMonthPercent: number;
  scanSuccessRatePercent: number;
  highestDayCount: number;
  highestDayName: string;
  dailyData: DailyStat[];
}

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
