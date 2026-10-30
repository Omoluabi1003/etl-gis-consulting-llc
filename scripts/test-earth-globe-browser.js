'use strict';
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const origin = process.env.GLOBE_TEST_ORIGIN || 'http://127.0.0.1:8010';
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox', '--enable-unsafe-swiftshader'] });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1050 } });
    const errors = [], requests = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('request', (request) => requests.push(request.url()));
    await page.route('**/*', (route) => route.request().url().startsWith(origin) ? route.continue() : route.abort());
    await page.goto(`${origin}/index.html`);
    const hero = page.locator('.earth-scene [data-earth-globe]');
    await page.waitForFunction(() => document.querySelector('.earth-scene [data-earth-globe]').dataset.ready === 'true');
    assert.equal(await hero.getAttribute('data-renderer'), 'webgl');
    assert.equal(await page.locator('a[href*="rustgis"]').count(), 0);
    assert.equal(await page.locator('.intelligence-console,.about-visual,.rustgis-feature').count(), 0);
    const initial = await hero.getAttribute('data-rotation');
    await page.waitForFunction((previous) => document.querySelector('.earth-scene [data-earth-globe]').dataset.rotation !== previous, initial);
    await page.getByRole('button', { name: 'Pause globe' }).click();
    const paused = await hero.getAttribute('data-rotation');
    await page.waitForTimeout(250);
    assert.equal(await hero.getAttribute('data-rotation'), paused);
    await hero.locator('canvas').focus();
    await page.keyboard.press('ArrowRight');
    assert.ok(Math.abs(Number(await hero.getAttribute('data-rotation')) - Number(paused) - 8) < .01);
    await page.keyboard.press('Home');
    assert.equal(await hero.getAttribute('data-rotation'), '-45.000');
    const bounds = await hero.boundingBox();
    await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
    await page.mouse.down(); await page.mouse.move(bounds.x + bounds.width / 2 + 60, bounds.y + bounds.height / 2, { steps: 5 }); await page.mouse.up();
    assert.ok(Number(await hero.getAttribute('data-rotation')) < -50);
    await page.getByRole('button', { name: 'Resume globe' }).click();
    await page.screenshot({ path: '/tmp/etl-globe-hero.png' });
    await page.locator('#about').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => document.querySelector('.earth-scene [data-earth-globe]').dataset.visible === 'false');
    const offscreen = await hero.getAttribute('data-rotation');
    await page.waitForTimeout(250);
    assert.equal(await hero.getAttribute('data-rotation'), offscreen);
    assert.equal(await page.locator('.about-earth [data-earth-globe]').getAttribute('data-paused'), 'true');
    await page.screenshot({ path: '/tmp/etl-globe-about.png' });
    // Read the actual render buffer in the draw call, before it is discarded.
    const transparency = await page.locator('.about-earth canvas').evaluate((canvas) => {
      const gl = canvas.getContext('webgl');
      let result;
      const draw = gl.drawArrays.bind(gl);
      gl.drawArrays = (...args) => {
        draw(...args);
        const pixel = new Uint8Array(4);
        gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
        result = { corner: Array.from(pixel), premultiplied: gl.getContextAttributes().premultipliedAlpha };
      };
      canvas.parentElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));
      // The static globe rerenders when its canvas size changes.
      return new Promise((resolve) => {
        const host = canvas.parentElement;
        const width = host.style.width;
        host.style.width = (host.clientWidth - 1) + 'px';
        const poll = () => {
          if (!result) return requestAnimationFrame(poll);
          gl.drawArrays = draw; host.style.width = width; resolve(result);
        };
        requestAnimationFrame(poll);
      });
    });
    assert.equal(transparency.premultiplied, true);
    assert.deepEqual(transparency.corner, [0, 0, 0, 0], 'Space outside the globe must be transparent black, without residual blue');

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 390, height: 844 }); await page.goto(`${origin}/index.html`);
    await page.waitForFunction(() => document.querySelector('.earth-scene [data-earth-globe]').dataset.ready === 'true');
    assert.equal(await hero.getAttribute('data-paused'), 'true');
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.locator('.earth-scene').scrollIntoViewIfNeeded();
    await page.screenshot({ path: '/tmp/etl-globe-mobile.png' });
    assert.deepEqual(errors, []);
    assert.ok(!requests.some((url) => /rustgis|maplibre|\.wasm/.test(url)));
    const fallback = await browser.newPage({ viewport: { width: 1100, height: 950 } });
    await fallback.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (type, ...args) { return /webgl/.test(type) ? null : original.call(this, type, ...args); };
    });
    await fallback.route('**/*', (route) => route.request().url().startsWith(origin) ? route.continue() : route.abort());
    await fallback.goto(`${origin}/index.html`);
    await fallback.waitForFunction(() => document.querySelector('.earth-scene [data-earth-globe]').dataset.ready === 'true');
    assert.equal(await fallback.locator('.earth-scene [data-earth-globe]').getAttribute('data-renderer'), 'fallback');
    assert.ok(await fallback.locator('.hero-actions a').first().isVisible());
    await fallback.screenshot({ path: '/tmp/etl-globe-fallback.png' });
    console.log('Integrated globe browser checks passed: actual WebGL rendering, drag/keyboard controls, pause, offscreen suspension, static About globe, reduced motion, mobile layout and projected-image fallback. No GIS application or WASM requested.');
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
