const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

const consultation = require(path.join(root, 'api', 'consultation.js'));
const playbook = require(path.join(root, 'api', 'playbook.js'));

if (typeof consultation !== 'function') {
  console.error('[typecheck] api/consultation.js does not export a handler function.');
  process.exit(1);
}

if (typeof playbook !== 'function') {
  console.error('[typecheck] api/playbook.js does not export a handler function.');
  process.exit(1);
}

const scriptsPath = path.join(root, 'assets', 'js', 'scripts.js');
const scriptsContent = fs.readFileSync(scriptsPath, 'utf8');

if (!scriptsContent.includes('/api/consultation')) {
  console.error('[typecheck] scripts.js is missing /api/consultation endpoint reference.');
  process.exit(1);
}

if (!scriptsContent.includes('/api/playbook')) {
  console.error('[typecheck] scripts.js is missing /api/playbook endpoint reference.');
  process.exit(1);
}

console.log('[typecheck] API handlers and client endpoints are aligned.');
