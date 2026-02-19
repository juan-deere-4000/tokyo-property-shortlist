# Tokyo Shortlist: LLM Ingestion Guide

Live site: https://juan-deere-4000.github.io/tokyo-property-shortlist/

## Local Server (Quick Start)
Use this exact setup when previewing local changes.

1. Start server from repo root:
```bash
cd /Users/joe/projects/tokyo-shortlist
/usr/bin/python3 -m http.server 8020 --bind 127.0.0.1
```

2. Open in browser:
- `http://127.0.0.1:8020/`

3. Verify with curl (from a second terminal):
```bash
curl -sS -I http://127.0.0.1:8020/ | head -n 8
curl -sS -I http://127.0.0.1:8020/styles/base.css | head -n 8
curl -sS -I http://127.0.0.1:8020/js/app/bootstrap.js | head -n 8
```

Expected result: all three return `HTTP/1.0 200 OK`.

4. Stop server:
- `Ctrl+C` in the terminal running `http.server`.

## Goal
Given a new `.webarchive` property page, produce a working local page:
- `properties/<slug>.html`
- `properties/<slug>_files/` (all required assets)

## Required Naming
- HTML: `properties/<slug>.html`
- Assets dir: `properties/<slug>_files/`
- Keep slug identical in both names.

## Conversion Workflow (New Property)
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

## Validation (Run Every Time)
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

## Optional: Runtime English Translation
Use only if English rendering is needed for review.
- Inject an `auto-en-translate` script in each property HTML.
- Script should set `googtrans=/ja/en` and load Google Translate element JS.
- This is runtime translation, not permanent rewritten English HTML.

## Data Model Note
Published cards are now sourced from Supabase `properties` where `status='published'`.
Primary sort metric remains:
- `door_to_door_min = walk_min + transit_min`

## Shared Notes Setup

Goal: notes entered on one device are visible to all visitors.
Stars are also shared across devices.
Ratings are shared across devices.

1. Create DB objects in Supabase:
- Open Supabase SQL Editor.
- Run: `supabase/setup_notes.sql`

2. Configure frontend keys:
- Copy `notes-config.example.js` to `notes-config.js` (already included with placeholders).
- Fill:
  - `supabaseUrl`
  - `supabaseAnonKey`
  - keep `table: 'property_notes'`
  - keep `starTable: 'property_flags'`
  - keep `ratingTable: 'property_ratings'`

3. Deploy:
- Commit and push `notes-config.js` + `index.html`.
- GitHub Pages will serve notes UI automatically.

Notes behavior:
- Notes UI is collapsed by default.
- If a property already has a note, its notes panel auto-expands.
- Star state is shared via Supabase (`property_flags`).
- Ratings state is shared via Supabase (`property_ratings`).
- Supabase config is required.

## Juan: Adding New Sources Safely

When adding a property from a new upstream source (example: `higherground`), do this in order:

1. Check source constraint first
- If `properties.source` does not allow the new value, add a migration in:
  - `supabase/migrations/<timestamp>_add_<source>_source.sql`
- Example pattern:
```sql
ALTER TABLE properties DROP CONSTRAINT IF EXISTS properties_source_check;
ALTER TABLE properties ADD CONSTRAINT properties_source_check CHECK (source IN ('suumo', 'yahoo', 'higherground'));
```

2. Apply migration before inserting rows
- Run `supabase db push --linked`.
- Confirm migration is applied before any insert.

3. Insert with the true source value
- Use the real source in `properties.source` (example: `higherground`).
- Do not use `source='suumo'` as a workaround.

4. If a workaround row was already inserted, fix it immediately
- Update the row to the correct source value (do not leave hacks in DB).

5. Publish workflow remains the same
- Only rows with `status='published'` render on the site.
