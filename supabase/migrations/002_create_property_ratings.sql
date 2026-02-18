-- Create property_ratings table for shared ratings
create table if not exists public.property_ratings (
  property_slug text not null,
  rater text not null,
  metric text not null,
  score numeric(3,1) not null check (score >= 0 and score <= 10),
  updated_at timestamptz not null default now(),
  primary key (property_slug, rater, metric)
);

alter table public.property_ratings enable row level security;

-- RLS policies for property_ratings
create policy property_ratings_select_anon on public.property_ratings for select to anon using (true);
create policy property_ratings_insert_anon on public.property_ratings for insert to anon with check (true);
create policy property_ratings_update_anon on public.property_ratings for update to anon using (true) with check (true);
create policy property_ratings_delete_anon on public.property_ratings for delete to anon using (true);

create index if not exists property_ratings_updated_at_idx on public.property_ratings (updated_at desc);
