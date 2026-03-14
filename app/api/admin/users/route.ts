import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin/auth";
import { createServiceClient } from "@/lib/supabase/service";

export async function GET(req: NextRequest) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role");
  const search = searchParams.get("search");
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = 20;
  const offset = (page - 1) * limit;

  const sb = createServiceClient();
  let query = sb
    .from("profiles")
    .select("id, email, display_name, role, subscription_status, created_at", {
      count: "exact",
    })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (role && role !== "all") query = query.eq("role", role);
  if (search) query = query.ilike("email", `%${search}%`);

  const { data, count, error } = await query;
  if (error) return NextResponse.json({ error: "조회 실패" }, { status: 500 });

  return NextResponse.json({ users: data, total: count, page, limit });
}

export async function PATCH(req: NextRequest) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });

  const body = await req.json().catch(() => null);
  if (!body?.id || !body?.action)
    return NextResponse.json({ error: "필수 항목 누락" }, { status: 400 });

  const { id, action } = body;

  if (id === admin.id)
    return NextResponse.json({ error: "자신의 권한은 변경할 수 없습니다." }, { status: 400 });

  const roleMap: Record<string, string> = {
    make_admin: "admin",
    remove_admin: "user",
    ban: "banned",
    unban: "user",
  };

  const newRole = roleMap[action];
  if (!newRole) return NextResponse.json({ error: "유효하지 않은 액션" }, { status: 400 });

  const sb = createServiceClient();
  const { error } = await sb.from("profiles").update({ role: newRole }).eq("id", id);
  if (error) return NextResponse.json({ error: "업데이트 실패" }, { status: 500 });

  return NextResponse.json({ success: true, newRole });
}
