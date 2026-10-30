const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const requiredFiles = [
  'assets/brand/etl-gis-crest.png',
  'assets/brand/etl-gis-crest-128.webp',
  'assets/brand/etl-gis-crest-256.webp',
  'assets/brand/etl-gis-share.jpg',
  'assets/brand/favicon.ico',
  'assets/brand/icon-32.png',
  'assets/brand/icon-180.png',
  'assets/css/brand-identity.css',
  'site.webmanifest',
  'assets/js/earth-globe.js',
  'assets/images/earth/day-2048.webp',
  'assets/images/earth/night-1024.webp',
  'assets/downloads/utility-network-modernization-playbook.pdf',
  'assets/downloads/public-agency-analytics-playbook.pdf',
  'assets/downloads/cjis-alignment-brief.pdf',
  'assets/images/C4376F7C-6E7F-470B-A331-84B0E39C59A7.png',
  'agentos/index.html',
  'assets/css/agentos.css',
  'database/agentos-schema.sql',
];

const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(root, file)));

if (missing.length > 0) {
  console.error('[build] Missing required assets:');
  missing.forEach((file) => console.error(`- ${file}`));
  process.exit(1);
}

console.log('[build] Required assets are present.');
