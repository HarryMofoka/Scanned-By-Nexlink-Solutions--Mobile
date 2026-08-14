// src/config/profile.ts - TypeScript export for app profile config
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
  countApiKey: 'tapshare-thabo',
  cardUrl: 'https://tapshare-scanned.vercel.app/api/card',
};
