/**
 * src/config/profile.ts — Client-side profile defaults and types for TapShare.
 *
 * Provides:
 *   - ProfileConfig interface and PROFILE_CONFIG constant used by AppContext
 *     as the default profile when no AsyncStorage data exists yet.
 *   - countApiKey and cardUrl for the optional tracked-sharing backend.
 *
 * These defaults are overridden once the user edits their profile via
 * EditProfileScreen (which persists changes to AsyncStorage).
 *
 * Environment variable overrides (for CI/CD):
 *   - EXPO_PUBLIC_COUNT_API_KEY: Override CountAPI namespace
 *   - EXPO_PUBLIC_CARD_URL: Override the deployed vCard endpoint URL
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
  countApiKey: process.env.EXPO_PUBLIC_COUNT_API_KEY || 'tapshare-thabo',
  cardUrl:
    process.env.EXPO_PUBLIC_CARD_URL ||
    'https://tapshare-scanned.vercel.app/api/card',
};
