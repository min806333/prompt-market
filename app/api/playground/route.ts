import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rateLimit, getClientIp } from "@/lib/security/rateLimit";
import { createHmac } from "crypto";

// Polling-based generation (Udio/Kling) can take up to 50s
// Requires Vercel Pro (maxDuration > 10s). On Hobby plan, Udio/Kling will time out.
export const maxDuration = 60;

const DAILY_LIMIT = 3;
const PRO_DAILY_LIMIT = 20;
const ALLOWED_TEXT_MODELS = ["gpt-4o-mini", "gpt-4o", "gpt-3.5-turbo"];

// Copy-only models (no official API)
const COPY_ONLY: Record<
  string,
  { name: string; url: string; instructions: string; type: "music" | "image" | "video" }
> = {
  suno: {
    name: "Suno",
    url: "https://suno.com",
    instructions: "Custom Mode를 활성화하고 Style 입력란에 프롬프트를 붙여넣으세요",
    type: "music",
  },
  midjourney: {
    name: "Midjourney",
    url: "https://www.midjourney.com",
    instructions: "Discord의 /imagine 명령어 뒤에 프롬프트를 붙여넣으세요",
    type: "image",
  },
  runway: {
    name: "Runway",
    url: "https://runwayml.com",
    instructions: "Gen-3 Alpha → Text to Video에 프롬프트를 붙여넣으세요",
    type: "video",
  },
  pika: {
    name: "Pika",
    url: "https://pika.art",
    instructions: "Text to Video 탭에 프롬프트를 입력하세요",
    type: "video",
  },
};

// ── Real API generators ──────────────────────────────────────────────────────

async function generateImage_DallE3(prompt: string): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({ model: "dall-e-3", prompt, n: 1, size: "1024x1024" }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: { message?: string } };
    throw new Error(err?.error?.message ?? `DALL-E error ${res.status}`);
  }
  const data = await res.json() as { data?: { url?: string }[] };
  const url = data.data?.[0]?.url;
  if (!url) throw new Error("No image URL returned from DALL-E");
  return url;
}

async function generateImage_Flux(prompt: string): Promise<string> {
  const res = await fetch("https://fal.run/fal-ai/flux/schnell", {
    method: "POST",
    headers: {
      Authorization: `Key ${process.env.FAL_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      image_size: "landscape_4_3",
      num_images: 1,
      enable_safety_checker: true,
    }),
  });
  if (!res.ok) throw new Error(`fal.ai error ${res.status}`);
  const data = await res.json() as { images?: { url?: string }[] };
  const url = data.images?.[0]?.url;
  if (!url) throw new Error("No image URL from fal.ai");
  return url;
}

async function generateMusic_MusicGen(prompt: string): Promise<string> {
  const res = await fetch("https://fal.run/fal-ai/musicgen", {
    method: "POST",
    headers: {
      Authorization: `Key ${process.env.FAL_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt, duration: 30 }),
  });
  if (!res.ok) throw new Error(`MusicGen error ${res.status}`);
  const data = await res.json() as { audio?: { url?: string }; audio_file?: { url?: string } };
  const url = data.audio?.url ?? data.audio_file?.url;
  if (!url) throw new Error("No audio URL from MusicGen");
  return url;
}

// ── Kling AI image generation (Kolors) ───────────────────────────────────────
async function generateImage_Kling(prompt: string): Promise<string> {
  const token = generateKlingJWT();
  const res = await fetch("https://api.klingai.com/v1/images/text2image", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model_name: "kolors-v1",
      prompt,
      n: 1,
      aspect_ratio: "16:9",
      image_format: "jpg",
    }),
  });
  if (!res.ok) throw new Error(`Kling Image API error ${res.status}`);

  const data = await res.json() as { data?: { task_id?: string } };
  const taskId = data.data?.task_id;
  if (!taskId) throw new Error("No task ID from Kling Image");

  for (let i = 0; i < 12; i++) {
    await new Promise((r) => setTimeout(r, 3000));
    const poll = await fetch(`https://api.klingai.com/v1/images/text2image/${taskId}`, {
      headers: { Authorization: `Bearer ${generateKlingJWT()}` },
    });
    if (poll.ok) {
      const s = await poll.json() as {
        data?: { task_status?: string; task_result?: { images?: { url?: string }[] } };
      };
      if (s.data?.task_status === "succeed") {
        const url = s.data?.task_result?.images?.[0]?.url;
        if (url) return url;
      }
      if (s.data?.task_status === "failed") throw new Error("Kling Image generation failed");
    }
  }
  throw new Error("Kling Image timed out after 36s");
}

