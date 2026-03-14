-- ============================================================
-- Stripe Phase 3 Schema — 수정본
-- creators 테이블 의존성 문제 해결 버전
-- Supabase SQL Editor에 전체 붙여넣기 후 실행
-- ============================================================

-- ─────────────────────────────────────────────
-- 0. creators 테이블 (없을 경우 먼저 생성)
-- ─────────────────────────────────────────────
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

create index if not exists idx_creators_username on creators (username);
create index if not exists idx_creators_user_id  on creators (user_id);

alter table creators enable row level security;

drop policy if exists "creators_public_read"  on creators;
drop policy if exists "creators_own_update"   on creators;

create policy "creators_public_read"
  on creators for select using (true);

create policy "creators_own_update"
  on creators for update using (auth.uid() = user_id);

-- updated_at 트리거 (handle_updated_at 함수가 이미 존재해야 함)
drop trigger if exists creators_updated_at on creators;
create trigger creators_updated_at
  before update on creators
  for each row execute function handle_updated_at();

-- Creator 인증 자동화 트리거
create or replace function check_creator_verification()
returns trigger language plpgsql as $$
begin
  if new.total_sales >= 10 and new.rating_avg >= 4.0 and new.is_verified = false then
    new.is_verified  = true;
    new.verified_at  = now();
  end if;
  return new;
end;
$$;

drop trigger if exists creators_auto_verify on creators;
create trigger creators_auto_verify
  before update on creators
  for each row execute function check_creator_verification();


-- ─────────────────────────────────────────────
-- 1. processed_events (중복 이벤트 방지)
-- ─────────────────────────────────────────────
create table if not exists processed_events (
  id              uuid primary key default gen_random_uuid(),
  stripe_event_id text unique not null,
  event_type      text not null,
  status          text not null default 'processing'
                  check (status in ('processing', 'completed', 'failed')),
  error_message   text,
  processed_at    timestamptz default now()
);

create index if not exists idx_processed_events_stripe_id on processed_events (stripe_event_id);
create index if not exists idx_processed_events_status    on processed_events (status);

alter table processed_events enable row level security;
-- service_role 키만 접근 (클라이언트 정책 없음)


-- ─────────────────────────────────────────────
-- 2. subscriptions
-- ─────────────────────────────────────────────
create table if not exists subscriptions (
  id                     uuid primary key default gen_random_uuid(),
  user_id                uuid not null references profiles(id) on delete cascade,
  stripe_subscription_id text unique not null,
  stripe_customer_id     text,
  plan                   text not null default 'pro'
                         check (plan in ('pro', 'creator', 'premium')),
  status                 text not null default 'active'
                         check (status in (
                           'active','trialing','past_due',
                           'canceled','incomplete','incomplete_expired','unpaid'
                         )),
  current_period_end     timestamptz,
  cancel_at_period_end   boolean default false,
  created_at             timestamptz default now(),
  updated_at             timestamptz default now()
);

create index if not exists idx_subscriptions_user_id   on subscriptions (user_id);
create index if not exists idx_subscriptions_stripe_id on subscriptions (stripe_subscription_id);
create index if not exists idx_subscriptions_status    on subscriptions (status);

alter table subscriptions enable row level security;

drop policy if exists "subscriptions_own_read" on subscriptions;
create policy "subscriptions_own_read"
  on subscriptions for select using (auth.uid() = user_id);

drop trigger if exists subscriptions_updated_at on subscriptions;
create trigger subscriptions_updated_at
  before update on subscriptions
  for each row execute function handle_updated_at();


-- ─────────────────────────────────────────────
-- 3. payment_failures (결제 실패 로그)
-- ─────────────────────────────────────────────
create table if not exists payment_failures (
  id                   uuid primary key default gen_random_uuid(),
  stripe_customer_id   text not null,
  stripe_invoice_id    text unique,
  amount_due           numeric(10,2),
  attempt_count        integer default 1,
  created_at           timestamptz default now()
);

alter table payment_failures enable row level security;
-- admin 전용 — service_role 키로만 접근


-- ─────────────────────────────────────────────
-- 4. favorites (즐겨찾기)
-- ─────────────────────────────────────────────
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

drop policy if exists "favorites_own_read"   on favorites;
drop policy if exists "favorites_own_insert" on favorites;
drop policy if exists "favorites_own_delete" on favorites;

create policy "favorites_own_read"
  on favorites for select using (auth.uid() = user_id);
create policy "favorites_own_insert"
  on favorites for insert with check (auth.uid() = user_id);
create policy "favorites_own_delete"
  on favorites for delete using (auth.uid() = user_id);


-- ─────────────────────────────────────────────
-- 5. playground_usage (일일 사용량)
-- ─────────────────────────────────────────────
create table if not exists playground_usage (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references profiles(id) on delete cascade,
  prompt_text text,
  model_used  text,
  used_at     timestamptz default now()
);

create index if not exists idx_playground_usage_user_date
  on playground_usage (user_id, used_at desc);

