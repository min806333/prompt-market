-- ============================================================
-- PromptMarket — New Features Schema
-- Run this in Supabase SQL Editor AFTER the main schema
-- ============================================================

-- ============================================================
-- 1. Comments table
-- ============================================================
create table if not exists comments (
  id         uuid primary key default gen_random_uuid(),
  prompt_id  uuid not null references products(id) on delete cascade,
  user_id    uuid not null references profiles(id) on delete cascade,
  content    text not null check (char_length(content) between 1 and 500),
  is_deleted boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_comments_prompt_id on comments(prompt_id);
create index if not exists idx_comments_user_id   on comments(user_id);
create index if not exists idx_comments_created   on comments(created_at desc);

alter table comments enable row level security;

drop policy if exists "comments_public_read" on comments;
drop policy if exists "comments_auth_insert" on comments;
drop policy if exists "comments_own_delete"  on comments;

create policy "comments_public_read"
  on comments for select using (is_deleted = false);

create policy "comments_auth_insert"
  on comments for insert with check (auth.uid() = user_id);

create policy "comments_own_delete"
  on comments for update using (auth.uid() = user_id);

-- ============================================================
-- 2. Creator Followers table
-- ============================================================
create table if not exists creator_followers (
  id          uuid primary key default gen_random_uuid(),
  creator_id  uuid not null references profiles(id) on delete cascade,
  follower_id uuid not null references profiles(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique (creator_id, follower_id)
);

create index if not exists idx_creator_followers_creator  on creator_followers(creator_id);
create index if not exists idx_creator_followers_follower on creator_followers(follower_id);

alter table creator_followers enable row level security;

drop policy if exists "followers_public_read"  on creator_followers;
drop policy if exists "followers_own_manage"   on creator_followers;

create policy "followers_public_read"
  on creator_followers for select using (true);

create policy "followers_own_manage"
  on creator_followers for all using (auth.uid() = follower_id);

-- Add follower_count to creators if not exists
alter table creators add column if not exists follower_count integer not null default 0;

-- ============================================================
-- 3. RPC: increment / decrement follower_count
-- ============================================================
create or replace function increment_follower_count(p_creator_id uuid)
returns void language plpgsql security definer as $$
begin
  update creators set follower_count = follower_count + 1
  where user_id = p_creator_id;
end;
$$;

create or replace function decrement_follower_count(p_creator_id uuid)
returns void language plpgsql security definer as $$
begin
  update creators set follower_count = greatest(follower_count - 1, 0)
  where user_id = p_creator_id;
end;
$$;

-- ============================================================
-- 4. Announcements table
-- ============================================================
create table if not exists announcements (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  slug       text unique not null,
  summary    text,
  content    text not null,
  category   text not null default 'notice'
             check (category in ('notice', 'update', 'event')),
  is_pinned  boolean not null default false,
  image_url  text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_announcements_slug    on announcements(slug);
create index if not exists idx_announcements_pinned  on announcements(is_pinned) where is_pinned = true;
create index if not exists idx_announcements_created on announcements(created_at desc);

alter table announcements enable row level security;

drop policy if exists "announcements_public_read"  on announcements;
drop policy if exists "announcements_admin_all"    on announcements;

create policy "announcements_public_read"
  on announcements for select using (true);

create policy "announcements_admin_all"
  on announcements for all
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- trigger: updated_at
create trigger announcements_updated_at
  before update on announcements
  for each row execute function handle_updated_at();

-- ============================================================
-- 5. Prompt Versions table
-- ============================================================
create table if not exists prompt_versions (
  id          uuid primary key default gen_random_uuid(),
  prompt_id   uuid not null references products(id) on delete cascade,
  version     text not null,
  changelog   text,
  created_at  timestamptz not null default now()
);

create index if not exists idx_prompt_versions_prompt on prompt_versions(prompt_id);

alter table prompt_versions enable row level security;

drop policy if exists "prompt_versions_public_read" on prompt_versions;

create policy "prompt_versions_public_read"
  on prompt_versions for select using (true);

-- ============================================================
-- 6. Sample announcements data
-- ============================================================
insert into announcements (title, slug, summary, content, category, is_pinned) values
(
  'PromptMarket 정식 오픈 안내',
  'official-launch',
  '인디 크리에이터를 위한 AI 프롬프트 마켓이 정식 오픈했습니다.',
  '안녕하세요, PromptMarket 팀입니다. AI 프롬프트 마켓플레이스가 정식으로 오픈했습니다. 많은 참여 부탁드립니다.',
  'notice',
  true
),
(
  'Early Creator 프로그램 모집',
  'early-creator-program',
  '초기 100명의 Creator에게 특별 혜택을 제공합니다.',
  '초기 100명의 Creator에게 판매 수익률 90%를 평생 제공합니다. 지금 바로 상품을 등록하고 Early Creator가 되어보세요!',
  'event',
  false
)
on conflict (slug) do nothing;
