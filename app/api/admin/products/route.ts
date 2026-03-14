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
    .from("products")
    .select(
      `id, title, slug, price, status, is_featured, sales_count, created_at,
       creator:creator_id(display_name, username)`,
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status && status !== "all") query = query.eq("status", status);

  const { data, count, error } = await query;
  if (error) return NextResponse.json({ error: "조회 실패" }, { status: 500 });

  return NextResponse.json({ products: data, total: count, page, limit });
}

export async function PATCH(req: NextRequest) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });

  const body = await req.json().catch(() => null);
  if (!body?.id || !body?.action)
    return NextResponse.json({ error: "필수 항목 누락" }, { status: 400 });

  const { id, action } = body;

  const statusMap: Record<string, string> = {
    approve: "approved",
    reject: "rejected",
    pending: "pending",
  };

  const newStatus = statusMap[action];
  if (!newStatus) return NextResponse.json({ error: "유효하지 않은 액션" }, { status: 400 });

  const sb = createServiceClient();
  const { error } = await sb.from("products").update({ status: newStatus }).eq("id", id);
  if (error) return NextResponse.json({ error: "업데이트 실패" }, { status: 500 });

  return NextResponse.json({ success: true, newStatus });
}

export async function DELETE(req: NextRequest) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });

  const body = await req.json().catch(() => null);
  if (!body?.id) return NextResponse.json({ error: "ID 필요" }, { status: 400 });

  const sb = createServiceClient();
  const { error } = await sb.from("products").delete().eq("id", body.id);
  if (error) return NextResponse.json({ error: "삭제 실패" }, { status: 500 });

  return NextResponse.json({ success: true });
}
