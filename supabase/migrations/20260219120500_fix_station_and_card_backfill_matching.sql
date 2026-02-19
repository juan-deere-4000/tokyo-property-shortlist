begin;

create temp table _full_patch (
  listing_id text primary key,
  title_en text not null,
  title_ja text not null,
  source_url text not null,
  ward text not null,
  walk_min integer not null,
  train_min integer not null,
  total_transit_min integer not null,
  price_m numeric(10,2) not null,
  layout text not null,
  sqm numeric(10,2) not null,
  station_name text not null,
  station_line text not null,
  display_date text not null
) on commit drop;

insert into _full_patch (
  listing_id, title_en, title_ja, source_url, ward,
  walk_min, train_min, total_transit_min,
  price_m, layout, sqm,
  station_name, station_line, display_date
) values
  ('78109773', 'Yotsuya High Corp', '四谷ハイコーパ', 'properties/yotsuya-high-corp.html', 'Shinjuku', 7, 10, 17, 29.98, '2DK', 41.68, 'Yotsuya Sanchome Station', 'Tokyo Metro Marunouchi', 'Feb 17'),
  ('78258114', 'Nakamachi Corp', '仲町コーポラス', 'properties/nakamachi-corp.html', 'Koto', 7, 11, 18, 26.20, '1LDK', 47.21, 'Monzen-Nakacho Station', 'Toei Oedo', 'Feb 17'),
  ('78616622', 'Kasuga Town Home', '春日タウンホーム', 'properties/kasuga-town-home.html', 'Bunkyo', 8, 11, 19, 24.80, '1LDK', 50.51, 'Korakuen Station', 'Tokyo Metro Marunouchi', 'Feb 17'),
  ('0024085388', 'Kikukawa Royal Corp', '菊川ローザルコーポ', 'https://realestate.yahoo.co.jp/used/mansion/detail_corp/b0024085388/', 'Sumida', 4, 15, 19, 26.80, '1LDK', 40.16, 'Kikukawa Station', 'Toei Shinjuku', 'Feb 18'),
  ('79060154', 'Heitsu Otowa', 'ハイツ音羽', 'properties/heitsu-otowa.html', 'Bunkyo', 3, 17, 20, 29.99, '1LDK', 37.44, 'Gokokuji Station', 'Tokyo Metro Yurakucho', 'Feb 17'),
  ('79031765', 'Tabata Mansion', '田端マンション', 'properties/tabata-mansion.html', 'Kita', 5, 15, 20, 29.80, '2LDK', 45.76, 'Tabata Station', 'JR Yamanote Line', 'Feb 17'),
  ('78515092', 'Oedo Corp', '大江戸コーパ', 'properties/oedo-corp.html', 'Nakano', 1, 20, 21, 29.80, '1LDK', 46.28, 'Nakano-Sakaue Station', 'Tokyo Metro Marunouchi', 'Feb 17'),
  ('20143678', 'Hasegawa Heights', 'ハセガワハイツ', 'properties/hasegawa-heights.html', 'Bunkyo', 4, 17, 21, 27.80, '1LDK', 47.04, 'Gokokuji Station', 'Tokyo Metro Yurakucho', 'Feb 17'),
  ('78243269', 'Palm House Bunkyo', 'パルムハウス文京', 'properties/palm-house-bunkyo.html', 'Bunkyo', 7, 15, 22, 31.80, '2DK', 47.43, 'Edogawabashi Station', 'Tokyo Metro Yurakucho', 'Feb 17'),
  ('79112310', 'Palast Nippori', 'パラスト日暮里', 'properties/palast-nippori.html', 'Arakawa', 14, 12, 26, 26.99, '1LDK', 44.70, 'Nippori Station', 'JR Yamanote', 'Feb 17'),
  ('20050927', 'Happy Heights Kameido', 'ハピーハイツ亀戸', 'properties/happy-heights-kameido.html', 'Koto', 3, 25, 28, 25.80, '2LDK', 46.18, 'Kameido Station', 'JR Sobu', 'Feb 18'),
  ('20189225', 'Ojima Royal Mansion', '大島ロイヤルマンション', 'properties/ojima-royal-mansion.html', 'Koto', 7, 24, 31, 22.80, '1LDK', 40.01, 'Ojima Station', 'Toei Shinjuku', 'Feb 18'),
  ('20035299', 'Koken Heights Mejiro', '光建ハイツ目白', 'properties/koken-heights-mejiro.html', 'Toshima', 7, 27, 34, 27.50, '2DK', 49.77, 'Shiinamachi Station', 'Seibu Ikebukuro', 'Feb 18');

update public.properties p
set
  title_en = fp.title_en,
  title_ja = fp.title_ja,
  source_url = fp.source_url,
  ward = fp.ward,
  walk_min = fp.walk_min,
  train_min = fp.train_min,
  total_transit_min = fp.total_transit_min,
  price_m = fp.price_m,
  layout = fp.layout,
  sqm = fp.sqm,
  station_name = fp.station_name,
  station_line = fp.station_line,
  display_date = fp.display_date,
  updated_at = now()
from _full_patch fp
where
  p.source_listing_id = fp.listing_id
  or p.external_id like ('%' || fp.listing_id)
  or p.source_url like ('%' || fp.listing_id || '%');

commit;
