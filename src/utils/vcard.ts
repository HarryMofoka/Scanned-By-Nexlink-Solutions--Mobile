import { UserProfile } from '../types';

/**
 * Generates a standard vCard 3.0 string directly from an on-device UserProfile object.
 * Enables zero-network, local-first contact sharing via QR codes and NFC tags.
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
