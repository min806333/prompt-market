import { NextRequest, NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/data/mockData";
import { rateLimit, getClientIp } from "@/lib/security/rateLimit";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  // Rate limit: IP당 1분에 20회
  const ip = getClientIp(req);
  if (!rateLimit(ip, { limit: 20, windowMs: 60 * 1000 })) {
    return NextResponse.json(
      { error: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (!slug || typeof slug !== "string") {
    return NextResponse.json({ error: "slug 파라미터가 필요합니다." }, { status: 400 });
  }

  // slug 형식 검증 (경로 탈출 방지)
  if (!/^[a-z0-9-]+$/.test(slug) || slug.length > 100) {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const product = getProductBySlug(slug);
  if (!product) {
    return NextResponse.json({ error: "상품을 찾을 수 없습니다." }, { status: 404 });
  }

  if (!product.isFree) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }
    const { data: order } = await supabase
      .from("orders")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", product.id)
      .eq("payment_status", "completed")
      .single();
    if (!order) {
      return NextResponse.json({ error: "구매 후 다운로드 가능합니다." }, { status: 403 });
    }
  }

  if (!product.fileUrls[0]) {
    return NextResponse.json({ error: "다운로드 파일이 없습니다." }, { status: 404 });
  }

  // 외부 URL로 리디렉트 시 허용된 도메인만 허용
  const allowedHosts = ["supabase.co", "storage.googleapis.com"];
  try {
    const fileUrl = new URL(product.fileUrls[0]);
    const isAllowed = allowedHosts.some((host) => fileUrl.hostname.endsWith(host));
    if (!isAllowed) {
      return NextResponse.json({ error: "허용되지 않은 파일 경로입니다." }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: "잘못된 파일 경로입니다." }, { status: 400 });
  }

  return NextResponse.redirect(product.fileUrls[0]);
}
