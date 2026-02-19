-- Shared notes table for static site clients.
-- Run in Supabase SQL editor.

create table if not exists public.property_notes (
  property_slug text primary key,
  body text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.property_flags (
  property_slug text primary key,
  starred boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists public.property_ratings (
  property_slug text not null,
  rater text not null,
  metric text not null,
  score numeric(3,1) not null check (score >= 0 and score <= 10),
  updated_at timestamptz not null default now(),
  primary key (property_slug, rater, metric)
);

create table if not exists public.property_vetoes (
  property_slug text not null,
  rater text not null,
  vetoed boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (property_slug, rater)
);

create table if not exists public.property_notes_by_author (
  property_slug text not null,
  author text not null,
  body text not null default '',
  updated_at timestamptz not null default now(),
  primary key (property_slug, author)
);

do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'property_status'
  ) then
    create type public.property_status as enum (
      'intake',
      'filtered',
      'presented',
      'approved',
      'rejected',
      'published'
    );
  end if;
end$$;

create table if not exists public.properties (
  id bigserial primary key,
  external_id text not null unique,
  source text not null check (source in ('suumo', 'yahoo')),
  source_listing_id text not null,
  source_url text not null,
  title_ja text not null default '',
  title_en text not null default '',
  ward text,
  layout text,
  sqm numeric(8,2),
  price_m numeric(10,2),
  walk_min integer,
  train_min integer,
  total_transit_min integer,
  status public.property_status not null default 'intake',
  presented_at timestamptz,
  approved_at timestamptz,
  rejected_at timestamptz,
  published_at timestamptz,
  rejection_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.property_notes enable row level security;
alter table public.property_flags enable row level security;
alter table public.property_ratings enable row level security;
alter table public.property_vetoes enable row level security;
alter table public.property_notes_by_author enable row level security;
alter table public.properties enable row level security;

-- Read/write from anonymous clients (public site).
-- This is intentionally open for simplicity.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'property_notes'
      and policyname = 'property_notes_select_anon'
  ) then
    create policy property_notes_select_anon
      on public.property_notes
      for select
      to anon
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'property_notes'
      and policyname = 'property_notes_insert_anon'
  ) then
    create policy property_notes_insert_anon
      on public.property_notes
      for insert
      to anon
      with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'property_notes'
      and policyname = 'property_notes_update_anon'
  ) then
    create policy property_notes_update_anon
      on public.property_notes
      for update
      to anon
      using (true)
      with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'property_notes'
      and policyname = 'property_notes_delete_anon'
  ) then
    create policy property_notes_delete_anon
      on public.property_notes
      for delete
      to anon
      using (true);
  end if;
end$$;

-- Shared starred flags table policies.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'property_flags'
      and policyname = 'property_flags_select_anon'
  ) then
    create policy property_flags_select_anon
      on public.property_flags
      for select
      to anon
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'property_flags'
      and policyname = 'property_flags_insert_anon'
  ) then
    create policy property_flags_insert_anon
      on public.property_flags
      for insert
      to anon
      with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'property_flags'
      and policyname = 'property_flags_update_anon'
  ) then
    create policy property_flags_update_anon
      on public.property_flags
      for update
      to anon
      using (true)
      with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'property_flags'
      and policyname = 'property_flags_delete_anon'
  ) then
    create policy property_flags_delete_anon
      on public.property_flags
      for delete
      to anon
      using (true);
  end if;
end$$;

-- Shared ratings table policies.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'property_ratings'
      and policyname = 'property_ratings_select_anon'
  ) then
    create policy property_ratings_select_anon
      on public.property_ratings
      for select
      to anon
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'property_ratings'
      and policyname = 'property_ratings_insert_anon'
  ) then
    create policy property_ratings_insert_anon
      on public.property_ratings
      for insert
      to anon
      with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'property_ratings'
      and policyname = 'property_ratings_update_anon'
  ) then
    create policy property_ratings_update_anon
      on public.property_ratings
      for update
      to anon
      using (true)
      with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'property_ratings'
      and policyname = 'property_ratings_delete_anon'
  ) then
    create policy property_ratings_delete_anon
      on public.property_ratings
      for delete
      to anon
      using (true);
  end if;
end$$;

-- Shared veto table policies.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'property_vetoes'
      and policyname = 'property_vetoes_select_anon'
  ) then
    create policy property_vetoes_select_anon
      on public.property_vetoes
      for select
      to anon
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'property_vetoes'
      and policyname = 'property_vetoes_insert_anon'
  ) then
    create policy property_vetoes_insert_anon
      on public.property_vetoes
      for insert
      to anon
      with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'property_vetoes'
      and policyname = 'property_vetoes_update_anon'
  ) then
    create policy property_vetoes_update_anon
      on public.property_vetoes
      for update
      to anon
      using (true)
      with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'property_vetoes'
      and policyname = 'property_vetoes_delete_anon'
  ) then
    create policy property_vetoes_delete_anon
      on public.property_vetoes
      for delete
      to anon
      using (true);
  end if;
end$$;

-- Shared per-author notes table policies.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'property_notes_by_author'
      and policyname = 'property_notes_by_author_select_anon'
  ) then
    create policy property_notes_by_author_select_anon
      on public.property_notes_by_author
      for select
      to anon
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'property_notes_by_author'
      and policyname = 'property_notes_by_author_insert_anon'
  ) then
    create policy property_notes_by_author_insert_anon
      on public.property_notes_by_author
      for insert
      to anon
      with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'property_notes_by_author'
      and policyname = 'property_notes_by_author_update_anon'
  ) then
    create policy property_notes_by_author_update_anon
      on public.property_notes_by_author
      for update
      to anon
      using (true)
      with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'property_notes_by_author'
      and policyname = 'property_notes_by_author_delete_anon'
  ) then
    create policy property_notes_by_author_delete_anon
      on public.property_notes_by_author
      for delete
      to anon
      using (true);
  end if;
end$$;

-- Published properties are readable by anonymous clients.
do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'properties'
      and policyname = 'properties_select_published_anon'
  ) then
    create policy properties_select_published_anon
      on public.properties
      for select
      to anon
      using (status = 'published');
  end if;
end$$;

-- Helpful index for recency checks.
create index if not exists property_notes_updated_at_idx
  on public.property_notes (updated_at desc);
create index if not exists property_flags_updated_at_idx
  on public.property_flags (updated_at desc);
create index if not exists property_ratings_updated_at_idx
  on public.property_ratings (updated_at desc);
create index if not exists property_ratings_slug_idx
  on public.property_ratings (property_slug);
create index if not exists property_vetoes_updated_at_idx
  on public.property_vetoes (updated_at desc);
create index if not exists property_vetoes_slug_idx
  on public.property_vetoes (property_slug);
create index if not exists property_notes_by_author_updated_at_idx
  on public.property_notes_by_author (updated_at desc);
create index if not exists property_notes_by_author_slug_idx
  on public.property_notes_by_author (property_slug);
create index if not exists properties_status_idx
  on public.properties (status);
create index if not exists properties_updated_at_idx
  on public.properties (updated_at desc);
create index if not exists properties_total_transit_idx
  on public.properties (total_transit_min);
create index if not exists properties_price_idx
  on public.properties (price_m);
create index if not exists properties_external_id_idx
  on public.properties (external_id);
