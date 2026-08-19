/**
 * vcard.ts — Local-first vCard 3.0 generator for TapShare.
 *
 * This module is the core of TapShare's offline-first architecture.
 * It builds a standard vCard 3.0 string from the on-device UserProfile,
 * which is then embedded directly into QR codes and NFC tag payloads.
 *
 * Key design decisions:
 *   - No network requests: the vCard is generated entirely from local state.
 *   - No URL dependency: QR codes contain the vCard text itself, not a link.
 *   - Graceful defaults: missing fields produce valid but minimal vCards.
 *   - Links without protocol get https:// prepended automatically.
 *
 * The same vCard format is used by api/card.js (server-side), keeping
 * offline and online contact cards consistent.
 */
import { UserProfile } from '../types';

/**
 * Generates a standard vCard 3.0 string from a UserProfile object.
 *
 * @param user - The UserProfile from AppContext (stored in AsyncStorage).
 * @returns A complete vCard 3.0 string with CRLF line endings, ready to be
 *          encoded into a QR code or written to an NFC tag.
 *
 * @example
 *   const vcard = generateVCard(user);
 *   // => "BEGIN:VCARD\r\nVERSION:3.0\r\nN:Nkosi;Thabo;;;\r\n..."
 */
export const generateVCard = (user: UserProfile): string => {
  const nameTrimmed = (user?.name || '').trim();
  const nameParts = nameTrimmed.split(' ').filter(Boolean);
  const firstName = nameParts[0] || '';
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${lastName};${firstName};;;`,
    `FN:${nameTrimmed}`,
    `TEL;TYPE=CELL:${user?.phone || ''}`,
    `EMAIL:${user?.email || ''}`,
  ];

  if (user?.links && Array.isArray(user.links)) {
    user.links.forEach(l => {
      if (l.url) {
        const formattedUrl =
          l.url.startsWith('http://') || l.url.startsWith('https://')
            ? l.url
            : `https://${l.url}`;
        lines.push(`URL:${formattedUrl}`);
      }
    });
  }

  lines.push('END:VCARD');
  return lines.join('\r\n');
};
