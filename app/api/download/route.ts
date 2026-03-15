import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/security/rateLimit";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_HOSTS = [
  "supabase.co",
  "storage.googleapis.com",
  "promto.kr",
  "files.promto.kr",
];

export async function GET(req: NextRequest) {
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

  if (!/^[a-z0-9-]+$/.test(slug) || slug.length > 100) {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const supabase = await createClient();

  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id, title, is_free, file_url, demo_prompts")
    .eq("slug", slug)
    .single();

  if (productError || !product) {
    return NextResponse.json({ error: "상품을 찾을 수 없습니다." }, { status: 404 });
  }

  if (!product.is_free) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

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

  // If file_url is set, validate domain and redirect
  if (product.file_url) {
    try {
      const fileUrl = new URL(product.file_url);
      const isAllowed = ALLOWED_HOSTS.some((host) => fileUrl.hostname.endsWith(host));
      if (!isAllowed) {
        return NextResponse.json({ error: "허용되지 않은 파일 경로입니다." }, { status: 403 });
      }
      return NextResponse.redirect(product.file_url);
    } catch {
      return NextResponse.json({ error: "잘못된 파일 경로입니다." }, { status: 400 });
    }
  }

  // For free products without a file_url, generate a text file from demo_prompts
  if (product.is_free && product.demo_prompts && product.demo_prompts.length > 0) {
    const lines: string[] = [
      `${product.title}`,
      `${"=".repeat(product.title.length)}`,
      `Promto.kr — AI Prompt Marketplace`,
      "",
      "---",
      "",
    ];

    product.demo_prompts.forEach((prompt: string, idx: number) => {
      lines.push(`[Prompt ${idx + 1}]`);
      lines.push(prompt);
      lines.push("");
    });

    lines.push("---");
    lines.push("더 많은 프롬프트는 https://promto.kr 에서 확인하세요.");

    const textContent = lines.join("\n");
    const filename = `${slug}-sample.txt`;

    return new NextResponse(textContent, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  }

  return NextResponse.json(
    { error: "파일이 아직 준비되지 않았습니다. 잠시 후 다시 시도해주세요." },
    { status: 404 }
  );
}
