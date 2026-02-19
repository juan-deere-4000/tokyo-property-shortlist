begin;

alter table public.properties
  add column if not exists station_name text,
  add column if not exists station_line text,
  add column if not exists display_date text;

create temp table _station_patch (
  source text not null,
  listing_id text not null,
  station_name text not null,
  station_line text not null,
  display_date text not null,
  primary key (source, listing_id)
) on commit drop;

insert into _station_patch (source, listing_id, station_name, station_line, display_date) values
  ('suumo', '78109773', 'Yotsuya Sanchome Station', 'Tokyo Metro Marunouchi', 'Feb 17'),
  ('suumo', '78258114', 'Monzen-Nakacho Station', 'Toei Oedo', 'Feb 17'),
  ('suumo', '78616622', 'Korakuen Station', 'Tokyo Metro Marunouchi', 'Feb 17'),
  ('yahoo', '0024085388', 'Kikukawa Station', 'Toei Shinjuku', 'Feb 18'),
  ('suumo', '79060154', 'Gokokuji Station', 'Tokyo Metro Yurakucho', 'Feb 17'),
  ('suumo', '79031765', 'Tabata Station', 'JR Yamanote Line', 'Feb 17'),
  ('suumo', '78515092', 'Nakano-Sakaue Station', 'Tokyo Metro Marunouchi', 'Feb 17'),
  ('suumo', '20143678', 'Gokokuji Station', 'Tokyo Metro Yurakucho', 'Feb 17'),
  ('suumo', '78243269', 'Edogawabashi Station', 'Tokyo Metro Yurakucho', 'Feb 17'),
  ('suumo', '79112310', 'Nippori Station', 'JR Yamanote', 'Feb 17'),
  ('suumo', '20050927', 'Kameido Station', 'JR Sobu', 'Feb 18'),
  ('suumo', '20189225', 'Ojima Station', 'Toei Shinjuku', 'Feb 18'),
  ('suumo', '20035299', 'Shiinamachi Station', 'Seibu Ikebukuro', 'Feb 18');

update public.properties p
set
  station_name = s.station_name,
  station_line = s.station_line,
  display_date = s.display_date,
  updated_at = now()
from _station_patch s
where p.source = s.source
  and (
    p.source_listing_id = s.listing_id
    or p.source_url ilike ('%' || s.listing_id || '%')
  );

commit;
