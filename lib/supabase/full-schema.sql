-- ============================================================
-- Prompt Market — Full Schema v2.0
-- Supabase SQL Editor에 전체 붙여넣고 실행
-- ============================================================

-- 확장 기능
create extension if not exists "pg_trgm";
create extension if not exists "unaccent";

-- ============================================================
-- 1. 테이블 생성
-- ============================================================

-- 카테고리
create table if not exists categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text unique not null,
  description text,
  icon        text,
  sort_order  integer default 0,
  created_at  timestamptz default now()
);

-- 크리에이터 프로필
create table if not exists creators (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid unique not null references auth.users(id) on delete cascade,
  username          text unique not null,
  display_name      text,
  bio               text,
  avatar_url        text,
  website_url       text,
  social_links      jsonb default '{}',
  total_sales       integer default 0,
  total_revenue     numeric(12,2) default 0,
  rating_avg        numeric(3,2) default 0,
  review_count      integer default 0,
  follower_count    integer default 0,
  is_verified       boolean default false,
  verified_at       timestamptz,
  stripe_account_id text,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

-- 프롬프트 상품 (products 대체)
create table if not exists prompts (
  id                  uuid primary key default gen_random_uuid(),
  title               text not null,
  slug                text unique not null,
  short_description   text,
  full_description    text,
  price               numeric(10,2) not null default 0,
  creator_id          uuid references creators(id) on delete set null,
  category_id         uuid references categories(id) on delete set null,
  ai_tools            text[] default '{}',
  difficulty          text default 'beginner'
                      check (difficulty in ('beginner','intermediate','advanced')),
  prompt_count        integer default 0,
  preview_image_url   text,
  tags                text[] default '{}',
  version             text default 'v1.0',
  is_featured         boolean default false,
  is_free             boolean default false,
  is_bundle           boolean default false,
  is_limited_drop     boolean default false,
  stock_limit         integer,
  stock_remaining     integer,
  status              text default 'approved'
                      check (status in ('pending','approved','rejected','hidden')),
  fts_vector          tsvector,
  sales_count         integer default 0,
  rating_avg          numeric(3,2) default 0,
  review_count        integer default 0,
  file_urls           text[] default '{}',
  external_buy_url    text,
  stripe_price_id     text,
  seo_title           text,
  seo_description     text,
  seo_keywords        text[],
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

-- 샘플 프롬프트
create table if not exists prompt_samples (
  id          uuid primary key default gen_random_uuid(),
  prompt_id   uuid not null references prompts(id) on delete cascade,
  sample_text text not null,
  sort_order  integer default 0,
  created_at  timestamptz default now()
);

-- 결과 예시
create table if not exists prompt_results (
  id             uuid primary key default gen_random_uuid(),
  prompt_id      uuid not null references prompts(id) on delete cascade,
  result_type    text not null check (result_type in ('image','text','audio','video')),
  result_url     text not null,
  caption        text,
  ai_model_used  text,
  created_at     timestamptz default now()
);

-- 버전 히스토리
create table if not exists prompt_versions (
  id          uuid primary key default gen_random_uuid(),
  prompt_id   uuid not null references prompts(id) on delete cascade,
  version     text not null,
  changelog   text,
  created_at  timestamptz default now()
);

-- 번들
create table if not exists bundles (
  id                   uuid primary key default gen_random_uuid(),
  prompt_id            uuid not null references prompts(id) on delete cascade,
  included_prompt_ids  uuid[] default '{}',
  discount_percent     numeric(5,2) default 0,
  created_at           timestamptz default now()
);

-- 유저 프로필
create table if not exists profiles (
  id                  uuid primary key references auth.users(id) on delete cascade,
  email               text unique not null,
  display_name        text,
  avatar_url          text,
  role                text default 'user' check (role in ('user','admin')),
  subscription_status text default 'free' check (subscription_status in ('free','pro')),
  stripe_customer_id  text,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

-- 주문
create table if not exists orders (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid references profiles(id) on delete set null,
  prompt_id             uuid references prompts(id) on delete set null,
  amount                numeric(10,2) not null,
  payment_status        text default 'pending'
                        check (payment_status in ('pending','completed','failed','refunded')),
  payment_method        text check (payment_method in ('stripe','external')),
  stripe_session_id     text unique,
  stripe_payment_intent text,
  download_token        text unique,
  download_count        integer default 0,
  created_at            timestamptz default now()
);

-- 즐겨찾기
create table if not exists favorites (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references profiles(id) on delete cascade,
  prompt_id  uuid not null references prompts(id) on delete cascade,
  created_at timestamptz default now(),
  unique (user_id, prompt_id)
);

-- 리뷰 (구매자 전용)
create table if not exists reviews (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null references profiles(id) on delete cascade,
  prompt_id            uuid not null references prompts(id) on delete cascade,
  order_id             uuid references orders(id) on delete set null,
  rating               integer not null check (rating between 1 and 5),
  content              text not null,
  ai_model_used        text,
  result_quality       integer check (result_quality between 1 and 5),
  is_verified_purchase boolean default false,
  created_at           timestamptz default now(),
  unique (user_id, prompt_id)
);

-- Playground 사용량
create table if not exists playground_usage (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references profiles(id) on delete cascade,
  prompt_id  uuid references prompts(id) on delete set null,
  ip_address text,
  used_at    timestamptz default now()
);

-- 신고
create table if not exists reports (
  id           uuid primary key default gen_random_uuid(),
  reporter_id  uuid references profiles(id) on delete set null,
  prompt_id    uuid not null references prompts(id) on delete cascade,
  report_type  text not null check (report_type in ('fake','duplicate','broken','spam')),
  description  text,
  status       text default 'pending' check (status in ('pending','reviewed','dismissed')),
  created_at   timestamptz default now()
);

-- 구독
create table if not exists subscriptions (
  id                      uuid primary key default gen_random_uuid(),
  user_id                 uuid not null references profiles(id) on delete cascade,
  stripe_subscription_id  text unique,
  status                  text default 'active'
                          check (status in ('active','cancelled','past_due','trialing')),
  plan                    text default 'pro',
  current_period_end      timestamptz,
  created_at              timestamptz default now(),
  updated_at              timestamptz default now()
);

-- 크리에이터 팔로우
create table if not exists creator_follows (
  id          uuid primary key default gen_random_uuid(),
  follower_id uuid not null references profiles(id) on delete cascade,
  creator_id  uuid not null references creators(id) on delete cascade,
  created_at  timestamptz default now(),
  unique (follower_id, creator_id)
);

-- 이메일 리드
create table if not exists email_leads (
  id                uuid primary key default gen_random_uuid(),
  email             text not null,
  source_prompt_id  uuid references prompts(id) on delete set null,
  source            text default 'newsletter'
                    check (source in ('cta','sample','newsletter')),
  created_at        timestamptz default now(),
  unique (email, source)
);

-- 정산 내역
create table if not exists commissions (
  id                uuid primary key default gen_random_uuid(),
  creator_id        uuid not null references creators(id) on delete cascade,
  order_id          uuid references orders(id) on delete set null,
  prompt_id         uuid references prompts(id) on delete set null,
  sale_amount       numeric(10,2) not null,
  commission_rate   numeric(5,2) not null default 10.00,
  commission_amount numeric(10,2) not null,
  creator_amount    numeric(10,2) not null,
  status            text default 'pending' check (status in ('pending','paid','cancelled')),
  created_at        timestamptz default now()
);

-- ============================================================
-- 2. 뷰
-- ============================================================

create or replace view daily_test_limits as
select
  user_id,
  count(*)::integer as used_today
from playground_usage
where used_at::date = current_date
group by user_id;

create or replace view prompts_with_creator as
select
  p.*,
  c.username         as creator_username,
  c.display_name     as creator_display_name,
  c.avatar_url       as creator_avatar_url,
  c.is_verified      as creator_is_verified,
  cat.name           as category_name,
  cat.slug           as category_slug,
  cat.icon           as category_icon
from prompts p
left join creators c on p.creator_id = c.id
left join categories cat on p.category_id = cat.id;

-- ============================================================
-- 3. 인덱스
-- ============================================================

create index if not exists idx_prompts_slug         on prompts (slug);
create index if not exists idx_prompts_category_id  on prompts (category_id);
create index if not exists idx_prompts_creator_id   on prompts (creator_id);
create index if not exists idx_prompts_status       on prompts (status);
create index if not exists idx_prompts_is_featured  on prompts (is_featured) where is_featured = true;
create index if not exists idx_prompts_fts          on prompts using gin(fts_vector);
create index if not exists idx_prompts_tags         on prompts using gin(tags);
create index if not exists idx_prompts_ai_tools     on prompts using gin(ai_tools);
create index if not exists idx_reviews_prompt_id    on reviews (prompt_id);
create index if not exists idx_favorites_user_id    on favorites (user_id);
create index if not exists idx_orders_user_id       on orders (user_id);
create index if not exists idx_playground_user_date on playground_usage (user_id, used_at);
create index if not exists idx_creators_username    on creators (username);
create index if not exists idx_trgm_title           on prompts using gin(title gin_trgm_ops);

-- ============================================================
-- 4. RLS
-- ============================================================

alter table categories       enable row level security;
alter table prompts          enable row level security;
alter table prompt_samples   enable row level security;
alter table prompt_results   enable row level security;
alter table prompt_versions  enable row level security;
alter table bundles          enable row level security;
alter table profiles         enable row level security;
alter table creators         enable row level security;
alter table orders           enable row level security;
alter table favorites        enable row level security;
alter table reviews          enable row level security;
alter table playground_usage enable row level security;
alter table reports          enable row level security;
alter table subscriptions    enable row level security;
alter table creator_follows  enable row level security;
alter table email_leads      enable row level security;
alter table commissions      enable row level security;

-- categories: 공개 읽기
create policy "categories_public_read" on categories for select using (true);

-- prompts: approved만 공개 읽기, 본인 상품 관리
create policy "prompts_public_read"    on prompts for select using (status = 'approved' or auth.uid() = (select user_id from creators where id = creator_id));
create policy "prompts_creator_insert" on prompts for insert with check (auth.uid() = (select user_id from creators where id = creator_id));
create policy "prompts_creator_update" on prompts for update using (auth.uid() = (select user_id from creators where id = creator_id));

-- prompt_samples, results, versions: 공개 읽기
create policy "samples_public_read"   on prompt_samples  for select using (true);
create policy "results_public_read"   on prompt_results  for select using (true);
create policy "versions_public_read"  on prompt_versions for select using (true);
create policy "bundles_public_read"   on bundles         for select using (true);

-- profiles
create policy "profiles_own_read"     on profiles for select using (auth.uid() = id);
create policy "profiles_own_update"   on profiles for update using (auth.uid() = id);
create policy "profiles_own_insert"   on profiles for insert with check (auth.uid() = id);
create policy "profiles_public_read"  on profiles for select using (true);

-- creators: 공개 읽기, 본인 수정
create policy "creators_public_read"  on creators for select using (true);
create policy "creators_own_insert"   on creators for insert with check (auth.uid() = user_id);
create policy "creators_own_update"   on creators for update using (auth.uid() = user_id);

-- orders: 본인 주문
create policy "orders_own_read"       on orders for select using (auth.uid() = user_id);
create policy "orders_own_insert"     on orders for insert with check (auth.uid() = user_id);

-- favorites: 본인
create policy "favorites_own_read"    on favorites for select using (auth.uid() = user_id);
create policy "favorites_own_insert"  on favorites for insert with check (auth.uid() = user_id);
create policy "favorites_own_delete"  on favorites for delete using (auth.uid() = user_id);

-- reviews: 공개 읽기, 본인 작성
create policy "reviews_public_read"   on reviews for select using (true);
create policy "reviews_own_insert"    on reviews for insert with check (auth.uid() = user_id);
create policy "reviews_own_update"    on reviews for update using (auth.uid() = user_id);
create policy "reviews_own_delete"    on reviews for delete using (auth.uid() = user_id);

-- playground_usage: 본인
create policy "playground_own_read"   on playground_usage for select using (auth.uid() = user_id);
create policy "playground_own_insert" on playground_usage for insert with check (auth.uid() = user_id);

-- reports: 본인 신고
create policy "reports_own_insert"    on reports for insert with check (auth.uid() = reporter_id);

-- subscriptions: 본인
create policy "subscriptions_own_read" on subscriptions for select using (auth.uid() = user_id);

-- creator_follows: 공개 읽기, 본인 팔로우
create policy "follows_public_read"   on creator_follows for select using (true);
create policy "follows_own_insert"    on creator_follows for insert with check (auth.uid() = follower_id);
create policy "follows_own_delete"    on creator_follows for delete using (auth.uid() = follower_id);

-- email_leads: 누구나 등록
create policy "email_leads_insert"    on email_leads for insert with check (true);

-- commissions: 본인 크리에이터
create policy "commissions_own_read"  on commissions for select using (
  auth.uid() = (select user_id from creators where id = creator_id)
);

-- ============================================================
-- 5. 트리거 함수
-- ============================================================

create or replace function handle_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create or replace trigger prompts_updated_at
  before update on prompts for each row execute function handle_updated_at();
create or replace trigger profiles_updated_at
  before update on profiles for each row execute function handle_updated_at();
create or replace trigger creators_updated_at
  before update on creators for each row execute function handle_updated_at();
create or replace trigger subscriptions_updated_at
  before update on subscriptions for each row execute function handle_updated_at();

-- FTS 자동 업데이트
create or replace function update_prompt_fts()
returns trigger language plpgsql as $$
begin
  new.fts_vector :=
    setweight(to_tsvector('simple', coalesce(new.title, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(new.short_description, '')), 'B') ||
    setweight(to_tsvector('simple', array_to_string(coalesce(new.tags, '{}'), ' ')), 'C') ||
    setweight(to_tsvector('simple', array_to_string(coalesce(new.ai_tools, '{}'), ' ')), 'D');
  return new;
end; $$;

create or replace trigger prompts_fts_update
  before insert or update on prompts
  for each row execute function update_prompt_fts();

-- 회원가입 시 profiles 자동 생성
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  ) on conflict (id) do nothing;
  return new;
end; $$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- 리뷰 작성 시 프롬프트 평점 자동 갱신
create or replace function update_prompt_rating()
returns trigger language plpgsql as $$
begin
  update prompts set
    rating_avg   = (select round(avg(rating)::numeric, 2) from reviews where prompt_id = coalesce(new.prompt_id, old.prompt_id)),
    review_count = (select count(*) from reviews where prompt_id = coalesce(new.prompt_id, old.prompt_id))
  where id = coalesce(new.prompt_id, old.prompt_id);
  return coalesce(new, old);
end; $$;

create or replace trigger reviews_rating_update
  after insert or update or delete on reviews
  for each row execute function update_prompt_rating();

-- 크리에이터 인증 자동 판정
create or replace function check_creator_verification()
returns trigger language plpgsql as $$
begin
  if new.total_sales >= 10 and new.rating_avg >= 4.0 and not new.is_verified then
    new.is_verified := true;
    new.verified_at := now();
  end if;
  return new;
end; $$;

create or replace trigger creator_verify_check
  before update on creators
  for each row execute function check_creator_verification();

-- ============================================================
-- 6. 샘플 데이터
-- ============================================================

insert into categories (id, name, slug, description, icon, sort_order) values
  ('00000000-0000-0000-0000-000000000001', '게임 음악',   'game-music',     'BGM, OST, 효과음 등 게임 음악 제작용 프롬프트', '🎵', 1),
  ('00000000-0000-0000-0000-000000000002', '기획/문서',   'planning-docs',  '게임 기획서, 소개문, UI 텍스트 등 문서 작성 프롬프트', '📄', 2),
  ('00000000-0000-0000-0000-000000000003', '영상/콘텐츠', 'video-content',  '유튜브, 매드무비, 숏폼 콘텐츠 제작 프롬프트', '🎬', 3),
  ('00000000-0000-0000-0000-000000000004', '앱/게임 소개','app-description','앱스토어, 구글플레이 소개문 자동 생성 프롬프트', '📱', 4),
  ('00000000-0000-0000-0000-000000000005', '이미지/그래픽','image-graphic', 'Midjourney, SD 등 이미지 생성 프롬프트', '🎨', 5),
  ('00000000-0000-0000-0000-000000000006', '텍스트/카피',  'text-copy',     '마케팅, 블로그, SNS 카피라이팅 프롬프트', '✍️', 6)
on conflict (slug) do nothing;
