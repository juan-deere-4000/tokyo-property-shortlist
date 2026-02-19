# Tokyo Property Pipeline Rebuild Plan v2 (Personal Tool)

## Principles
- Personal tool for friends, not enterprise software.
- Downtime is acceptable during migration.
- No fallback modes.
- No dead code.
- No legacy/parallel old patterns after cutover.
- One clear source of truth: Supabase.
- Prefer direct, minimal implementation over architecture ceremony.

## Desired End State
- Juan runs one daily cron as orchestration agent.
- Cron pulls fresh properties, applies filters, and stores pipeline state in Supabase.
- Juan presents new candidates to Joe on Telegram using property skill format.
- Joe approves/rejects in chat.
- On approval, Juan enriches details and publishes property via API.
- Website reads published properties from Supabase (not hardcoded `index.html` cards).
- Website collaboration features (notes, ratings, veto, stars) continue in Supabase.

## Current-State Findings (Audit Summary)

### 1) Data pipeline is CSV-driven
- `tokyo-properties/scraper/daily-scrape.js` writes:
  - `list1-intake.csv`
  - `list2-filtered.csv`
  - `list3-seen.csv`
  - `list4-shortlist.csv`
- Many fields remain `TBD` for SUUMO rows.
- `presented_to_user` state is encoded in CSV rows instead of proper event/state tables.

### 2) Cron orchestration is tied to CSV mutation
- OpenClaw cron job `daily-property-search` currently:
  - runs scraper
  - reads shortlist CSV
  - presents rows where `presented_to_user=false`
  - flips them to true in CSV
- This is brittle and can replay or desync state when rows are bulk modified.

### 3) Website inventory is hardcoded
- `tokyo-shortlist/index.html` still hardcodes property cards.
- Supabase is used only for collaboration metadata:
  - `property_notes`
  - `property_notes_by_author`
  - `property_flags`
  - `property_ratings`
  - `property_vetoes`
- No structured API for Juan to publish properties.

### 4) Existing code inconsistencies
- Scraper has stale/unused path (`scrapeWards` references Playwright import that is commented out).
- Title translation relies heavily on hardcoded map and generic fallback naming.
- README/docs still contain outdated statements in places.

## Target Architecture

### A) Supabase as system of record
Create one canonical lifecycle table:
- `properties`

Keep existing collaboration tables unchanged:
- `property_notes`
- `property_notes_by_author`
- `property_flags`
- `property_ratings`
- `property_vetoes`

### B) No Edge Functions in v1
- Juan and scraper use Supabase client directly.
- No direct SQL in normal workflow.
- Centralize writes in a small shared data-access module (single code path for status transitions).

### C) Website reads published properties from Supabase
- Property cards are rendered from `properties where status='published'`.
- Existing notes/ratings/veto/stars continue to work.
- Sort/hide preferences stay localStorage (already done).

## Canonical Property Model
Use one schema for both SUUMO and Yahoo rows:
- `external_id` (ex: `suumo:78109773`, `yahoo:b0024085388`)
- `source` (`suumo` or `yahoo`)
- `source_listing_id`
- `source_url`
- `title_ja`
- `title_en`
- `ward`
- `layout`
- `sqm`
- `price_m`
- `walk_min`
- `train_min`
- `total_transit_min`
- `status` (`intake|filtered|presented|approved|rejected|published`)
- `presented_at`
- `approved_at`
- `rejected_at`
- `published_at`
- `rejection_reason`
- `created_at`
- `updated_at`

## Lifecycle State Rules
1. Scraper inserts/upserts into `intake`.
2. Filter pass transitions to `filtered`.
3. Juan presents only `filtered` rows not yet presented; mark `presented`.
4. Joe approval transitions to `approved`; rejection transitions to `rejected`.
5. Enrichment pass fills missing fields for approved properties.
6. Publish action transitions to `published`; site shows only published.

## Authentication Model
- Website uses Supabase anon key for read access to published properties and existing collaboration features.
- Juan/scraper use Supabase service role key for pipeline writes.
- Preserve current working notes/ratings/veto/stars auth behavior.

## Open Decisions (Lock Before Build)
1. Backfill strategy:
- Option A: migrate existing hardcoded shortlist cards into `properties`.
- Option B: start fresh and archive old cards.
2. Enrichment scope for v1:
- Enrichment only fills canonical fields already defined in this plan.
- No extra schema expansion until v1 is stable.

## Implementation Phases (Simplified)

### Phase 1: Schema + Migration
- Backup current Supabase DB.
- Add `properties` table migration.
- Backfill existing data (or execute start-fresh decision).
- Keep existing collaboration tables untouched.

### Phase 2: Pipeline Cutover (Scraper + Juan)
- Update scraper to upsert into Supabase instead of list CSV lifecycle files.
- Keep scraper refactor minimal: only what is needed to fetch/normalize/filter/upsert.
- Update Juan cron to:
  - present only `status='filtered' and presented_at is null`
  - mark presented/approved/rejected/published via Supabase client writes
- Remove CSV lifecycle usage from orchestration path.

### Phase 3: Site Data Cutover
- Replace hardcoded property cards with fetch/render from Supabase published rows.
- Keep collaboration features on same tables.
- Validate sorting/filtering and mobile UI still behave as expected.
- Remove old hardcoded card inventory and obsolete pipeline docs/scripts.
- Ensure no dead code paths remain.

## Tailwind Migration Track (Isolated Rollback Branch)
This is intentionally separate to minimize blast radius.

### Branch strategy
- Create dedicated branch: `feat/tailwind-site-migration`.
- Scope strictly to UI styling/layout only.
- Do not include DB/API/cron changes in this branch.

### Constraints
- Must preserve existing behavior for:
  - notes
  - ratings
  - veto
  - stars
  - sort/hide
- No fallback styling systems.
- If migration gets messy, abort branch and keep current CSS.

### Merge gate
- Merge only after visual and behavior parity check.
- If parity fails, close branch (easy rollback by non-merge).

## Backup and Migration Policy
- Before schema cutover: take full DB dump.
- During migration: run one-time import into `properties` (or start fresh if chosen).
- Keep a dated archive of CSVs and current `index.html` for reference only.

## Juan Interaction Contract (Post-Rebuild)
Juan should only perform these lifecycle writes through the shared Supabase client module:
- intake upsert
- presented transition
- approved transition
- rejected transition
- published transition

Juan should never run direct SQL for normal property lifecycle operations.

## Acceptance Criteria
- New property can go from scrape to published site card without editing `index.html`.
- Juan can run full daily cycle from cron without touching CSV files.
- Approvals and publishing are explicit via status + timestamps on `properties`.
- Collaboration data remains intact and shared across devices.
- Old CSV-driven lifecycle path is removed.
