-- =============================================================
-- TODAY'S MIGRATION (2026-09-02)
-- Excellence Coaching — Custom Student ID & Password by Admin
-- Run this in: Supabase Dashboard → SQL Editor
-- =============================================================

-- 1. Ensure 'password' column exists (in case it was missing)
alter table public.students
  add column if not exists password text not null default 'pass123';

-- 2. Remove the hardcoded default so admin MUST provide a password
--    (the app now always sends one; no fallback needed at DB level)
alter table public.students
  alter column password drop default;

-- 3. Ensure 'id' column is TEXT (not serial/uuid) so custom IDs work
--    (No change needed if already TEXT — this is just a safety check comment)
--    Your students.id should already be: id text primary key

-- Done. Students can now be created with admin-assigned IDs (e.g. C8001, S8001)
-- and admin-assigned passwords — both visible in the admin panel.
