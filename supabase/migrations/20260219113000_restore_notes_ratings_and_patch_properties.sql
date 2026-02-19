-- Restore legacy collaboration data after slug key migration and patch
-- published property metadata from shortlist truth data.

begin;

create temp table _slug_source_map (
  old_slug text primary key,
  source text not null,
  listing_id text not null
) on commit drop;

insert into _slug_source_map (old_slug, source, listing_id) values
  ('yotsuya-high-corp', 'suumo', '78109773'),
  ('nakamachi-corp', 'suumo', '78258114'),
  ('kasuga-town-home', 'suumo', '78616622'),
  ('heitsu-otowa', 'suumo', '79060154'),
  ('tabata-mansion', 'suumo', '79031765'),
  ('oedo-corp', 'suumo', '78515092'),
  ('hasegawa-heights', 'suumo', '20143678'),
  ('palm-house-bunkyo', 'suumo', '78243269'),
  ('kikugawa-royal-corp', 'yahoo', '0024085388'),
  ('palast-nippori', 'suumo', '79112310'),
  ('happy-heights-kameido', 'suumo', '20050927'),
  ('ojima-royal-mansion', 'suumo', '20189225'),
  ('koken-heights-mejiro', 'suumo', '20035299'),
  -- Legacy fallback slug that appeared when one card had no deterministic key.
  ('property-4', 'suumo', '20189225');

create temp table _slug_map (
  old_slug text primary key,
  new_slug text not null
) on commit drop;

insert into _slug_map (old_slug, new_slug)
select
  m.old_slug,
  replace(p.external_id, ':', '_') as new_slug
from _slug_source_map m
join public.properties p
  on p.source = m.source
 and (
   p.source_listing_id = m.listing_id
   or p.source_url ilike ('%' || m.listing_id || '%')
 );

-- property_notes
insert into public.property_notes (property_slug, body, updated_at)
select
  z.property_slug,
  z.body,
  z.updated_at
from (
  select
    coalesce(m.new_slug, n.property_slug) as property_slug,
    n.body,
    n.updated_at,
    row_number() over (
      partition by coalesce(m.new_slug, n.property_slug)
      order by n.updated_at desc
    ) as rn
  from public.property_notes n
  left join _slug_map m on m.old_slug = n.property_slug
) z
where z.rn = 1
on conflict (property_slug) do update set
  body = excluded.body,
  updated_at = greatest(public.property_notes.updated_at, excluded.updated_at);

delete from public.property_notes n
using _slug_map m
where n.property_slug = m.old_slug;

-- property_notes_by_author
insert into public.property_notes_by_author (property_slug, author, body, updated_at)
select
  z.property_slug,
  z.author,
  z.body,
  z.updated_at
from (
  select
    coalesce(m.new_slug, n.property_slug) as property_slug,
    n.author,
    n.body,
    n.updated_at,
    row_number() over (
      partition by coalesce(m.new_slug, n.property_slug), n.author
      order by n.updated_at desc
    ) as rn
  from public.property_notes_by_author n
  left join _slug_map m on m.old_slug = n.property_slug
) z
where z.rn = 1
on conflict (property_slug, author) do update set
  body = excluded.body,
  updated_at = greatest(public.property_notes_by_author.updated_at, excluded.updated_at);

delete from public.property_notes_by_author n
using _slug_map m
where n.property_slug = m.old_slug;

-- property_ratings
insert into public.property_ratings (property_slug, rater, metric, score, updated_at)
select
  z.property_slug,
  z.rater,
  z.metric,
  z.score,
  z.updated_at
from (
  select
    coalesce(m.new_slug, r.property_slug) as property_slug,
    r.rater,
    r.metric,
    r.score,
    r.updated_at,
    row_number() over (
      partition by coalesce(m.new_slug, r.property_slug), r.rater, r.metric
      order by r.updated_at desc
    ) as rn
  from public.property_ratings r
  left join _slug_map m on m.old_slug = r.property_slug
) z
where z.rn = 1
on conflict (property_slug, rater, metric) do update set
  score = excluded.score,
  updated_at = greatest(public.property_ratings.updated_at, excluded.updated_at);

delete from public.property_ratings r
using _slug_map m
where r.property_slug = m.old_slug;

-- property_vetoes
insert into public.property_vetoes (property_slug, rater, vetoed, updated_at)
select
  z.property_slug,
  z.rater,
  z.vetoed,
  z.updated_at
from (
  select
    coalesce(m.new_slug, v.property_slug) as property_slug,
    v.rater,
    v.vetoed,
    v.updated_at,
    row_number() over (
      partition by coalesce(m.new_slug, v.property_slug), v.rater
      order by v.updated_at desc
    ) as rn
  from public.property_vetoes v
  left join _slug_map m on m.old_slug = v.property_slug
) z
where z.rn = 1
on conflict (property_slug, rater) do update set
  vetoed = excluded.vetoed,
  updated_at = greatest(public.property_vetoes.updated_at, excluded.updated_at);

