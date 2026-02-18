create table if not exists public.property_vetoes (
  property_slug text not null,
  rater text not null,
  vetoed boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (property_slug, rater)
);

alter table public.property_vetoes enable row level security;

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

create index if not exists property_vetoes_slug_idx on public.property_vetoes (property_slug);

create table if not exists public.user_preferences (
  user_id text primary key,
  sort_key text not null default 'score',
  hide_unstarred boolean not null default false,
  hide_sold boolean not null default true,
  hide_vetoed boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.user_preferences enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'user_preferences'
      and policyname = 'user_preferences_select_anon'
  ) then
    create policy user_preferences_select_anon
      on public.user_preferences
      for select
      to anon
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'user_preferences'
      and policyname = 'user_preferences_insert_anon'
  ) then
    create policy user_preferences_insert_anon
      on public.user_preferences
      for insert
      to anon
      with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'user_preferences'
      and policyname = 'user_preferences_update_anon'
  ) then
    create policy user_preferences_update_anon
      on public.user_preferences
      for update
      to anon
      using (true)
      with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'user_preferences'
      and policyname = 'user_preferences_delete_anon'
  ) then
    create policy user_preferences_delete_anon
      on public.user_preferences
      for delete
      to anon
      using (true);
  end if;
end$$;

-- Add property_slug index to property_ratings if not exists
create index if not exists property_ratings_slug_idx on public.property_ratings (property_slug);
