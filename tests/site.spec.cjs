const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const pageErrors = new WeakMap();

test.beforeEach(async ({ page }) => {
  const errors = [];
  pageErrors.set(page, errors);
  page.on('pageerror', error => errors.push(error.message));
});

test.afterEach(async ({ page }) => {
  expect(pageErrors.get(page)).toEqual([]);
});

const original = {
  external_id: 'test-one', source: 'suumo', source_listing_id: 'one', status: 'published',
  title_en: 'First Apartment', title_ja: '東京の家', price_m: 29.8, sqm: 40,
  layout: '1LDK', ward: 'Bunkyo', walk_min: 5, train_min: 15, total_transit_min: 20,
  station_name: 'Tokyo Station', station_line: 'JR',
  source_url: 'https://suumo.jp/example/?id=one',
  source_url_translated: 'https://suumo-jp.translate.goog/example/?id=one&_x_tr_tl=en',
  created_at: '2026-10-14T12:00:00Z', display_date: 'Oct 14'
};

async function fixture(page, options = {}) {
  const rows = options.rows || [structuredClone(original), { ...original, external_id: 'test-two', title_en: 'Sold Apartment', price_m: 20 }];
  const requests = [];
  await page.route('**/notes-config.js', route => route.fulfill({
    contentType: 'application/javascript',
    body: options.missingConfig ? 'window.NOTES_CONFIG = {};' :
      'window.NOTES_CONFIG = {supabaseUrl:"https://shortlist-test.supabase.co",supabasePublishableKey:"sb_publishable_browser_fixture"};'
  }));
  await page.route('https://shortlist-test.supabase.co/**', async route => {
    const request = route.request();
    const url = new URL(request.url());
    const table = url.pathname.split('/').at(-1);
    const method = request.method();
    const write = !['GET', 'HEAD', 'OPTIONS'].includes(method);
    requests.push({ table, method, body: write ? request.postDataJSON() : null });
    const reply = (body, status = 200) => route.fulfill({
      status, contentType: 'application/json',
      headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(body)
    });
    if (options.stallRead === table && !write) return new Promise(() => {});
    if (options.delayRating && table === 'property_ratings' && !write) {
      await new Promise(resolve => setTimeout(resolve, 350));
      return reply([{ property_slug: 'test-one', rater: 'Joe', metric: 'Layout', score: 2 }]);
    }
    if (options.failRead === table && !write) return reply({ message: 'read denied', code: '42501' }, 403);
    if (options.failWrite === table && write) return reply({ message: 'save denied', code: '42501' }, 403);
    if (table === 'properties') {
      const id = url.searchParams.get('external_id')?.replace(/^eq\./, '');
      if (options.failEdit && id) return reply({ message: 'property missing', code: 'PGRST116' }, 406);
      return reply(id ? rows.find(row => row.external_id === id) : rows);
    }
    if (table === 'update_published_property') {
      const body = request.postDataJSON();
      Object.assign(rows[0], Object.fromEntries(Object.entries(body).map(([key, value]) => [key.replace(/^p_/, ''), value])));
      rows[0].total_transit_min = rows[0].walk_min == null || rows[0].train_min == null ? null : rows[0].walk_min + rows[0].train_min;
      rows[0].source_url_translated = 'https://translated.example/saved';
      return reply(rows[0].external_id);
    }
    if (table === 'hide_property') return reply(request.postDataJSON().p_external_id);
    if (write) return reply(null, 200);
    if (table === 'property_flags') return reply([{ property_slug: 'test-two', sold: true }]);
    return reply([]);
  });
  await page.goto('/');
  if (options.missingConfig || options.failRead === 'properties') {
    await expect(page.locator('#app-status')).toHaveClass(/error/);
  } else if (rows.length && !options.stallRead && !options.delayRating) {
    await page.waitForFunction(() => document.body.dataset.ready === 'true');
  }
  return { rows, requests };
}

test('loads published inventory, hides sold by default, and restores sort/filter preferences', async ({ page }) => {
  await fixture(page);
  await expect(page.locator('.property')).toHaveCount(2);
  await expect(page.locator('.property:visible')).toHaveCount(1);
  await expect(page.locator('.notes-toggle')).toHaveCount(2);
  await expect(page.locator('.ratings-toggle')).toHaveCount(2);
  await expect(page.locator('.property').first().locator('.sqm-tag')).toHaveText('40m²');
  await page.locator('#hide-toggle').click();
  await page.locator('#hide-sold').uncheck();
  await page.locator('#sort-by').selectOption('price');
  await expect(page.locator('.property').first()).toHaveAttribute('data-external-id', 'test-two');
  await page.reload();
  await page.waitForFunction(() => document.body.dataset.ready === 'true');
  await expect(page.locator('.property:visible')).toHaveCount(2);
  await expect(page.locator('#sort-by')).toHaveValue('price');
});

