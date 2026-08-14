// config/profile.js - Single-User MVP Profile Configuration
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
  countApiKey: 'tapshare-thabo',
  // Serverless vCard endpoint URL for QR code scanning & NFC tag writing
  cardUrl: 'https://tapshare-scanned.vercel.app/api/card',
};
