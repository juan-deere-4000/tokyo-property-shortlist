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

alter table public.property_notes enable row level security;
alter table public.property_flags enable row level security;
alter table public.property_ratings enable row level security;

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

-- Helpful index for recency checks.
create index if not exists property_notes_updated_at_idx
  on public.property_notes (updated_at desc);
create index if not exists property_flags_updated_at_idx
  on public.property_flags (updated_at desc);
create index if not exists property_ratings_updated_at_idx
  on public.property_ratings (updated_at desc);
