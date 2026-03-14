import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin/auth";
import { createServiceClient } from "@/lib/supabase/service";

export async function GET(req: NextRequest) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = 20;
  const offset = (page - 1) * limit;

  const sb = createServiceClient();
  let query = sb
    .from("reports")
    .select(
      `id, report_type, description, status, created_at,
       reporter:reporter_id(email, display_name),
       prompt:prompt_id(id, title, slug, status)`,
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status && status !== "all") query = query.eq("status", status);

  const { data, count, error } = await query;
  if (error) return NextResponse.json({ error: "조회 실패" }, { status: 500 });

  return NextResponse.json({ reports: data, total: count, page, limit });
}

export async function PATCH(req: NextRequest) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });

  const body = await req.json().catch(() => null);
  if (!body?.id || !body?.action)
    return NextResponse.json({ error: "필수 항목 누락" }, { status: 400 });

  const { id, action, promptId } = body;

  const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!UUID_REGEX.test(id))
    return NextResponse.json({ error: "유효하지 않은 report ID입니다." }, { status: 400 });
  if (promptId && !UUID_REGEX.test(promptId))
    return NextResponse.json({ error: "유효하지 않은 promptId입니다." }, { status: 400 });

  const statusMap: Record<string, string> = {
    resolve: "resolved",
    dismiss: "dismissed",
    review: "reviewed",
  };

  const newStatus = statusMap[action];
  if (!newStatus) return NextResponse.json({ error: "유효하지 않은 액션" }, { status: 400 });

  const sb = createServiceClient();

  const { error } = await sb
    .from("reports")
    .update({ status: newStatus, reviewed_by: admin.id })
    .eq("id", id);

  if (error) return NextResponse.json({ error: "업데이트 실패" }, { status: 500 });

  // If resolving and promptId provided, also hide the reported prompt
  if (action === "resolve" && promptId) {
    await sb.from("products").update({ status: "rejected" }).eq("id", promptId);
  }

  return NextResponse.json({ success: true });
}
