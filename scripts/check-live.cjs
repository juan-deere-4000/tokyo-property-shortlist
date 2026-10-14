const assert = require('node:assert/strict');
const { chromium } = require('@playwright/test');

(async function () {
  const url = process.env.SITE_URL || 'https://juan-deere-4000.github.io/tokyo-property-shortlist/';
  const channel = process.env.PLAYWRIGHT_CHANNEL || (process.platform === 'darwin' ? 'chrome' : undefined);
  const browser = await chromium.launch({ headless: true, ...(channel ? { channel } : {}) });
  try {
    const page = await browser.newPage();
    const errors = [];
    const failures = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('requestfailed', request => failures.push({ path: new URL(request.url()).pathname, reason: request.failure()?.errorText }));
    await page.route('**/rest/v1/**', route => {
      if (!['GET', 'HEAD', 'OPTIONS'].includes(route.request().method())) {
        errors.push('Unexpected database mutation attempted during read-only check');
        return route.abort();
      }
      return route.continue();
    });
    await page.goto(url, { waitUntil: 'load', timeout: 45000 });
    await page.waitForFunction(() => {
      const count = document.querySelectorAll('.property').length;
      return document.body.dataset.ready === 'true' || document.querySelector('#app-status.error') ||
        (count > 0 && document.querySelectorAll('.ratings-toggle').length === count);
    }, undefined, { timeout: 45000 });
    await page.waitForLoadState('networkidle');
    assert.equal(await page.locator('#app-status.error').count(), 0, 'Site reports a loading or collaboration failure');
    const cards = await page.locator('.property').count();
    assert.ok(cards > 0, 'Published inventory is empty');
    assert.equal(await page.locator('.notes-toggle').count(), cards);
    assert.equal(await page.locator('.ratings-toggle').count(), cards);
    assert.equal(await page.locator('.star-toggle').count(), cards);
    const localLinks = await page.locator('.property-link').evaluateAll(links => links.map(link => link.href).filter(href => new URL(href).origin === location.origin));
    for (const link of localLinks) {
      assert.equal((await page.request.get(link)).status(), 200, 'Broken archive: ' + new URL(link).pathname);
    }
    await page.setViewportSize({ width: 390, height: 844 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Phone layout overflows');
    assert.deepEqual(errors, [], 'Browser runtime errors');
    assert.deepEqual(failures, [], 'Failed network requests');
    console.log(JSON.stringify({ url, cards, visibleCards: await page.locator('.property:visible').count(), localArchives: localLinks.length, phoneWidth: 390, databaseWrites: 0, result: 'passed' }, null, 2));
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
