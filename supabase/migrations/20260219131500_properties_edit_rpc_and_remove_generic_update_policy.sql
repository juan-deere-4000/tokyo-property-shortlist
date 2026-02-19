begin;

-- Remove broad anon update access now that edits go through RPC.
drop policy if exists properties_update_published_anon on public.properties;

create or replace function public.update_published_property(
  p_external_id text,
  p_title_en text,
  p_title_ja text,
  p_price_m numeric,
  p_walk_min integer,
  p_train_min integer,
  p_layout text,
  p_sqm numeric,
  p_ward text,
  p_station_name text,
  p_station_line text,
  p_display_date text,
  p_source_url text
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_external_id text;
  v_total integer;
begin
  if p_walk_min is not null and p_train_min is not null then
    v_total := p_walk_min + p_train_min;
  else
    v_total := null;
  end if;

  update public.properties
  set
    title_en = coalesce(trim(p_title_en), ''),
    title_ja = coalesce(trim(p_title_ja), ''),
    price_m = p_price_m,
    walk_min = p_walk_min,
    train_min = p_train_min,
    total_transit_min = v_total,
    layout = coalesce(trim(p_layout), ''),
    sqm = p_sqm,
    ward = nullif(trim(p_ward), ''),
    station_name = coalesce(trim(p_station_name), ''),
    station_line = coalesce(trim(p_station_line), ''),
    display_date = coalesce(trim(p_display_date), ''),
    source_url = coalesce(trim(p_source_url), ''),
    updated_at = now()
  where external_id = p_external_id
    and status = 'published'
  returning external_id into v_external_id;

  if v_external_id is null then
    raise exception 'No published property matched external_id=%', p_external_id;
  end if;

  return v_external_id;
end
$$;

revoke all on function public.update_published_property(
  text, text, text, numeric, integer, integer, text, numeric, text, text, text, text, text
) from public;

grant execute on function public.update_published_property(
  text, text, text, numeric, integer, integer, text, numeric, text, text, text, text, text
) to anon;

commit;
