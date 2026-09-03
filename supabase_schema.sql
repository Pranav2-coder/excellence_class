-- =============================================================
-- Excellence Coaching — Supabase SQL Schema
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- =============================================================


-- ─────────────────────────────────────────────────────────────
-- 1.  STUDENTS TABLE
--     id       → custom text ID assigned by admin (e.g. C8001, S8001)
--     password → plain-text password assigned by admin (visible in admin panel)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.students (
  id          text        primary key,          -- custom ID set by admin  e.g. "C8001"
  name        text        not null,
  mobile      text        not null,
  course      text        not null,
  yearly_fee  numeric     not null default 0,
  password    text        not null default 'pass123',  -- visible to admin
  join_date   date        not null default current_date,
  created_at  timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- 2.  PAYMENTS TABLE
-- ─────────────────────────────────────────────────────────────
create table if not exists public.payments (
  id          text        primary key,           -- e.g. "P123456"
  student_id  text        not null references public.students(id) on delete cascade,
  amount      numeric     not null,
  date        date        not null default current_date,
  mode        text        not null default 'Cash',
  note        text        not null default '',
  created_at  timestamptz not null default now()
);

-- index for fast per-student payment lookups
create index if not exists idx_payments_student_id on public.payments(student_id);


-- =============================================================
-- 3.  ROW LEVEL SECURITY (RLS)
--     Enable RLS but allow full access via anon key (demo mode).
--     Replace with proper auth policies when you add Supabase Auth.
-- =============================================================
alter table public.students enable row level security;
alter table public.payments  enable row level security;

-- Allow all operations with the anon key (demo / no-auth mode)
drop policy if exists "allow_all_students" on public.students;
create policy "allow_all_students" on public.students
  for all using (true) with check (true);

drop policy if exists "allow_all_payments" on public.payments;
create policy "allow_all_payments" on public.payments
  for all using (true) with check (true);


-- =============================================================
-- 4.  OPTIONAL: SEED DEMO DATA
--     Uncomment & run if you want a quick starting data set.
-- =============================================================
/*
insert into public.students (id, name, mobile, course, yearly_fee, password, join_date) values
  ('C8001', 'Aarav Sharma',  '9876543210', 'JEE Foundation',   48000, 'aarav@8',  '2024-06-01'),
  ('S8001', 'Priya Patel',   '9823456789', 'NEET Preparation', 52000, 'priya@8',  '2024-06-10'),
  ('C9001', 'Rohan Mehta',   '9012345678', 'Class 12 PCM',     36000, 'rohan@9',  '2024-07-01'),
  ('S9001', 'Ananya Singh',  '9654321098', 'Class 10 Board',   28000, 'ananya@9', '2024-07-15')
on conflict (id) do nothing;

insert into public.payments (id, student_id, amount, date, mode, note) values
  ('P001', 'C8001', 16000, current_date - 90, 'UPI',           'Q1 Installment'),
  ('P002', 'C8001', 12000, current_date - 45, 'Cash',          'Q2 Installment'),
  ('P003', 'S8001', 20000, current_date - 80, 'Bank Transfer', 'Advance Payment'),
  ('P004', 'S8001', 15000, current_date - 30, 'UPI',           'Mid-Year')
on conflict (id) do nothing;
*/
