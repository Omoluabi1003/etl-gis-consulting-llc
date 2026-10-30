const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const requiredFiles = [
  'rustgis-app/index.html',
  'rustgis-app/LICENSE',
  'rustgis-app/THIRD-PARTY-LICENSES.txt',
  'rustgis-app/PROVENANCE.json',
  'rustgis-app/rustgis-web-1815bb691d99cd11.js',
  'rustgis-app/rustgis-web-1815bb691d99cd11_bg.wasm',
  'rustgis-app/snippets/rustgis-web-16bb2518e3b497a1/inline0.js',
  'rustgis-app/data/countries.geojson',
  'rustgis-app/data/cities.geojson',
  'rustgis.html',
  'assets/css/rustgis.css',
  'assets/js/rustgis-core.js',
  'assets/js/rustgis.js',
  'assets/js/rustgis-embed.js',
  'assets/images/rustgis/hero.webp',
  'assets/images/rustgis/analysis.webp',
  'assets/images/rustgis/raster.webp',
  'assets/images/rustgis/layouts.webp',
  'assets/images/rustgis/LICENSE.txt',
  'assets/vendor/maplibre-gl/maplibre-gl.js',
  'assets/vendor/maplibre-gl/maplibre-gl.css',
  'assets/vendor/maplibre-gl/LICENSE.txt',
  'assets/downloads/utility-network-modernization-playbook.pdf',
  'assets/downloads/public-agency-analytics-playbook.pdf',
  'assets/downloads/cjis-alignment-brief.pdf',
  'assets/images/C4376F7C-6E7F-470B-A331-84B0E39C59A7.png',
  'agentos/index.html',
  'assets/css/agentos.css',
  'assets/js/agentos.js',
  'database/agentos-schema.sql',
];

const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(root, file)));

if (missing.length > 0) {
  console.error('[build] Missing required assets:');
  missing.forEach((file) => console.error(`- ${file}`));
  process.exit(1);
}

const crypto = require('crypto');
const provenance = JSON.parse(fs.readFileSync(path.join(root, 'rustgis-app/PROVENANCE.json')));
for (const [file, expected] of Object.entries(provenance.sha256)) {
  const actual = crypto.createHash('sha256').update(fs.readFileSync(path.join(root, 'rustgis-app', file))).digest('hex');
  if (actual !== expected) {
    console.error(`[build] RustGIS artifact integrity mismatch: ${file}`);
    process.exit(1);
  }
}
console.log('[build] Required assets and RustGIS artifact integrity verified.');
