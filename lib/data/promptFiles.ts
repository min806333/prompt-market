/**
 * Complete prompt content for all products.
 * Used by /api/download to generate TXT files when no file_url is stored in Supabase.
 */

export interface PromptSection {
  title: string;
  prompts: string[];
}

export interface PromptFileData {
  productTitle: string;
  intro: string;
  sections: PromptSection[];
  tips: string[];
}

export const PROMPT_FILES: Record<string, PromptFileData> = {

  // ──────────────────────────────────────────────────────────────────────────
  // PRODUCT 1: 퍼즐 게임 BGM 50종 (Suno / MusicGen)
  // ──────────────────────────────────────────────────────────────────────────
  "puzzle-game-bgm-50": {
    productTitle: "퍼즐 게임 BGM 프롬프트 50종 — Suno & MusicGen",
    intro:
      "퍼즐 게임에 최적화된 BGM 프롬프트 50종 완전판입니다.\n" +
      "각 프롬프트는 Suno Custom Mode 또는 MusicGen에서 바로 사용 가능합니다.\n" +
      "분위기·BPM·악기·루프 포인트가 모두 세팅되어 있어 복붙 즉시 결과를 확인할 수 있습니다.",
    sections: [
      {
        title: "로비 / 메인 메뉴 BGM (8종)",
        prompts: [
          "warm inviting puzzle game main theme, bright xylophone melody with pizzicato strings and soft glockenspiel countermelody, acoustic guitar fingerpicking underneath, 102 BPM, F major, peaceful and cheerful atmosphere that welcomes returning players, seamless 4-bar loop, no drums, cozy home feel",
          "playful character selection screen music, bubbly marimba lead melody with bouncing pizzicato bass line, light tambourine accents, 116 BPM, G major, curious and fun, each phrase ending with a question-mark inflection, 8-bar loop, cartoon puzzle game vibe",
          "adventurous world map selection music, light orchestral with solo oboe melody over pizzicato strings, distant French horn call-and-response, 98 BPM, C major, sense of exploration and possibility, slightly sweeping and grand but still casual, loopable 16-bar structure",
          "cozy in-game shop ambient music, warm jazz piano trio with brushed drums and plucked double bass, gentle Rhodes comping, 88 BPM, Eb major, relaxed and inviting, makes players want to browse and spend time, smooth and unhurried loop",
          "gentle helpful tutorial background music, solo acoustic guitar fingerpicking with soft celeste overlay, simple and clear melodic motif that repeats, 90 BPM, D major, patient and encouraging, unobtrusive enough to not distract from learning, calm loop",
          "neutral calm pause menu ambient sound, sparse piano with long sustained string pads, subtle wind chimes in the background, 76 BPM, A minor, contemplative and restful, very low energy, soft and minimalist loop",
          "proud nostalgic hall of records music, triumphant but gentle French horn melody with warm string accompaniment, nostalgic harp arpeggios, 110 BPM, C major, celebrating accomplishments without being overwhelming, warm glow feeling, loopable",
          "unobtrusive subtle loading screen ambient, soft pulsing synth pad with slow-moving chord progression, distant piano notes, 70 BPM, Dm, nearly background-level, enough to fill silence without demanding attention, extremely smooth loopable drone",
        ],
      },
      {
        title: "일반 스테이지 BGM (15종)",
        prompts: [
          "bright cheerful beginner puzzle stage music, marimba and glockenspiel melody with bouncing pizzicato strings, light percussion, 120 BPM, C major, carefree and playful, child-friendly energy, motivating without pressure, seamless loop",
          "upbeat flowery spring puzzle stage BGM, flute melody with light harp arpeggios and pizzicato bass, warm strings in background, 112 BPM, G major, fresh and light like a spring morning, gentle swing feel, loopable 8-bar melody",
          "soft calm nighttime puzzle stage music, music box melody with slow synth pad chords, distant cricket ambient texture, 82 BPM, F major, cozy and sleepy, warm night feeling, gentle and unhurried loop for late-night gaming sessions",
          "focused medium difficulty puzzle stage BGM, minimalist solo piano with subtle Rhodes harmony, occasional pizzicato cello punctuation, 96 BPM, D minor, concentrated and slightly tense but comfortable, thinking music that aids focus, loop-friendly",
          "rhythmic driving medium puzzle BGM, electric piano with syncopated bass guitar groove, tight hi-hat pattern, 108 BPM, E minor, engaging and forward-moving, moderate intensity that keeps players locked in, funk-influenced loop",
          "natural forest puzzle world BGM, acoustic guitar with bird call samples and leaf rustle texture, occasional pan flute phrase, 94 BPM, G major, outdoor earthy feeling, organic and grounded, peaceful nature loop",
          "urban city-themed puzzle stage music, muted jazz guitar with light percussion and distant traffic ambience, walking bass, 104 BPM, Bb major, sophisticated and cool, big city puzzle-solving energy, smooth urban loop",
          "dreamy underwater puzzle world BGM, slow arpeggiated synth harp with oceanic reverb, whale song texture, slow bubbling effects, 78 BPM, D minor, mysterious and weightless, floating underwater feeling, extremely smooth seamless loop",
          "tense difficult puzzle stage BGM, fast arpeggiated piano over dissonant string sustained notes, building harmonic tension, 118 BPM, C# minor, mentally challenging, slight anxiety that sharpens focus, complex rhythmic interplay, loop",
          "driving intense hard stage puzzle music, staccato brass punches with tense string ostinato, punchy percussion, 132 BPM, E minor, relentless forward momentum, challenging energy, no resolution until stage clears, tight 8-bar loop",
          "cold stark winter puzzle BGM, solo cello melody over glacial synth pad, sparse crystalline piano notes, 86 BPM, A minor, isolated and determined, cold focus energy, frozen landscape feeling, minimalist loop",
          "extremely challenging expert puzzle BGM, complex polyrhythmic piano with dissonant jazz chords, tense counterpoint, 140 BPM, F# minor, intellectually demanding, maximum concentration music, no comfortable resolution, intricate loop",
          "dark challenging night expert stage, brooding low brass with racing violin ostinato, stabbing percussion accents, 136 BPM, D minor, dark determination, high-stakes tension, slightly menacing but motivating loop",
          "blazing fire world puzzle BGM, fiery fiddle melody with driving percussion and brass stabs, energetic Latin-influenced rhythm, 144 BPM, B minor, hot and intense, danger mixed with excitement, energetic loopable track",
          "cosmic space puzzle world BGM, ethereal synth pads with slow evolving chord progressions, twinkling bell textures, 68 BPM, Bbm, vast and mysterious, zero-gravity floating feeling, infinite universe ambience, extremely smooth space ambient loop",
        ],
      },
      {
        title: "보스 / 챌린지 BGM (5종)",
        prompts: [
          "first puzzle boss encounter music, dramatic strings building from quiet to loud, brass fanfare entrance, driving percussion, 126 BPM, D minor, escalating tension, manageable but exciting boss energy, 16-bar intro then loop",
          "mid-game boss battle BGM, aggressive orchestral with pounding timpani and brass ostinato, fast string runs, 138 BPM, F minor, powerful and relentless, experienced difficulty curve expressed in music, building climax loop",
          "epic final boss showdown, massive hybrid orchestral with choir, heavy drums, brass and string battle theme, 148 BPM, D minor, ultimate climactic energy, everything at maximum intensity, grandiose and unstoppable, dynamic loop with build",
          "breakneck speed challenge mode, ultra-fast piano with racing percussion, 8th note bass drive, 176 BPM, A minor, absolutely frenetic and panic-inducing, extreme urgency, barely controlled chaos, tight short loop",
          "endless survival mode BGM, driving minimalist techno-classical hybrid, relentless 16th note synth bass, tense chord pulses, 160 BPM, C minor, never lets up, machine-like precision, survival instinct music, hard-looping 4-bar pattern",
        ],
      },
      {
        title: "스테이지 클리어 / 승리 BGM (5종)",
        prompts: [
          "short triumphant stage completion fanfare, bright brass with chimes and triangle accent, ascending resolution, 4-bar 120 BPM, C major, instantly rewarding and satisfying, textbook victory sting for game UI",
          "extra sparkly perfect stage clear jingle, xylophone and bells with magical glitter sound effect, upward swoosh, 4-bar 130 BPM, E major, extra special feeling, player feels uniquely rewarded, short celebration sting",
          "powerful level up fanfare, ascending brass arpeggio with snare roll and crash cymbal, big triumphant swell, 4-bar 120 BPM, F major, powerful and empowering, clear sense of growth and achievement, game progression sound",
          "grand world completion theme, full orchestral swell with choir, brass fanfare and sweeping strings, bells, 8-bar 110 BPM, C major, chapter-closing satisfaction, epic journey completed feeling, ceremonial and celebratory",
          "special record-breaking fanfare, electronic starburst effect with ascending synth arpeggio, digital sparkle, 4-bar 124 BPM, G major, unique and exciting, feels different from normal clear, competitive achievement sound",
        ],
      },
      {
        title: "타이머 / 카운트다운 BGM (7종)",
        prompts: [
          "30-second timer warning variation, adds ticking clock-like percussion layer over stage theme, slight tempo acceleration, rising harmonic tension, background music urgency intensifier, seamless continuation of stage theme with added pressure",
          "extreme final 10-second countdown, rapid ticking with dissonant rising strings, panic-inducing pulse, extremely short fast loop, maximum urgency and desperation, almost unbearably tense",
          "time-limit approaching BGM variant, tempo gradually accelerates from 100 to 160 BPM over 30 seconds, increasingly dissonant harmonies, small repeating loop that grows more frantic, classic racing-against-the-clock music",
          "speed run challenge BGM, blazing fast synth lead over driving 4-on-the-floor kick, compressed and aggressive, 172 BPM, A minor, pure adrenaline, gamer in full focus mode energy, relentless energetic loop",
          "time bonus collection excitement music, upbeat celebratory with racing arpeggios and chime sparkles, 138 BPM, G major, exciting and rewarding, collecting time bonuses should feel great, bouncy motivating loop",
          "overtime bonus period BGM, intense driving strings with rapid piano scales, sweating intensity, 152 BPM, D minor, extra tense but hopeful, playing into overtime has high stakes, urgent but not hopeless loop",
          "ultra-last-second nail-biting single measure loop, single held tension chord with rattling snare roll, cymbal swell building, total suspense, unresolved tension that lands on stage clear or fail, dramatic game moment music",
        ],
      },
      {
        title: "던전 / 미스터리 BGM (5종)",
        prompts: [
          "ancient puzzle dungeon BGM, deep ominous drone with distant medieval harp arpeggios, stone echo reverb, torch crackling texture, 68 BPM, B minor, old and foreboding, archaeological mystery atmosphere, slow dark loop",
          "haunted mansion puzzle BGM, eerie music box melody over dark organ chords, creaking wood sound texture, ghost whisper reverb, 72 BPM, E minor, spooky but not terrifying, Halloween aesthetic, unsettling atmosphere with playful edge, loop",
          "mysterious deep underwater ruins BGM, lonely cello melody with oceanic reverb and distant sonar pings, slow shifting harmonies, 60 BPM, F# minor, lost civilization feeling, vast and ancient underwater world, melancholic discovery loop",
          "exotic lost temple puzzle world, sitars and tablas with mysterious flute melody, ancient Indian musical influences, 80 BPM, D minor, archaeological exploration, sacred and mysterious, discovering ancient secrets vibe, hypnotic loop",
          "magical crystal cave BGM, high bell tones and crystalline synthesizer textures, slow harp arpeggios, reverberant cave ambience, 74 BPM, E major, sparkling and magical, gem-like beauty of underground world, enchanted loop",
        ],
      },
      {
        title: "엔딩 / 크레딧 BGM (5종)",
        prompts: [
          "emotional puzzle game true ending theme, building from solo piano to full orchestra, heartfelt melody, 96 BPM, C major, journey completion emotion, bittersweet joy, all earlier themes referenced, climactic and beautiful, non-looping cinematic piece",
          "warm nostalgic end credits music, gentle acoustic guitar with light strings and piano, unhurried and reflective, 88 BPM, G major, celebrating the journey just completed, bittersweet and warm, relaxed ending feeling, gently looping",
          "gentle non-punishing game over screen music, soft piano with slow string resolution from tension, 76 BPM, A minor to C major, encouraging rather than discouraging, you'll get it next time feeling, compassionate game over music",
          "joyful true ending resolved theme, bright and warm orchestral with piano lead, singing strings, celebratory but intimate, 104 BPM, E major, happy conclusion, all conflicts resolved, characters achieved their goals, warm satisfying loop",
          "peaceful game conclusion ambient, long sustained string chord progression moving to bright major resolution, 60 BPM, C major, absolute peace and contentment, game world at rest, quiet satisfaction, slow loopable outro",
        ],
      },
    ],
    tips: [
      "Suno에서 Custom Mode를 켜고 Style 입력란에 프롬프트를 그대로 붙여넣으세요.",
      "BPM 수치를 ±10 범위에서 조정하면 더 다양한 결과를 얻을 수 있습니다.",
      "'loopable' 키워드는 반드시 유지하면 매끄러운 루프 음악이 생성됩니다.",
      "같은 프롬프트로 2~3번 시도하면 퀄리티 편차가 있으므로 가장 좋은 결과를 선택하세요.",
      "MusicGen 사용 시 프롬프트 앞에 'loopable background music:' 을 추가하면 루프 품질이 향상됩니다.",
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // PRODUCT 2: 게임 매드무비 음악 30종 (Suno / MusicGen)
  // ──────────────────────────────────────────────────────────────────────────
  "game-madmovie-music-30": {
    productTitle: "게임 매드무비 음악 프롬프트 30종 — Suno & MusicGen",
    intro:
      "게임 매드무비·하이라이트 영상·유튜브 게임 채널에 최적화된 배경음악 프롬프트 30종입니다.\n" +
      "저작권 걱정 없이 바로 생성해서 영상에 삽입 가능한 실전형 프롬프트입니다.",
    sections: [
      {
        title: "하드코어 액션 BGM (10종)",
        prompts: [
          "epic cinematic game montage music, heavy electric guitar riffs with orchestral strings, massive percussion hits, 140 BPM, D minor, intense and powerful, building to climax, perfect for killstreak highlights, dramatic and unstoppable energy",
          "adrenaline spike gaming highlight, metalcore breakdown with djent guitar chug, electronic bass drop, aggressive programmed drums, 155 BPM, E minor, instant hype, made for the first killstreak sequence, explosive in-your-face energy",
          "high-kill-streak background track, hybrid trap metal, 808 bass drops meeting chromatic guitar runs, atmospheric verse building to massive chorus explosion, 142 BPM, D minor, hip-hop influenced aggression, modern gaming aesthetic",
          "FPS sniper play highlight music, tense sparse intro building to orchestral climax, controlled tension punctuated by explosive brass hits at key moments, 128 BPM, C# minor, precision and power, surgical excellence musical expression",
          "battle royale final circle music, pure cinematic intensity, thundering kettle drums, racing strings, horn calls, 158 BPM, F minor, maximum stakes, final survivor energy, nothing held back, full orchestral power",
          "melee combat chain highlight track, brutal industrial electronic, clanging metal samples mixed with kick drums, aggressive 16th note programming, 152 BPM, B minor, mechanical violence, fighting game combo energy",
          "one-versus-many clutch play music, underdog comeback theme, starts quiet then explodes when the tide turns, dramatic orchestral swell, 136 BPM, A minor to A major, hero moment music, come-from-behind victory energy",
          "speed kill highlight reel BGM, breakneck electronic punk hybrid, shredding guitar over programmed blast beats, barely controlled sonic chaos, 168 BPM, G minor, pure unbridled gaming energy, frame-perfect plays deserve this",
          "team wipe celebration track, triumphant orchestral with four-on-the-floor kick, victory lap energy, brass stabs and rising strings, 144 BPM, E major, dominant team performance moment, perfect synchronized plays",
          "legendary play music, massive cinematic with choir chanting, orchestral maximum power, tribal percussion, 162 BPM, D minor, legendary status energy, once-in-a-lifetime gameplay, absolute peak gaming moment",
        ],
      },
      {
        title: "감성 슬로우모션 BGM (8종)",
        prompts: [
          "emotional slow-motion gaming highlight, delicate piano melody with slowly swelling string orchestra, 60 BPM, A minor, deeply moving, last-moment clutch play frozen in time, longing and tension in every note",
          "last player standing dramatic moment, solo violin over sparse piano, distant echo reverb, 60 BPM, A minor, lonely survivor intensity, emotional weight of the final moment, longing and tension",
          "friend versus friend rivalry moment, bittersweet piano duet theme, two melodic lines intertwining and separating, 72 BPM, F major to F minor, complex emotional friendship expressed in music",
          "defeat with honor sequence, proud but sad orchestral, noble brass with muted strings, 68 BPM, D minor, losing gracefully, respect for worthy opponent, not giving up but acknowledging defeat",
          "training montage emotional turn, slow inspiring piano builds to triumphant strings, 80 BPM, C major to E major, working hard toward a goal, determination and hope, Rocky-inspired emotional arc",
          "player's best moment in slow motion, ethereal choir with floating strings, time seems to stop, 56 BPM, A major, peak performance frozen in time, absolute mastery moment, gaming transcendence",
          "tournament finals emotional scene, swelling strings with subdued brass, held breath intensity, 74 BPM, E minor, everything on the line, years of practice culminating in this moment",
          "champion crowned finale music, triumphant tears theme, strings and brass reach full climax then resolve gently, 88 BPM, C major, earned victory after long journey, emotional payoff of the entire video narrative",
        ],
      },
      {
        title: "클라이맥스 빌드업 (7종)",
        prompts: [
          "hype build-up intro for gaming montage, starts with single snare hits and bass pulses, gradually adds layers every 4 bars, cymbal swell into massive drop, 140 BPM, A minor, textbook gaming hype structure",
          "classic 8-bar build, cymbal rides gradually introduced, bass notes drop in, snare added last before full drop, 140 BPM, rising tension in every bar, pre-drop buildup, crowd-tested hype structure",
          "orchestral swell build, single string note grows to full orchestra over 16 bars, timpani enters at bar 8, brass at bar 12, everything collides at bar 16, 120 BPM, C minor to C major, maximum emotional payoff structure",
          "electronic tension builder, filtered bass rises as reverb expands, synth arpeggio speeds up, snare fill every 4 bars, 130 BPM, G minor, dance music buildout applied to gaming hype",
          "reverse cymbal industrial build, reversed sounds layering up, industrial metal tension, 146 BPM, A minor, dark anticipation, metallic mechanical tension peak",
          "hip-hop influenced slow build, chopped samples layering in, 808 getting progressively louder, 124 BPM, streetwear gaming culture buildup, urban gaming aesthetic",
          "cinematic military approach build, distant rotor growing louder, military snare pattern intensifies, brass enters dramatically, 138 BPM, B minor, war game aesthetic, troops arriving at final battle",
        ],
      },
      {
        title: "아웃트로 / 엔딩 BGM (5종)",
        prompts: [
          "gaming session outro, lo-fi chill hip-hop fade, mellow Rhodes piano, slow boom-bap groove, 80 BPM, F major, session complete, time to rest, warm and nostalgic end to an epic video",
          "subscribe endscreen music, bright and catchy short loop, 8-bar memorable melody, 100 BPM, G major, positive call-to-action energy, makes viewers want to engage, friendly youtuber endscreen vibe",
          "until next time outro, bittersweet but hopeful acoustic theme, guitar with light strings, 86 BPM, A major, see you in the next video energy, positive ending leaving audience wanting more",
          "achievement unlocked end theme, retro chiptune evolved to full arrangement, celebratory gaming reference, 108 BPM, C major, meta gaming reference, fans will love it",
          "championship recap outro, sweeping orchestral reprise referencing opening theme, full circle narrative resolution, 96 BPM, E major, satisfying video structure, memorable conclusion",
        ],
      },
    ],
    tips: [
      "Suno의 Extend 기능을 활용해 영상 길이에 맞게 음악을 늘릴 수 있습니다.",
      "'building to climax' 키워드로 영상 클라이맥스 구간 음악을 쉽게 만들 수 있습니다.",
      "슬로우모션 구간 BGM은 BPM을 절반으로 낮추면 더 극적인 효과를 줍니다.",
      "유튜브 업로드 전에 AI 생성 음악임을 크레딧에 표기하는 것이 권장됩니다.",
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // PRODUCT 3: 게임 기획서 생성 프롬프트 번들 (ChatGPT / Claude)
  // ──────────────────────────────────────────────────────────────────────────
  "game-design-doc-bundle": {
    productTitle: "게임 기획서 생성 프롬프트 번들 20종 — ChatGPT & Claude",
    intro:
      "인디 게임 개발자를 위한 게임 기획서 작성 프롬프트 번들입니다.\n" +
      "[대괄호] 안의 변수를 본인 프로젝트 정보로 교체하면 즉시 사용 가능합니다.\n" +
      "ChatGPT-4o 또는 Claude 3.5 Sonnet 이상에서 최상의 결과를 얻을 수 있습니다.",
    sections: [
      {
        title: "GDD 기본 구조 (4종)",
        prompts: [
          "You are a professional game designer. Create a comprehensive Game Design Document (GDD) outline for a [GENRE] game targeting [TARGET_AUDIENCE]. Include: 1) Core concept and elevator pitch (50 words), 2) Unique selling points (3-5 bullet points), 3) Target platform and technical requirements, 4) Basic game loop description, 5) Main features list (8-10 features), 6) Monetization overview. Format as a professional GDD document structure. Output in Korean.",
          "You are a senior game designer. Write a detailed Core Gameplay section for '[GAME_NAME]', a [GENRE] game. Cover: 1) Primary player actions (what can the player do every second?), 2) Core feedback loop (action → reaction → reward cycle), 3) Short session structure (what happens in 5 minutes of play?), 4) Long session structure (what keeps players engaged for 30+ minutes?), 5) Player skill expression (how does mastery feel different from novice play?). Output in Korean.",
          "You are a game narrative director. Create a complete story outline for '[GAME_NAME]'. Include: Act 1 (setup — world, protagonist, inciting incident), Act 2 (conflict — escalating challenges, midpoint revelation), Act 3 (climax and resolution). For each act provide: key plot beats, character development moments, and gameplay sections that reinforce the narrative. Output in Korean.",
          "You are a mobile game product manager. Define the complete feature specification for '[GAME_NAME]' Phase 1 (MVP launch). For each of the 8-12 core features provide: Feature name | Description (2 sentences) | User story | Priority (P0/P1/P2) | Estimated complexity (S/M/L/XL) | Dependencies. Conclude with a summary of what is explicitly OUT OF SCOPE for Phase 1 to manage scope creep. Output in Korean.",
        ],
      },
      {
        title: "게임 루프 설계 (3종)",
        prompts: [
          "You are a game systems designer. Design the core game loop for '[GAME_NAME]', a [GENRE] game. Describe: 1) The moment-to-moment loop (what happens every 5-30 seconds), 2) The session loop (what a typical 10-15 minute session looks like), 3) The meta loop (what keeps players coming back day after day), 4) Tension and release cycle (how does the game create and resolve tension?), 5) Random vs skill elements balance. Include a diagram description (text-based flow chart). Output in Korean.",
          "You are a game balance designer. Create a progression system for '[GAME_NAME]'. Design three interlocking systems: 1) Skill progression (how player ability grows), 2) Character/Equipment progression (numerical power growth), 3) Content progression (new areas, modes, challenges unlocked). For each system define: starting state, milestone markers, end state, and how it interacts with the other two systems. Output in Korean.",
          "You are a UX game designer. Map the complete new player experience (NPE) for '[GAME_NAME]', from first launch to first 30 minutes. Create a moment-by-moment script: Minute 0-2 (first screen, onboarding), Minutes 2-5 (first tutorial interaction), Minutes 5-15 (first full gameplay loop), Minutes 15-30 (first session completion + retention hook). For each phase describe what the player sees, does, feels, and learns. Output in Korean.",
        ],
      },
      {
        title: "캐릭터 설정 (3종)",
        prompts: [
          "You are a character designer. Create complete character sheets for [NUM] main characters in '[GAME_NAME]'. For each character provide: Name | Role | Physical description (3 sentences) | Personality traits (3-5 adjectives with explanation) | Background story (100 words) | Motivation (what do they want most?) | Fear (what are they afraid of?) | Relationship to protagonist | Character arc (how do they change?) | Signature quote. Output in Korean.",
          "You are a narrative designer. Create a complete relationship web for '[GAME_NAME]' featuring [NUM_CHARACTERS] named characters. For each pair of key characters define: 1) Relationship type (ally, rival, mentor, romantic, enemy), 2) Shared history, 3) Current dynamic and tension, 4) How the relationship evolves through the story. Format as a relationship bible. Output in Korean.",
          "You are a dialogue writer. Write the complete first meeting scene between '[PROTAGONIST_NAME]' and '[ANTAGONIST_NAME]' in '[GAME_NAME]'. Context: [BRIEF_CONTEXT]. The scene should: establish both characters' personalities in the first 3 lines, create immediate tension or intrigue, include stage directions for animations, hint at the larger conflict, and end with a memorable line. Length: 20-30 dialogue exchanges. Output in Korean.",
        ],
      },
      {
        title: "레벨 디자인 (3종)",
        prompts: [
          "You are a level designer. Design a complete level progression for '[GAME_NAME]' with [LEVEL_COUNT] levels. For each of the first 10 levels: level name | core mechanic introduced | difficulty (1-10) | new obstacle type | estimated completion time | teaching moment. Then describe the overall difficulty curve with valleys (rest levels) and peaks (challenge levels). State 3-5 level design pillars for this game. Output in Korean.",
          "You are a world-building specialist. Create the complete world bible for '[GAME_WORLD_NAME]'. Include: 1) Geography (major regions with visual themes), 2) History (3 eras that shaped the present), 3) Factions (3-5 groups with conflicting goals), 4) Magic/Technology rules (5 clear rules), 5) Economy (what is valuable and why), 6) Current conflict (what threat unites or divides the world). Output as a game world bible in Korean.",
          "You are an environment artist lead. Write creative briefs for 5 key environments in '[GAME_NAME]'. For each location: Location name | Biome/Setting | Visual reference (2-3 real-world or existing game references) | Color palette description | Unique visual element | Mood/atmosphere | Time of day | Weather | Key gameplay area within this environment | 3 hero props that define this space. Output in Korean.",
        ],
      },
      {
        title: "수익화 모델 (3종)",
        prompts: [
          "You are a mobile game monetization expert. Design the monetization strategy for '[GAME_NAME]', a [GENRE] game with [BUSINESS_MODEL] model. Provide: 1) Player segmentation (free players, dolphin $5-50, whale $50+) with value proposition for each, 2) Premium currency economy design, 3) 30-day new player monetization journey, 4) Bundle design (3 specific examples), 5) Ethical guardrails (what lines not to cross). Output in Korean.",
          "You are a game economist. Design a virtual economy for '[GAME_NAME]'. Define: 1) Currency types (hard vs soft vs premium), 2) Sources (how players earn each currency), 3) Sinks (what they spend it on), 4) Balance rules (what prevents inflation or deflation?), 5) Exchange rates between currencies, 6) First-week economy calibration (how to make new players feel rich enough to engage). Output in Korean.",
          "You are a subscription product manager. Design a subscription model for '[GAME_NAME]'. Create 3 subscription tiers: Tier 1 (basic, ~$3/month), Tier 2 (standard, ~$8/month), Tier 3 (premium, ~$15/month). For each tier: exact benefits list, target player archetype, retention hook, upgrade trigger from lower tier. Include a side-by-side comparison table. Output in Korean.",
        ],
      },
      {
        title: "UI/UX 설계 (2종)",
        prompts: [
          "You are a game UI/UX designer. Design the complete interface system for '[GAME_NAME]' on [PLATFORM]. Provide: 1) HUD elements (always visible vs toggleable), 2) Main menu flow diagram (text format), 3) Key interaction patterns, 4) Accessibility features (colorblind mode, text size, subtitles), 5) Onboarding UI flow (step-by-step first-time experience), 6) Font and color recommendations with psychological rationale. Output in Korean.",
          "You are a UX researcher. Write 10 usability test tasks for '[GAME_NAME]' prototype testing. For each task: task description | expected completion path | what we are measuring | success criteria | common failure points to watch for. Also write the pre-test questionnaire (5 questions) and post-test questionnaire (7 questions). Output in Korean.",
        ],
      },
      {
        title: "출시 전략 (2종)",
        prompts: [
          "You are a game launch director. Create the definitive pre-launch checklist for '[GAME_NAME]'. Organize into: 1) Technical (server tests, patch certification, crash rate targets), 2) Store pages (screenshots, descriptions, age ratings), 3) Marketing (press codes, embargo dates, social media calendar), 4) Community (Discord setup, FAQ, moderator guidelines), 5) Customer support (briefings, known issues, escalation protocols), 6) Legal (EULA, privacy policy, GDPR/COPPA). Output as a checklist in Korean.",
          "You are a game marketing director. Create the marketing one-pager for '[GAME_NAME]'. Include: 1) Elevator pitch (25 words max), 2) Three target personas with demographics and wants, 3) Competitive positioning ('like X meets Y'), 4) Key messages for social/press/app store, 5) Viral hooks (what is shareable?), 6) Launch window analysis, 7) First 3 content marketing pieces to create. Output in Korean.",
        ],
      },
    ],
    tips: [
      "[대괄호] 안의 변수를 실제 게임 정보로 교체한 후 사용하세요.",
      "Claude에서는 프롬프트 앞에 'Think step by step:' 를 추가하면 더 체계적인 결과가 나옵니다.",
      "긴 GDD를 작성할 때는 섹션별로 나눠서 대화형으로 진행하는 것을 권장합니다.",
      "결과물을 Notion이나 Google Docs에 붙여넣으면 기획서로 바로 활용 가능합니다.",
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // PRODUCT 4: 앱/게임 소개문 생성 프롬프트 (ChatGPT / Claude)
  // ──────────────────────────────────────────────────────────────────────────
  "app-game-description-prompts": {
    productTitle: "앱/게임 소개문 생성 프롬프트 15종 — ChatGPT & Claude",
    intro:
      "앱스토어·구글플레이 소개문을 ChatGPT 또는 Claude로 빠르게 완성하는 프롬프트 15종입니다.\n" +
      "[대괄호] 안의 변수를 교체하면 즉시 실전 사용 가능합니다.",
    sections: [
      {
        title: "App Store 소개문 (3종)",
        prompts: [
          "Write an App Store short description (max 255 characters) for [APP_NAME], a [CATEGORY] app that [MAIN_FEATURE]. Make it compelling, clear, and include a call-to-action. The description should lead with the primary benefit, not the feature. Output in Korean.",
          "You are an App Store conversion optimization expert. Write 3 versions of the App Store subtitle (30 characters max each) for '[APP_NAME]': Version A (feature-focused), Version B (benefit-focused), Version C (emotion-focused). For each version include the character count and A/B test hypothesis. Output in Korean.",
          "Write a complete App Store product page copy package for '[APP_NAME]': 1) App name + subtitle (app name max 30 chars, subtitle max 30 chars), 2) Short description (255 chars), 3) What's New section for version [VERSION] (max 4000 chars but be concise), 4) Keywords (100 chars max, comma-separated). Core features: [LIST_FEATURES]. Output in Korean.",
        ],
      },
      {
        title: "Google Play 소개문 (3종)",
        prompts: [
          "Write a complete Google Play Store description for '[APP_NAME]' ([CATEGORY] app). Requirements: 2500-3500 characters total, first 167 characters must stand alone as a compelling hook, include 5 emoji-bullet feature points (using ✅ or ⭐), weave in keywords [KW1] [KW2] [KW3] naturally, end with a strong download CTA. Output in Korean.",
          "You are a Google Play ASO expert. Rewrite the following description to maximize search ranking and conversion rate. Current description: '[PASTE_DESCRIPTION]'. Improvements: 1) Move strongest benefit to sentence 1, 2) Add social proof (use placeholder [RATING]/[DOWNLOADS]), 3) Create 5 benefit-focused bullet points, 4) Add a FAQ section with top 3 user concerns, 5) Ensure main keyword appears 3-4 times naturally. Output the complete revised description in Korean.",
          "Create bilingual (Korean + English) Google Play descriptions for '[APP_NAME]'. Korean version: optimize for Korean user pain points and expressions, use natural Korean idioms. English version: punchy global appeal, strong opening verb, clear benefit. Provide both versions side-by-side with total character counts. Explain strategy differences between the two versions.",
        ],
      },
      {
        title: "ASO 키워드 전략 (2종)",
        prompts: [
          "You are a keyword research specialist. Identify the top 20 most valuable App Store keywords for '[APP_NAME]' in the [CATEGORY] category. For each keyword: Korean keyword | Search volume estimate (High/Medium/Low) | Competition (1-5) | Relevance (High/Medium/Low) | Recommended placement (title/subtitle/keyword field). Also suggest 5 trending underserved keywords in this category. Include both Korean and English variants.",
          "You are an ASO consultant. Diagnose why '[APP_NAME]' might be ranking poorly for '[TARGET_KEYWORD]' and provide a fix plan. Checklist: 1) Keyword placement audit, 2) Metadata readability check (not keyword stuffed), 3) Review velocity and average rating analysis, 4) Top 3 competitor comparison, 5) Screenshot and icon conversion optimization. Provide 5 specific recommendations with expected impact. Output in Korean.",
        ],
      },
      {
        title: "업데이트 노트 / 이중 언어 (3종)",
        prompts: [
          "Write 3 versions of update notes for '[APP_NAME]' v[VERSION]: A) Casual/fun tone (consumer app, use emoji, personality), B) Professional business tone (productivity app), C) Technical notes (developer tool). Changes: [LIST_CHANGES]. Requirements: max 150 words each, lead with most important change, use positive framing for bug fixes. Output all 3 in Korean.",
          "Create the complete v2.0 major update launch copy for '[APP_NAME]'. Provide: 1) Push notification (under 60 chars), 2) In-app what's new popup (50 words), 3) App Store update description (200 words), 4) Email newsletter subject + preview + body (300 words), 5) Twitter/X announcement thread (3 tweets), 6) Press release headline + first paragraph. Key changes: [CHANGES]. Output in Korean.",
          "Write App Store screenshot copy and layout briefs for 8 screenshots for '[APP_NAME]'. For each: screenshot # | orientation | background style | headline (max 40 chars) | subtext (max 80 chars) | feature to demonstrate | UI element to highlight. Screenshots should tell a narrative: problem → solution → result → CTA. First screenshot must achieve impact in under 3 seconds. Output in Korean.",
        ],
      },
      {
        title: "리뷰 응답 템플릿 (2종)",
        prompts: [
          "Create App Store review response templates for '[APP_NAME]' for these scenarios: 1) 1-star crash report, 2) 1-star negative feature review, 3) 2-star constructive criticism, 4) 3-star feature request, 5) 5-star positive (3 different versions), 6) Competitor comparison, 7) Price complaint. For each response: text | tone | primary goal (retain user / fix perception / gather info). Output in Korean.",
          "Write a complete app review management guideline for '[APP_NAME]'. Include: 1) Response time standards (when to reply within 24h vs 72h), 2) Escalation criteria (which reviews to flag to dev team), 3) Legal boundaries (what not to promise or admit), 4) Tone guide for negative vs positive reviews, 5) Template for requesting review updates after fixing bugs, 6) Metric targets (aim for X% of negative reviews resolved). Output in Korean.",
        ],
      },
      {
        title: "A/B 테스트 (2종)",
        prompts: [
          "Design an A/B test plan for '[APP_NAME]' app store listing. Test hypothesis: 'Changing [ELEMENT] will increase install conversion by X%'. Provide: 1) Control (current), 2) Variant A description, 3) Variant B description, 4) Primary metric (install conversion rate), 5) Sample size for statistical significance, 6) Test duration, 7) Success criteria. Also write Variant A and B complete copy. Output in Korean.",
          "You are a CRO specialist. Analyze the following app store listing for '[APP_NAME]' and identify the top 5 conversion blockers: [PASTE_CURRENT_LISTING]. For each blocker: current problem | hypothesis for improvement | specific rewrite | expected impact (High/Medium/Low) | testing priority. Output in Korean.",
        ],
      },
    ],
    tips: [
      "[대괄호] 안의 변수를 실제 앱 정보로 교체한 후 사용하세요.",
      "App Store 소개문은 255자 제한이 있으므로 결과물의 글자 수를 항상 확인하세요.",
      "구글플레이 설명문에서 처음 167자가 검색 결과에 노출되므로 핵심 문구를 앞에 배치하세요.",
      "A/B 테스트는 최소 2주 이상 데이터를 모아야 통계적으로 유의미한 결과를 얻을 수 있습니다.",
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // PRODUCT 5: 무료 샘플 — 게임 BGM 5종
  // ──────────────────────────────────────────────────────────────────────────
  "free-sample-game-bgm-5": {
    productTitle: "무료 샘플 — 퍼즐 게임 BGM 프롬프트 5종",
    intro:
      "퍼즐 게임 BGM 프롬프트 50종 패키지의 무료 샘플 5종입니다.\n" +
      "Suno Custom Mode의 Style 입력란에 아래 프롬프트를 그대로 붙여넣어 사용하세요.\n" +
      "더 많은 프롬프트는 Promto.kr에서 '퍼즐 게임 BGM 50종' 패키지를 확인하세요.",
    sections: [
      {
        title: "샘플 프롬프트 5종",
        prompts: [
          "Relaxing puzzle game background music, soft piano with gentle glockenspiel, 100 BPM, peaceful and focused atmosphere, loopable, no drums, cozy game feel",
          "Energetic puzzle stage music, upbeat marimba and light percussion, 130 BPM, cheerful and motivating, seamless loop for continuous play",
          "Mysterious puzzle dungeon BGM, ambient synth with subtle bass, 80 BPM, slightly eerie but not scary, loopable exploration atmosphere",
          "Celebration jingle for puzzle completion, bright xylophone and bells, 4-bar fanfare, happy and rewarding feeling, triumphant game UI sound",
          "Title screen music for casual puzzle game, whimsical melody with piano and strings, 110 BPM, inviting and memorable, perfect for main menu",
        ],
      },
    ],
    tips: [
      "Suno Custom Mode → Style 입력란에 그대로 붙여넣어 사용하세요.",
      "더 많은 프롬프트를 원하시면 '퍼즐 게임 BGM 50종' 전체 패키지를 확인해보세요.",
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // PRODUCT 6: AI 이미지 캐릭터 디자인 30종 (Midjourney / DALL-E)
  // ──────────────────────────────────────────────────────────────────────────
  "midjourney-character-design-30": {
    productTitle: "AI 이미지 캐릭터 디자인 프롬프트 30종 — Midjourney & DALL-E",
    intro:
      "인디 게임·소설·웹툰용 캐릭터를 AI로 빠르게 생성하는 프롬프트 30종입니다.\n" +
      "Midjourney v6 및 DALL-E 3에서 테스트 완료된 실전형 프롬프트입니다.\n" +
      "Midjourney 사용 시 프롬프트 끝에 --ar 2:3 --v 6 을 추가하세요.",
    sections: [
      {
        title: "판타지 전사 / 마법사 (8종)",
        prompts: [
          "heroic female paladin warrior, gleaming silver plate armor with golden sun emblem, flowing blue cape, short auburn hair, battle-ready confident pose, ancient stone castle courtyard at dawn, dramatic lighting, high fantasy RPG concept art style, detailed and cinematic --ar 2:3 --v 6 --stylize 200",
          "wise elderly archmage wizard, long silver beard with magical braids, deep blue starfield robe covered in glowing celestial symbols, carved oak staff topped with floating crystal orb, dignified calm expression of absolute mastery, grand magical library background with floating tomes --ar 2:3 --v 6 --stylize 180",
          "battle-hardened dwarven berserker, stocky muscular frame, oversized rune-carved battle axe, thick braided beard with iron rings, patched leather and chain armor showing clan symbols, low angle dynamic battle pose, stone quarry background, industrial fantasy style --ar 2:3 --v 6 --stylize 150",
          "elegant high elf archmage, impossibly tall and slender, flowing silver and white robes with glowing golden arcane script at hem, silver crown circlet, staff with pulsing crystalline orb, serene expression of magical mastery, grand library background --ar 2:3 --v 6 --stylize 200",
          "beastfolk wolf ranger, half-wolf anthropomorphic warrior standing upright, tactical leather ranger armor, quiver and twin blades, intense yellow eyes, battle scars on muzzle, crouching ready stance in dense misty forest, dappled morning light, realistic anthropomorphic game art --ar 2:3 --v 6 --stylize 140",
          "ancient sea-god warrior priest, barnacle-covered plate armor, trident weapon with coral decorations, flowing teal robes, glowing blue ocean deity eyes, underwater palace throne room background, epic dark fantasy RPG art --ar 2:3 --v 6 --stylize 175",
          "forest druid shapeshifter, half-transformed between human and bear, glowing green eyes, celtic knotwork tattoos covering arms, ancient oak grove with morning mist, lush overgrown environment, painterly game concept art --ar 2:3 --v 6 --stylize 160",
          "fire elementalist warrior, volcanic rock armor with glowing lava cracks, flame aura wreathing hands, fierce concentrated expression, active volcano caldera backdrop with falling embers, dramatic red and orange lighting --ar 2:3 --v 6 --stylize 190",
        ],
      },
      {
        title: "인디 / 픽셀 스타일 (5종)",
        prompts: [
          "cute chibi indie game protagonist, small round head with big expressive eyes, colorful casual adventurer outfit with oversized backpack, simple geometric art style, flat color with subtle gradients, white background, mobile game character design, charming and accessible --ar 1:1 --v 6 --stylize 100",
          "retro pixel art style indie platformer hero, 16-bit aesthetic, simple geometric shapes, limited 4-color palette per character, front-facing idle pose, clean vector flat art style, retro game character sheet format, crisp and nostalgic --ar 1:1 --v 6 --stylize 80",
          "hand-drawn sketch indie game character, rough confident pencil textures, asymmetric quirky design, expressive face with personality, charming imperfection in art style, off-white paper texture background, indie game illustration aesthetic --ar 2:3 --v 6 --stylize 120",
          "bright 2D illustration indie RPG hero, flat color with subtle cel shading, sticker-book aesthetic, colorful energetic design, family-friendly approachable character, expressive round eyes, simple but memorable silhouette --ar 2:3 --v 6 --stylize 130",
          "minimalist ink line art game character, single color silhouette with minimal detail lines, elegant negative space usage, ultra-clean geometric design, suitable for puzzle or casual mobile game, zen aesthetic, professional logo-quality clarity --ar 2:3 --v 6 --stylize 60",
        ],
      },
      {
        title: "다크 판타지 / 소울라이크 (5종)",
        prompts: [
          "undead knight boss character, crumbling obsidian plate armor with glowing curse runes, ethereal purple flame aura, dark hollow eyes, imposing menacing presence, dark throne room filled with bones and candlelight, souls-like game boss design --ar 2:3 --v 6 --stylize 220",
          "plague doctor dark RPG character, long black leather beak mask, layered tattered plague doctor robes with alchemical pouches, mysterious and sinister, fog-covered dark cobblestone street at night, atmospheric horror-adjacent fantasy --ar 2:3 --v 6 --stylize 200",
          "vampire lord noble villain, pale aristocratic face with deep crimson eyes, elaborate Victorian gothic black coat with blood-red silk lining, coffin throne in dark castle throne room, candlelit chandelier background --ar 2:3 --v 6 --stylize 210",
          "fallen angel warrior, magnificent black feathered wings with torn battle-worn edges, tarnished celestial armor gone dark, conflicted haunted expression, apocalyptic battlefield with burning sky and falling ash --ar 2:3 --v 6 --stylize 230",
          "necromancer lich sorceress, skeletal face partially exposed through decaying hood, swirling green necrotic magic from bony hands, underground crypt with floating spectral minions, dramatic underlighting, dark magic fantasy art --ar 2:3 --v 6 --stylize 215",
        ],
      },
      {
        title: "캐주얼 / SD (6종)",
        prompts: [
          "super deformed SD samurai cat, tiny orange tabby cat in full blue samurai armor with miniature katana, huge round head in 3:1 ratio, stubby limbs, perpetually determined expression, cherry blossom temple background, adorable mobile game character --ar 1:1 --v 6 --stylize 100",
          "chibi magical girl character, pastel rainbow color scheme, oversized magical bow accessory, sparkle particle effects, heart motifs throughout design, triumphant transformation pose, anime-inspired mobile game art, ultra cute --ar 2:3 --v 6 --stylize 110",
          "round penguin explorer adventurer, tiny explorer hat and backpack, stubby happy arms, perpetual smile, arctic research station background, utterly wholesome casual game character, simple and universally appealing --ar 1:1 --v 6 --stylize 90",
          "cute robot companion character, rounded boxy body, expressive LED screen face showing emoji eyes, tiny propeller hat, various helpful tool attachments, warm gold accent colors on white body, friendly helper bot design --ar 1:1 --v 6 --stylize 105",
          "chubby bear knight character, adorably rotund proportions, honey-pot shield design, flower crown on helmet, meadow background with butterflies, absolutely wholesome casual mobile RPG fighter, pastel color palette --ar 2:3 --v 6 --stylize 95",
          "tiny fairy merchant character, delicate iridescent wings, miniature trading post hat, magical coin pouch, wide innocent eyes, mushroom forest market background, whimsical fantasy casual game design --ar 2:3 --v 6 --stylize 115",
        ],
      },
      {
        title: "사이버펑크 / SF (6종)",
        prompts: [
          "cyberpunk hacker protagonist, neon-streaked hair, wire-frame AR glasses with scrolling data, worn tech jacket covered in device attachments and circuit patches, crouching in server room with blue data streams, gritty neon-lit atmosphere --ar 2:3 --v 6 --stylize 180",
          "android idol pop star, perfect synthetic human face with visible circuit seams at temples, holographic concert dress with data-stream effects, floating drone speaker companions, massive neon concert stage background --ar 2:3 --v 6 --stylize 200",
          "corporate enforcer soldier, sleek matte black powered exosuit, corporation logo prominently on shoulder pad, crowd control baton weapon, rain-soaked megacity street at night, dystopian authority figure design --ar 2:3 --v 6 --stylize 190",
          "underground street doctor medic, worn medical coat with glowing blue healing tools, cybernetic eye scanner monocle, morally complex expression, neon-lit underground clinic background, cyberpunk anti-hero design --ar 2:3 --v 6 --stylize 175",
          "space marine commander in advanced powered armor, sleek white ceramic-composite exosuit with shoulder AI unit, pulse rifle, space station airlock exterior background with planet visible, hard sci-fi military design --ar 2:3 --v 6 --stylize 185",
          "alien diplomat envoy, unique non-humanoid bipedal form with four arms and bioluminescent skin patterns, ornate ceremonial intergalactic council robes, grand space station council chamber background, original alien species design --ar 2:3 --v 6 --stylize 195",
        ],
      },
    ],
    tips: [
      "Midjourney에서 --v 6 파라미터를 --v 6.1 로 변경하면 더 높은 품질을 얻을 수 있습니다.",
      "--stylize 값을 50으로 낮추면 프롬프트에 더 충실한 결과가, 250으로 높이면 더 예술적인 결과가 나옵니다.",
      "같은 프롬프트로 4번 생성 후 /vary 로 원하는 이미지를 변형하세요.",
      "DALL-E 3 사용 시 프롬프트 앞에 'Illustration of:' 를 추가하면 더 일관된 결과를 얻을 수 있습니다.",
      "--ar 2:3 은 캐릭터 카드 비율, --ar 16:9 는 배경 일러스트에 적합합니다.",
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // PRODUCT 7: AI 영상 생성 프롬프트 번들 20종 (Kling / RunwayML / Pika)
  // ──────────────────────────────────────────────────────────────────────────
  "ai-video-generation-bundle-20": {
    productTitle: "AI 영상 생성 프롬프트 번들 20종 — Kling & RunwayML",
    intro:
      "Kling AI·RunwayML·Pika Labs에서 즉시 사용 가능한 영상 생성 프롬프트 20종입니다.\n" +
      "게임 트레일러, 자연 환경, 캐릭터 애니메이션, 제품 광고, 아트 비주얼 등 5개 카테고리를 포함합니다.",
    sections: [
      {
        title: "게임 트레일러 / 시네마틱 (5종)",
        prompts: [
          "sweeping aerial establishing shot of a vast fantasy kingdom under siege, armies charging across a burning stone bridge, castle towers crumbling in background, golden hour light cutting through smoke and dust, cinematic drone pull-back, 4K quality, photorealistic, 8-second slow push forward",
          "ultra-slow-motion moment freeze of a battle climax, protagonist raising sword as enemies surround, digital particles of frozen time visible in air around the frame, ethereal light rays through dust, hyperrealistic, cinematic dramatic pause effect, 5-second reveal",
          "first-person high-speed dash through a neon cyberpunk city at night, rain-soaked streets reflecting neon advertisements, holographic signs blurring at high speed, tight winding alleyway, speed ramp from slow to breakneck, immersive FPS game feel",
          "dramatic hero character reveal emerging from thick fog, silhouette in mist becoming clear as they walk toward camera, backlit by dramatic sunset, long slow 10-second walk, inspirational protagonist introduction cinematic shot",
          "seamless environment transition montage: ancient stone dungeon morphs to crystal cave to starfield space, each scene dissolves into the next through matching shapes, dreamlike liquid transition effect, 12-second sequence",
        ],
      },
      {
        title: "자연 / 환경 (4종)",
        prompts: [
          "misty ancient forest at golden dawn, god rays filtering through towering redwood trees, forest floor covered in glowing bioluminescent mushrooms, slow cinematic push forward along mossy path, ultra-realistic natural quality, serene open-world game establishing shot",
          "timelapse of frozen arctic tundra from day through night to northern lights, stars appearing gradually, aurora borealis dancing in green and purple above snow-covered landscape, 10-second atmospheric beauty sequence",
          "volcanic island creation sequence, lava flowing down crater slope into ocean creating steam explosions and new land forming, dramatic planetary formation imagery, epic slow drone rise above the active volcano",
          "underwater descent from bright coral reef into deep dark abyss, colors fading to black as depth increases, bioluminescent deep-sea creatures appearing in darkness, atmospheric pressure and isolation feeling",
        ],
      },
      {
        title: "캐릭터 애니메이션 (4종)",
        prompts: [
          "dynamic idle animation loop for a female warrior in heavy plate armor, weight shifting subtly, cape flowing in wind, eyes scanning left and right alertly, breathing visible in chest piece movement, detailed metal surface textures, ready-for-battle stance, seamless 3-second loop",
          "magical transformation sequence, ordinary person engulfed in swirling light particles, clothing and form morphing into warrior goddess state, golden energy and sparkles, dramatic power-up reveal moment, 5-second cinematic transformation",
          "victory celebration dance sequence, video game character performing an iconic celebratory dance after winning, expressive full-body movement, stadium confetti and cheering crowd background, 4-second loopable idle celebration animation",
          "character emotional close-up, subtle expression shift from neutral blank face to dawning realization to joy, ultra-detailed facial micro-expression animation, single tear forming in corner of eye, photorealistic or stylized game cutscene quality",
        ],
      },
      {
        title: "제품 / 앱 광고 (4종)",
        prompts: [
          "sleek smartphone product reveal, dark phone rising from pure black background while slowly rotating, app UI visible on screen with key features highlighted and labeled, clean minimal product advertisement animation, tech launch event style, premium quality",
          "3D brand logo animation reveal, letters emerging from particle burst coming from center point, assembled dramatically letter by letter, premium metallic material texture, 3-second logo sting, brand identity reveal sequence",
          "split-screen before and after demonstration, left shows frustrated user struggling with manual process, right shows same user delighted using the app solution, satisfying side-by-side contrast, 6-second benefit demonstration",
          "kinetic typography testimonial reveal, user quote text appearing word by word with dynamic type motion, warm gradient background, professional service advertisement style, inspiring and trustworthy visual design",
        ],
      },
      {
        title: "추상 아트 / VFX (3종)",
        prompts: [
          "infinite zoom journey through nested fractal geometry, mathematical shapes shrinking to infinite depth, neon color palette transitioning through blue to purple to gold, meditative and hypnotic, suitable for game loading screen or title sequence background loop",
          "fluid simulation paint explosion, vivid colors colliding and mixing in beautiful slow-motion fluid dynamics, satisfying and visually stunning, abstract game brand identity visual or celebration particle effect sequence",
          "dimensional portal opening effect, circular energy vortex forming from small sparks growing to full portal, swirling purple and electric blue energy tendrils, dramatic gateway opening, 4-second portal reveal suitable for level transition or game intro",
        ],
      },
    ],
    tips: [
      "Kling AI에서 'motion_mode: pro'를 활성화하면 더 자연스러운 움직임을 얻을 수 있습니다.",
      "영상 길이는 5초 이내로 시작하여 품질을 확인한 후 길이를 늘리는 것을 권장합니다.",
      "RunwayML Gen-3에서는 프롬프트에 카메라 무브먼트를 명시하면(예: 'slow push forward') 더 원하는 결과가 나옵니다.",
      "결과물 영상은 상업적 용도로 사용 가능하지만 각 AI 서비스의 이용 약관을 확인하세요.",
    ],
  },
};

/**
 * Format a PromptFileData object into a human-readable text document.
 */
export function formatPromptFile(data: PromptFileData, slug: string): string {
  const lines: string[] = [];
  const divider = "=".repeat(60);
  const thinDivider = "-".repeat(60);

  lines.push(divider);
  lines.push(data.productTitle);
  lines.push(divider);
  lines.push("");
  lines.push(data.intro);
  lines.push("");
  lines.push(`총 프롬프트: ${data.sections.reduce((acc, s) => acc + s.prompts.length, 0)}종`);
  lines.push(`출처: https://promto.kr/products/${slug}`);
  lines.push("");

  data.sections.forEach((section) => {
    lines.push(thinDivider);
    lines.push(`[ ${section.title} ]`);
    lines.push(thinDivider);
    lines.push("");
    section.prompts.forEach((prompt, idx) => {
      lines.push(`[${idx + 1}]`);
      lines.push(prompt);
      lines.push("");
    });
  });

  if (data.tips.length > 0) {
    lines.push(divider);
    lines.push("[ 사용 팁 ]");
    lines.push(thinDivider);
    data.tips.forEach((tip, idx) => {
      lines.push(`${idx + 1}. ${tip}`);
    });
    lines.push("");
  }

  lines.push(divider);
  lines.push("더 많은 프롬프트 → https://promto.kr");
  lines.push(divider);

  return lines.join("\n");
}