delete from public.property_vetoes v
using _slug_map m
where v.property_slug = m.old_slug;

-- property_flags
insert into public.property_flags (property_slug, starred, updated_at)
select
  z.property_slug,
  z.starred,
  z.updated_at
from (
  select
    coalesce(m.new_slug, f.property_slug) as property_slug,
    f.starred,
    f.updated_at,
    row_number() over (
      partition by coalesce(m.new_slug, f.property_slug)
      order by f.updated_at desc
    ) as rn
  from public.property_flags f
  left join _slug_map m on m.old_slug = f.property_slug
) z
where z.rn = 1
on conflict (property_slug) do update set
  starred = excluded.starred,
  updated_at = greatest(public.property_flags.updated_at, excluded.updated_at);

delete from public.property_flags f
using _slug_map m
where f.property_slug = m.old_slug;

create temp table _property_patch (
  source text not null,
  listing_id text not null,
  title_en text not null,
  title_ja text not null,
  source_url text not null,
  ward text not null,
  train_min integer,
  price_m numeric(10,2),
  layout text,
  sqm numeric(10,2),
  walk_min integer,
  primary key (source, listing_id)
) on commit drop;

insert into _property_patch (source, listing_id, title_en, title_ja, source_url, ward, train_min, price_m, layout, sqm, walk_min) values
  ('suumo', '78109773', 'Yotsuya High Corp', '四谷ハイコーパ', 'properties/yotsuya-high-corp.html', 'Shinjuku', 10, 29.98, '2DK', 41.68, 7),
  ('suumo', '78258114', 'Nakamachi Corp', '仲町コーポラス', 'properties/nakamachi-corp.html', 'Koto', 11, 26.20, '1LDK', 47.21, 7),
  ('suumo', '78616622', 'Kasuga Town Home', '春日タウンホーム', 'properties/kasuga-town-home.html', 'Bunkyo', 11, 24.80, '1LDK', 50.51, 8),
  ('yahoo', '0024085388', 'Kikukawa Royal Corp', '菊川ローザルコーポ', 'https://realestate.yahoo.co.jp/used/mansion/detail_corp/b0024085388/', 'Sumida', 15, 26.80, '1LDK', 40.16, 4),
  ('suumo', '79060154', 'Heitsu Otowa', 'ハイツ音羽', 'properties/heitsu-otowa.html', 'Bunkyo', 17, 29.99, '1LDK', 37.44, 3),
  ('suumo', '79031765', 'Tabata Mansion', '田端マンション', 'properties/tabata-mansion.html', 'Kita', 15, 29.80, '2LDK', 45.76, 5),
  ('suumo', '78515092', 'Oedo Corp', '大江戸コーパ', 'properties/oedo-corp.html', 'Nakano', 20, 29.80, '1LDK', 46.28, 1),
  ('suumo', '20143678', 'Hasegawa Heights', 'ハセガワハイツ', 'properties/hasegawa-heights.html', 'Bunkyo', 17, 27.80, '1LDK', 47.04, 4),
  ('suumo', '78243269', 'Palm House Bunkyo', 'パルムハウス文京', 'properties/palm-house-bunkyo.html', 'Bunkyo', 15, 31.80, '2DK', 47.43, 7),
  ('suumo', '79112310', 'Palast Nippori', 'パラスト日暮里', 'properties/palast-nippori.html', 'Arakawa', 12, 26.99, '1LDK', 44.70, 14),
  ('suumo', '20050927', 'Happy Heights Kameido', 'ハピーハイツ亀戸', 'properties/happy-heights-kameido.html', 'Koto', 25, 25.80, '2LDK', 46.18, 3),
  ('suumo', '20189225', 'Ojima Royal Mansion', '大島ロイヤルマンション', 'properties/ojima-royal-mansion.html', 'Koto', 24, 22.80, '1LDK', 40.01, 7),
  ('suumo', '20035299', 'Koken Heights Mejiro', '光建ハイツ目白', 'properties/koken-heights-mejiro.html', 'Toshima', 27, 27.50, '2DK', 49.77, 7);

update public.properties p
set
  title_en = pp.title_en,
  title_ja = pp.title_ja,
  source_url = pp.source_url,
  ward = pp.ward,
  train_min = pp.train_min,
  price_m = pp.price_m,
  layout = pp.layout,
  sqm = pp.sqm,
  walk_min = pp.walk_min,
  total_transit_min = case
    when pp.train_min is not null and pp.walk_min is not null then pp.train_min + pp.walk_min
    else p.total_transit_min
  end,
  updated_at = now()
from _property_patch pp
where p.source = pp.source
  and (
    p.source_listing_id = pp.listing_id
    or p.source_url ilike ('%' || pp.listing_id || '%')
  );

commit;
