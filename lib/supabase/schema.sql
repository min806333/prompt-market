-- ============================================================
-- Prompt Market for Indie Creators — Supabase Schema
-- Supabase SQL Editor에 전체 붙여넣기 후 실행
-- ============================================================


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
  created_at  timestamptz default now()
);

-- 상품
create table if not exists products (
  id                  uuid primary key default gen_random_uuid(),
  title               text not null,
  slug                text unique not null,
  short_description   text,
  full_description    text,
  price               numeric(10,2) not null default 0,
  category_id         uuid references categories(id) on delete set null,
  file_url            text,
  preview_image_url   text,
  demo_prompts        text[],           -- 미리보기용 샘플 프롬프트 배열
  supported_ai_tools  text[],           -- ['ChatGPT', 'Claude', 'Suno', 'Udio']
  prompt_count        integer default 0,
  file_format         text,             -- 'PDF' | 'TXT' | 'ZIP'
  is_featured         boolean default false,
  is_free             boolean default false,
  tags                text[],
  external_buy_url    text,             -- Phase 1 외부 결제 링크
  usage_tips          text[],           -- 사용 팁 배열
  example_results     text[],           -- 예시 결과 설명 배열
  sort_order          integer default 0, -- 수동 정렬용
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

-- 유저 프로필 (auth.users 와 1:1 연동)
create table if not exists profiles (
  id                  uuid primary key references auth.users(id) on delete cascade,
  email               text unique not null,
  display_name        text,
  avatar_url          text,
  role                text default 'user' check (role in ('user', 'admin')),
  subscription_status text default 'free' check (subscription_status in ('free', 'pro')),
  stripe_customer_id  text,             -- Phase 2: Stripe 고객 ID
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

-- 주문
create table if not exists orders (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid references profiles(id) on delete set null,
  product_id        uuid references products(id) on delete set null,
  amount            numeric(10,2) not null,
  payment_status    text default 'pending'
                    check (payment_status in ('pending', 'completed', 'failed', 'refunded')),
  payment_method    text check (payment_method in ('stripe', 'external')),
  stripe_session_id text unique,
  stripe_payment_intent text,
  download_count    integer default 0,
  created_at        timestamptz default now()
);

-- 이메일 리드 수집 (CTA / 무료 샘플 / 뉴스레터)
create table if not exists email_leads (
  id                uuid primary key default gen_random_uuid(),
  email             text not null,
  source_product_id uuid references products(id) on delete set null,
  source            text default 'newsletter'
                    check (source in ('cta', 'sample', 'newsletter')),
  created_at        timestamptz default now(),
  unique (email, source)                -- 동일 이메일+소스 중복 방지
);

-- 후기
create table if not exists reviews (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references products(id) on delete cascade,
  user_id     uuid references profiles(id) on delete set null,
  author_name text not null,
  author_role text,
  rating      integer not null check (rating between 1 and 5),
  content     text not null,
  is_verified boolean default false,    -- 구매 확인 후기 여부
  created_at  timestamptz default now()
);


-- ============================================================
-- 2. 인덱스
-- ============================================================

create index if not exists idx_products_slug        on products (slug);
create index if not exists idx_products_category_id on products (category_id);
create index if not exists idx_products_is_featured  on products (is_featured) where is_featured = true;
create index if not exists idx_products_is_free      on products (is_free);
create index if not exists idx_products_created_at   on products (created_at desc);
create index if not exists idx_orders_user_id        on orders (user_id);
create index if not exists idx_orders_product_id     on orders (product_id);
create index if not exists idx_orders_payment_status on orders (payment_status);
create index if not exists idx_reviews_product_id    on reviews (product_id);
create index if not exists idx_email_leads_email     on email_leads (email);


-- ============================================================
-- 3. RLS (Row Level Security)
-- ============================================================

alter table categories  enable row level security;
alter table products    enable row level security;
alter table profiles    enable row level security;
alter table orders      enable row level security;
alter table email_leads enable row level security;
alter table reviews     enable row level security;

-- categories: 누구나 읽기 가능
create policy "categories_public_read"
  on categories for select using (true);

-- products: 누구나 읽기 가능
create policy "products_public_read"
  on products for select using (true);

-- profiles: 본인만 조회 / 수정
create policy "profiles_own_read"
  on profiles for select using (auth.uid() = id);

create policy "profiles_own_update"
  on profiles for update using (auth.uid() = id);

-- profiles: 본인 row 생성 (회원가입 트리거 대신 직접 insert 허용)
create policy "profiles_own_insert"
  on profiles for insert with check (auth.uid() = id);

-- orders: 본인 주문만 조회 / 생성
create policy "orders_own_read"
  on orders for select using (auth.uid() = user_id);

create policy "orders_own_insert"
  on orders for insert with check (auth.uid() = user_id);

-- email_leads: 비인증 포함 누구나 추가 가능
create policy "email_leads_public_insert"
  on email_leads for insert with check (true);

-- reviews: 누구나 읽기, 로그인 사용자만 작성
create policy "reviews_public_read"
  on reviews for select using (true);

create policy "reviews_auth_insert"
  on reviews for insert with check (auth.uid() = user_id);

-- reviews: 본인 후기만 수정/삭제
create policy "reviews_own_update"
  on reviews for update using (auth.uid() = user_id);

create policy "reviews_own_delete"
  on reviews for delete using (auth.uid() = user_id);


-- ============================================================
-- 4. 트리거 — updated_at 자동 갱신
-- ============================================================

create or replace function handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_updated_at
  before update on products
  for each row execute function handle_updated_at();

create trigger profiles_updated_at
  before update on profiles
  for each row execute function handle_updated_at();

-- ============================================================
-- 5. 트리거 — 회원가입 시 profiles 자동 생성
-- ============================================================

create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();


-- ============================================================
-- 6. 뷰 — 편의용
-- ============================================================

-- 상품 + 카테고리 조인 뷰
create or replace view products_with_category as
select
  p.*,
  c.name  as category_name,
  c.slug  as category_slug,
  c.icon  as category_icon
from products p
left join categories c on p.category_id = c.id;

-- 상품별 평균 평점 뷰
create or replace view product_ratings as
select
  product_id,
  count(*)::integer          as review_count,
  round(avg(rating), 1)      as average_rating
from reviews
group by product_id;

-- 구매 확인된 주문 뷰
create or replace view completed_orders as
select
  o.*,
  p.title             as product_title,
  p.slug              as product_slug,
  p.file_url          as product_file_url,
  p.preview_image_url as product_image_url
from orders o
join products p on o.product_id = p.id
where o.payment_status = 'completed';


-- ============================================================
-- 7. 샘플 데이터 INSERT
-- ============================================================

-- 카테고리
insert into categories (id, name, slug, description, icon) values
  ('00000000-0000-0000-0000-000000000001', '게임 음악',   'game-music',     'BGM, OST, 효과음 등 게임 음악 제작용 프롬프트', '🎵'),
  ('00000000-0000-0000-0000-000000000002', '기획/문서',   'planning-docs',  '게임 기획서, 소개문, UI 텍스트 등 문서 작성 프롬프트', '📄'),
  ('00000000-0000-0000-0000-000000000003', '영상/콘텐츠', 'video-content',  '유튜브, 매드무비, 숏폼 콘텐츠 제작 프롬프트', '🎬'),
  ('00000000-0000-0000-0000-000000000004', '앱/게임 소개','app-description','앱스토어, 구글플레이 소개문 자동 생성 프롬프트', '📱')
on conflict (slug) do nothing;

-- 상품
insert into products (
  id, title, slug, short_description, full_description,
  price, category_id, preview_image_url,
  demo_prompts, supported_ai_tools, prompt_count, file_format,
  is_featured, is_free, tags, external_buy_url,
  usage_tips, example_results, sort_order
) values
(
  '10000000-0000-0000-0000-000000000001',
  '퍼즐 게임 BGM 프롬프트 50종',
  'puzzle-game-bgm-50',
  'Suno & Udio로 바로 쓸 수 있는 퍼즐 게임 전용 BGM 프롬프트 50개 완전 모음',
  '퍼즐 게임에 최적화된 BGM 프롬프트 50종 모음입니다.

포함 테마:
- 로비 / 메인 메뉴 BGM (8종)
- 일반 스테이지 BGM (15종)
- 보스 스테이지 / 클리어 BGM (10종)
- 집중 타임 / 타이머 BGM (7종)
- 엔딩 / 크레딧 BGM (10종)

각 프롬프트는 Suno와 Udio 양쪽에서 테스트 완료된 실전형 프롬프트입니다.',
  12.99,
  '00000000-0000-0000-0000-000000000001',
  'https://images.unsplash.com/photo-1518791841217-8f162f1912da?w=800&q=80',
  array[
    'Upbeat and playful puzzle game lobby BGM, chiptune mixed with light orchestral, 120 BPM, loopable, bright and welcoming atmosphere',
    'Focused puzzle stage background music, minimalist piano and soft synth pads, 90 BPM, calm tension building, loop-friendly',
    'Victory fanfare for puzzle game stage clear, cheerful brass section with sparkle sound effects, 4 bars, triumphant and cute'
  ],
  array['Suno', 'Udio'],
  50, 'TXT', true, false,
  array['퍼즐게임', 'BGM', 'Suno', 'Udio', '게임음악'],
  'https://example.com/buy/puzzle-bgm-50',
  array[
    'Suno에서 Custom Mode를 켜고 프롬프트를 Style 란에 붙여넣으세요.',
    'BPM 수치를 ±10 범위로 조정하면 더 다양한 결과를 얻을 수 있습니다.',
    '''loopable'' 키워드는 반드시 유지하면 매끄러운 루프 음악이 생성됩니다.'
  ],
  array[
    'Suno로 생성 시 평균 3~4번 시도 만에 원하는 퀄리티 달성',
    '퍼즐 게임 개발자 50명 이상이 실제 프로젝트에 사용'
  ],
  1
),
(
  '10000000-0000-0000-0000-000000000002',
  '게임 매드무비 음악 프롬프트 30종',
  'game-madmovie-music-30',
  '게임 매드무비·하이라이트 영상에 어울리는 강렬한 음악 프롬프트 30종',
  '게임 매드무비, 하이라이트 클립, 몽타주 영상 제작을 위한 음악 프롬프트 30종입니다.

포함 스타일:
- 하드코어 액션 (10종)
- 감성 슬로우 모션 구간 (8종)
- 클라이맥스 빌드업 (7종)
- 아웃트로 / 엔딩 (5종)',
  9.99,
  '00000000-0000-0000-0000-000000000001',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80',
  array[
    'Epic cinematic game montage music, heavy electric guitar riffs with orchestral strings, 140 BPM, intense and powerful, building to climax',
    'Emotional slow-motion gaming highlight, piano melody with swelling strings, 70 BPM, melancholic yet triumphant'
  ],
  array['Suno', 'Udio'],
  30, 'TXT', true, false,
  array['매드무비', '게임영상', 'Suno', 'Udio', '유튜브'],
  'https://example.com/buy/madmovie-30',
  array[
    '영상 길이에 맞춰 Suno의 Extend 기능을 활용하세요.',
    '''building to climax'' 키워드로 영상 클라이맥스 구간 음악을 쉽게 만들 수 있습니다.'
  ],
  array['유튜브 게임 채널에서 저작권 문제 없이 활용 가능'],
  2
),
(
  '10000000-0000-0000-0000-000000000003',
  '게임 기획서 생성 프롬프트 번들',
  'game-design-doc-bundle',
  'ChatGPT·Claude로 완성도 높은 게임 기획서를 빠르게 만드는 프롬프트 번들',
  '인디 게임 개발자를 위한 게임 기획서 작성 프롬프트 번들입니다.

포함 항목:
- 게임 컨셉 문서(GDD) 기본 구조 생성 프롬프트
- 게임 루프 설계 프롬프트
- 캐릭터 설정서 생성 프롬프트
- 레벨 디자인 개요 프롬프트
- 수익화 모델 제안 프롬프트',
  14.99,
  '00000000-0000-0000-0000-000000000002',
  'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&q=80',
  array[
    'You are a professional game designer. Create a Game Design Document (GDD) outline for a [GENRE] game targeting [TARGET_AUDIENCE]. Include: core concept, unique selling points, target platform, and basic game loop in Korean.',
    'Design a core game loop for [GAME_NAME], a [GENRE] game. Describe the moment-to-moment gameplay, session length, and player motivation in detail.'
  ],
  array['ChatGPT', 'Claude'],
  20, 'PDF', true, false,
  array['게임기획', 'GDD', 'ChatGPT', 'Claude', '인디게임'],
  'https://example.com/buy/game-gdd-bundle',
  array[
    '[GENRE], [TARGET_AUDIENCE] 등 대괄호 변수를 여러분의 게임에 맞게 교체하세요.',
    'Claude에서 사용 시 ''Think step by step'' 문구를 앞에 추가하면 더 체계적인 결과가 나옵니다.'
  ],
  array['ChatGPT-4로 5분 안에 10페이지 분량의 기획서 초안 생성 가능'],
  3
),
(
  '10000000-0000-0000-0000-000000000004',
  '앱·게임 소개문 생성 프롬프트',
  'app-game-description-prompts',
  '앱스토어 & 구글플레이 소개문을 ChatGPT로 빠르게 완성하는 프롬프트 모음',
  '앱스토어와 구글플레이에 최적화된 앱·게임 소개문 생성 프롬프트 모음입니다.

포함 항목:
- 앱스토어 짧은 설명 (255자) 생성 프롬프트
- 구글플레이 전체 설명 생성 프롬프트
- 키워드 ASO 최적화 프롬프트
- 한/영 동시 생성 프롬프트
- 업데이트 노트 작성 프롬프트',
  7.99,
  '00000000-0000-0000-0000-000000000004',
  'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80',
  array[
    'Write an App Store short description (max 255 characters) for [APP_NAME], a [CATEGORY] app that [MAIN_FEATURE]. Make it compelling, clear, and include a call-to-action. Output in Korean.'
  ],
  array['ChatGPT', 'Claude'],
  15, 'TXT', false, false,
  array['앱소개', '앱스토어', 'ASO', 'ChatGPT'],
  'https://example.com/buy/app-description',
  array['[APP_NAME], [CATEGORY] 변수를 실제 앱 정보로 교체하세요.'],
  array['앱스토어 소개문 작성 시간 평균 2시간 → 10분으로 단축'],
  4
),
(
  '10000000-0000-0000-0000-000000000005',
  '무료 샘플 — 게임 BGM 프롬프트 5종',
  'free-sample-game-bgm-5',
  '퍼즐 게임 BGM 프롬프트 50종 패키지의 무료 샘플 5종',
  '유료 패키지 구매 전 퀄리티를 직접 확인해보세요. 퍼즐 게임 BGM 프롬프트 5종을 무료로 제공합니다.',
  0.00,
  '00000000-0000-0000-0000-000000000001',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
  array[
    'Relaxing puzzle game background music, soft piano with gentle glockenspiel, 100 BPM, peaceful and focused atmosphere, loopable',
    'Energetic puzzle stage music, upbeat marimba and light percussion, 130 BPM, cheerful and motivating',
    'Mysterious puzzle dungeon BGM, ambient synth with subtle bass, 80 BPM, slightly eerie but not scary, loopable',
    'Celebration jingle for puzzle completion, bright xylophone and bells, 4-bar fanfare, happy and rewarding feeling',
    'Title screen music for casual puzzle game, whimsical melody with piano and strings, 110 BPM, inviting and memorable'
  ],
  array['Suno', 'Udio'],
  5, 'TXT', false, true,
  array['무료', '샘플', '퍼즐게임', 'BGM'],
  null,
  array['Suno Custom Mode의 Style 입력란에 그대로 붙여넣어 사용하세요.'],
  null,
  5
)
on conflict (slug) do nothing;

-- 샘플 후기
insert into reviews (product_id, author_name, author_role, rating, content, is_verified) values
(
  '10000000-0000-0000-0000-000000000001',
  '김민준', '인디 게임 개발자', 5,
  'BGM 작업 시간이 90% 줄었어요. Suno에서 바로 붙여넣으면 퀄리티 높은 음악이 나와서 정말 놀랐습니다.',
  true
),
(
  '10000000-0000-0000-0000-000000000002',
  '이수연', '유튜브 게임 크리에이터', 5,
  '매드무비 음악 프롬프트로 저작권 걱정 없는 BGM을 만들었어요. 하이라이트 영상 조회수가 확실히 올랐습니다!',
  true
),
(
  '10000000-0000-0000-0000-000000000003',
  '박지호', '1인 앱 개발자', 5,
  'ChatGPT에 변수만 바꿔 넣으면 탄탄한 기획서 초안이 나옵니다. 정말 시간 절약이 됩니다.',
  true
),
(
  '10000000-0000-0000-0000-000000000001',
  '최유진', '게임 1인 개발자', 5,
  '50종이나 들어있어서 다양하게 테스트해볼 수 있었어요. 타이머 BGM 프롬프트가 특히 좋았습니다.',
  false
);
