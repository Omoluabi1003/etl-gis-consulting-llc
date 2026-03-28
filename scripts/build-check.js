const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const requiredFiles = [
  'assets/downloads/utility-network-modernization-playbook.pdf',
  'assets/downloads/public-agency-analytics-playbook.pdf',
  'assets/downloads/cjis-alignment-brief.pdf',
  'assets/images/C4376F7C-6E7F-470B-A331-84B0E39C59A7.png',
];

const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(root, file)));

if (missing.length > 0) {
  console.error('[build] Missing required assets:');
  missing.forEach((file) => console.error(`- ${file}`));
  process.exit(1);
}

console.log('[build] Required assets are present.');
