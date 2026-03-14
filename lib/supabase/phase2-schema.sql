-- ============================================================
-- Phase 2 추가 테이블 — Supabase SQL Editor에 붙여넣기 후 실행
-- ============================================================

-- 즐겨찾기
create table if not exists favorites (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references profiles(id) on delete cascade,
  prompt_id  uuid not null references products(id) on delete cascade,
  created_at timestamptz default now(),
  unique (user_id, prompt_id)
);

create index if not exists idx_favorites_user_id   on favorites (user_id);
create index if not exists idx_favorites_prompt_id on favorites (prompt_id);

alter table favorites enable row level security;

create policy "favorites_own_read"
  on favorites for select using (auth.uid() = user_id);

create policy "favorites_own_insert"
  on favorites for insert with check (auth.uid() = user_id);

create policy "favorites_own_delete"
  on favorites for delete using (auth.uid() = user_id);


-- Playground 사용량 기록
create table if not exists playground_usage (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references profiles(id) on delete cascade,
  prompt_text  text,
  model_used   text,
  used_at      timestamptz default now()
);

create index if not exists idx_playground_usage_user_date
  on playground_usage (user_id, used_at desc);

alter table playground_usage enable row level security;

create policy "playground_usage_own_read"
  on playground_usage for select using (auth.uid() = user_id);

create policy "playground_usage_own_insert"
  on playground_usage for insert with check (auth.uid() = user_id);


-- 신고
create table if not exists reports (
  id            uuid primary key default gen_random_uuid(),
  reporter_id   uuid not null references profiles(id) on delete cascade,
  prompt_id     uuid references products(id) on delete set null,
  report_type   text not null check (report_type in ('spam', 'duplicate', 'not_working', 'inappropriate')),
  description   text,
  status        text default 'pending' check (status in ('pending', 'reviewed', 'resolved', 'dismissed')),
  reviewed_by   uuid references profiles(id) on delete set null,
  created_at    timestamptz default now()
);

create index if not exists idx_reports_prompt_id on reports (prompt_id);
create index if not exists idx_reports_status    on reports (status);

alter table reports enable row level security;

create policy "reports_own_insert"
  on reports for insert with check (auth.uid() = reporter_id);

-- Admin only read (service_role handles this)
create policy "reports_admin_read"
  on reports for select using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );


-- Creator 테이블 (판매자 프로필)
create table if not exists creators (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid unique not null references profiles(id) on delete cascade,
  username        text unique not null,
  display_name    text not null,
  bio             text,
  avatar_url      text,
  website_url     text,
  social_links    jsonb default '{}',
  total_sales     integer default 0,
  total_revenue   numeric(12,2) default 0,
  rating_avg      numeric(3,1) default 0,
  review_count    integer default 0,
  follower_count  integer default 0,
  is_verified     boolean default false,
  verified_at     timestamptz,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create index if not exists idx_creators_username  on creators (username);
create index if not exists idx_creators_user_id   on creators (user_id);

alter table creators enable row level security;

create policy "creators_public_read"
  on creators for select using (true);

create policy "creators_own_update"
  on creators for update using (auth.uid() = user_id);


-- products 테이블에 creator_id 컬럼 추가 (없는 경우)
alter table products add column if not exists creator_id uuid references creators(id) on delete set null;
alter table products add column if not exists difficulty text default 'beginner' check (difficulty in ('beginner', 'intermediate', 'advanced'));
alter table products add column if not exists version text default '1.0';
alter table products add column if not exists is_bundle boolean default false;
alter table products add column if not exists is_limited_drop boolean default false;
alter table products add column if not exists stock_total integer;
alter table products add column if not exists stock_remaining integer;
alter table products add column if not exists status text default 'approved' check (status in ('draft', 'pending', 'approved', 'rejected'));
alter table products add column if not exists sales_count integer default 0;
alter table products add column if not exists rating_avg numeric(3,1) default 0;
alter table products add column if not exists review_count integer default 0;
alter table products add column if not exists seo_title text;
alter table products add column if not exists seo_description text;
alter table products add column if not exists seo_keywords text[];


-- 프롬프트 샘플 테이블
create table if not exists prompt_samples (
  id           uuid primary key default gen_random_uuid(),
  prompt_id    uuid not null references products(id) on delete cascade,
  sample_text  text not null,
  sort_order   integer default 0,
  created_at   timestamptz default now()
);

create index if not exists idx_prompt_samples_prompt_id on prompt_samples (prompt_id);
alter table prompt_samples enable row level security;
create policy "prompt_samples_public_read"
  on prompt_samples for select using (true);


-- Creator 인증 자동화 트리거
create or replace function check_creator_verification()
returns trigger
language plpgsql
as $$
begin
  if new.total_sales >= 10 and new.rating_avg >= 4.0 and new.is_verified = false then
    new.is_verified = true;
    new.verified_at = now();
  end if;
  return new;
end;
$$;

create trigger creators_auto_verify
  before update on creators
  for each row execute function check_creator_verification();

create trigger creators_updated_at
  before update on creators
  for each row execute function handle_updated_at();
