// api/card.js - Serverless Function for vCard Contact Download & CountAPI Logging
export default async function handler(req, res) {
  try {
    await fetch('https://api.countapi.xyz/hit/tapshare-thabo/scans');
  } catch (e) {
    console.error('Counter ping failed', e);
  }

  const profile = require('../config/profile.js');

  const vcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${profile.lastName};${profile.firstName};;;`,
    `FN:${profile.firstName} ${profile.lastName}`,
    `TEL;TYPE=CELL:${profile.phone}`,
    `EMAIL:${profile.email}`,
    ...profile.links.map(l => `URL:${l.url}`),
    'END:VCARD',
  ].join('\r\n');

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Content-Type', 'text/vcard; charset=utf-8');
  res.setHeader('Content-Disposition', `inline; filename="${profile.firstName}-${profile.lastName}.vcf"`);
  res.status(200).send(vcard);
}