test('fits a narrow phone screen', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await fixture(page);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('inventory errors show a retry action rather than a blank list', async ({ page }) => {
  await fixture(page, { failRead: 'properties' });
  await expect(page.locator('#app-status')).toContainText('Could not load the shortlist');
  await expect(page.locator('.app-retry')).toBeVisible();
  await expect(page.locator('.property')).toHaveCount(0);
});

test('an empty published collection is explained', async ({ page }) => {
  await fixture(page, { rows: [] });
  await expect(page.locator('#app-status')).toHaveText(/No properties are currently published/);
  await expect(page.locator('.app-retry')).toBeHidden();
});

test('missing configuration is a visible error', async ({ page }) => {
  await fixture(page, { missingConfig: true });
  await expect(page.locator('.app-retry')).toBeVisible();
});

test('failed flag reads are reported', async ({ page }) => {
  await fixture(page, { failRead: 'property_flags' });
  await expect(page.locator('#app-status')).toContainText('Could not load property flags');
});

test('a failed star write rolls back the optimistic star', async ({ page }) => {
  await fixture(page, { failWrite: 'property_flags' });
  const card = page.locator('.property[data-external-id="test-one"]');
  await card.locator('.star-toggle').click();
  await expect(page.locator('#app-status')).toContainText('Could not save this star');
  await expect(card).toHaveAttribute('data-starred', 'false');
  await expect(card.locator('.star-toggle')).toHaveText('☆');
});

test('a failed sold write rolls back the flag and leaves the property visible', async ({ page }) => {
  await fixture(page, { failWrite: 'property_flags' });
  const card = page.locator('.property[data-external-id="test-one"]');
  await card.locator('.notes-toggle').click();
  await card.locator('.notes-sold-toggle').click();
  await expect(page.locator('#app-status')).toContainText('Could not save this sold flag');
  await expect(card).toHaveAttribute('data-sold', 'false');
  await expect(card).toBeVisible();
});

test('a failed veto write rolls back the veto', async ({ page }) => {
  await fixture(page, { failWrite: 'property_vetoes' });
  const card = page.locator('.property[data-external-id="test-one"]');
  await card.locator('.ratings-toggle').click();
  await card.locator('.veto-btn').first().click();
  await expect(page.locator('#app-status')).toContainText('Could not save this veto');
  await expect(card).toHaveAttribute('data-vetoed', 'false');
});

test('failed notes autosave is reported and keeps the draft', async ({ page }) => {
  await fixture(page, { failWrite: 'property_notes_by_author' });
  const card = page.locator('.property[data-external-id="test-one"]');
  await card.locator('.notes-toggle').click();
  await card.locator('.notes-author-pill[data-author="Joe"]').first().click();
  const input = card.locator('.notes-input[data-author="Joe"]');
  await input.fill('do not lose this draft');
  await expect(page.locator('#app-status')).toContainText('Could not save these notes');
  await expect(input).toHaveValue('do not lose this draft');
});

test('failed rating autosave is reported', async ({ page }) => {
  await fixture(page, { failWrite: 'property_ratings' });
  const card = page.locator('.property[data-external-id="test-one"]');
  await card.locator('.ratings-toggle').click();
  await card.locator('.rating-range').first().fill('8');
  await expect(page.locator('#app-status')).toContainText('Could not save this rating');
});

test('edits use the saved translated link and clear numeric values without zeroes or stale sort values', async ({ page }) => {
  await fixture(page);
  const card = page.locator('.property[data-external-id="test-one"]');
  await card.locator('.edit-btn').click();
  await page.locator('input[name="price_m"]').fill('');
  await page.locator('input[name="sqm"]').fill('');
  await page.locator('input[name="walk_min"]').fill('');
  await page.locator('input[name="train_min"]').fill('');
  await page.locator('.edit-save').click();
  await expect(card.locator('.price')).toHaveText('TBD');
  await expect(card.locator('.sqm-tag')).toHaveText('TBD');
  await expect(card.locator('.transit-pills')).toHaveText('Transit TBD');
  await expect(card.locator('.property-link')).toHaveAttribute('href', 'https://translated.example/saved');
  expect(await card.evaluate(node => ['price', 'sqm', 'cpsqm', 'walk', 'total'].every(key => !(key in node.dataset)))).toBe(true);
});

test('an edit load error cannot submit stale data for a previous property', async ({ page }) => {
  await fixture(page, { failEdit: true });
  await page.locator('.edit-btn').first().click();
  await expect(page.locator('#edit-dialog')).toBeVisible();
  await expect(page.locator('.edit-save')).toBeDisabled();
  await expect(page.locator('.edit-hide')).toBeDisabled();
  await expect(page.locator('#edit-msg')).toContainText('property missing');
});

test('hide removes the property and renumbers the remaining visible cards', async ({ page }) => {
  await fixture(page);
  await page.locator('#hide-toggle').click();
  await page.locator('#hide-sold').uncheck();
  await page.locator('[data-external-id="test-one"] .edit-btn').click();
  await page.locator('.edit-hide').click();
  await expect(page.locator('.property')).toHaveCount(1);
  await expect(page.locator('.rank')).toHaveText('#1');
});

test('local archive links bypass broken translated paths and the archive is served', async ({ page }) => {
  await fixture(page, { rows: [{ ...original, source_url: 'properties/yotsuya-high-corp.html', source_url_translated: 'properties/yotsuya-high-corp.html&_x_tr_sl=ja' }] });
  await expect(page.locator('.property-link')).toHaveAttribute('href', 'properties/yotsuya-high-corp.html');
  expect((await page.request.get('/properties/yotsuya-high-corp.html')).status()).toBe(200);
});

test('untrusted source URLs cannot become executable links', async ({ page }) => {
  await fixture(page, { rows: [{ ...original, source_url: 'javascript:alert(1)', source_url_translated: null }] });
  await expect(page.locator('.property-link')).toHaveAttribute('href', '#');
  expect(await page.evaluate(() => normalizeSourceUrl('https://example.com/a%20b?q=one%20two'))).toBe('https://example.com/a%20b?q=one%20two');
});

test('an unresponsive database times out into a retryable error', async ({ page }) => {
  await page.clock.install();
  await fixture(page, { stallRead: 'properties' });
  await page.clock.runFor(15001);
  await expect(page.locator('#app-status')).toHaveClass(/error/);
  await expect(page.locator('.app-retry')).toBeVisible();
});

test('late rating hydration cannot overwrite an edit made while loading', async ({ page }) => {
  await fixture(page, { delayRating: true });
  const card = page.locator('.property[data-external-id="test-one"]');
  await card.locator('.ratings-toggle').click();
  const input = card.locator('.rating-range').first();
  await input.fill('9');
  await page.waitForFunction(() => document.body.dataset.ready === 'true');
  await expect(input).toHaveValue('9');
  await expect(card.locator('.aggregate-score')).toHaveText('9.00');
});

test('successful notes and rating writes use the compatible shared storage keys', async ({ page }) => {
  const { requests } = await fixture(page);
  const card = page.locator('.property[data-external-id="test-one"]');
  await card.locator('.notes-toggle').click();
  await card.locator('.notes-author-pill[data-author="Joe"]').first().click();
  await card.locator('.notes-input[data-author="Joe"]').fill('a shared note');
  await expect.poll(() => requests.filter(request => request.table === 'property_notes' && request.method === 'POST').length).toBe(1);
  await card.locator('.ratings-toggle').click();
  await card.locator('.rating-range').first().fill('8');
  await expect.poll(() => requests.filter(request => request.table === 'property_ratings' && request.method === 'POST').length).toBe(1);
  const rating = requests.find(request => request.table === 'property_ratings' && request.method === 'POST').body;
  expect(rating).toMatchObject({ property_slug: 'test-one', rater: 'Joe', metric: 'Layout', score: 8 });
  const note = requests.find(request => request.table === 'property_notes_by_author' && request.method === 'POST').body;
  expect(note).toMatchObject({ property_slug: 'test-one', author: 'Joe', body: 'a shared note' });
});

test('published archives keep their cached stylesheet assets locally resolvable', async () => {
  const root = path.resolve(__dirname, '..');
  for (const slug of ['yotsuya-high-corp', 'heitsu-otowa', 'koken-heights-mejiro', 'palm-house-bunkyo', 'nakamachi-corp']) {
    const html = fs.readFileSync(path.join(root, 'properties', slug + '.html'), 'utf8');
    expect(html).not.toMatch(/<script\b[^>]*src=["'][^"']*(?:gtm\.js|s_code\.js|catalyst\.js|log_beacon\.js)/);
    const refs = [...html.matchAll(/href="([^"]+\.css)"/g)].map(match => match[1]);
    for (const ref of refs) {
      if (/^(?:https?:)?\/\//.test(ref)) continue;
      const file = path.resolve(root, 'properties', decodeURIComponent(ref));
      expect(fs.existsSync(file), ref).toBe(true);
      const folder = path.dirname(file);
      const css = fs.readFileSync(file, 'utf8');
      for (const match of css.matchAll(/url\(\s*([^)]*?)\s*\)/g)) {
        const raw = match[1].trim().replace(/^["']|["']$/g, '');
        if (!raw || /^(?:data:|#|https?:|\/\/)/.test(raw)) continue;
        const parsed = new URL(raw, 'https://archive.invalid/');
        const basename = path.basename(decodeURIComponent(parsed.pathname));
        if (!fs.existsSync(path.join(folder, basename))) continue;
        expect(fs.existsSync(path.resolve(folder, decodeURIComponent(raw.split(/[?#]/)[0]))), slug + ': ' + raw).toBe(true);
      }
    }
  }
});

test('known station walk remains visible and sortable while train time is unknown', async ({ page }) => {
  await fixture(page, { rows: [{ ...original, walk_min: 5, train_min: null, total_transit_min: null }] });
  await expect(page.locator('.transit-pills')).toHaveText('🚶 5 min → 🚇 TBD');
  await expect(page.locator('.property')).toHaveAttribute('data-walk', '5');
  expect(await page.locator('.property').evaluate(node => !('train' in node.dataset) && !('total' in node.dataset))).toBe(true);
});