// Kling AI JWT 생성 (Access Key ID + Secret 방식)
function generateKlingJWT(): string {
  const ak = process.env.KLING_ACCESS_KEY_ID ?? "";
  const sk = process.env.KLING_ACCESS_KEY_SECRET ?? "";
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(JSON.stringify({ iss: ak, exp: now + 1800, nbf: now - 5 })).toString("base64url");
  const sig = createHmac("sha256", sk).update(`${header}.${payload}`).digest("base64url");
  return `${header}.${payload}.${sig}`;
}

async function generateVideo_Kling(prompt: string): Promise<string> {
  const token = generateKlingJWT();
  const res = await fetch("https://api.klingai.com/v1/videos/text2video", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model_name: "kling-v1",
      prompt,
      duration: "5",
      aspect_ratio: "16:9",
      mode: "std",
    }),
  });
  if (!res.ok) throw new Error(`Kling API error ${res.status}`);

  const data = await res.json() as { data?: { task_id?: string } };
  const taskId = data.data?.task_id;
  if (!taskId) throw new Error("No task ID from Kling");

  for (let i = 0; i < 10; i++) {
    await new Promise((r) => setTimeout(r, 5000));
    const poll = await fetch(`https://api.klingai.com/v1/videos/text2video/${taskId}`, {
      headers: { Authorization: `Bearer ${generateKlingJWT()}` },
    });
    if (poll.ok) {
      const s = await poll.json() as { data?: { task_status?: string; task_result?: { videos?: { url?: string }[] } } };
      if (s.data?.task_status === "succeed") {
        const url = s.data?.task_result?.videos?.[0]?.url;
        if (url) return url;
      }
      if (s.data?.task_status === "failed") throw new Error("Kling generation failed");
    }
  }
  throw new Error("Kling timed out after 50s");
}

