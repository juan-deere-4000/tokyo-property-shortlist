-- Create property_flags table for starred properties
create table if not exists public.property_flags (
  property_slug text primary key,
  starred boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.property_flags enable row level security;

-- RLS policies for property_flags
create policy property_flags_select_anon on public.property_flags for select to anon using (true);
create policy property_flags_insert_anon on public.property_flags for insert to anon with check (true);
create policy property_flags_update_anon on public.property_flags for update to anon using (true) with check (true);
create policy property_flags_delete_anon on public.property_flags for delete to anon using (true);

-- Index
create index if not exists property_flags_updated_at_idx on public.property_flags (updated_at desc);
