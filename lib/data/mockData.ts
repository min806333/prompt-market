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
  {
    id: "prod-1",
    title: "퍼즐 게임 BGM 프롬프트 50종",
    slug: "puzzle-game-bgm-50",
    shortDescription: "Suno & Udio로 바로 쓸 수 있는 퍼즐 게임 전용 BGM 프롬프트 50개 완전 모음",
    fullDescription: `퍼즐 게임에 최적화된 BGM 프롬프트 50종 모음입니다.

**포함 테마:**
- 로비 / 메인 메뉴 BGM (8종)
- 일반 스테이지 BGM (15종)
- 보스 스테이지 / 클리어 BGM (10종)
- 집중 타임 / 타이머 BGM (7종)
- 엔딩 / 크레딧 BGM (10종)

각 프롬프트는 Suno와 Udio 양쪽에서 테스트 완료된 실전형 프롬프트입니다.
분위기, BPM, 악기 구성까지 세밀하게 설정되어 바로 복붙해서 사용할 수 있습니다.`,
    price: 12.99,
    categoryId: "cat-1",
    category: categories[0],
    aiTools: ["Suno", "Udio"],
    difficulty: "beginner",
    promptCount: 50,
    previewImageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
    tags: ["퍼즐게임", "BGM", "Suno", "Udio", "게임음악"],
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
    externalBuyUrl: "https://example.com/buy/puzzle-bgm-50",
    samples: [
      { id: "s1-1", promptId: "prod-1", sortOrder: 1, sampleText: "Upbeat and playful puzzle game lobby BGM, chiptune mixed with light orchestral, 120 BPM, loopable, bright and welcoming atmosphere" },
      { id: "s1-2", promptId: "prod-1", sortOrder: 2, sampleText: "Focused puzzle stage background music, minimalist piano and soft synth pads, 90 BPM, calm tension building, loop-friendly" },
      { id: "s1-3", promptId: "prod-1", sortOrder: 3, sampleText: "Victory fanfare for puzzle game stage clear, cheerful brass section with sparkle sound effects, 4 bars, triumphant and cute" },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-2",
    title: "게임 매드무비 음악 프롬프트 30종",
    slug: "game-madmovie-music-30",
    shortDescription: "게임 매드무비·하이라이트 영상에 어울리는 강렬한 음악 프롬프트 30종",
    fullDescription: `게임 매드무비, 하이라이트 클립, 몽타주 영상 제작을 위한 음악 프롬프트 30종입니다.

**포함 스타일:**
- 하드코어 액션 (10종)
- 감성 슬로우 모션 구간 (8종)
- 클라이맥스 빌드업 (7종)
- 아웃트로 / 엔딩 (5종)

유튜브 비공개 게시물에서도 저작권 위험 없이 사용 가능한 AI 생성 음악 제작을 위한 프롬프트입니다.`,
    price: 9.99,
    categoryId: "cat-1",
    category: categories[0],
    aiTools: ["Suno", "Udio"],
    difficulty: "intermediate",
    promptCount: 30,
    previewImageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80",
    tags: ["매드무비", "게임영상", "Suno", "Udio", "유튜브"],
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
    externalBuyUrl: "https://example.com/buy/madmovie-30",
    samples: [
      { id: "s2-1", promptId: "prod-2", sortOrder: 1, sampleText: "Epic cinematic game montage music, heavy electric guitar riffs with orchestral strings, 140 BPM, intense and powerful, building to climax" },
      { id: "s2-2", promptId: "prod-2", sortOrder: 2, sampleText: "Emotional slow-motion gaming highlight, piano melody with swelling strings, 70 BPM, melancholic yet triumphant" },
      { id: "s2-3", promptId: "prod-2", sortOrder: 3, sampleText: "High-energy FPS game killstreak soundtrack, aggressive EDM drops with metal influence, 150 BPM, adrenaline pumping" },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-3",
    title: "게임 기획서 생성 프롬프트 번들",
    slug: "game-design-doc-bundle",
    shortDescription: "ChatGPT·Claude로 완성도 높은 게임 기획서를 빠르게 만드는 프롬프트 번들",
    fullDescription: `인디 게임 개발자를 위한 게임 기획서 작성 프롬프트 번들입니다.

**포함 항목:**
- 게임 컨셉 문서 (GDD) 기본 구조 생성 프롬프트
- 게임 루프 설계 프롬프트
- 캐릭터 설정서 생성 프롬프트
- 레벨 디자인 개요 프롬프트
- 수익화 모델 제안 프롬프트

각 프롬프트는 변수 치환 방식으로 설계되어 게임 장르와 타겟을 입력하면 즉시 맞춤형 기획서를 생성합니다.`,
    price: 14.99,
    categoryId: "cat-2",
    category: categories[1],
    aiTools: ["ChatGPT", "Claude"],
    difficulty: "beginner",
    promptCount: 20,
    previewImageUrl: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&q=80",
    tags: ["게임기획", "GDD", "ChatGPT", "Claude", "인디게임"],
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
    externalBuyUrl: "https://example.com/buy/game-gdd-bundle",
    samples: [
      { id: "s3-1", promptId: "prod-3", sortOrder: 1, sampleText: "You are a professional game designer. Create a Game Design Document (GDD) outline for a [GENRE] game targeting [TARGET_AUDIENCE]. Include: core concept, unique selling points, target platform, and basic game loop in Korean." },
      { id: "s3-2", promptId: "prod-3", sortOrder: 2, sampleText: "Design a core game loop for [GAME_NAME], a [GENRE] game. Describe the moment-to-moment gameplay, session length, and player motivation in detail. Format as a structured document in Korean." },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-4",
    title: "앱·게임 소개문 생성 프롬프트",
    slug: "app-game-description-prompts",
    shortDescription: "앱스토어 & 구글플레이 소개문을 ChatGPT로 빠르게 완성하는 프롬프트 모음",
    fullDescription: `앱스토어와 구글플레이에 최적화된 앱·게임 소개문 생성 프롬프트 모음입니다.

**포함 항목:**
- 앱스토어 짧은 설명 (255자) 생성 프롬프트
- 구글플레이 전체 설명 생성 프롬프트
- 키워드 ASO 최적화 프롬프트
- 한/영 동시 생성 프롬프트
- 업데이트 노트 작성 프롬프트`,
    price: 7.99,
    categoryId: "cat-4",
    category: categories[3],
    aiTools: ["ChatGPT", "Claude"],
    difficulty: "beginner",
    promptCount: 15,
    previewImageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
    tags: ["앱소개", "앱스토어", "ASO", "ChatGPT"],
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
    externalBuyUrl: "https://example.com/buy/app-description",
    samples: [
      { id: "s4-1", promptId: "prod-4", sortOrder: 1, sampleText: "Write an App Store short description (max 255 characters) for [APP_NAME], a [CATEGORY] app that [MAIN_FEATURE]. Make it compelling, clear, and include a call-to-action. Output in Korean." },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-5",
    title: "무료 샘플 — 게임 BGM 프롬프트 5종",
    slug: "free-sample-game-bgm-5",
    shortDescription: "퍼즐 게임 BGM 프롬프트 50종 패키지의 무료 샘플 5종",
    fullDescription: "유료 패키지 구매 전 퀄리티를 직접 확인해보세요. 퍼즐 게임 BGM 프롬프트 5종을 무료로 제공합니다.",
    price: 0,
    categoryId: "cat-1",
    category: categories[0],
    aiTools: ["Suno", "Udio"],
    difficulty: "beginner",
    promptCount: 5,
    previewImageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
    tags: ["무료", "샘플", "퍼즐게임", "BGM"],
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
    samples: [
      { id: "s5-1", promptId: "prod-5", sortOrder: 1, sampleText: "Relaxing puzzle game background music, soft piano with gentle glockenspiel, 100 BPM, peaceful and focused atmosphere, loopable" },
      { id: "s5-2", promptId: "prod-5", sortOrder: 2, sampleText: "Energetic puzzle stage music, upbeat marimba and light percussion, 130 BPM, cheerful and motivating, suitable for time pressure stages" },
      { id: "s5-3", promptId: "prod-5", sortOrder: 3, sampleText: "Mysterious puzzle dungeon BGM, ambient synth with subtle bass, 80 BPM, slightly eerie but not scary, loopable" },
      { id: "s5-4", promptId: "prod-5", sortOrder: 4, sampleText: "Celebration jingle for puzzle completion, bright xylophone and bells, 4-bar fanfare, happy and rewarding feeling" },
      { id: "s5-5", promptId: "prod-5", sortOrder: 5, sampleText: "Title screen music for casual puzzle game, whimsical melody with piano and strings, 110 BPM, inviting and memorable" },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-6",
    title: "Midjourney 캐릭터 디자인 프롬프트 30종",
    slug: "midjourney-character-design-30",
    shortDescription: "Midjourney v6으로 바로 쓸 수 있는 게임·웹툰 캐릭터 디자인 프롬프트 30종",
    fullDescription: `게임 캐릭터, 웹툰, 컨셉 아트에 최적화된 Midjourney v6 프롬프트 30종 모음입니다.

**포함 테마:**
- 판타지 전사 / 마법사 캐릭터 (8종)
- 인디 게임 픽셀/미니멀 스타일 (6종)
- 다크 판타지 / 소울라이크 스타일 (6종)
- 귀여운 캐주얼 / SD 캐릭터 (6종)
- 사이버펑크 / SF 캐릭터 (4종)

각 프롬프트는 --ar, --v, --stylize 파라미터까지 최적화되어 있어 그대로 붙여넣어 사용할 수 있습니다.`,
    price: 11.99,
    categoryId: "cat-5",
    category: categories[4],
    aiTools: ["Midjourney", "DALL-E 3", "Stable Diffusion"],
    difficulty: "beginner",
    promptCount: 30,
    previewImageUrl: "https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=800&q=80",
    tags: ["Midjourney", "캐릭터디자인", "컨셉아트", "AI이미지", "게임캐릭터"],
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
    externalBuyUrl: "https://example.com/buy/midjourney-character-30",
    usageTips: [
      "[GENRE]를 실제 게임 장르로 교체하고 --ar 2:3 (세로형) 또는 --ar 1:1 (정사각형)을 용도에 맞게 조정하세요.",
      "같은 프롬프트로 --seed 값을 고정하면 일관성 있는 캐릭터 시리즈를 만들 수 있습니다.",
      "--stylize 값을 50~250 사이로 조정하면 사실적~예술적 스타일 범위를 조절할 수 있습니다.",
    ],
    exampleResults: [
      "판타지 RPG 전사 캐릭터: 평균 2~3회 시도 만에 상업용 수준의 컨셉 아트 완성",
      "인디 게임 개발자 20명 이상이 실제 게임 프로젝트 캐릭터 제작에 활용",
    ],
    samples: [
      { id: "s6-1", promptId: "prod-6", sortOrder: 1, sampleText: "a fierce female warrior with silver armor and glowing blue runes, detailed fantasy character design, full body portrait, dramatic lighting from above, painterly concept art style, highly detailed metalwork, 8k resolution --ar 2:3 --v 6 --stylize 150" },
      { id: "s6-2", promptId: "prod-6", sortOrder: 2, sampleText: "minimalist indie game character design, cute chibi warrior with oversized sword, pastel colors, clean vector style, white background, game asset ready, simple and charming --ar 1:1 --v 6 --stylize 80" },
      { id: "s6-3", promptId: "prod-6", sortOrder: 3, sampleText: "dark souls inspired knight character, massive plate armor with battle damage, dramatic rim lighting, gothic cathedral background, cinematic composition, intricate engravings on armor --ar 2:3 --v 6 --stylize 200" },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-7",
    title: "AI 영상 생성 프롬프트 번들 20종",
    slug: "ai-video-generation-bundle-20",
    shortDescription: "Runway, Kling, Pika로 바로 쓸 수 있는 고퀄리티 영상 생성 프롬프트 20종",
    fullDescription: `Runway Gen-3, Kling AI, Pika Labs에서 검증된 영상 생성 프롬프트 20종 번들입니다.

**포함 테마:**
- 게임 트레일러 / 시네마틱 장면 (5종)
- 자연 / 환경 영상 (5종)
- 캐릭터 애니메이션 장면 (4종)
- 제품 광고 / 소셜미디어 영상 (3종)
- 타임랩스 / 추상 아트 (3종)

각 프롬프트는 카메라 움직임, 조명 조건, 시간대까지 세밀하게 설정되어 있습니다.`,
    price: 13.99,
    categoryId: "cat-6",
    category: categories[5],
    aiTools: ["Runway", "Kling AI", "Pika Labs", "Sora"],
    difficulty: "intermediate",
    promptCount: 20,
    previewImageUrl: "https://images.unsplash.com/photo-1574717025058-2f8737d2e2b7?w=800&q=80",
    tags: ["Runway", "Kling", "Pika", "AI영상", "동영상생성", "시네마틱"],
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
    externalBuyUrl: "https://example.com/buy/ai-video-20",
    usageTips: [
      "Runway Gen-3에서 최상의 결과를 위해 프롬프트 앞에 'cinematic quality, 4K ultra HD,' 를 추가하세요.",
      "Kling AI는 카메라 무브먼트 묘사에 특히 강합니다. 'camera slowly pans...' 키워드를 활용하세요.",
      "영상 길이는 5~10초 클립으로 생성 후 편집 툴에서 연결하는 방식을 추천합니다.",
    ],
    exampleResults: [
      "게임 트레일러 시네마틱 장면을 기존 제작 시간 대비 80% 단축",
      "소셜미디어 광고 영상 소재를 하루 만에 20개 이상 생성한 사례",
    ],
    samples: [
      { id: "s7-1", promptId: "prod-7", sortOrder: 1, sampleText: "A serene forest at dawn, sunlight filtering through tall ancient trees, morning mist rising slowly from the mossy ground, birds in flight, camera gently pushes forward through the trees, photorealistic, cinematic quality, 4K ultra HD" },
      { id: "s7-2", promptId: "prod-7", sortOrder: 2, sampleText: "Game character walking through a neon-lit cyberpunk cityscape at night, heavy rain falling, neon reflections on wet pavement, dramatic volumetric lighting, third-person tracking shot from behind, smooth cinematic motion, ultra HD" },
      { id: "s7-3", promptId: "prod-7", sortOrder: 3, sampleText: "Epic fantasy battlefield timelapse, storm clouds rolling in rapidly, lightning strikes illuminating castle ruins in the distance, dramatic sky transition from dusk to storm, wide cinematic angle, hyper-realistic, 4K" },
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
    promptSlugs: ["game-madmovie-music-30", "app-game-description-prompts"],
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
