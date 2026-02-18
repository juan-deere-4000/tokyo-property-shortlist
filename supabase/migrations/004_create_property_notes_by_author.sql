create table if not exists public.property_notes_by_author (
  property_slug text not null,
  author text not null,
  body text not null default '',
  updated_at timestamptz not null default now(),
  primary key (property_slug, author)
);

alter table public.property_notes_by_author enable row level security;

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

create index if not exists property_notes_by_author_slug_idx
  on public.property_notes_by_author (property_slug);

create index if not exists property_notes_by_author_updated_at_idx
  on public.property_notes_by_author (updated_at desc);

-- Preserve existing notes by copying legacy single-note rows into Joe.
insert into public.property_notes_by_author (property_slug, author, body, updated_at)
select property_slug, 'Joe', body, updated_at
from public.property_notes
where coalesce(trim(body), '') <> ''
on conflict (property_slug, author) do update
set body = excluded.body,
    updated_at = excluded.updated_at
where coalesce(trim(public.property_notes_by_author.body), '') = '';
