import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/security/rateLimit";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const promptId = searchParams.get("promptId");

  if (!promptId) {
    return NextResponse.json({ error: "promptId is required" }, { status: 400 });
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("comments")
    .select(
      `id, content, created_at,
       profiles!inner(display_name, avatar_url)`
    )
    .eq("prompt_id", promptId)
    .eq("is_deleted", false)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ comments: [] });
  }

  const comments = (data ?? []).map((row: Record<string, unknown>) => ({
    id: row.id,
    promptId,
    content: row.content,
    createdAt: row.created_at,
    user: {
      displayName: (row.profiles as { display_name: string; avatar_url?: string })?.display_name ?? "익명",
      avatarUrl: (row.profiles as { display_name: string; avatar_url?: string })?.avatar_url,
    },
  }));

  return NextResponse.json({ comments });
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const allowed = rateLimit(`comments:${ip}`, { limit: 10, windowMs: 60_000 });
  if (!allowed) {
    return NextResponse.json({ error: "요청이 너무 많습니다. 잠시 후 다시 시도하세요." }, { status: 429 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  let body: { promptId?: string; content?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const { promptId, content } = body;

  if (!promptId || !content?.trim()) {
    return NextResponse.json({ error: "내용을 입력해주세요." }, { status: 400 });
  }

  const sanitized = content.trim().slice(0, 500);

  const { data, error } = await supabase
    .from("comments")
    .insert({ prompt_id: promptId, user_id: user.id, content: sanitized })
    .select(`id, content, created_at, profiles!inner(display_name, avatar_url)`)
    .single();

  if (error) {
    return NextResponse.json({ error: "댓글 등록에 실패했습니다." }, { status: 500 });
  }

  const profile = (data.profiles as unknown as { display_name: string; avatar_url?: string }) ?? {};
    return NextResponse.json({
    comment: {
      id: data.id,
      promptId,
      content: data.content,
      createdAt: data.created_at,
      user: {
        displayName: profile.display_name ?? "익명",
        avatarUrl: profile.avatar_url,
      },
    },
  });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const commentId = searchParams.get("id");

  if (!commentId) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase
    .from("comments")
    .update({ is_deleted: true })
    .eq("id", commentId)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: "삭제에 실패했습니다." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
