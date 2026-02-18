-- Shared notes table for static site clients.
-- Run in Supabase SQL editor.

create table if not exists public.property_notes (
  property_slug text primary key,
  body text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.property_notes enable row level security;

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

-- Helpful index for recency checks.
create index if not exists property_notes_updated_at_idx
  on public.property_notes (updated_at desc);
