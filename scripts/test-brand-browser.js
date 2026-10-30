'use strict';
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const origin = process.env.PUBLIC_SITE_TEST_ORIGIN || 'http://127.0.0.1:8011';
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox', '--enable-unsafe-swiftshader'] });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.route('**/*', (route) => route.request().url().startsWith(origin) ? route.continue() : route.abort());
    for (const route of ['/', '/about.html', '/services/enterprise-architecture.html', '/insights/location-intelligence-for-executive-decision-cycles.html', '/agentos/']) {
      await page.goto(origin + route);
      const logo = page.locator('img[src*="brand/etl-gis-crest-128.webp"]').first();
      await logo.evaluate((img) => img.decode());
      assert.ok(await logo.isVisible(), route);
      assert.equal(await logo.evaluate((img) => img.naturalWidth), 128);
      const share = await page.locator('meta[property="og:image"]').getAttribute('content');
      const response = await page.request.get(origin + new URL(share).pathname);
      assert.equal(response.status(), 200);
      assert.ok(response.headers()['content-type'].includes('image/jpeg'));
    }
    await page.goto(origin + '/');
    await page.screenshot({ path: '/tmp/etl-engraved-brand-desktop.png' });
    await page.setViewportSize({ width: 390, height: 844 });
    for (const route of ['/', '/services.html', '/agentos/']) {
      await page.goto(origin + route);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), route);
      assert.ok(await page.locator('img[src*="brand/etl-gis-crest-128.webp"]').first().isVisible());
    }
    await page.goto(origin + '/');
    await page.screenshot({ path: '/tmp/etl-engraved-brand-mobile.png' });
    assert.deepEqual(errors, []);
    console.log('[test] Engraved identity loads in desktop/mobile headers, nested services, insights and AI overview; social preview image is served as JPEG.');
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
