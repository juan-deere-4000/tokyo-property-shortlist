# Tokyo Shortlist: LLM Ingestion Guide

Live site: https://juan-deere-4000.github.io/tokyo-property-shortlist/

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
Primary sort metric:
- `door_to_door_min = walk_min + transit_min`
