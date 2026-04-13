create extension if not exists pgcrypto;

create table if not exists public.profiles (
  user_id text primary key,
  name text not null,
  email text not null unique,
  avatar_url text,
  default_timezone text not null default 'Asia/Manila',
  school_name text,
  program text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.internship_terms (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public.profiles(user_id) on delete cascade,
  company text not null,
  supervisor text not null,
  role_title text not null,
  start_date date not null,
  end_date date not null,
  target_hours integer not null default 300,
  report_title text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists internship_terms_user_id_idx on public.internship_terms(user_id);

create table if not exists public.work_days (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public.profiles(user_id) on delete cascade,
  work_date date not null,
  time_in_local text,
  time_out_local text,
  timezone text not null default 'Asia/Manila',
  total_minutes integer not null default 0,
  dtr_narrative_document_id text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique(user_id, work_date)
);

create index if not exists work_days_user_id_work_date_idx on public.work_days(user_id, work_date);

create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public.profiles(user_id) on delete cascade,
  work_day_id uuid not null references public.work_days(id) on delete cascade,
  title text not null,
  content_md text not null,
  source_type text not null default 'text',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists journal_entries_user_id_created_at_idx on public.journal_entries(user_id, created_at desc);
create index if not exists journal_entries_work_day_id_idx on public.journal_entries(work_day_id);
