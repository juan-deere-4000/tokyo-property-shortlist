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

alter table public.properties enable row level security;

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

create index if not exists properties_status_idx on public.properties (status);
create index if not exists properties_updated_at_idx on public.properties (updated_at desc);
create index if not exists properties_total_transit_idx on public.properties (total_transit_min);
create index if not exists properties_price_idx on public.properties (price_m);
create index if not exists properties_external_id_idx on public.properties (external_id);