// ── Main handler ─────────────────────────────────────────────────────────────

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

  const PAID_PLANS = ["pro", "creator", "premium"];
  const limit = PAID_PLANS.includes(profile?.subscription_status ?? "") ? PRO_DAILY_LIMIT : DAILY_LIMIT;

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

  const body = await req.json() as { promptText?: unknown; model?: unknown };
  const { promptText, model } = body;

  if (!promptText || typeof promptText !== "string" || promptText.length > 2000) {
    return NextResponse.json({ error: "유효하지 않은 프롬프트입니다." }, { status: 400 });
  }

  const modelKey = (typeof model === "string" ? model : "").toLowerCase().trim();
  const remaining = limit - usedToday - 1;

  const logUsage = () =>
    supabase.from("playground_usage").insert({
      user_id: user.id,
      prompt_text: promptText.slice(0, 500),
      model_used: modelKey,
    });

  // ── Copy-only (Suno, Midjourney, Runway, Pika) ──────────────────────────
  if (COPY_ONLY[modelKey]) {
    const info = COPY_ONLY[modelKey];
    const emoji = info.type === "music" ? "🎵" : info.type === "image" ? "🎨" : "🎬";
    const typeLabel = info.type === "music" ? "음악" : info.type === "image" ? "이미지" : "영상";
    await logUsage();
    return NextResponse.json({
      content: `${emoji} 이 프롬프트는 **${info.name}** ${typeLabel} 생성용입니다.\n\n**사용 방법:**\n1. 아래 프롬프트를 복사하세요\n2. [${info.name}](${info.url}) 에 접속하세요\n3. ${info.instructions}\n\n---\n\n**프롬프트:**\n\`\`\`\n${promptText}\n\`\`\``,
      resultType: "copy",
      model: modelKey,
      platformUrl: info.url,
      remainingToday: remaining,
    });
  }

  // ── DALL-E 3 (real generation) ───────────────────────────────────────────
  if (modelKey === "dalle") {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI API 키가 설정되지 않았습니다." }, { status: 503 });
    }
    try {
      const imageUrl = await generateImage_DallE3(promptText);
      await logUsage();
      return NextResponse.json({
        content: "DALL-E 3 이미지 생성 완료",
        imageUrl,
        resultType: "image",
        model: "dalle",
        remainingToday: remaining,
      });
    } catch (e) {
      console.error("DALL-E error:", e);
      return NextResponse.json({ error: `DALL-E 오류: ${(e as Error).message}` }, { status: 500 });
    }
  }

  // ── fal.ai Flux (real generation) ───────────────────────────────────────
  if (modelKey === "flux") {
    if (!process.env.FAL_KEY) {
      return NextResponse.json(
        { error: "fal.ai API 키가 설정되지 않았습니다. 관리자에게 문의하세요.", remainingToday: remaining + 1 },
        { status: 503 }
      );
    }
    try {
      const imageUrl = await generateImage_Flux(promptText);
      await logUsage();
      return NextResponse.json({
        content: "Flux 이미지 생성 완료",
        imageUrl,
        resultType: "image",
        model: "flux",
        remainingToday: remaining,
      });
    } catch (e) {
      console.error("Flux error:", e);
      return NextResponse.json({ error: `Flux 오류: ${(e as Error).message}` }, { status: 500 });
    }
  }

  // ── fal.ai MusicGen (real generation) ──────────────────────────────────────
  if (modelKey === "musicgen") {
    if (!process.env.FAL_KEY) {
      return NextResponse.json(
        { error: "fal.ai API 키가 설정되지 않았습니다. 관리자에게 문의하세요.", remainingToday: remaining + 1 },
        { status: 503 }
      );
    }
    try {
      const audioUrl = await generateMusic_MusicGen(promptText);
      await logUsage();
      return NextResponse.json({
        content: "MusicGen 음악 생성 완료",
        audioUrl,
        resultType: "audio",
        model: "musicgen",
        remainingToday: remaining,
      });
    } catch (e) {
      console.error("MusicGen error:", e);
      return NextResponse.json({ error: `MusicGen 오류: ${(e as Error).message}` }, { status: 500 });
    }
  }

  // ── Kling AI image (Kolors) ──────────────────────────────────────────────
  if (modelKey === "kling-image") {
    if (!process.env.KLING_ACCESS_KEY_ID || !process.env.KLING_ACCESS_KEY_SECRET) {
      return NextResponse.json(
        { error: "Kling API 키가 설정되지 않았습니다. 관리자에게 문의하세요.", remainingToday: remaining + 1 },
        { status: 503 }
      );
    }
    try {
      const imageUrl = await generateImage_Kling(promptText);
      await logUsage();
      return NextResponse.json({
        content: "Kling Kolors 이미지 생성 완료",
        imageUrl,
        resultType: "image",
        model: "kling-image",
        remainingToday: remaining,
      });
    } catch (e) {
      console.error("Kling Image error:", e);
      return NextResponse.json({ error: `Kling 이미지 오류: ${(e as Error).message}` }, { status: 500 });
    }
  }

  // ── Kling AI video ───────────────────────────────────────────────────────
  if (modelKey === "kling") {
    if (!process.env.KLING_ACCESS_KEY_ID || !process.env.KLING_ACCESS_KEY_SECRET) {
      return NextResponse.json(
        { error: "Kling API 키가 설정되지 않았습니다. 관리자에게 문의하세요.", remainingToday: remaining + 1 },
        { status: 503 }
      );
    }
    try {
      const videoUrl = await generateVideo_Kling(promptText);
      await logUsage();
      return NextResponse.json({
        content: "Kling 영상 생성 완료",
        videoUrl,
        resultType: "video",
        model: "kling",
        remainingToday: remaining,
      });
    } catch (e) {
      console.error("Kling error:", e);
      return NextResponse.json({ error: `Kling 오류: ${(e as Error).message}` }, { status: 500 });
    }
  }

  // ── GPT Text (default) ───────────────────────────────────────────────────
  const selectedModel = ALLOWED_TEXT_MODELS.includes(modelKey) ? modelKey : "gpt-4o-mini";

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "AI 서비스가 현재 준비 중입니다.", remainingToday: remaining },
      { status: 503 }
    );
  }

  try {
    const gptRes = await fetch("https://api.openai.com/v1/chat/completions", {
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

    if (!gptRes.ok) throw new Error(`OpenAI error ${gptRes.status}`);

    const gptData = await gptRes.json() as { choices?: { message?: { content?: string } }[] };
    const content = gptData.choices?.[0]?.message?.content ?? "";
    await logUsage();

    return NextResponse.json({
      content,
      resultType: "text",
      model: selectedModel,
      remainingToday: remaining,
    });
  } catch (err) {
    console.error("GPT error:", err);
    return NextResponse.json({ error: "AI 생성 중 오류가 발생했습니다." }, { status: 500 });
  }
}
