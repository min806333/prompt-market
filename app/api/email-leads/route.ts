import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/security/rateLimit";

// Phase 2: Supabase email_leads 테이블에 저장
// import { createClient } from "@/lib/supabase/server";

// 허용 이메일 도메인 차단 목록 (스팸 방지)
const BLOCKED_DOMAINS = ["mailinator.com", "tempmail.com", "throwaway.email", "guerrillamail.com"];

function isValidEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;
  if (email.length > 254) return false;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false;
  const domain = email.split("@")[1]?.toLowerCase();
  if (BLOCKED_DOMAINS.includes(domain)) return false;
  return true;
}

export async function POST(req: NextRequest) {
  // Rate limit: IP당 5분에 3회
  const ip = getClientIp(req);
  if (!rateLimit(ip, { limit: 3, windowMs: 5 * 60 * 1000 })) {
    return NextResponse.json(
      { error: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "잘못된 요청 형식입니다." }, { status: 400 });
    }

    const { email, source = "newsletter", sourceProductId } = body;

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "유효한 이메일을 입력해주세요." }, { status: 400 });
    }

    const allowedSources = ["cta", "sample", "newsletter"];
    if (!allowedSources.includes(source)) {
      return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
    }

    // Phase 1: 콘솔 출력
    console.log("[email_leads]", { email: email.toLowerCase(), source });

    // Phase 2: Supabase 저장
    // const supabase = await createClient();
    // const { error } = await supabase.from("email_leads").insert({
    //   email: email.toLowerCase(),
    //   source,
    //   source_product_id: sourceProductId ?? null,
    // });
    // if (error && error.code !== "23505") throw error;

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
