begin;

drop policy if exists properties_update_published_anon on public.properties;

-- Keep RPC execute only for anon; no generic table updates from anon.
revoke all on function public.update_published_property(
  text, text, text, numeric, integer, integer, text, numeric, text, text, text, text, text
) from public;

grant execute on function public.update_published_property(
  text, text, text, numeric, integer, integer, text, numeric, text, text, text, text, text
) to anon;

commit;
