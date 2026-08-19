/**
 * config/profile.js — Server-side profile configuration for TapShare.
 *
 * This file is read by api/card.js (the Vercel serverless function) to
 * generate vCard responses. It is NOT used by the mobile app's QR/NFC
 * generation — those read from AsyncStorage via AppContext instead.
 *
 * To customise the server-side contact card:
 *   1. Edit the fields below with your real contact info.
 *   2. Redeploy to Vercel (or set environment variables).
 *
 * Environment variable overrides (optional):
 *   - COUNT_API_KEY: Override the CountAPI namespace (default: 'tapshare-thabo')
 *   - CARD_URL: Override the full vCard endpoint URL
 *   - VERCEL_URL: Auto-set by Vercel; used as fallback to construct cardUrl
 */
module.exports = {
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
  countApiKey: process.env.COUNT_API_KEY || 'tapshare-thabo',
  // Serverless vCard endpoint URL for QR code scanning & NFC tag writing
  cardUrl:
    process.env.CARD_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/api/card` : 'https://tapshare-scanned.vercel.app/api/card'),
};
