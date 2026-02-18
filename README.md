# Tokyo Shortlist (LLM-Compact)

Live site: https://juan-deere-4000.github.io/tokyo-property-shortlist/

## Scope

This repo stores the rendered shortlist site and raw property HTML captures under `properties/`.

## Data Model

Primary transit metric:
- `door_to_door_min = walk_min + transit_min`

Sort order target:
- ascending `door_to_door_min`

## Property HTML Conversion Rules

Goal: make each property HTML load from its local extracted assets.

For each `properties/<name>.html`:
- expected local assets folder: `properties/<name>_files/`
- special case allowed:
  - `nakamachi-corp.html` may use
    `[SUUMO] Nakamachi Corporas Used Apartment Property Information_files/`

### Rewrite Targets (only these)

Rewrite `href/src` paths when they start with:
- `krcommon/`
- `jjcommon/`
- `assets/suumo/`
- `/library/` (library pages)
- optional prefixed forms are also targets:
  - `/jj/<target>`
  - `https://suumo.jp/<target>`

### Rewrite Method

- Strip domain/prefix/querystring.
- Keep basename only.
- Map to local folder.

Examples:
- `krcommon/css/common.css?1661472838000` -> `oedo-corp_files/common.css`
- `/jj/jjcommon/js/dropdown.js` -> `oedo-corp_files/dropdown.js`
- `https://suumo.jp/library/js/library.js?20260218` -> `ojima-royal-mansion_files/library.js`

### Do NOT Rewrite

Keep external non-asset links as-is, e.g.:
- Google Fonts
- analytics/ads/tracking scripts
- other external CDNs

## Validation Commands

No remaining targeted raw asset prefixes:
```bash
rg -n '(href|src)="(?:https?://suumo\.jp)?/?(?:jj/)?(?:krcommon/|jjcommon/|assets/suumo/|library/)' properties/*.html
```

Show local `_files` references:
```bash
rg -n '(href|src)="[^\"]*_files/[^\"]+"' properties/*.html | head
```

Quick existence check for rewritten assets (sample):
```bash
for f in properties/*.html; do
  echo "--- $f"
  rg -o "[-_A-Za-z0-9\\[\\] .]+_files/[^\"' ]+" "$f" | head -n 10
done
```

## Current Target Set

- happy-heights-kameido.html
- hasegawa-heights.html
- heitsu-otowa.html
- kasuga-town-home.html
- koken-heights-mejiro.html
- nakamachi-corp.html
- oedo-corp.html
- ojima-royal-mansion.html
- palast-nippori.html
- palm-house-bunkyo.html
- tabata-mansion.html
- yotsuya-high-corp.html
