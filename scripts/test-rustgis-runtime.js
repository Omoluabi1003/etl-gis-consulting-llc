/* Actual vendored Rust/WASM engine smoke test: no engine or data mocks. */
'use strict';
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const origin = process.env.RUSTGIS_TEST_ORIGIN || 'http://127.0.0.1:8010';

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox', '--enable-unsafe-swiftshader'] });
  const deadline = setTimeout(() => browser.close(), 90000);
  try {
    const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
    const failures = [];
    page.on('pageerror', (error) => failures.push(error.message));
    await page.route('**/*', (route) => {
      const url = route.request().url();
      return url.startsWith(origin + '/') || url.startsWith('blob:') ? route.continue() : route.abort();
    });
    await page.goto(`${origin}/rustgis.html?workflow=world`);
    await page.locator('#load-rustgis').click();
    await page.waitForFunction(() => document.querySelector('#rustgis-engine-status').textContent.startsWith('RustGIS is ready'), null, { timeout: 30000 });
    // Only this test installs a project observer and requests an import. The product UI
    // does not receive project payloads or run engine commands on the user's behalf.
    await page.evaluate(() => {
      window.__rustgisTestMessages = [];
      const frame = document.querySelector('#rustgis-frame-host iframe');
      window.addEventListener('message', (event) => {
        if (event.origin === location.origin && event.source === frame.contentWindow) window.__rustgisTestMessages.push(event.data);
      });
      frame.contentWindow.postMessage({ rustgis: 'run', id: 'real-import-smoke', command: 'ui.addUrl', params: { url: location.origin + '/rustgis-app/data/countries.geojson' } }, location.origin);
    });
    await page.waitForFunction(() => window.__rustgisTestMessages.some((m) => m.rustgis === 'result' && m.id === 'real-import-smoke'), null, { timeout: 15000 });
    const outcome = await page.evaluate(() => window.__rustgisTestMessages.find((m) => m.rustgis === 'result' && m.id === 'real-import-smoke'));
    assert.equal(outcome.ok, true, outcome.error);
    await page.waitForFunction(() => window.__rustgisTestMessages.some((m) => {
      if (m.rustgis !== 'project') return false;
      const layers = JSON.parse(m.text).maps.flatMap((map) => map.layers);
      return layers.some((layer) => layer.name === 'cities' && layer.dataset.features.length === 243) && layers.filter((layer) => layer.name.startsWith('countries') && layer.dataset.features.length === 177).length >= 2;
    }), null, { timeout: 15000 });
    await page.locator('#rustgis-frame-host').screenshot({ path: '/tmp/rustgis-real-runtime.png' });
    // The same distribution must also boot as the new-tab destination, not only an iframe.
    await page.goto(`${origin}/rustgis-app/?blank`);
    await page.waitForFunction(() => {
      const loading = document.getElementById('rustgis_loading');
      return window.wasmBindings && (!loading || getComputedStyle(loading).display === 'none');
    }, null, { timeout: 30000 });
    assert.equal(await page.locator('#rustgis_canvas').count(), 1);
    assert.deepEqual(failures, []);
    console.log('Actual RustGIS WASM passed: embedded readiness, 177-country and 243-city starter layers, successful vector import/project state, and standalone new-tab startup. All external requests were blocked.');
  } finally { clearTimeout(deadline); await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
