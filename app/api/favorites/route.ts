import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ favorites: [] });

  const { data, error } = await supabase
    .from("favorites")
    .select("prompt_id")
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ favorites: data?.map((f) => f.prompt_id) ?? [] });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const { promptId } = body;
  if (!promptId) return NextResponse.json({ error: "promptId is required" }, { status: 400 });
  if (!UUID_REGEX.test(promptId)) {
    return NextResponse.json({ error: "Invalid promptId format" }, { status: 400 });
  }

  const { data: existing } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("prompt_id", promptId)
    .single();

  if (existing) {
    await supabase.from("favorites").delete().eq("id", existing.id);
    return NextResponse.json({ favorited: false });
  } else {
    await supabase.from("favorites").insert({ user_id: user.id, prompt_id: promptId });
    return NextResponse.json({ favorited: true });
  }
}
