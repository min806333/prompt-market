import type { Category, Prompt, Review, Testimonial, SortOption, SearchFilters, Announcement, Collection } from "@/types";

export const categories: Category[] = [
  {
    id: "cat-1",
    name: "게임 음악",
    slug: "game-music",
    description: "BGM, OST, 효과음 등 게임 음악 제작용 프롬프트",
    icon: "🎵",
    sortOrder: 1,
  },
  {
    id: "cat-2",
    name: "기획/문서",
    slug: "planning-docs",
    description: "게임 기획서, 소개문, UI 텍스트 등 문서 작성 프롬프트",
    icon: "📄",
    sortOrder: 2,
  },
  {
    id: "cat-3",
    name: "영상/콘텐츠",
    slug: "video-content",
    description: "유튜브, 매드무비, 숏폼 콘텐츠 제작 프롬프트",
    icon: "🎬",
    sortOrder: 3,
  },
  {
    id: "cat-4",
    name: "앱/게임 소개",
    slug: "app-description",
    description: "앱스토어, 구글플레이 소개문 자동 생성 프롬프트",
    icon: "📱",
    sortOrder: 4,
  },
  {
    id: "cat-5",
    name: "AI 이미지",
    slug: "ai-image",
    description: "Midjourney, DALL-E, Stable Diffusion 이미지 생성 프롬프트",
    icon: "🎨",
    sortOrder: 5,
  },
  {
    id: "cat-6",
    name: "AI 영상",
    slug: "ai-video",
    description: "Runway, Sora, Kling, Pika 동영상 생성 프롬프트",
    icon: "🎥",
    sortOrder: 6,
  },
];

