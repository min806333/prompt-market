import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin/auth";
import { createServiceClient } from "@/lib/supabase/service";

export async function GET(req: NextRequest) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });

  const sb = createServiceClient();
  const { data, error } = await sb
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: "조회 실패" }, { status: 500 });
  return NextResponse.json({ announcements: data });
}

export async function POST(req: NextRequest) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "잘못된 요청" }, { status: 400 });

  const { title, slug, summary, content, category, is_pinned, image_url } = body;

  if (!title?.trim() || !slug?.trim() || !content?.trim() || !category)
    return NextResponse.json({ error: "필수 항목을 입력해주세요." }, { status: 400 });

  const safeSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");

  const sb = createServiceClient();
  const { data, error } = await sb
    .from("announcements")
    .insert({
      title: title.trim(),
      slug: safeSlug,
      summary: summary?.trim() ?? null,
      content: content.trim(),
      category,
      is_pinned: !!is_pinned,
      image_url: image_url?.trim() ?? null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ announcement: data }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });

  const body = await req.json().catch(() => null);
  if (!body?.id) return NextResponse.json({ error: "ID 필요" }, { status: 400 });

  const { id, ...updates } = body;
  const allowed = ["title", "summary", "content", "category", "is_pinned", "image_url"];
  const filtered = Object.fromEntries(
    Object.entries(updates).filter(([k]) => allowed.includes(k))
  );

  if (Object.keys(filtered).length === 0)
    return NextResponse.json({ error: "변경할 항목이 없습니다." }, { status: 400 });

  const sb = createServiceClient();
  const { error } = await sb.from("announcements").update(filtered).eq("id", id);
  if (error) return NextResponse.json({ error: "업데이트 실패" }, { status: 500 });

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });

  const body = await req.json().catch(() => null);
  if (!body?.id) return NextResponse.json({ error: "ID 필요" }, { status: 400 });

  const sb = createServiceClient();
  const { error } = await sb.from("announcements").delete().eq("id", body.id);
  if (error) return NextResponse.json({ error: "삭제 실패" }, { status: 500 });

  return NextResponse.json({ success: true });
}
