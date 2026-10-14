-- The UI accepts hundredths; preserve them instead of rounding at persistence.
begin;
alter table public.property_ratings alter column score type numeric(4,2);
commit;
