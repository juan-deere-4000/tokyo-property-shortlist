# Tokyo Property Shortlist

Live site: https://juan-deere-4000.github.io/tokyo-property-shortlist/

A shared shortlist for Joe, Max, and Michelle. The page loads published properties from Supabase and supports shared notes, stars, sold/exclusive/lease flags, ratings, vetoes, and editing/hiding cards. There is no sign-in screen: the existing shared collaboration model is intentional.

## Runtime and data flow

- `index.html`, `styles/`, and `js/` are a static frontend hosted by GitHub Pages.
- `notes-config.js` contains the public Supabase project URL and publishable key. Never put a secret/service-role key in this file.
- The pinned Supabase SDK is served from `vendor/supabase.js`, with its license alongside it. Loading the shortlist does not depend on a third-party script CDN.
- Inventory comes exclusively from `properties` where `status='published'`. An empty database is explained on the page; a connection/API failure shows an error and Retry. Old hardcoded cards are not an inventory fallback.
- The scraper and daily schedule live in the separate `../tokyo-properties` project. New published rows appear on the next page load; no frontend deployment is needed for a data change.
- Some original listings are archived under `properties/<slug>.html` and `properties/<slug>_files/`. Those files remain deployed because current published cards link to them. Local archives bypass external translation URLs.

The original Heitsu, Koken, and Palm captures did not save their main listing photos. At least the checked Heitsu photo URL now returns 404 upstream, so those galleries cannot be recovered from the existing archives. Cached listing text, layout, and shared UI assets are preserved; upstream appointment/contact widgets are not local services.

Shared tables are `property_notes`, `property_notes_by_author`, `property_flags`, `property_ratings`, and `property_vetoes`. Author names are Joe, Max, Michelle, and Agent; ratings are Joe, Max, and Michelle. The UI calls the interior metric `Interior`, while its stored key remains `Layout` for compatibility.

Browser edits use the `update_published_property` RPC and then fetch the saved row, including its translated link. Hide uses `hide_property`. Sorting/filter preferences are local to each browser. Supabase read/write failures are visible; failed flag changes are rolled back, and unsaved notes remain in the editor.

## Local preview

```sh
cd /Users/joe/projects/tokyo-shortlist
python3 -m http.server 8020 --bind 127.0.0.1
```

Open http://127.0.0.1:8020/. This uses the real published database. Editing, notes, flags, and ratings in a normal preview also write to the real database.

## Tests and deployment

Requires Node 22+ and Python 3.

```sh
npm ci
npx playwright install chromium
npm test
npm run build
```

On this Mac, the installed Google Chrome can be used without downloading Chromium:

```sh
PLAYWRIGHT_CHANNEL=chrome npm test
```

Tests use the real vendored SDK against intercepted disposable HTTP fixtures, and cannot write to the live database. They cover loading/failures, phone layout, filtering/sorting, collaboration failures, saved edits, safe URLs, and archived links. The test server defaults to port 18763; set `TEST_PORT` if needed.

`npm run build` creates `dist/` from an explicit runtime allowlist. SQL, database backups, tests, Node dependencies, `properties_backup/`, and raw captures in `properties/backup-originals/` are excluded. Pushes to `main` run the browser tests, build, and deploy `dist/` using `.github/workflows/deploy.yml`; the workflow can also be started manually.

After deployment, run the read-only browser check:

```sh
npm run test:live
```

It verifies inventory, notes/ratings/stars, local archive HTTP responses, phone width, and browser/network errors. Database mutations are blocked in this check. Set `SITE_URL` to test another deployed or local build, and `PLAYWRIGHT_CHANNEL` to select an installed browser.

When upgrading the SDK, update the pinned npm dependency and lockfile, then copy `node_modules/@supabase/supabase-js/dist/umd/supabase.js` and its package `LICENSE` into `vendor/` and rerun tests.

## Ingestion and migrations

Use the canonical `upsert_property_from_source` RPC with a normalized `p_payload` for normal scraper/manual ingestion. Do not use ad-hoc table inserts, fake source names, or republish a manually hidden property. Follow the `add-to-shortlist` skill and the scraper project's instructions. Ingestion credentials belong only in the scraper environment.

Schema changes live in `supabase/migrations/`. Check allowed source values before adding a new source and apply its migration before ingestion. Historical migrations and `supabase/setup_notes.sql` document the original schema; do not run the setup SQL as a recovery shortcut over the existing database.

If the page is empty or reports a connection error, check the existing Supabase project's health first. A paused project can make its host stop resolving even while GitHub Pages itself returns HTTP 200. Restore the same project and verify its existing data, rather than creating a second project or replacing the inventory.

## Archived property conversion

These steps apply only when deliberately adding a locally archived listing. Current scraper listings normally link to their upstream source.

### Goal
Given a new `.webarchive` property page, produce a working local page:
- `properties/<slug>.html`
- `properties/<slug>_files/` (all required assets)

### Required Naming
- HTML: `properties/<slug>.html`
- Assets dir: `properties/<slug>_files/`
- Keep slug identical in both names.

### Conversion Workflow
1. Add files
- Place converted HTML in `properties/<slug>.html`.
- Place extracted assets in `properties/<slug>_files/`.

2. Rewrite SUUMO asset refs to local
- Rewrite `href`/`src` when path starts with:
  - `krcommon/`
  - `jjcommon/`
  - `assets/suumo/`
  - `/library/`
  - `/jj/<target>`
  - `https://suumo.jp/<target>`
- Map to local: `<slug>_files/<basename>`.
- Remove query strings.

Examples:
- `krcommon/css/common.css?1661472838000` -> `<slug>_files/common.css`
- `/jj/jjcommon/js/dropdown.js` -> `<slug>_files/dropdown.js`
- `https://suumo.jp/library/js/library.js?20260218` -> `<slug>_files/library.js`

3. Keep external links unless required locally
- Do not rewrite generic external links (fonts/CDNs/content links).
- If external tracker/optimizer scripts break page behavior, remove them.

4. Ensure core local JS/CSS exists and is referenced
- Typical required locals: `jquery.js`, `library.js`, `library3.js`, `style.css`.
- If page references local fallback assets (example: `close_panel_btn.gif`, `suumobook.png`), ensure those files exist.

### Validation
Check unresolved SUUMO-style asset prefixes:
```bash
rg -n '(href|src)="(?:https?://suumo\.jp)?/?(?:jj/)?(?:krcommon/|jjcommon/|assets/suumo/|library/)' properties/*.html
```

Check local `_files` references exist on disk:
```bash
cd properties
for html in *.html; do
  base="${html%.html}"
  pref="${base}_files/"
  refs=$(rg -o "${pref}[^\"' )>]+" "$html" | sed "s#^${pref}##" | sort -u)
  while IFS= read -r f; do
    [ -z "$f" ] && continue
    [ -e "${pref}$f" ] || echo "$html :: MISSING :: $f"
  done <<< "$refs"
done
```

Spot-check for likely runtime breakers:
```bash
rg -n 'library8|libraryg|_files/jsapi"|\$ is not defined|visualwebsiteoptimizer|log\.suumo\.jp' properties/*.html
```

### Optional Runtime Translation
Use only if English rendering is needed for review.
- Inject an `auto-en-translate` script in each property HTML.
- Script should set `googtrans=/ja/en` and load Google Translate element JS.
- This is runtime translation, not permanent rewritten English HTML.
