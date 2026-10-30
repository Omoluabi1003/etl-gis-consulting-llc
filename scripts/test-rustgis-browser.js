/* Requires Playwright and a running local static server. No paid/live services. */
'use strict';
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const origin = process.env.RUSTGIS_TEST_ORIGIN || 'http://127.0.0.1:8010';

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.route('**/*', (route) => route.request().url().startsWith(origin) || route.request().url().startsWith('blob:') ? route.continue() : route.abort());
    await page.goto(`${origin}/rustgis.html`);
    await page.waitForFunction(() => document.querySelector('#visible-count').textContent === '12');
    assert.equal(await page.locator('#features circle[role="button"]').count(), 12);
    await page.locator('#feature-table button').first().focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('#inspection h3').textContent(), 'Community library');
    assert.equal(await page.evaluate(() => document.activeElement.closest('#feature-table') !== null), true);
    await page.locator('#analyze').click();
    const matches = Number(await page.locator('#match-count').textContent());
    assert.ok(matches > 0 && matches < 12);
    const downloadPromise = page.waitForEvent('download');
    await page.locator('#export').click();
    const download = await downloadPromise;
    const data = JSON.parse(require('node:fs').readFileSync(await download.path(), 'utf8'));
    assert.equal(data.features.length, matches);
    assert.ok(data.features.every((feature) => feature.properties.provenance === 'Synthetic demonstration record'));
    await page.locator('#search').fill('water');
    assert.equal(await page.locator('#feature-table button').count(), 2);
    await page.getByRole('checkbox', { name: 'Utility assets' }).uncheck();
    assert.equal(await page.locator('#visible-count').textContent(), '0');
    await page.locator('#reset').click();
    assert.equal(await page.locator('#visible-count').textContent(), '12');
    const beforeZoom = await page.locator('#graticule text').first().textContent();
    await page.locator('#zoom-in').click();
    assert.notEqual(await page.locator('#graticule text').first().textContent(), beforeZoom);
    await page.locator('#fit').click();
    await page.screenshot({ path: '/tmp/rustgis-desktop.png', fullPage: true });
    const imported = { type: 'FeatureCollection', features: [{ type: 'Feature', id: 'local-1', properties: { name: '<img src=x onerror=alert(1)>', note: 'Local source' }, geometry: { type: 'Point', coordinates: [3.4, 6.5] } }, { type: 'Feature', properties: { name: 'Second point' }, geometry: { type: 'Point', coordinates: [3.41, 6.5] } }] };
    await page.locator('#import-file').setInputFiles({ name: 'local.geojson', mimeType: 'application/geo+json', buffer: Buffer.from(JSON.stringify(imported)) });
    await page.waitForFunction(() => document.querySelector('#visible-count').textContent === '2');
    assert.equal(await page.locator('#feature-table img').count(), 0);
    assert.equal(await page.locator('#feature-table button').first().textContent(), '<img src=x onerror=alert(1)>');
    await page.locator('#import-file').setInputFiles({ name: 'invalid.geojson', mimeType: 'application/json', buffer: Buffer.from('{"type":"FeatureCollection","features":[]}') });
    await page.waitForFunction(() => document.querySelector('#feedback').textContent.includes('Import failed'));
    assert.equal(await page.locator('#visible-count').textContent(), '2');
    await page.locator('#basemap').selectOption('streets');
    await page.waitForFunction(() => document.querySelector('#basemap').value === 'grid', null, { timeout: 20000 });
    assert.equal(await page.locator('#visible-count').textContent(), '2');
    // Exercise the real MapLibre load path using a local style fixture, never live tiles.
    await page.route('https://tiles.openfreemap.org/styles/liberty', (route) => route.fulfill({ contentType: 'application/json', body: JSON.stringify({ version: 8, sources: {}, layers: [{ id: 'fixture-background', type: 'background', paint: { 'background-color': '#e5eee8' } }] }) }));
    await page.locator('#basemap').selectOption('streets');
    await page.waitForFunction(() => document.querySelector('#map-mode').textContent === 'Atlas Streets', null, { timeout: 20000 });
    assert.equal(await page.locator('#online-map canvas').count(), 1);
    await page.locator('#basemap').selectOption('grid');
    await page.locator('#reset').click();
    await page.setViewportSize({ width: 390, height: 844 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
    await page.screenshot({ path: '/tmp/rustgis-mobile.png', fullPage: true });
    await page.goto(`${origin}/index.html`);
    assert.equal(await page.getByRole('link', { name: 'Launch RUSTGIS' }).count(), 1);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
    assert.deepEqual(errors, []);
    console.log('RUSTGIS browser checks passed: selection, keyboard focus, proximity, export, filters, layers, zoom, import, XSS handling, MapLibre fixture rendering, basemap fallback, mobile layout and homepage entry.');
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
