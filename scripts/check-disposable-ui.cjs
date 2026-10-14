// Root operator only: create a disposable published audit row first, then remove
// it and all related annotation rows afterward. This script never creates rows.
const assert = require('node:assert/strict');
const { chromium } = require('@playwright/test');

(async function () {
  const externalId = process.env.TOKYO_AUDIT_EXTERNAL_ID || '';
  assert.match(externalId, /^(?:audit:|codex-audit:)[a-zA-Z0-9_:-]+$/, 'Use an explicitly disposable audit: or codex-audit: external ID');
  assert.equal(process.env.RUN_DISPOSABLE_MUTATION_CHECK, 'yes', 'Set RUN_DISPOSABLE_MUTATION_CHECK=yes only after creating the disposable fixture');
  const slug = externalId.replace(/[^a-zA-Z0-9_-]/g, '_');
  const url = process.env.SITE_URL || 'https://juan-deere-4000.github.io/tokyo-property-shortlist/';
  const channel = process.env.PLAYWRIGHT_CHANNEL || (process.platform === 'darwin' ? 'chrome' : undefined);
  const browser = await chromium.launch({ headless: true, ...(channel ? { channel } : {}) });
  const checks = [];
  try {
    const page = await browser.newPage();
    const errors = [];
    const mutations = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/rest/v1/**', async route => {
      const request = route.request();
      if (['GET', 'HEAD', 'OPTIONS'].includes(request.method())) return route.continue();
      const target = new URL(request.url());
      const table = target.pathname.split('/').at(-1);
      let body;
      try { body = request.postDataJSON(); } catch { body = null; }
      const allowedTable = ['property_notes', 'property_notes_by_author', 'property_flags', 'property_ratings', 'property_vetoes'].includes(table);
      const rows = Array.isArray(body) ? body : [body];
      const ownAnnotation = allowedTable && (request.method() === 'DELETE'
        ? target.searchParams.get('property_slug') === 'eq.' + slug
        : rows.length > 0 && rows.every(row => row?.property_slug === slug));
      const ownRpc = ['update_published_property', 'hide_property'].includes(table) && body?.p_external_id === externalId;
      if (!ownAnnotation && !ownRpc) {
        errors.push('Blocked mutation outside disposable fixture: ' + table);
        return route.abort();
      }
      mutations.push(table);
      return route.continue();
    });
    await page.goto(url, { waitUntil: 'load', timeout: 45000 });
    await page.waitForFunction(() => document.body.dataset.ready === 'true', undefined, { timeout: 45000 });
    const card = page.locator('.property[data-external-id=' + JSON.stringify(externalId) + ']');
    assert.equal(await card.count(), 1, 'Disposable published fixture is missing');
    assert.equal(await card.getAttribute('data-property-slug'), slug);
    await page.locator('#hide-toggle').click();
    await page.locator('#hide-sold').uncheck();
    await page.locator('#hide-toggle').click();

    async function saved(table, filters, predicate) {
      const deadline = Date.now() + 10000;
      while (Date.now() < deadline) {
        const result = await page.evaluate(async ({ table, filters }) => {
          let query = supabaseClient.from(table).select('*');
          for (const [key, value] of Object.entries(filters)) query = query.eq(key, value);
          const { data, error } = await query;
          if (error) throw new Error(error.message);
          return data;
        }, { table, filters });
        if (predicate(result)) return result;
        await new Promise(resolve => setTimeout(resolve, 150));
      }
      throw new Error('Stored data did not match UI change: ' + table);
    }

    await card.locator('.star-toggle').click();
    await saved('property_flags', { property_slug: slug }, rows => rows[0]?.starred === true);
    checks.push('star');

    await card.locator('.notes-toggle').click();
    await card.locator('.notes-author-pill[data-author="Joe"]').first().click();
    const marker = 'disposable shortlist browser audit ' + new Date().toISOString();
    await card.locator('.notes-input[data-author="Joe"]').fill(marker);
    await saved('property_notes_by_author', { property_slug: slug, author: 'Joe' }, rows => rows[0]?.body === marker);
    await saved('property_notes', { property_slug: slug }, rows => rows[0]?.body === marker);
    checks.push('author notes and legacy mirror');

    for (const flag of ['sold', 'exclusive', 'lease']) {
      await card.locator('.notes-' + flag + '-toggle').click();
      await saved('property_flags', { property_slug: slug }, rows => rows[0]?.[flag] === true && rows[0]?.starred === true);
      checks.push(flag + ' flag');
    }

    await card.locator('.ratings-toggle').click();
    await card.locator('.rating-control[data-rater="Joe"][data-metric="Interior"] .rating-range').fill('7.25');
    await saved('property_ratings', { property_slug: slug, rater: 'Joe', metric: 'Layout' }, rows => Number(rows[0]?.score) === 7.25);
    checks.push('interior rating storage');
    await card.locator('.veto-btn[data-rater="Joe"]').click();
    await saved('property_vetoes', { property_slug: slug, rater: 'Joe' }, rows => rows[0]?.vetoed === true);
    checks.push('veto');

    await card.locator('.edit-btn').click();
    await page.locator('input[name="title_en"]').fill('Disposable Browser Audit Verified');
    await page.locator('input[name="price_m"]').fill('');
    await page.locator('input[name="sqm"]').fill('');
    await page.locator('input[name="walk_min"]').fill('');
    await page.locator('input[name="train_min"]').fill('');
    await page.locator('input[name="source_url"]').fill('https://example.com/shortlist-audit');
    await page.locator('.edit-save').click();
    await saved('properties', { external_id: externalId }, rows => rows[0]?.title_en === 'Disposable Browser Audit Verified' && rows[0]?.price_m === null && rows[0]?.sqm === null && rows[0]?.walk_min === null);
    assert.equal(await card.locator('.price').textContent(), 'TBD');
    assert.equal(await card.locator('.sqm-tag').textContent(), 'TBD');
    assert.equal(await card.locator('.transit-pills').textContent(), 'Transit TBD');
    checks.push('edit RPC and saved card');

    await page.locator('#edit-dialog').waitFor({ state: 'hidden' });
    await page.reload();
    await page.waitForFunction(() => document.body.dataset.ready === 'true', undefined, { timeout: 45000 });
    assert.equal(await card.getAttribute('data-starred'), 'true');
    assert.equal(await card.getAttribute('data-sold'), 'true');
    assert.equal(await card.getAttribute('data-exclusive'), 'true');
    assert.equal(await card.getAttribute('data-lease'), 'true');
    assert.equal(await card.getAttribute('data-vetoed'), 'true');
    assert.equal(await card.locator('.notes-input[data-author="Joe"]').inputValue(), marker);
    assert.equal(await card.locator('.aggregate-score').textContent(), '7.25');
    checks.push('persistence after reload');

    await card.locator('.edit-btn').click();
    await page.locator('.edit-hide').click();
    await card.waitFor({ state: 'detached' });
    checks.push('hide RPC');
    assert.deepEqual(errors, [], 'Browser runtime or mutation guard failures');
    assert.equal(await page.locator('#app-status.error').count(), 0, 'UI reported a save/load failure');
    console.log(JSON.stringify({ result: 'passed', externalId, slug, checks, guardedMutations: mutations.length, cleanupRequired: true }, null, 2));
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