export const prompts: Prompt[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // PROD-1: 퍼즐 게임 BGM 50종 (Suno / MusicGen)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "prod-1",
    title: "퍼즐 게임 BGM 프롬프트 50종",
    slug: "puzzle-game-bgm-50",
    shortDescription: "Suno & MusicGen으로 바로 쓸 수 있는 퍼즐 게임 전용 BGM 프롬프트 50개 완전 모음",
    fullDescription: `퍼즐 게임에 최적화된 BGM 프롬프트 50종 모음입니다.

**포함 테마:**
- 로비 / 메인 메뉴 BGM (8종) — 밝고 환영하는 분위기
- 일반 스테이지 BGM (15종) — 집중력 유지, 루프 최적화
- 보스 스테이지 / 클리어 BGM (10종) — 긴장감→해방감 전환
- 집중 타임 / 타이머 BGM (7종) — 긴박감 고조
- 엔딩 / 크레딧 BGM (10종) — 따뜻한 마무리 감성

각 프롬프트는 Suno와 MusicGen 양쪽에서 테스트 완료된 실전형 프롬프트입니다.
분위기, BPM, 악기 구성, 루프 포인트까지 세밀하게 설정되어 바로 복붙해서 사용할 수 있습니다.`,
    price: 2.99,
    categoryId: "cat-1",
    category: categories[0],
    aiTools: ["Suno", "MusicGen"],
    difficulty: "beginner",
    promptCount: 50,
    previewImageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
    tags: ["퍼즐게임", "BGM", "Suno", "MusicGen", "게임음악", "루프"],
    version: "1.2",
    isFeatured: true,
    isFree: false,
    isBundle: false,
    isLimitedDrop: false,
    status: "approved",
    salesCount: 0,
    ratingAvg: 0,
    reviewCount: 0,
    fileUrls: [],
    externalBuyUrl: "",
    usageTips: [
      "Suno에서 Custom Mode를 켜고 Style 란에 프롬프트를 그대로 붙여넣으세요.",
      "BPM을 ±10 범위로 조정하면 같은 분위기에서 더 다양한 결과를 얻을 수 있습니다.",
      "'loopable' 키워드를 유지하면 게임 엔진에서 매끄럽게 루프되는 음악이 생성됩니다.",
      "MusicGen에서는 duration을 30~45초로 설정하고 프롬프트를 입력하세요.",
    ],
    exampleResults: [
      "Suno로 생성 시 평균 2~3번 시도 만에 상업용 수준의 퀄리티 달성",
      "Unity / Unreal 게임 프로젝트에 바로 적용 가능한 루프 음원 생성",
    ],
    samples: [
      {
        id: "s1-1", promptId: "prod-1", sortOrder: 1,
        sampleText: "upbeat cheerful puzzle game lobby music, warm xylophone melody with light pizzicato strings and soft glockenspiel accents, 118 BPM, major key, loopable seamless, bright and welcoming atmosphere that makes players want to start playing, no vocals, game soundtrack style",
      },
      {
        id: "s1-2", promptId: "prod-1", sortOrder: 2,
        sampleText: "focused calm puzzle stage background music, minimalist solo piano with soft reverb, gentle synth pads underneath, 88 BPM, C major, meditative and peaceful, subtle tension that builds concentration without distraction, loopable, no drums, ambient game music",
      },
      {
        id: "s1-3", promptId: "prod-1", sortOrder: 3,
        sampleText: "urgent puzzle timer countdown music, ticking clock-like percussion with fast arpeggiated piano, rising string tension, 145 BPM, minor key, anxious and pressured feeling, staccato notes emphasizing time passing, loopable short loop, game tension music",
      },
      {
        id: "s1-4", promptId: "prod-1", sortOrder: 4,
        sampleText: "triumphant puzzle stage clear fanfare, bright brass flourish with celebratory bells and sparkling chimes, 4-bar jingle, major key, energetic and rewarding, quick resolution of tension into joy, short victory sting, game UI sound",
      },
      {
        id: "s1-5", promptId: "prod-1", sortOrder: 5,
        sampleText: "mysterious enchanted puzzle dungeon BGM, dark ambient with slow arpeggiated harp, subtle choir pads, eerie music box melody, 72 BPM, D minor, slightly unsettling but intriguing, magical and ancient atmosphere, loopable, no percussion, game dungeon music",
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // ─────────────────────────────────────────────────────────────────────────
  // PROD-2: 게임 매드무비 음악 30종 (Suno / MusicGen)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "prod-2",
    title: "게임 매드무비 음악 프롬프트 30종",
    slug: "game-madmovie-music-30",
    shortDescription: "게임 매드무비·하이라이트 영상에 어울리는 강렬한 음악 프롬프트 30종",
    fullDescription: `게임 매드무비, 하이라이트 클립, 몽타주 영상 제작을 위한 음악 프롬프트 30종입니다.

**포함 스타일:**
- 하드코어 액션 (10종) — 강렬한 드롭, 메탈+EDM 퓨전
- 감성 슬로우 모션 구간 (8종) — 피아노+오케스트라 감성
- 클라이맥스 빌드업 (7종) — 점진적 에너지 상승
- 아웃트로 / 엔딩 (5종) — 여운 있는 마무리

유튜브, 틱톡, 릴스에서 저작권 위험 없이 사용 가능한 AI 생성 음악 제작용 프롬프트입니다.`,
    price: 2.99,
    categoryId: "cat-1",
    category: categories[0],
    aiTools: ["Suno", "MusicGen"],
    difficulty: "intermediate",
    promptCount: 30,
    previewImageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80",
    tags: ["매드무비", "게임영상", "Suno", "MusicGen", "유튜브", "하이라이트"],
    version: "1.0",
    isFeatured: true,
    isFree: false,
    isBundle: false,
    isLimitedDrop: false,
    status: "approved",
    salesCount: 0,
    ratingAvg: 0,
    reviewCount: 0,
    fileUrls: [],
    externalBuyUrl: "",
    usageTips: [
      "영상의 하이라이트 구간 직전에 'building to climax' 계열 프롬프트를 사용하세요.",
      "슬로우 모션 구간에는 70 BPM 이하의 감성 프롬프트가 가장 잘 맞습니다.",
      "Suno의 Extend 기능으로 영상 길이에 맞게 음악을 자연스럽게 늘릴 수 있습니다.",
    ],
    exampleResults: [
      "유튜브 게임 채널 매드무비에 적용 후 시청 유지율 평균 23% 상승",
      "저작권 Content-ID 클레임 0건 — 완전한 AI 생성 음악",
    ],
    samples: [
      {
        id: "s2-1", promptId: "prod-2", sortOrder: 1,
        sampleText: "epic cinematic game highlight montage music, powerful hybrid orchestral with heavy distorted electric guitar riffs, massive percussion hits, 138 BPM, E minor, intense and aggressive energy, full dynamic range from quiet to explosive, perfect for killstreak moments, no vocals",
      },
      {
        id: "s2-2", promptId: "prod-2", sortOrder: 2,
        sampleText: "emotional slow-motion gaming highlight, delicate piano melody with slowly swelling string orchestra, 65 BPM, A minor to A major resolution, melancholic yet ultimately triumphant, gradual crescendo from solo piano to full orchestra, cinematic game OST style",
      },
      {
        id: "s2-3", promptId: "prod-2", sortOrder: 3,
        sampleText: "hype build-up intro for gaming montage, starts with single snare hits and bass pulses, adding layers every 8 bars, trap hi-hats meeting orchestral risers, white noise sweep, 145 BPM, reaches full EDM drop at 32 bars, massive bass drop with choir stabs",
      },
      {
        id: "s2-4", promptId: "prod-2", sortOrder: 4,
        sampleText: "aggressive FPS game frag movie soundtrack, metalcore meets electronic, chugging downtuned guitar riffs with industrial synth bass, blast beat drums at 160 BPM, D minor, raw and relentless energy, breakdown section mid-track, dark and ruthless atmosphere",
      },
      {
        id: "s2-5", promptId: "prod-2", sortOrder: 5,
        sampleText: "nostalgic gaming montage outro, lo-fi chill hip-hop with retro game sound chip samples, warm vinyl crackle, mellow Rhodes piano, boom-bap drums at 82 BPM, bittersweet and reflective mood, fade-out ending, perfect for end-of-session highlights",
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // ─────────────────────────────────────────────────────────────────────────
  // PROD-3: 게임 기획서 프롬프트 번들 20종 (ChatGPT / Claude)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "prod-3",
    title: "게임 기획서 생성 프롬프트 번들",
    slug: "game-design-doc-bundle",
    shortDescription: "ChatGPT·Claude로 완성도 높은 게임 기획서를 빠르게 만드는 프롬프트 번들 20종",
    fullDescription: `인디 게임 개발자를 위한 게임 기획서 작성 프롬프트 번들 20종입니다.

**포함 항목:**
- 게임 컨셉 문서 (GDD) 전체 구조 생성 (4종)
- 핵심 게임 루프 설계 (3종)
- 캐릭터 설정서 및 NPC 관계도 (3종)
- 레벨 디자인 개요 및 난이도 곡선 (3종)
- 수익화 모델 및 아이템 기획 (3종)
- UI/UX 흐름 기획 (2종)
- 출시 전략 및 마케팅 기획 (2종)

[대괄호] 변수 치환 방식으로 설계되어 어떤 장르의 게임에도 즉시 적용 가능합니다.`,
    price: 2.99,
    categoryId: "cat-2",
    category: categories[1],
    aiTools: ["ChatGPT", "Claude"],
    difficulty: "beginner",
    promptCount: 20,
    previewImageUrl: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&q=80",
    tags: ["게임기획", "GDD", "ChatGPT", "Claude", "인디게임", "기획서"],
    version: "1.1",
    isFeatured: true,
    isFree: false,
    isBundle: true,
    isLimitedDrop: false,
    status: "approved",
    salesCount: 0,
    ratingAvg: 0,
    reviewCount: 0,
    fileUrls: [],
    externalBuyUrl: "",
    usageTips: [
      "[대괄호] 안의 변수를 실제 게임 정보로 교체한 뒤 프롬프트를 실행하세요.",
      "Claude 3.5 Sonnet에서 특히 구조적이고 상세한 결과가 나옵니다.",
      "GPT-4o 사용 시 프롬프트 앞에 'Think step by step'을 추가하면 더 탄탄한 기획서가 생성됩니다.",
      "한 번에 전체 GDD를 요청하기보다 섹션별로 순서대로 생성하는 방식을 추천합니다.",
    ],
    exampleResults: [
      "GPT-4o로 5분 안에 10페이지 분량의 GDD 초안 완성",
      "인디 게임 출품작 기획서 작성 시간 4시간 → 40분으로 단축",
    ],
    samples: [
      {
        id: "s3-1", promptId: "prod-3", sortOrder: 1,
        sampleText: `You are a senior game designer at a top indie studio. Create a comprehensive Game Design Document (GDD) outline for a [GENRE] game titled "[GAME_TITLE]" targeting [TARGET_PLATFORM] for [TARGET_AUDIENCE].

Structure the document with these sections:
1. Executive Summary (elevator pitch, unique selling point, target market)
2. Core Concept (theme, setting, tone, art direction)
3. Core Gameplay Loop (moment-to-moment, session loop, long-term loop)
4. Key Mechanics (list top 5 mechanics with detailed descriptions)
5. Progression System (levels, unlocks, difficulty curve)
6. Monetization Strategy

Format as a professional document in Korean. Be specific and actionable.`,
      },
      {
        id: "s3-2", promptId: "prod-3", sortOrder: 2,
        sampleText: `You are a game systems designer. Design a detailed core game loop for "[GAME_NAME]", a [GENRE] game.

Provide:
1. Micro Loop (30 seconds ~ 3 minutes): What does the player do moment-to-moment?
2. Macro Loop (1 session, 15~30 minutes): What is the session goal and reward?
3. Meta Loop (long-term, days/weeks): What keeps players coming back?
4. Player Psychology: What emotions does each loop trigger? (challenge, mastery, curiosity, social)
5. Retention Hooks: List 5 specific mechanics that create daily return motivation

Include concrete examples for each loop stage. Output in Korean with English game terms preserved.`,
      },
      {
        id: "s3-3", promptId: "prod-3", sortOrder: 3,
        sampleText: `You are a narrative designer. Create a detailed character design document for the protagonist of "[GAME_NAME]", a [GENRE] game.

Include:
1. Character Overview (name, age, background, personality in 3 adjectives)
2. Backstory (origin, key life events that shaped them, motivation)
3. Personality Matrix (MBTI or equivalent, strengths, flaws, fears, desires)
4. Character Arc (where they start → key turning points → where they end)
5. Relationships (list 3 key NPCs: ally, rival, mentor — with relationship dynamics)
6. Visual Design Notes (silhouette, color palette, key design elements)
7. Voice and Dialogue Style (tone, speech patterns, memorable catchphrases)

Format as a character bible document in Korean.`,
      },
      {
        id: "s3-4", promptId: "prod-3", sortOrder: 4,
        sampleText: `You are a monetization specialist for mobile games. Design a complete monetization model for "[GAME_NAME]", a [GENRE] [PLATFORM] game with [BUSINESS_MODEL: free-to-play / premium / freemium].

Provide:
1. Primary Revenue Stream (IAP structure / subscription / one-time purchase)
2. Virtual Economy Design (currency types, earn vs spend balance, whale vs dolphin vs minnow segmentation)
3. Premium Items List (cosmetics, gameplay boosters, convenience items — with psychological pricing)
4. Battle Pass / Season Pass structure (if applicable)
5. Ethical Design Considerations (avoiding pay-to-win, dark patterns to avoid)
6. Revenue Projections (rough estimates for 10K DAU scenario)

Output in Korean with specific price points in USD and KRW.`,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // ─────────────────────────────────────────────────────────────────────────
  // PROD-4: 앱·게임 소개문 15종 (ChatGPT / Claude)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "prod-4",
    title: "앱·게임 소개문 생성 프롬프트",
    slug: "app-game-description-prompts",
    shortDescription: "앱스토어 & 구글플레이 소개문을 ChatGPT로 5분 만에 완성하는 ASO 최적화 프롬프트 15종",
    fullDescription: `앱스토어와 구글플레이에 최적화된 앱·게임 소개문 생성 프롬프트 15종 모음입니다.

**포함 항목:**
- 앱스토어 짧은 설명 (255자 제한) 생성 프롬프트 (3종)
- 구글플레이 전체 설명 (4000자) 생성 프롬프트 (3종)
- ASO 키워드 최적화 프롬프트 (2종)
- 한국어 / 영어 동시 생성 프롬프트 (3종)
- 업데이트 노트 / 릴리즈 노트 작성 프롬프트 (2종)
- A/B 테스트용 다중 버전 생성 프롬프트 (2종)

실제 앱스토어 심사를 통과한 소개문 패턴을 기반으로 제작되었습니다.`,
    price: 2.99,
    categoryId: "cat-4",
    category: categories[3],
    aiTools: ["ChatGPT", "Claude"],
    difficulty: "beginner",
    promptCount: 15,
    previewImageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
    tags: ["앱소개", "앱스토어", "구글플레이", "ASO", "ChatGPT", "마케팅"],
    version: "1.0",
    isFeatured: false,
    isFree: false,
    isBundle: false,
    isLimitedDrop: false,
    status: "approved",
    salesCount: 0,
    ratingAvg: 0,
    reviewCount: 0,
    fileUrls: [],
    externalBuyUrl: "",
    usageTips: [
      "[대괄호] 변수를 실제 앱 정보로 교체하세요. APP_NAME, CATEGORY, MAIN_FEATURE가 핵심입니다.",
      "앱스토어용은 반드시 255자 이하 확인 후 제출하세요 (공백 포함).",
      "구글플레이는 첫 167자가 가장 중요합니다 — 키워드를 앞부분에 집중 배치하세요.",
      "GPT-4o 사용 시 temperature를 0.7로 설정하면 창의적이면서도 자연스러운 문장이 생성됩니다.",
    ],
    exampleResults: [
      "앱스토어 소개문 작성 시간 평균 2시간 → 8분으로 단축",
      "ASO 최적화 적용 후 키워드 검색 노출 순위 평균 18단계 상승",
    ],
    samples: [
      {
        id: "s4-1", promptId: "prod-4", sortOrder: 1,
        sampleText: `You are an expert App Store copywriter with 10 years of ASO experience. Write a compelling App Store short description for:

App Name: [APP_NAME]
Category: [CATEGORY] (e.g., Puzzle Game / Fitness / Productivity)
Core Feature: [MAIN_FEATURE]
Target User: [TARGET_USER]
Unique Selling Point: [USP]

Requirements:
- Maximum 255 characters including spaces
- Start with the strongest benefit, not the app name
- Include 1-2 primary ASO keywords naturally
- End with a subtle call-to-action
- Tone: [TONE: fun and playful / professional / motivational]

Output ONLY the final description text in Korean. No explanations.`,
      },
      {
        id: "s4-2", promptId: "prod-4", sortOrder: 2,
        sampleText: `You are a Google Play Store optimization specialist. Write a full app description for Google Play:

App: [APP_NAME] — [ONE_LINE_DESCRIPTION]
Key Features (list 3-5): [FEATURES]
Target Audience: [AUDIENCE]
Primary Keywords: [KEYWORDS]

Structure the description as:
1. Hook paragraph (2-3 sentences, lead with the #1 user benefit)
2. Feature list with emojis (5-7 bullet points using ✅ or 🎯 or relevant emojis)
3. Social proof paragraph (mention user ratings, downloads, or awards if available — use [INSERT_STATS] placeholder if unknown)
4. Call-to-action closing sentence

Total length: 2500-3500 characters. Naturally embed [KEYWORDS] throughout.
Output in Korean. Preserve app feature names in English if they are brand terms.`,
      },
      {
        id: "s4-3", promptId: "prod-4", sortOrder: 3,
        sampleText: `You are an ASO keyword research expert. Generate an optimized keyword strategy for:

App: [APP_NAME]
Category: [APP_CATEGORY]
Primary Function: [WHAT_THE_APP_DOES]
Competitor Apps: [COMPETITOR_1], [COMPETITOR_2] (optional)

Provide:
1. Primary Keywords (5): highest search volume, directly relevant
2. Secondary Keywords (10): medium competition, specific use cases
3. Long-tail Keywords (10): low competition, high intent
4. Negative Keywords (5): terms to avoid that attract wrong users
5. Seasonal Keywords (3): time-sensitive terms relevant to this app

For each keyword provide: Korean term | English term | estimated competition level (Low/Medium/High)

Format as a table. Focus on Korean App Store keywords.`,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // ─────────────────────────────────────────────────────────────────────────
  // PROD-5: 무료 샘플 5종
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "prod-5",
    title: "무료 샘플 — 게임 BGM 프롬프트 5종",
    slug: "free-sample-game-bgm-5",
    shortDescription: "퍼즐 게임 BGM 프롬프트 50종 패키지의 무료 샘플 5종 — 품질을 직접 확인해보세요",
    fullDescription: `유료 패키지 구매 전 퀄리티를 직접 체험해보세요.
퍼즐 게임 BGM 프롬프트 50종 중 엄선한 5종을 무료로 제공합니다.

Suno 또는 MusicGen에 그대로 붙여넣어 바로 사용 가능합니다.`,
    price: 0,
    categoryId: "cat-1",
    category: categories[0],
    aiTools: ["Suno", "MusicGen"],
    difficulty: "beginner",
    promptCount: 5,
    previewImageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
    tags: ["무료", "샘플", "퍼즐게임", "BGM", "Suno"],
    version: "1.0",
    isFeatured: false,
    isFree: true,
    isBundle: false,
    isLimitedDrop: false,
    status: "approved",
    salesCount: 0,
    ratingAvg: 0,
    reviewCount: 0,
    fileUrls: [],
    usageTips: [
      "Suno Custom Mode의 Style 입력란에 프롬프트를 그대로 붙여넣어 사용하세요.",
      "MusicGen에서는 duration=30을 설정하면 게임에 적합한 길이의 루프가 생성됩니다.",
    ],
    samples: [
      {
        id: "s5-1", promptId: "prod-5", sortOrder: 1,
        sampleText: "relaxing cozy puzzle game main theme, soft piano melody with gentle glockenspiel countermelody, warm acoustic guitar fingerpicking, 98 BPM, F major, peaceful and inviting, seamless loopable, no drums, suitable for menu screen background",
      },
      {
        id: "s5-2", promptId: "prod-5", sortOrder: 2,
        sampleText: "energetic time-attack puzzle stage music, upbeat marimba with bouncy staccato strings, playful woodwind ornaments, light snare and hi-hat percussion, 126 BPM, G major, cheerful and motivating, great for stages with time limit pressure, loopable",
      },
      {
        id: "s5-3", promptId: "prod-5", sortOrder: 3,
        sampleText: "mysterious underwater puzzle world BGM, ambient bubble sound textures, slow arpeggiated harp with detuned synth pads, occasional distant whale song, 74 BPM, B minor, dreamy and slightly surreal, infinite seamless loop, no percussion",
      },
      {
        id: "s5-4", promptId: "prod-5", sortOrder: 4,
        sampleText: "joyful puzzle completion celebration sting, bright orchestral swell with brass fanfare and cascading bells, 4-bar resolution from tension to triumph, 120 BPM, D major, rewarding and satisfying feeling, short 8-second jingle format, game UI victory sound",
      },
      {
        id: "s5-5", promptId: "prod-5", sortOrder: 5,
        sampleText: "whimsical puzzle game title screen music, charming toy piano melody with music box accompaniment, light triangle and soft choir oohs, 105 BPM, A major, magical and nostalgic, evokes curiosity and wonder, loopable, suitable for children and casual players",
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // ─────────────────────────────────────────────────────────────────────────
  // PROD-6: Midjourney 캐릭터 디자인 30종
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "prod-6",
    title: "Midjourney 캐릭터 디자인 프롬프트 30종",
    slug: "midjourney-character-design-30",
    shortDescription: "Midjourney v6·DALL-E 3으로 바로 쓸 수 있는 게임·웹툰 캐릭터 디자인 프롬프트 30종",
    fullDescription: `게임 캐릭터, 웹툰, 컨셉 아트에 최적화된 Midjourney v6 / DALL-E 3 프롬프트 30종 모음입니다.

**포함 테마:**
- 판타지 전사 / 마법사 캐릭터 (8종) — RPG, MMORPG용
- 인디 게임 픽셀 / 미니멀 스타일 (5종) — 귀엽고 단순한 디자인
- 다크 판타지 / 소울라이크 스타일 (5종) — 무겁고 디테일한 아머
- 캐주얼 / SD (슈퍼 디포르메) 캐릭터 (6종) — 모바일 게임용
- 사이버펑크 / SF 캐릭터 (6종) — 미래적이고 세련된 디자인

각 프롬프트는 --ar, --v 6, --stylize, --quality 파라미터까지 최적화되어 있어 그대로 붙여넣어 사용 가능합니다.`,
    price: 2.99,
    categoryId: "cat-5",
    category: categories[4],
    aiTools: ["Midjourney", "DALL-E 3", "Stable Diffusion"],
    difficulty: "beginner",
    promptCount: 30,
    previewImageUrl: "https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=800&q=80",
    tags: ["Midjourney", "캐릭터디자인", "컨셉아트", "AI이미지", "게임캐릭터", "DALL-E"],
    version: "1.0",
    isFeatured: true,
    isFree: false,
    isBundle: false,
    isLimitedDrop: false,
    status: "approved",
    salesCount: 0,
    ratingAvg: 0,
    reviewCount: 0,
    fileUrls: [],
    externalBuyUrl: "",
    usageTips: [
      "--seed 값을 고정하면 같은 캐릭터의 다양한 포즈와 표정을 일관성 있게 생성할 수 있습니다.",
      "--stylize 50 = 사실적, --stylize 200 = 예술적. 게임 스타일에 맞게 조절하세요.",
      "DALL-E 3 사용 시 Midjourney 파라미터(--v, --ar 등)는 제거하고 스타일 설명만 남기세요.",
      "캐릭터 시트가 필요하면 'character sheet, front view, side view, back view' 키워드를 추가하세요.",
    ],
    exampleResults: [
      "판타지 RPG 전사 컨셉 아트: 평균 2~3회 시도 만에 상업용 수준 완성",
      "인디 게임 캐릭터 30종 제작 기간 3주 → 3일로 단축",
    ],
    samples: [
      {
        id: "s6-1", promptId: "prod-6", sortOrder: 1,
        sampleText: "a fierce female knight commander in ornate silver and gold plate armor, deep crimson cape flowing behind her, glowing blue arcane runes engraved on the breastplate, battle-worn but regal, dramatic three-quarter pose, cinematic rim lighting, painterly concept art style for AAA fantasy game, highly detailed metalwork and fabric, dark stone throne room background, hyperrealistic --ar 2:3 --v 6 --stylize 180 --q 2",
      },
      {
        id: "s6-2", promptId: "prod-6", sortOrder: 2,
        sampleText: "cute chibi indie game protagonist, small boy with oversized magical staff, fluffy white robe with star patterns, big expressive eyes, short spiky brown hair, simple clean vector art style, pastel purple and cream color palette, white background, full body character sheet, game asset ready for mobile RPG --ar 1:1 --v 6 --stylize 60 --q 2",
      },
      {
        id: "s6-3", promptId: "prod-6", sortOrder: 3,
        sampleText: "dark souls inspired undead knight, massive decaying plate armor covered in cracks and rust, tattered black cape, hollow glowing eye sockets in dark helm, gripping an enormous greatsword, dramatic low-angle shot, volumetric fog, cathedral ruins background with god rays, dark gothic atmosphere, ultra-detailed engravings and damage marks on armor, cinematic game art --ar 2:3 --v 6 --stylize 220 --q 2",
      },
      {
        id: "s6-4", promptId: "prod-6", sortOrder: 4,
        sampleText: "cyberpunk female hacker character, sleek black tactical bodysuit with neon blue circuit pattern lines, cybernetic left arm with exposed wiring and LED accents, short electric blue hair with shaved side, holographic visor over one eye, confident leaning pose against a server tower, rain-soaked neon-lit alleyway background, cinematic portrait, game concept art style --ar 2:3 --v 6 --stylize 160 --q 2",
      },
      {
        id: "s6-5", promptId: "prod-6", sortOrder: 5,
        sampleText: "charming casual mobile game character, cheerful fox-girl merchant with big fluffy tail and ears, wearing an oversized adventurer backpack, warm orange and white color scheme, soft rounded shapes, expressive sparkly eyes, friendly wave pose, clean white background, super deformed SD style for gacha game UI --ar 1:1 --v 6 --stylize 80 --q 2",
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // ─────────────────────────────────────────────────────────────────────────
  // PROD-7: AI 영상 생성 프롬프트 20종 (Runway / Kling / Pika)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "prod-7",
    title: "AI 영상 생성 프롬프트 번들 20종",
    slug: "ai-video-generation-bundle-20",
    shortDescription: "Runway Gen-3, Kling AI, Pika로 고퀄리티 영상을 바로 만드는 시네마틱 프롬프트 20종",
    fullDescription: `Runway Gen-3 Alpha, Kling AI v1, Pika Labs에서 검증된 영상 생성 프롬프트 20종 번들입니다.

**포함 테마:**
- 게임 트레일러 / 시네마틱 장면 (5종) — 장엄하고 박진감 있는 영상
- 자연 / 환경 분위기 영상 (4종) — 게임 세계관 표현용
- 캐릭터 애니메이션 장면 (4종) — 인트로/아웃트로 컷씬
- 제품·앱 광고 / 소셜미디어 영상 (4종) — 숏폼 광고 소재
- 추상 아트 / 비주얼 이펙트 (3종) — 로딩 화면, 배경 영상

각 프롬프트는 카메라 무브먼트, 조명 조건, 시간대, 시각 효과까지 세밀하게 설정되어 있습니다.`,
    price: 2.99,
    categoryId: "cat-6",
    category: categories[5],
    aiTools: ["Runway", "Kling AI", "Pika Labs"],
    difficulty: "intermediate",
    promptCount: 20,
    previewImageUrl: "https://images.unsplash.com/photo-1574717025058-2f8737d2e2b7?w=800&q=80",
    tags: ["Runway", "Kling", "Pika", "AI영상", "시네마틱", "게임트레일러"],
    version: "1.0",
    isFeatured: true,
    isFree: false,
    isBundle: true,
    isLimitedDrop: false,
    status: "approved",
    salesCount: 0,
    ratingAvg: 0,
    reviewCount: 0,
    fileUrls: [],
    externalBuyUrl: "",
    usageTips: [
      "Runway Gen-3에서 최상의 결과를 위해 프롬프트 앞에 'cinematic, 4K ultra HD, photorealistic'을 추가하세요.",
      "Kling AI는 카메라 무브먼트 묘사에 특히 강합니다. 'slow push in', 'orbital shot' 등 구체적 카메라 언어를 활용하세요.",
      "5초 클립 여러 개를 생성 후 CapCut, Premiere Pro에서 연결하는 방식을 추천합니다.",
      "Pika는 루프 영상에 강점이 있습니다. 배경 영상이나 로딩 화면용으로 활용하세요.",
    ],
    exampleResults: [
      "게임 인디 트레일러 시네마틱 컷씬 제작 기간 2주 → 2일로 단축",
      "소셜미디어 광고 영상 소재를 하루 만에 15개 이상 생성한 사례",
    ],
    samples: [
      {
        id: "s7-1", promptId: "prod-7", sortOrder: 1,
        sampleText: "ancient enchanted forest at golden hour dawn, shafts of warm sunlight filtering through towering redwood trees, soft morning mist rising slowly from the mossy carpet floor, a single white deer walks calmly into frame from the right, birds gently taking flight in the background, camera slowly pushes forward at ground level following the deer, photorealistic, cinematic color grading, 4K ultra HD, no camera shake",
      },
      {
        id: "s7-2", promptId: "prod-7", sortOrder: 2,
        sampleText: "lone cyberpunk warrior walking through a rain-soaked megacity street at night, heavy neon signs reflecting in puddles below, steam rising from grates, holographic advertisements flickering on skyscrapers, camera tracks behind the character at shoulder height, then slowly cranes up to reveal the full city skyline, volumetric fog, blade runner aesthetic, cinematic anamorphic lens flare, ultra HD",
      },
      {
        id: "s7-3", promptId: "prod-7", sortOrder: 3,
        sampleText: "dramatic game title reveal cinematic, massive stone gate covered in glowing golden runes slowly opening, epic dust particles catching the light streaming through the gap, beyond the gate a vast fantasy kingdom bathed in twilight, low angle looking up at the gate, camera slowly dollies forward as the gate opens, booming orchestral energy implied through visual tension, 4K photorealistic, game trailer style",
      },
      {
        id: "s7-4", promptId: "prod-7", sortOrder: 4,
        sampleText: "mesmerizing abstract looping background for app loading screen, flowing liquid metal in deep navy and gold swirling in slow motion, iridescent light refractions creating rainbow caustics, smooth organic motion with no hard cuts, perfect for seamless loop, dark luxury aesthetic, 4K resolution, suitable as animated background for premium app or game splash screen",
      },
      {
        id: "s7-5", promptId: "prod-7", sortOrder: 5,
        sampleText: "mobile game advertisement short clip, an excited young player's hands holding a glowing smartphone, magical particles and game characters appearing to leap out of the screen into the real world in augmented reality style, warm natural living room lighting, close-up then pull back to reveal the person's delighted expression, upbeat and energetic, 9:16 vertical format for TikTok and Instagram Reels",
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Legacy alias
export const products = prompts;

export const testimonials: Testimonial[] = [
  {
    id: "t-1",
    authorName: "김민준",
    authorRole: "인디 게임 개발자",
    quote: "퍼즐 게임 BGM 프롬프트 50종 덕분에 사운드 작업 시간이 90% 줄었어요. Suno에서 바로 붙여넣으면 퀄리티 높은 음악이 뚝딱 나와서 정말 놀랐습니다.",
    rating: 5,
  },
  {
    id: "t-2",
    authorName: "이수연",
    authorRole: "유튜브 게임 크리에이터",
    quote: "매드무비 음악 프롬프트로 드디어 저작권 걱정 없는 배경음악을 만들게 됐어요. 하이라이트 영상 조회수가 확실히 올랐습니다!",
    rating: 5,
  },
  {
    id: "t-3",
    authorName: "박지호",
    authorRole: "1인 앱 개발자",
    quote: "게임 기획서 프롬프트 번들을 써봤는데 아이디어가 막힐 때 정말 유용해요. ChatGPT에 변수만 바꿔 넣으면 탄탄한 기획서 초안이 나옵니다.",
    rating: 5,
  },
  {
    id: "t-4",
    authorName: "최유진",
    authorRole: "게임 1인 개발자",
    quote: "50종이나 들어있어서 다양하게 테스트해볼 수 있었어요. 타이머 BGM 프롬프트가 특히 좋았습니다. 유료 에셋 구매 비용이 확 줄었어요.",
    rating: 5,
  },
  {
    id: "t-5",
    authorName: "강다현",
    authorRole: "숏폼 콘텐츠 크리에이터",
    quote: "AI 영상 프롬프트로 릴스 배경음악이랑 썸네일을 한 번에 뽑았어요. 예전엔 하루 걸리던 작업이 이제 30분이에요. 진짜 혁신입니다.",
    rating: 5,
  },
  {
    id: "t-6",
    authorName: "황민서",
    authorRole: "프리랜서 UI 디자이너",
    quote: "Midjourney 프롬프트 번들 덕분에 클라이언트용 목업 이미지 퀄리티가 완전히 달라졌어요. --ar, --stylize 파라미터까지 다 담겨있어서 바로 쓸 수 있었습니다.",
    rating: 5,
  },
  {
    id: "t-7",
    authorName: "윤정훈",
    authorRole: "모바일 게임 개발자",
    quote: "앱스토어 소개문 작성에 항상 시간을 너무 쏟았는데, 이 프롬프트 쓰니까 10분 만에 완성됐어요. 한/영 동시 생성까지 되니까 해외 출시가 훨씬 편해졌습니다.",
    rating: 5,
  },
  {
    id: "t-8",
    authorName: "손미래",
    authorRole: "유튜브 쇼츠 크리에이터",
    quote: "영상/콘텐츠 카테고리 프롬프트로 Kling AI 영상을 만들었는데 첫 시도에 원하는 결과가 나왔어요. 구매 전에 Playground에서 테스트해볼 수 있는 게 정말 좋았습니다.",
    rating: 5,
  },
  {
    id: "t-9",
    authorName: "임채원",
    authorRole: "인디 스튜디오 대표",
    quote: "게임 기획부터 BGM, 소개문까지 프롬프트 번들 하나로 다 해결했어요. 팀 없이 혼자 출시한 게임에서 사운드 퀄리티로 리뷰를 많이 받았습니다.",
    rating: 5,
  },
  {
    id: "t-10",
    authorName: "오지현",
    authorRole: "AI 툴 유튜버",
    quote: "구독자들에게 소개할 AI 프롬프트 사이트를 찾다가 여기를 발견했어요. Playground에서 직접 테스트하고 구매할 수 있는 구조가 신뢰감을 줍니다.",
    rating: 5,
  },
  {
    id: "t-11",
    authorName: "정현우",
    authorRole: "웹 개발자 & 사이드 프로젝터",
    quote: "주말에 사이드 프로젝트로 게임을 만드는데 BGM이 항상 발목을 잡았어요. 이제는 퇴근 후 30분 안에 퀄리티 있는 배경음악이 나와요. 완전히 게임 체인저입니다.",
    rating: 5,
  },
  {
    id: "t-12",
    authorName: "나소연",
    authorRole: "1인 콘텐츠 사업자",
    quote: "이미지, 영상, 텍스트 프롬프트를 한 곳에서 다 살 수 있어서 정말 편해요. 각각 사이트를 찾아다니던 시간이 완전히 사라졌어요. 강력 추천합니다!",
    rating: 5,
  },
];

export function getPromptBySlug(slug: string): Prompt | undefined {
  return prompts.find((p) => p.slug === slug);
}

export function getProductBySlug(slug: string): Prompt | undefined {
  return getPromptBySlug(slug);
}

export function filterAndSortPrompts(
  filters: SearchFilters,
  sort: SortOption,
  page = 1,
  pageSize = 12
): { items: Prompt[]; total: number } {
  let result = prompts.filter((p) => p.status === "approved");

  if (filters.query) {
    const q = filters.query.toLowerCase();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }
  if (filters.category) {
    result = result.filter((p) => p.category?.slug === filters.category);
  }
  if (filters.aiTool) {
    result = result.filter((p) => p.aiTools.includes(filters.aiTool!));
  }
  if (filters.difficulty) {
    result = result.filter((p) => p.difficulty === filters.difficulty);
  }
  if (filters.minPrice !== undefined) {
    result = result.filter((p) => p.price >= filters.minPrice!);
  }
  if (filters.maxPrice !== undefined) {
    result = result.filter((p) => p.price <= filters.maxPrice!);
  }
  if (filters.minRating !== undefined) {
    result = result.filter((p) => p.ratingAvg >= filters.minRating!);
  }
  if (filters.isFree) {
    result = result.filter((p) => p.isFree);
  }

  switch (sort) {
    case "popular":
      result = [...result].sort((a, b) => b.salesCount - a.salesCount);
      break;
    case "price_asc":
      result = [...result].sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      result = [...result].sort((a, b) => b.price - a.price);
      break;
    case "rating":
      result = [...result].sort((a, b) => b.ratingAvg - a.ratingAvg);
      break;
    case "newest":
    default:
      result = [...result].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }

  const total = result.length;
  const items = result.slice((page - 1) * pageSize, page * pageSize);
  return { items, total };
}

export function getFeaturedProducts(): Prompt[] {
  return prompts.filter((p) => p.isFeatured && p.status === "approved");
}

export function getRelatedProducts(prompt: Prompt, limit = 3): Prompt[] {
  return prompts
    .filter((p) => p.category?.slug === prompt.category?.slug && p.id !== prompt.id && p.status === "approved")
    .slice(0, limit);
}

export function getReviewsByProduct(promptId: string): Review[] {
  return reviews.filter((r) => r.promptId === promptId);
}

export function getAverageRating(promptId: string): number {
  const productReviews = getReviewsByProduct(promptId);
  if (productReviews.length === 0) return 0;
  const avg = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
  return Math.round(avg * 10) / 10;
}

export function searchProducts(query: string): Prompt[] {
  if (!query) return prompts.filter((p) => p.status === "approved");
  const q = query.toLowerCase();
  return prompts.filter(
    (p) =>
      p.status === "approved" &&
      (p.title.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.aiTools.some((t) => t.toLowerCase().includes(q)))
  );
}

export const reviews: Review[] = [];

export const announcements: Announcement[] = [];

export const collections: Collection[] = [
  {
    id: "col-1",
    title: "게임 개발자 필수 팩",
    slug: "game-dev",
    description: "인디 게임 개발의 모든 단계에 필요한 BGM, 기획서, 소개문 프롬프트 모음",
    icon: "🎮",
    promptSlugs: ["puzzle-game-bgm-50", "game-madmovie-music-30", "game-design-doc-bundle"],
  },
  {
    id: "col-2",
    title: "유튜브 크리에이터 팩",
    slug: "youtube-creators",
    description: "유튜브 영상 제작, BGM, 소개문 작성을 위한 프롬프트 모음",
    icon: "▶️",
    promptSlugs: ["game-madmovie-music-30", "ai-video-generation-bundle-20"],
  },
  {
    id: "col-3",
    title: "앱 출시 준비 팩",
    slug: "app-launch",
    description: "앱스토어·구글플레이 소개문부터 게임 기획까지 앱 출시에 필요한 모든 것",
    icon: "📱",
    promptSlugs: ["app-game-description-prompts", "game-design-doc-bundle"],
  },
  {
    id: "col-4",
    title: "AI 크리에이터 팩",
    slug: "ai-creator",
    description: "Midjourney 캐릭터 디자인부터 AI 영상 생성까지 비주얼 크리에이터를 위한 모음",
    icon: "🎨",
    promptSlugs: ["midjourney-character-design-30", "ai-video-generation-bundle-20"],
  },
  {
    id: "col-5",
    title: "무료 시작 팩",
    slug: "free-starter",
    description: "무료로 AI 프롬프트를 체험할 수 있는 샘플 모음",
    icon: "🆓",
    promptSlugs: ["free-sample-game-bgm-5"],
  },
];

export function getCollection(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}

export function getCollectionPrompts(collection: Collection): Prompt[] {
  return collection.promptSlugs
    .map((s) => prompts.find((p) => p.slug === s))
    .filter(Boolean) as Prompt[];
}
