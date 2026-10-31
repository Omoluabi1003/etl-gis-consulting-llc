'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { build, pages } = require('./build-site');
const output = build();
const share = 'https://etl-gis-consulting-llc.vercel.app/assets/brand/etl-gis-share.jpg';
let count = 0;
for (const name of pages.filter((p) => p.endsWith('.html'))) {
  const html = fs.readFileSync(path.join(output, name), 'utf8');
  assert.ok(!/C4376|og-cover\.svg|favicon\.svg|class="brand-mark"|brand-grid/.test(html), `${name}: obsolete identity`);
  assert.ok(html.includes('assets/brand/favicon.ico'), `${name}: favicon`);
  assert.ok(html.includes('assets/brand/icon-180.png'), `${name}: Apple icon`);
  assert.ok(html.includes('site.webmanifest'), `${name}: manifest`);
  assert.equal((html.match(/property="og:image"/g) || []).length, 1, `${name}: OG image count`);
  assert.ok(html.includes(`<meta property="og:image" content="${share}">`), `${name}: OG image`);
  assert.ok(html.includes(`<meta name="twitter:image" content="${share}">`), `${name}: Twitter image`);
  if (name !== 'index.html') {
    assert.ok(html.includes('property="og:image:width" content="1200"'), `${name}: OG width`);
    assert.ok(html.includes('property="og:image:height" content="630"'), `${name}: OG height`);
  }
  for (const target of [...html.matchAll(/(?:src|href)="([^"#]+)"/g)].map((m) => m[1])) {
    if (/assets\/(?:brand|css\/brand-identity)/.test(target) && !/^https?:/.test(target)) {
      assert.ok(fs.existsSync(path.resolve(output, path.dirname(name), target)), `${name}: ${target}`);
    }
  }
  if (name !== 'about/index.html') assert.ok(/<img[^>]+assets\/brand\/etl-gis-crest-128\.webp/.test(html), `${name}: visible crest`);
  count++;
}
for (const size of [16, 32, 48, 180, 192, 512]) {
  const bytes = fs.readFileSync(path.join(output, `assets/brand/icon-${size}.png`));
  assert.equal(bytes.readUInt32BE(16), size); assert.equal(bytes.readUInt32BE(20), size);
}
const ico = fs.readFileSync(path.join(output, 'favicon.ico'));
assert.equal(ico.readUInt16LE(2), 1); assert.equal(ico.readUInt16LE(4), 3);
const manifest = JSON.parse(fs.readFileSync(path.join(output, 'site.webmanifest')));
assert.equal(manifest.name, 'ETL GIS Consulting LLC');
for (const icon of manifest.icons) assert.ok(fs.existsSync(path.join(output, icon.src)));
console.log(`[test] Approved crest, icons and unique sharing metadata verified across all ${count} public HTML pages, including nested routes.`);
