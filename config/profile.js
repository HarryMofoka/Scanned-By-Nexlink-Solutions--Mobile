/**
 * config/profile.js — Server-side profile configuration (Optional Tracked Backend).
 *
 * ⚠️ IMPORTANT: THIS IS THE SERVER-SIDE CONFIG FILE.
 *
 * It is used EXCLUSIVELY by `api/card.js` (the Vercel/Node serverless function)
 * when serving a downloadable vCard over HTTP and recording scans via CountAPI.
 *
 * This file DOES NOT affect the mobile app's day-to-day profile data!
 * The mobile app stores and edits the owner's profile on-device in `AsyncStorage`.
 *
 * Edit this file ONLY IF:
 *   - You deploy your own copy of the `api/card.js` backend to Vercel/Node.
 *   - You want your deployed HTTP endpoint to return your specific details.
 *
 * Server-side Environment Variables (Vercel / Node):
 *   - COUNT_API_KEY : CountAPI namespace for server scan hits (default: 'tapshare-thabo')
 *   - CARD_URL      : Override URL for the deployed endpoint
 *   - VERCEL_URL    : Auto-injected by Vercel; fallback to build endpoint URL
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
