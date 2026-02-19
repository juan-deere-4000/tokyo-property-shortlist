do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'properties'
      and policyname = 'properties_update_published_anon'
  ) then
    create policy properties_update_published_anon
      on public.properties
      for update
      to anon
      using (status = 'published')
      with check (status = 'published');
  end if;
end
$$;
