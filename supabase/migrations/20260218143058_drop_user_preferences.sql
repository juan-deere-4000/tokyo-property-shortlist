-- Drop user_preferences table (sort/hide now localStorage)
drop policy if exists user_preferences_select_anon on public.user_preferences;
drop policy if exists user_preferences_insert_anon on public.user_preferences;
drop policy if exists user_preferences_update_anon on public.user_preferences;
drop policy if exists user_preferences_delete_anon on public.user_preferences;
drop table if exists public.user_preferences;
