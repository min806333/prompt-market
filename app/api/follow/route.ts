import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  let body: { creatorId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const { creatorId } = body;

  if (!creatorId) {
    return NextResponse.json({ error: "creatorId is required" }, { status: 400 });
  }

  if (!UUID_REGEX.test(creatorId)) {
    return NextResponse.json({ error: "Invalid creatorId format" }, { status: 400 });
  }

  if (creatorId === user.id) {
    return NextResponse.json({ error: "자신을 팔로우할 수 없습니다." }, { status: 400 });
  }

  // Check if already following
  const { data: existing } = await supabase
    .from("creator_followers")
    .select("id")
    .eq("creator_id", creatorId)
    .eq("follower_id", user.id)
    .maybeSingle();

  if (existing) {
    // Unfollow
    await supabase
      .from("creator_followers")
      .delete()
      .eq("creator_id", creatorId)
      .eq("follower_id", user.id);

    // Decrement follower_count
    await supabase.rpc("decrement_follower_count", { p_creator_id: creatorId });

    return NextResponse.json({ following: false });
  } else {
    // Follow
    await supabase
      .from("creator_followers")
      .insert({ creator_id: creatorId, follower_id: user.id });

    // Increment follower_count
    await supabase.rpc("increment_follower_count", { p_creator_id: creatorId });

    return NextResponse.json({ following: true });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const creatorId = searchParams.get("creatorId");

  if (!creatorId) {
    return NextResponse.json({ error: "creatorId is required" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ following: false, followerCount: 0 });
  }

  const [followCheck, countCheck] = await Promise.all([
    supabase
      .from("creator_followers")
      .select("id")
      .eq("creator_id", creatorId)
      .eq("follower_id", user.id)
      .maybeSingle(),
    supabase
      .from("creators")
      .select("follower_count")
      .eq("user_id", creatorId)
      .maybeSingle(),
  ]);

  return NextResponse.json({
    following: !!followCheck.data,
    followerCount: countCheck.data?.follower_count ?? 0,
  });
}
