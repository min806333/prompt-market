import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rateLimit, getClientIp } from "@/lib/security/rateLimit";

const REPORT_TYPES = ["spam", "duplicate", "not_working", "inappropriate"] as const;

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (!rateLimit(ip, { limit: 5, windowMs: 60 * 60 * 1000 })) {
    return NextResponse.json({ error: "신고는 1시간에 5회까지 가능합니다." }, { status: 429 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });

  const body = await req.json();
  const { promptId, reportType, description } = body;

  if (!promptId || !reportType) {
    return NextResponse.json({ error: "필수 항목이 누락되었습니다." }, { status: 400 });
  }
  if (!REPORT_TYPES.includes(reportType)) {
    return NextResponse.json({ error: "유효하지 않은 신고 유형입니다." }, { status: 400 });
  }

  const { error } = await supabase.from("reports").insert({
    reporter_id: user.id,
    prompt_id: promptId,
    report_type: reportType,
    description: description?.slice(0, 1000) ?? null,
    status: "pending",
  });

  if (error) {
    return NextResponse.json({ error: "신고 접수에 실패했습니다." }, { status: 500 });
  }

  return NextResponse.json({ message: "신고가 접수되었습니다. 검토 후 처리됩니다." }, { status: 201 });
}
