import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rateLimit, getClientIp } from "@/lib/security/rateLimit";

const DAILY_LIMIT = 3;
const PRO_DAILY_LIMIT = 20;

const MUSIC_MODELS: Record<string, { name: string; url: string; instructions: string }> = {
  suno: {
    name: "Suno",
    url: "https://suno.com",
    instructions: "Custom Mode를 활성화하고 Style 입력란에 프롬프트를 붙여넣으세요",
  },
  udio: {
    name: "Udio",
    url: "https://www.udio.com",
    instructions: "Custom 모드에서 Style 입력란에 프롬프트를 붙여넣으세요",
  },
};

const IMAGE_MODELS: Record<string, { name: string; url: string; instructions: string }> = {
  midjourney: {
    name: "Midjourney",
    url: "https://www.midjourney.com",
    instructions: "Discord의 /imagine 명령어 뒤에 프롬프트를 붙여넣으세요",
  },
  "stable-diffusion": {
    name: "Stable Diffusion",
    url: "https://stability.ai",
    instructions: "Prompt 입력란에 프롬프트를 붙여넣고 Generate를 누르세요",
  },
  dalle: {
    name: "DALL-E",
    url: "https://openai.com/dall-e-3",
    instructions: "ChatGPT에서 이미지 생성 모드로 전환 후 프롬프트를 입력하세요",
  },
};

const VIDEO_MODELS: Record<string, { name: string; url: string; instructions: string }> = {
  runway: {
    name: "Runway",
    url: "https://runwayml.com",
    instructions: "Gen-3 Alpha에서 Text to Video에 프롬프트를 붙여넣으세요",
  },
  pika: {
    name: "Pika",
    url: "https://pika.art",
    instructions: "Text to Video 탭에 프롬프트를 입력하세요",
  },
  kling: {
    name: "Kling AI",
    url: "https://klingai.com",
    instructions: "AI Video 섹션에 프롬프트를 입력하고 생성하세요",
  },
};

const ALLOWED_TEXT_MODELS = ["gpt-4o-mini", "gpt-4o", "gpt-3.5-turbo"];

function buildCopyResponse(
  type: "music" | "image" | "video",
  info: { name: string; url: string; instructions: string },
  promptText: string,
  remainingToday: number
) {
  const emoji = type === "music" ? "🎵" : type === "image" ? "🎨" : "🎬";
  const typeLabel = type === "music" ? "음악" : type === "image" ? "이미지" : "영상";

  return NextResponse.json({
    content: `${emoji} 이 프롬프트는 **${info.name}** ${typeLabel} 생성용입니다.\n\n**사용 방법:**\n1. 아래 프롬프트를 복사하세요\n2. [${info.name}](${info.url}) 에 접속하세요\n3. ${info.instructions}\n4. 생성 버튼을 눌러 결과물을 만드세요\n\n---\n\n**프롬프트:**\n\`\`\`\n${promptText}\n\`\`\``,
    model: info.name.toLowerCase(),
    isCopyPrompt: true,
    promptType: type,
    platformUrl: info.url,
    remainingToday,
  });
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (!rateLimit(ip, { limit: 30, windowMs: 60 * 1000 })) {
    return NextResponse.json({ error: "요청이 너무 많습니다." }, { status: 429 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "로그인이 필요합니다. 하루 3회 무료 테스트는 로그인 후 가능합니다." },
      { status: 401 }
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_status")
    .eq("id", user.id)
    .single();

  const limit = profile?.subscription_status === "pro" ? PRO_DAILY_LIMIT : DAILY_LIMIT;

  const today = new Date().toISOString().split("T")[0];
  const { count } = await supabase
    .from("playground_usage")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("used_at", today);

  const usedToday = count ?? 0;
  if (usedToday >= limit) {
    return NextResponse.json(
      {
        error: `오늘의 테스트 횟수(${limit}회)를 모두 사용했습니다. 내일 다시 시도하거나 Pro로 업그레이드하세요.`,
        remainingToday: 0,
      },
      { status: 429 }
    );
  }

  const body = await req.json();
  const { promptText, model } = body;

  if (!promptText || typeof promptText !== "string" || promptText.length > 2000) {
    return NextResponse.json({ error: "유효하지 않은 프롬프트입니다." }, { status: 400 });
  }

  const modelKey = (model ?? "").toLowerCase();
  const remaining = limit - usedToday - 1;

  // Music models
  if (MUSIC_MODELS[modelKey]) {
    await supabase.from("playground_usage").insert({
      user_id: user.id,
      prompt_text: promptText.slice(0, 500),
      model_used: modelKey,
    });
    return buildCopyResponse("music", MUSIC_MODELS[modelKey], promptText, remaining);
  }

  // Image models
  if (IMAGE_MODELS[modelKey]) {
    await supabase.from("playground_usage").insert({
      user_id: user.id,
      prompt_text: promptText.slice(0, 500),
      model_used: modelKey,
    });
    return buildCopyResponse("image", IMAGE_MODELS[modelKey], promptText, remaining);
  }

  // Video models
  if (VIDEO_MODELS[modelKey]) {
    await supabase.from("playground_usage").insert({
      user_id: user.id,
      prompt_text: promptText.slice(0, 500),
      model_used: modelKey,
    });
    return buildCopyResponse("video", VIDEO_MODELS[modelKey], promptText, remaining);
  }

  // Text models (GPT)
  const selectedModel = ALLOWED_TEXT_MODELS.includes(modelKey) ? modelKey : "gpt-4o-mini";

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "AI 서비스가 현재 준비 중입니다.", remainingToday: remaining },
      { status: 503 }
    );
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [{ role: "user", content: promptText }],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? "";

    await supabase.from("playground_usage").insert({
      user_id: user.id,
      prompt_text: promptText.slice(0, 500),
      model_used: selectedModel,
    });

    return NextResponse.json({
      content,
      model: selectedModel,
      remainingToday: remaining,
    });
  } catch (err) {
    console.error("Playground API error:", err);
    return NextResponse.json({ error: "AI 생성 중 오류가 발생했습니다." }, { status: 500 });
  }
}
