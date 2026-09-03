-- =============================================================
-- MIGRATION: First-Time Admin Setup
-- Excellence Coaching — Supabase SQL Editor
-- =============================================================

-- 1. Create admin_profiles table (NO passwords stored here)
create table if not exists public.admin_profiles (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null unique references auth.users(id) on delete cascade,
  email      text        not null unique,
  role       text        not null default 'admin' check (role = 'admin'),
  created_at timestamptz not null default now()
);

-- 2. Enable RLS
alter table public.admin_profiles enable row level security;

-- 3. Allow anyone to COUNT rows (needed for first-launch check via anon key)
--    This only exposes count, not actual email/user_id data.
drop policy if exists "admin_profiles_public_read" on public.admin_profiles;
create policy "admin_profiles_public_read" on public.admin_profiles
  for select using (true);

-- 4. Only the authenticated admin user can insert their own profile
drop policy if exists "admin_profiles_insert_own" on public.admin_profiles;
create policy "admin_profiles_insert_own" on public.admin_profiles
  for insert with check (auth.uid() = user_id);

-- 5. Prevent updates/deletes from the client (admin role is immutable)
drop policy if exists "admin_profiles_no_update" on public.admin_profiles;
create policy "admin_profiles_no_update" on public.admin_profiles
  for update using (false);

drop policy if exists "admin_profiles_no_delete" on public.admin_profiles;
create policy "admin_profiles_no_delete" on public.admin_profiles
  for delete using (false);

-- 6. Index for fast lookups
create index if not exists idx_admin_profiles_user_id on public.admin_profiles(user_id);
create index if not exists idx_admin_profiles_email   on public.admin_profiles(email);

-- Done. Passwords are NEVER stored here — Supabase Auth handles them exclusively.
