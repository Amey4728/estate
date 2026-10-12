-- Leads dashboard access  (the page at /#/dashboard)
-- ---------------------------------------------------------------------------
-- The website's publishable key can only INSERT enquiries. This file lets one
-- signed-in person — the super admin — read them and tick them off as handled.
-- There are no other staff accounts and no way to add one.
--
-- 1. Supabase → Authentication → Users → Add user. Give it an email and a
--    password, and tick "Auto Confirm User".
-- 2. Put that email in the block at the bottom of this file.
-- 3. Run the whole file in the SQL editor. It is safe to re-run, and must be
--    re-run after supabase-schema.sql (which drops the tables and with them
--    the policies below).

-- ------------------------------------------------------------------- admins
-- Signing in is not enough on its own: if sign-ups are open on the project,
-- anyone can create an account. Only the user recorded here gets to see leads.
create table if not exists public.admins (
  user_id  uuid primary key references auth.users (id) on delete cascade,
  added_at timestamptz not null default now()
);

-- One super admin, enforced by the database: every row indexes to the same
-- value, so a second row can never be inserted.
create unique index if not exists admins_only_one on public.admins ((true));

-- RLS on with no policies: the table is unreachable through the API. The
-- function below is the only way to consult it.
alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;

revoke execute on function public.is_admin() from public, anon;
grant  execute on function public.is_admin() to authenticated;

-- ---------------------------------------------------------------- enquiries
drop policy if exists "admins can read enquiries" on public.enquiries;
create policy "admins can read enquiries"
  on public.enquiries for select to authenticated using (public.is_admin());

drop policy if exists "admins can update enquiries" on public.enquiries;
create policy "admins can update enquiries"
  on public.enquiries for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- The dashboard only ever flips the "handled" flag, so that is the only column
-- it may write. A lead's own details stay exactly as the visitor sent them.
revoke update on public.enquiries from authenticated;
grant  select on public.enquiries to authenticated;
grant  update (handled) on public.enquiries to authenticated;

-- --------------------------------------------------------------- properties
-- enquiries_inbox joins to properties for the listing title. The existing read
-- policy is for anon only, so admins need one of their own.
drop policy if exists "admins can read properties" on public.properties;
create policy "admins can read properties"
  on public.properties for select to authenticated using (public.is_admin());

grant select on public.properties      to authenticated;
grant select on public.enquiries_inbox to authenticated;

-- ---------------------------------------------------------- the super admin
-- Change the email to the user you created in step 1. Running this again with
-- a different email hands the dashboard over to that user: the previous admin
-- is removed in the same step, so there is only ever one.
do $$
declare
  admin_email constant text := 'mitu@admin.com';
  uid uuid;
begin
  select id into uid from auth.users where email = admin_email;
  if uid is null then
    raise exception 'No user with email % — create it under Authentication → Users first.', admin_email;
  end if;
  delete from public.admins where user_id <> uid;
  insert into public.admins (user_id) values (uid) on conflict do nothing;
end $$;
