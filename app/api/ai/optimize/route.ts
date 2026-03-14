import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/security/rateLimit";

interface OptimizeRequest {
  prompt: string;
  targetModel?: string;
  goal?: string;
}

const SYSTEM_PROMPT = `You are an expert AI prompt engineer. Your job is to analyze and improve user-provided prompts.

When given a prompt, you must:
1. Improve clarity and structure
2. Add context and constraints that improve output quality
3. Optimize for the specified AI model
4. Return a JSON response with this exact structure:
{
  "optimized": "<the improved prompt>",
  "improvements": ["<improvement 1>", "<improvement 2>", ...],
  "qualityScore": {
    "clarity": <1-10>,
    "structure": <1-10>,
    "stability": <1-10>,
    "aiCompatibility": <1-10>,
    "overall": <1-10>
  }
}

Keep improvements concise (max 5 items). Write improvements in Korean. Optimize the prompt in its original language.`;

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const allowed = rateLimit(`ai-optimize:${ip}`, { limit: 5, windowMs: 60_000 });
  if (!allowed) {
    return NextResponse.json(
      { error: "요청 한도를 초과했습니다. 1분 후 다시 시도하세요." },
      { status: 429 }
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  let body: OptimizeRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const { prompt, targetModel = "ChatGPT", goal = "" } = body;

  if (!prompt?.trim()) {
    return NextResponse.json({ error: "프롬프트를 입력해주세요." }, { status: 400 });
  }

  if (prompt.length > 2000) {
    return NextResponse.json({ error: "프롬프트는 2000자 이하여야 합니다." }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "AI 서비스가 현재 준비 중입니다." }, { status: 503 });
  }

  const userMessage = `Optimize this prompt for ${targetModel}${goal ? ` with goal: ${goal}` : ""}:\n\n${prompt}`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
        temperature: 0.4,
        max_tokens: 1200,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenAI error:", errText);
      return NextResponse.json({ error: "AI 최적화에 실패했습니다." }, { status: 500 });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json({ error: "AI 응답이 없습니다." }, { status: 500 });
    }

    const parsed = JSON.parse(content);

    return NextResponse.json({
      original: prompt,
      optimized: parsed.optimized ?? prompt,
      improvements: parsed.improvements ?? [],
      qualityScore: parsed.qualityScore ?? {
        clarity: 7,
        structure: 7,
        stability: 7,
        aiCompatibility: 7,
        overall: 7,
      },
    });
  } catch (err) {
    console.error("Optimize error:", err);
    return NextResponse.json({ error: "AI 처리 중 오류가 발생했습니다." }, { status: 500 });
  }
}
