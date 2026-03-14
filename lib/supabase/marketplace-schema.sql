-- ============================================================
-- 마켓플레이스 확장 스키마 + 실제 프롬프트 데이터
-- Supabase SQL Editor에 붙여넣고 실행
-- ============================================================

-- ============================================================
-- 1. 마켓플레이스 테이블 추가
-- ============================================================

-- 사용자가 등록한 판매 상품 (별도 관리)
create table if not exists seller_products (
  id                  uuid primary key default gen_random_uuid(),
  seller_id           uuid not null references profiles(id) on delete cascade,
  title               text not null,
  slug                text unique not null,
  short_description   text,
  full_description    text,
  price               numeric(10,2) not null default 0,
  category_slug       text,
  prompt_count        integer default 0,
  file_format         text default 'TXT',
  supported_ai_tools  text[],
  usage_tips          text[],
  external_buy_url    text,
  status              text default 'pending'
                      check (status in ('pending', 'approved', 'rejected', 'hidden')),
  commission_rate     numeric(5,2) default 10.00,
  total_sales         integer default 0,
  total_revenue       numeric(10,2) default 0,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

-- 수수료 정산 내역
create table if not exists commissions (
  id                uuid primary key default gen_random_uuid(),
  seller_id         uuid not null references profiles(id) on delete cascade,
  order_id          uuid references orders(id) on delete set null,
  product_id        uuid references seller_products(id) on delete set null,
  sale_amount       numeric(10,2) not null,
  commission_rate   numeric(5,2) not null default 30.00,
  commission_amount numeric(10,2) not null,
  seller_amount     numeric(10,2) not null,
  status            text default 'pending'
                    check (status in ('pending', 'paid', 'cancelled')),
  created_at        timestamptz default now()
);

-- RLS
alter table seller_products enable row level security;
alter table commissions     enable row level security;

-- 누구나 approved 상품 볼 수 있음
create policy "seller_products_public_read"
  on seller_products for select using (status = 'approved');

-- 본인 상품 관리
create policy "seller_products_own_all"
  on seller_products for all using (auth.uid() = seller_id);

-- 본인 수수료 내역 조회
create policy "commissions_own_read"
  on commissions for select using (auth.uid() = seller_id);

-- ============================================================
-- 2. products 테이블에 실제 프롬프트 데이터 업데이트
-- ============================================================

-- 상품 1: 퍼즐 게임 BGM 프롬프트 50종
update products set demo_prompts = array[
  -- 로비/메인 메뉴 BGM (8종 중 샘플 3)
  'Upbeat and playful puzzle game lobby BGM, chiptune mixed with light orchestral, 120 BPM, loopable, bright and welcoming atmosphere, catchy main melody',
  'Whimsical main menu music for casual puzzle game, piano and marimba duet, 110 BPM, cheerful and inviting, loop-friendly seamless intro',
  'Cozy puzzle game title screen, acoustic guitar with soft strings, 95 BPM, warm and nostalgic, slightly upbeat, loopable',
  -- 일반 스테이지 (15종 중 샘플 5)
  'Focused puzzle stage background music, minimalist piano and soft synth pads, 90 BPM, calm tension building, loop-friendly',
  'Light and airy puzzle stage BGM, glockenspiel melody over ambient pads, 105 BPM, dreamy concentration mood, seamless loop',
  'Energetic puzzle stage music, upbeat marimba and light percussion, 130 BPM, cheerful and motivating, loop-friendly',
  'Mysterious puzzle stage BGM, pizzicato strings with subtle electronic elements, 88 BPM, curious and focused atmosphere',
  'Relaxing mid-difficulty puzzle BGM, soft piano with gentle glockenspiel, 100 BPM, peaceful and concentrated, loopable',
  -- 보스/클리어 (10종 중 샘플 4)
  'Intense boss level puzzle music, driving percussion with urgent strings, 145 BPM, high stakes tension, pulsing rhythm',
  'Epic final stage puzzle BGM, full orchestral with choir elements, 135 BPM, triumphant and challenging, loop-friendly',
  'Victory fanfare for puzzle game stage clear, cheerful brass section with sparkle sound effects, 4 bars, triumphant and cute',
  'Level complete celebration jingle, bright xylophone and bells, 4-bar fanfare, happy and rewarding feeling, short loop',
  -- 집중/타이머 (7종 중 샘플 3)
  'Ticking clock puzzle timer music, minimalist electronic beat with subtle urgency, 120 BPM, focused pressure atmosphere',
  'Time pressure puzzle BGM, staccato strings with electronic pulse, 140 BPM, urgent but not overwhelming, loopable',
  'Final countdown puzzle music, accelerating tempo electronic track starting at 100 BPM building to 130 BPM, tension building',
  -- 엔딩/크레딧 (10종 중 샘플 5)
  'Peaceful puzzle game ending theme, full orchestra resolution, 80 BPM, satisfying and emotional, gentle fadeout',
  'Credits roll music for puzzle game, light jazz piano with soft rhythm section, 95 BPM, nostalgic and warm',
  'Game over screen music for puzzle game, gentle melancholic melody, piano solo, 70 BPM, not too sad, encouraging retry feeling',
  'Achievement unlock fanfare, orchestral brass sting with sparkle, 2 bars, triumphant and satisfying',
  'New high score celebration, energetic pop fanfare with synth, 4 bars, exciting and rewarding'
], full_description = '퍼즐 게임에 최적화된 BGM 프롬프트 50종 완전 모음입니다. Suno와 Udio에서 바로 사용 가능한 실전 프롬프트로 구성되어 있습니다.

■ 포함 구성 (총 50종)
• 로비 / 메인 메뉴 BGM — 8종
• 일반 스테이지 BGM — 15종
• 보스 스테이지 / 클리어 BGM — 10종
• 집중 타임 / 타이머 BGM — 7종
• 엔딩 / 크레딧 BGM — 10종

■ 특징
• Suno AI Custom Mode 최적화
• Udio 호환 검증 완료
• BPM, 분위기, 악기 구성 세밀하게 지정
• "loopable" 키워드로 게임 내 반복 재생 최적화
• 무료 샘플 5종 미리 체험 가능

■ 파일 형식
TXT 파일 1개 (50개 프롬프트 수록)'
where slug = 'puzzle-game-bgm-50';

-- 상품 2: 게임 매드무비 음악 프롬프트 30종
update products set demo_prompts = array[
  -- 하드코어 액션 (10종 중 샘플 4)
  'Epic cinematic game montage music, heavy electric guitar riffs with orchestral strings, 140 BPM, intense and powerful, building to climax, perfect for FPS highlights',
  'Aggressive trap beat game montage, 808 bass drops with distorted synths, 150 BPM, hype energy, modern gaming style',
  'Metal core game highlight music, shredding guitar with blast beat drums, 160 BPM, extreme intensity, headbanging energy',
  'Dark cinematic action sequence BGM, dramatic orchestral with electronic elements, 130 BPM, menacing and powerful, action movie feel',
  -- 감성 슬로우 (8종 중 샘플 3)
  'Emotional slow-motion gaming highlight, piano melody with swelling strings, 70 BPM, melancholic yet triumphant',
  'Nostalgic gaming memories montage, soft acoustic guitar with ambient pad, 65 BPM, emotional and reflective, slight reverb',
  'Bittersweet gaming farewell sequence, piano and strings duet, 72 BPM, touching and cinematic, building emotional arc',
  -- 클라이맥스 빌드업 (7종 중 샘플 3)
  'Epic dubstep buildups for gaming montage, rising synth lead with heavy bass drop at 1 minute, 140 BPM, massive energy release',
  'Cinematic orchestra rise for game climax, string section crescendo with brass stab, 120-160 BPM accelerating, maximum impact',
  'Hybrid trailer music for game highlight reel, percussion ensemble with synth, 2-minute structure with drop at 1 minute',
  -- 아웃트로 (5종 중 샘플 2)
  'Gaming montage outro, chill lo-fi beat with emotional piano, 85 BPM, reflective and satisfying ending feel',
  'Epic gaming video end card music, triumphant short brass fanfare fading to ambient, 10 seconds, memorable sign-off'
], full_description = '게임 매드무비, 하이라이트 클립, 유튜브 게임 영상을 위한 음악 프롬프트 30종 모음입니다.

■ 포함 구성 (총 30종)
• 하드코어 액션 — 10종
• 감성 슬로우 모션 구간 — 8종
• 클라이맥스 빌드업 — 7종
• 아웃트로 / 엔딩 — 5종

■ 특징
• YouTube 게임 채널 최적화
• Suno Extend 기능과 함께 사용 시 영상 길이에 맞게 확장 가능
• 저작권 걱정 없는 AI 생성 음악
• 영상 구간별 (인트로/메인/클라이맥스/아웃트로) 분류

■ 활용 채널
• FPS / RPG / 배틀로얄 게임 영상
• 게임 클립 하이라이트 편집
• 유튜브 Shorts 게임 영상'
where slug = 'game-madmovie-music-30';

-- 상품 3: 게임 기획서 생성 프롬프트 번들
update products set demo_prompts = array[
  -- GDD 기본 구조
  'You are a professional game designer. Create a Game Design Document (GDD) outline for a [GENRE] game targeting [TARGET_AUDIENCE]. Include: 1) Core Concept & Vision, 2) Unique Selling Points (3-5 points), 3) Target Platform & Tech Stack, 4) Core Game Loop description, 5) Key Features list, 6) Monetization Strategy. Output in Korean with clear headers.',
  -- 게임 루프 설계
  'Design a detailed core game loop for [GAME_NAME], a [GENRE] game. Describe: moment-to-moment gameplay (30 seconds), session structure (5-15 minutes), daily engagement loop, long-term progression system. Include player motivation psychology for each loop layer. Output in Korean.',
  -- 캐릭터 설정서
  'Create a character design document for [CHARACTER_NAME] in [GAME_NAME]. Include: personality traits (5-7 key traits), backstory (100 words), visual design notes, abilities/skills (3-5), character arc, relationship to other characters, voice/speech style. Make it compelling for [GENRE] game targeting [AUDIENCE]. Output in Korean.',
  -- 레벨 디자인
  'Design a level design document for [LEVEL_NAME] in [GAME_NAME]. Include: level objective, environment theme, key gameplay mechanics introduced, difficulty curve, enemy/obstacle placement philosophy, rewards and collectibles, estimated completion time, accessibility considerations. Target difficulty: [DIFFICULTY]. Output in Korean.',
  -- 수익화 모델
  'Propose a monetization strategy for [GAME_NAME], a [GENRE] [PLATFORM] game. Analyze: 1) Best monetization model for this game type (premium/freemium/subscription), 2) IAP structure if applicable, 3) Revenue projections for 3 scenarios (low/medium/high), 4) Ethical monetization guidelines, 5) Competitor analysis approach. Output in Korean with actionable recommendations.'
], full_description = '인디 게임 개발자를 위한 게임 기획서 작성 프롬프트 번들입니다. ChatGPT와 Claude에서 바로 사용 가능하며, 대괄호 변수만 교체하면 완성도 높은 기획 문서를 빠르게 생성할 수 있습니다.

■ 포함 구성 (총 20종)
• 게임 컨셉 문서(GDD) 기본 구조 생성 — 4종
• 게임 루프 설계 — 3종
• 캐릭터 설정서 생성 — 4종
• 레벨 디자인 개요 — 4종
• 수익화 모델 제안 — 3종
• 기획서 검토 및 피드백 요청 — 2종

■ 변수 사용법
[GENRE], [TARGET_AUDIENCE] 등 대괄호 변수를 실제 게임 정보로 교체
예: [GENRE] → "퍼즐", [PLATFORM] → "모바일"

■ 특징
• ChatGPT-4 / GPT-4o 최적화
• Claude 3.5 Sonnet 호환 확인
• 한국어 출력 지시 포함
• 인디 개발자 실제 프로젝트에 검증된 프롬프트'
where slug = 'game-design-doc-bundle';

-- 상품 4: 앱/게임 소개문 생성 프롬프트 15종
update products set demo_prompts = array[
  -- 앱스토어 짧은 설명
  'Write an App Store short description (max 255 characters) for [APP_NAME], a [CATEGORY] app that [MAIN_FEATURE]. Make it compelling and clear, highlight the key benefit, include a soft call-to-action. Output in Korean. Be concise and impactful.',
  -- 구글플레이 전체 설명
  'Write a Google Play Store full description for [APP_NAME]. Structure: 1) Opening hook (2 sentences), 2) Core features (5 bullet points with emojis), 3) Who is this for section, 4) Social proof placeholder, 5) Call to action. Total 500-800 characters. Output in Korean, optimized for Play Store search.',
  -- ASO 키워드 최적화
  'Analyze [APP_NAME] ([CATEGORY] app) and suggest: 1) 10 primary keywords for App Store/Play Store optimization, 2) 5 long-tail keyword phrases, 3) Competitor keywords to target, 4) Keywords to avoid, 5) Keyword density recommendations for the description. Focus on Korean market ASO best practices.',
  -- 업데이트 노트
  'Write App Store update notes for [APP_NAME] version [VERSION]. Changes include: [CHANGE_LIST]. Make the update notes: engaging (not just "bug fixes"), highlight user benefits, be honest about what changed, max 500 characters per store. Output Korean and English versions.'
], full_description = '앱스토어와 구글플레이에 최적화된 소개문 생성 프롬프트 모음입니다.

■ 포함 구성 (총 15종)
• 앱스토어 짧은 설명 (255자) — 3종
• 구글플레이 전체 설명 — 3종
• ASO 키워드 최적화 — 3종
• 한/영 동시 생성 — 3종
• 업데이트 노트 작성 — 3종

■ 특징
• 한국어 앱스토어 / 구글플레이 특성 최적화
• ASO (앱스토어 검색 최적화) 키워드 전략 포함
• 변수 교체만으로 즉시 사용 가능
• 인디 개발자 앱 출시 경험 기반 실전 프롬프트

■ 활용 대상
• 모바일 앱 개발자
• 인디 게임 출시 준비 중인 개발자
• 앱스토어 최적화가 필요한 1인 개발자'
where slug = 'app-game-description-prompts';

-- 상품 5: 무료 샘플 5종 (기존 5개 유지, 설명만 업데이트)
update products set full_description = '유료 패키지 구매 전 퀄리티를 직접 확인해보세요!
퍼즐 게임 BGM 프롬프트 50종 패키지에서 엄선한 5가지 샘플을 무료로 제공합니다.

■ 포함 프롬프트 (5종)
1. 로비 BGM — 릴렉싱한 피아노 + 글로켄슈필
2. 스테이지 BGM — 경쾌한 마림바 + 퍼커션
3. 던전 BGM — 미스터리 앰비언트
4. 스테이지 클리어 — 축하 징글 (4bar)
5. 타이틀 스크린 — 동화같은 멜로디

■ 사용 방법
Suno AI → Custom Mode 클릭 → Style 입력란에 프롬프트 붙여넣기

■ 다음 단계
마음에 드셨다면 프롬프트 50종 전체 패키지를 구매하세요!'
where slug = 'free-sample-game-bgm-5';


-- ============================================================
-- 3. seller_products updated_at 트리거
-- ============================================================

create trigger seller_products_updated_at
  before update on seller_products
  for each row execute function handle_updated_at();
