-- Recovery audit: keep manually classified rows immutable to daily ingestion,
-- restrict ingestion to the server, and derive valid translated/local links.
begin;

-- The Homes source was previously mislabeled as Higherground to bypass an
-- outdated source constraint. Keep the existing external ID and annotations.
alter table public.properties drop constraint if exists properties_source_check;
alter table public.properties add constraint properties_source_check
  check (source in ('suumo', 'yahoo', 'higherground', 'homes'));

update public.properties
set source = 'homes'
where external_id = 'homes:b-1362120000417' and source = 'higherground';

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
  v_source_url_host text;
  v_source_url_path_query text;
  v_query_sep text;
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

  -- For higherground sources, store links using Google Translate wrapper so
  -- cards open pre-translated pages for English review.
  if v_source = 'higherground'
     and v_source_url ~* '^https?://([a-z0-9-]+\.)*higherground\.co\.jp([/?#].*)?$' then
    v_source_url_host := regexp_replace(v_source_url, '^https?://([^/?#]+).*$','\1', 'i');
    v_source_url_path_query := regexp_replace(v_source_url, '^https?://[^/?#]+', '', 'i');
    if v_source_url_path_query = '' then
      v_source_url_path_query := '/';
    end if;
    if position('_x_tr_sl=' in v_source_url_path_query) = 0 then
      if position('?' in v_source_url_path_query) > 0 then
        v_query_sep := '&';
      else
        v_query_sep := '?';
      end if;
      v_source_url_path_query := v_source_url_path_query ||
        v_query_sep || '_x_tr_sl=auto&_x_tr_tl=en&_x_tr_hl=en&_x_tr_pto=wapp';
    end if;
    v_source_url := 'https://' || replace(lower(v_source_url_host), '.', '-') || '.translate.goog' || v_source_url_path_query;
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

create or replace function public.property_translated_url(p_url text)
returns text
language plpgsql
immutable
strict
set search_path = public
as $url$
declare
  v_host text;
  v_path text;
  v_fragment text;
  v_base text;
begin
  if p_url ~ '^properties/[a-zA-Z0-9_./%-]+\.html([?#].*)?$' then
    return p_url;
  end if;
  if p_url !~* '^https?://[^/?#]+([/?#].*)?$' then
    return null;
  end if;
  v_host := lower(regexp_replace(p_url, '^https?://([^/?#]+).*$', '\1', 'i'));
  -- Leave image archives, existing Google Translate wrappers and other links
  -- intact. Only the supported Japanese listing sites need translation.
  if v_host not in ('suumo.jp', 'www.suumo.jp', 'realestate.yahoo.co.jp',
                    'higherground.co.jp', 'www.higherground.co.jp',
                    'homes.co.jp', 'www.homes.co.jp') then
    return p_url;
  end if;
  v_fragment := coalesce(substring(p_url from '#.*$'), '');
  v_base := split_part(p_url, '#', 1);
  v_path := regexp_replace(v_base, '^https?://[^/?#]+', '', 'i');
  if v_path = '' then v_path := '/'; end if;
  return 'https://' || replace(v_host, '.', '-') || '.translate.goog' || v_path ||
    case when position('?' in v_path) > 0 then '&' else '?' end ||
    '_x_tr_sl=auto&_x_tr_tl=en&_x_tr_hl=en&_x_tr_pto=wapp' || v_fragment;
end;
$url$;

create or replace function public.set_property_translated_url()
returns trigger
language plpgsql
set search_path = public
as $trigger$
begin
  new.source_url_translated := public.property_translated_url(new.source_url);
  return new;
end;
$trigger$;

create or replace trigger properties_translated_url
before insert or update of source_url, source_url_translated on public.properties
for each row execute function public.set_property_translated_url();

update public.properties
set source_url_translated = public.property_translated_url(source_url)
where source_url_translated is distinct from public.property_translated_url(source_url);

revoke all on function public.upsert_property_from_source(jsonb) from public, anon, authenticated;
grant execute on function public.upsert_property_from_source(jsonb) to service_role;

commit;
