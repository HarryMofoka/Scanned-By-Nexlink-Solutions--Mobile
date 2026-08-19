/**
 * src/config/profile.ts — Client-side default profile fallbacks & types.
 *
 * ⚠️ IMPORTANT: THIS IS THE CLIENT-SIDE FALLBACK CONFIG FILE.
 *
 * This file ONLY supplies fallback defaults and placeholder values before a user
 * completes `ProfileSetupScreen` or when generating mock previews.
 *
 * Once real profile data is saved on the device (in `AsyncStorage` under `@tapshare_user`),
 * changes in this file HAVE NO EFFECT on the user's active contact card!
 *
 * To change your contact details in the app:
 *   - Go to Settings → Edit Profile inside the mobile app.
 *
 * If you are deploying your own tracked backend, edit `config/profile.js` instead.
 *
 * Client-side Environment Variables (Expo / Mobile Client):
 *   - EXPO_PUBLIC_DEFAULT_COUNT_API_KEY (or EXPO_PUBLIC_COUNT_API_KEY) : Default CountAPI namespace fallback
 *   - EXPO_PUBLIC_DEFAULT_CARD_URL      (or EXPO_PUBLIC_CARD_URL)      : Default tracking endpoint URL fallback
 */
declare const process: { env: Record<string, string | undefined> };

export interface ProfileLink {
  label: string;
  url: string;
}

export interface ProfileConfig {
  firstName: string;
  lastName: string;
  name: string;
  phone: string;
  email: string;
  avatarInitials: string;
  bio: string;
  links: ProfileLink[];
  countApiKey: string;
  cardUrl: string;
}

export const PROFILE_CONFIG: ProfileConfig = {
  firstName: 'Thabo',
  lastName: 'Nkosi',
  name: 'Thabo Nkosi',
  phone: '+27 82 123 4567',
  email: 'thabo@tapshare.app',
  avatarInitials: 'TN',
  bio: 'Software Engineer & Tech Creator',
  links: [
    { label: 'LinkedIn', url: 'https://linkedin.com/in/thabonkosi' },
    { label: 'Instagram', url: 'https://instagram.com/thabo.nkosi' },
    { label: 'GitHub', url: 'https://github.com/thabonkosi' },
    { label: 'Website', url: 'https://tapshare.app' },
  ],
  countApiKey:
    process.env.EXPO_PUBLIC_DEFAULT_COUNT_API_KEY ||
    process.env.EXPO_PUBLIC_COUNT_API_KEY ||
    'tapshare-thabo',
  cardUrl:
    process.env.EXPO_PUBLIC_DEFAULT_CARD_URL ||
    process.env.EXPO_PUBLIC_CARD_URL ||
    'https://tapshare-scanned.vercel.app/api/card',
};
