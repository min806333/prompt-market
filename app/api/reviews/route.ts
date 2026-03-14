import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rateLimit, getClientIp } from "@/lib/security/rateLimit";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (!rateLimit(ip, { limit: 10, windowMs: 60 * 1000 })) {
    return NextResponse.json(
      { error: "요청이 너무 많습니다." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });

  const body = await req.json();
  const { promptId, rating, content, aiModelUsed } = body;

  if (!promptId || !rating || !content) {
    return NextResponse.json({ error: "필수 항목이 누락되었습니다." }, { status: 400 });
  }
  if (typeof rating !== "number" || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "평점은 1-5 사이여야 합니다." }, { status: 400 });
  }
  if (typeof content !== "string" || content.length < 10 || content.length > 2000) {
    return NextResponse.json({ error: "후기는 10자 이상 2000자 이하로 작성해주세요." }, { status: 400 });
  }

  // Verify purchase
  const { data: order } = await supabase
    .from("orders")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", promptId)
    .eq("payment_status", "completed")
    .single();

  if (!order) {
    return NextResponse.json({ error: "구매한 상품에만 후기를 작성할 수 있습니다." }, { status: 403 });
  }

  // Prevent duplicate review
  const { data: existing } = await supabase
    .from("reviews")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", promptId)
    .single();

  if (existing) {
    return NextResponse.json({ error: "이미 이 상품에 후기를 작성했습니다." }, { status: 409 });
  }

  const { data, error } = await supabase.from("reviews").insert({
    product_id: promptId,
    user_id: user.id,
    rating,
    content: content.trim(),
    ai_model_used: aiModelUsed,
    is_verified: true,
    order_id: order.id,
  }).select().single();

  if (error) {
    console.error("Review insert error:", error);
    return NextResponse.json({ error: "후기 등록에 실패했습니다." }, { status: 500 });
  }

  return NextResponse.json({ review: data }, { status: 201 });
}
