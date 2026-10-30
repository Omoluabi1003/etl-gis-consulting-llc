'use strict';
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const origin = process.env.PUBLIC_SITE_TEST_ORIGIN || 'http://127.0.0.1:8011';
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const requests = [], errors = [];
    page.on('request', (request) => requests.push(request.url()));
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(`${origin}/agentos/`);
    assert.ok((await page.locator('h1').textContent()).includes('Less friction.'));
    assert.equal(await page.locator('script').count(), 0);
    assert.equal(await page.locator('.metrics,.agent-grid,.connection-status').count(), 0);
    assert.ok(!requests.some((url) => url.includes('/api/')));
    await page.screenshot({ path: '/tmp/etl-ai-public-overview.png', fullPage: true });
    for (const file of ['/agentos/definitions.js', '/agentos/orchestrator.js', '/database/agentos-schema.sql', '/docs/agency-playbook/specialists.md', '/geoagent_os/engine.py', '/README.md']) {
      const response = await page.request.get(origin + file);
      assert.equal(response.status(), 404, file);
    }
    await page.setViewportSize({ width: 390, height: 844 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.getByRole('link', { name: 'Discuss your workflow' }).click();
    assert.ok(page.url().includes('/contact.html'));
    assert.deepEqual(errors, []);
    console.log('[test] Public AI overview: no operational API requests or dashboard; internal static paths return 404; mobile layout and consultation link verified.');
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