alter table playground_usage enable row level security;

drop policy if exists "playground_usage_own_read"   on playground_usage;
drop policy if exists "playground_usage_own_insert" on playground_usage;

create policy "playground_usage_own_read"
  on playground_usage for select using (auth.uid() = user_id);
create policy "playground_usage_own_insert"
  on playground_usage for insert with check (auth.uid() = user_id);


-- ─────────────────────────────────────────────
-- 6. reports (신고)
-- ─────────────────────────────────────────────
create table if not exists reports (
  id           uuid primary key default gen_random_uuid(),
  reporter_id  uuid not null references profiles(id) on delete cascade,
  prompt_id    uuid references products(id) on delete set null,
  report_type  text not null
               check (report_type in ('spam','duplicate','not_working','inappropriate')),
  description  text,
  status       text default 'pending'
               check (status in ('pending','reviewed','resolved','dismissed')),
  reviewed_by  uuid references profiles(id) on delete set null,
  created_at   timestamptz default now()
);

create index if not exists idx_reports_prompt_id on reports (prompt_id);
create index if not exists idx_reports_status    on reports (status);

alter table reports enable row level security;

drop policy if exists "reports_own_insert" on reports;
drop policy if exists "reports_admin_read" on reports;

create policy "reports_own_insert"
  on reports for insert with check (auth.uid() = reporter_id);

create policy "reports_admin_read"
  on reports for select using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );


-- ─────────────────────────────────────────────
-- 7. prompt_samples (샘플 프롬프트)
-- ─────────────────────────────────────────────
create table if not exists prompt_samples (
  id          uuid primary key default gen_random_uuid(),
  prompt_id   uuid not null references products(id) on delete cascade,
  sample_text text not null,
  sort_order  integer default 0,
  created_at  timestamptz default now()
);

create index if not exists idx_prompt_samples_prompt_id on prompt_samples (prompt_id);
alter table prompt_samples enable row level security;

drop policy if exists "prompt_samples_public_read" on prompt_samples;
create policy "prompt_samples_public_read"
  on prompt_samples for select using (true);


-- ─────────────────────────────────────────────
-- 8. products / orders 컬럼 보완
-- ─────────────────────────────────────────────
alter table products
  add column if not exists file_urls         text[]       default '{}',
  add column if not exists creator_id        uuid         references creators(id) on delete set null,
  add column if not exists difficulty        text         default 'beginner'
                                             check (difficulty in ('beginner','intermediate','advanced')),
  add column if not exists version           text         default '1.0',
  add column if not exists is_bundle         boolean      default false,
  add column if not exists is_limited_drop   boolean      default false,
  add column if not exists stock_total       integer,
  add column if not exists stock_remaining   integer,
  add column if not exists status            text         default 'approved'
                                             check (status in ('draft','pending','approved','rejected')),
  add column if not exists sales_count       integer      default 0,
  add column if not exists rating_avg        numeric(3,1) default 0,
  add column if not exists review_count      integer      default 0,
  add column if not exists seo_title         text,
  add column if not exists seo_description   text,
  add column if not exists seo_keywords      text[];

alter table orders
  add column if not exists stripe_payment_intent text;

create index if not exists idx_orders_stripe_pi
  on orders (stripe_payment_intent);


-- ─────────────────────────────────────────────
-- 9. Stored Procedures
-- ─────────────────────────────────────────────
create or replace function increment_product_sales(p_product_id uuid)
returns void language plpgsql security definer as $$
begin
  update products
     set sales_count = coalesce(sales_count, 0) + 1
   where id = p_product_id;

  update creators c
     set total_sales = coalesce(total_sales, 0) + 1
    from products p
   where p.id = p_product_id
     and c.id = p.creator_id;
end;
$$;

create or replace function decrement_product_sales(p_product_id uuid)
returns void language plpgsql security definer as $$
begin
  update products
     set sales_count = greatest(coalesce(sales_count, 0) - 1, 0)
   where id = p_product_id;

  update creators c
     set total_sales = greatest(coalesce(total_sales, 0) - 1, 0)
    from products p
   where p.id = p_product_id
     and c.id = p.creator_id;
end;
$$;

create or replace function add_creator_revenue(p_creator_id uuid, p_amount numeric)
returns void language plpgsql security definer as $$
begin
  update creators
     set total_revenue = coalesce(total_revenue, 0) + p_amount
   where id = p_creator_id;
end;
$$;


-- ─────────────────────────────────────────────
-- 10. 편의 뷰
-- ─────────────────────────────────────────────
create or replace view active_subscriptions as
select s.*, p.email, p.display_name
from subscriptions s
join profiles p on s.user_id = p.id
where s.status in ('active', 'trialing')
  and (s.current_period_end is null or s.current_period_end > now());

create or replace view webhook_event_stats as
select event_type, status, count(*) as event_count, max(processed_at) as last_processed
from processed_events
group by event_type, status
order by event_type, status;
