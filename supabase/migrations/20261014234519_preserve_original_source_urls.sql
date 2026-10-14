-- Preserve original source URLs; translation belongs to the derived-link trigger.
begin;

CREATE OR REPLACE FUNCTION public.upsert_property_from_source(p_payload jsonb)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_source text;
  v_source_listing_id text;
  v_external_id text;
  v_status property_status;
  v_walk_min integer;
  v_train_min integer;
  v_total_transit_min integer;
  v_title_en text;
  v_title_ja text;
  v_source_url text;
  v_station_line text;
begin
  v_source := nullif(trim(coalesce(p_payload->>'source', '')), '');
  v_source_listing_id := nullif(trim(coalesce(p_payload->>'source_listing_id', '')), '');
  v_source_url := nullif(trim(coalesce(p_payload->>'source_url', '')), '');
  v_title_en := coalesce(trim(coalesce(p_payload->>'title_en', '')), '');
  v_title_ja := coalesce(trim(coalesce(p_payload->>'title_ja', '')), '');
  v_station_line := nullif(trim(coalesce(p_payload->>'station_line', '')), '');

  if v_source is null then
    raise exception 'source is required';
  end if;
  if v_source_listing_id is null then
    raise exception 'source_listing_id is required';
  end if;
  if v_source_url is null then
    raise exception 'source_url is required';
  end if;
  if v_title_en = '' then
    raise exception 'title_en is required';
  end if;

  if p_payload ? 'status' then
    v_status := (p_payload->>'status')::property_status;
  else
    v_status := 'published'::property_status;
  end if;

  v_external_id := nullif(trim(coalesce(p_payload->>'external_id', '')), '');
  if v_external_id is null then
    v_external_id := v_source || ':' || v_source_listing_id;
  end if;

  v_walk_min := nullif(trim(coalesce(p_payload->>'walk_min', '')), '')::integer;
  v_train_min := nullif(trim(coalesce(p_payload->>'train_min', '')), '')::integer;
  v_total_transit_min := nullif(trim(coalesce(p_payload->>'total_transit_min', '')), '')::integer;
  if v_total_transit_min is null and v_walk_min is not null and v_train_min is not null then
    v_total_transit_min := v_walk_min + v_train_min;
  end if;

  if v_station_line is not null and v_station_line !~* 'line$' then
    v_station_line := v_station_line || ' Line';
  end if;

  insert into public.properties (
    external_id,
    source,
    source_listing_id,
    source_url,
    title_ja,
    title_en,
    ward,
    layout,
    sqm,
    price_m,
    walk_min,
    train_min,
    total_transit_min,
    station_name,
    station_line,
    display_date,
    status,
    presented_at,
    approved_at,
    rejected_at,
    published_at,
    rejection_reason,
    updated_at
  )
  values (
    v_external_id,
    v_source,
    v_source_listing_id,
    v_source_url,
    v_title_ja,
    v_title_en,
    nullif(trim(coalesce(p_payload->>'ward', '')), ''),
    nullif(trim(coalesce(p_payload->>'layout', '')), ''),
    nullif(trim(coalesce(p_payload->>'sqm', '')), '')::numeric,
    nullif(trim(coalesce(p_payload->>'price_m', '')), '')::numeric,
    v_walk_min,
    v_train_min,
    v_total_transit_min,
    nullif(trim(coalesce(p_payload->>'station_name', '')), ''),
    v_station_line,
    nullif(trim(coalesce(p_payload->>'display_date', '')), ''),
    v_status,
    nullif(trim(coalesce(p_payload->>'presented_at', '')), '')::timestamptz,
    nullif(trim(coalesce(p_payload->>'approved_at', '')), '')::timestamptz,
    nullif(trim(coalesce(p_payload->>'rejected_at', '')), '')::timestamptz,
    case
      when v_status = 'published'::property_status
      then coalesce(nullif(trim(coalesce(p_payload->>'published_at', '')), '')::timestamptz, now())
      else nullif(trim(coalesce(p_payload->>'published_at', '')), '')::timestamptz
    end,
    nullif(trim(coalesce(p_payload->>'rejection_reason', '')), ''),
    now()
  )
  on conflict (external_id) do update set
    source = excluded.source,
    source_listing_id = excluded.source_listing_id,
    source_url = excluded.source_url,
    title_ja = excluded.title_ja,
    title_en = excluded.title_en,
    ward = excluded.ward,
    layout = excluded.layout,
    sqm = excluded.sqm,
    price_m = excluded.price_m,
    walk_min = excluded.walk_min,
    train_min = excluded.train_min,
    total_transit_min = excluded.total_transit_min,
    station_name = excluded.station_name,
    station_line = excluded.station_line,
    display_date = excluded.display_date,
    status = excluded.status,
    presented_at = excluded.presented_at,
    approved_at = excluded.approved_at,
    rejected_at = excluded.rejected_at,
    published_at = case
      when excluded.status = 'published'::property_status
      then coalesce(public.properties.published_at, excluded.published_at, now())
      else excluded.published_at
    end,
    rejection_reason = excluded.rejection_reason,
    updated_at = now()
  where not coalesce((p_payload->>'ingest_if_new')::boolean, false);

  return v_external_id;
end
$function$
;

revoke all on function public.upsert_property_from_source(jsonb) from public, anon, authenticated;
grant execute on function public.upsert_property_from_source(jsonb) to service_role;
commit;
