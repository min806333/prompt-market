/**
 * Checkout API
 *
 * Supports two modes:
 *  - mode: "payment"      → single prompt purchase
 *  - mode: "subscription" → recurring plan subscription
 *
 * POST /api/checkout
 * Body (payment):      { mode: "payment",      productSlug: string }
 * Body (subscription): { mode: "subscription", plan: "pro" | "creator" | "premium" }
 */

import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/client";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { rateLimit, getClientIp } from "@/lib/security/rateLimit";

const PLAN_PRICE_MAP: Record<string, string | undefined> = {
  pro: process.env.STRIPE_PRICE_PRO,
  creator: process.env.STRIPE_PRICE_CREATOR,
  premium: process.env.STRIPE_PRICE_PREMIUM,
};

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (!rateLimit(ip, { limit: 10, windowMs: 60 * 1000 })) {
    return NextResponse.json(
      { error: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  if (!stripe) {
    return NextResponse.json(
      { error: "결제 시스템이 설정되지 않았습니다." },
      { status: 503 }
    );
  }

  // Get current user (optional for guest checkout)
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) {
    return NextResponse.json({ error: "서버 설정 오류입니다." }, { status: 500 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청 형식입니다." }, { status: 400 });
  }

  const mode = body.mode === "subscription" ? "subscription" : "payment";

  // ── Subscription checkout ─────────────────────────────────────
  if (mode === "subscription") {
    if (!user) {
      return NextResponse.json(
        { error: "구독은 로그인 후 이용 가능합니다." },
        { status: 401 }
      );
    }

    const plan = typeof body.plan === "string" ? body.plan : "";
    const priceId = PLAN_PRICE_MAP[plan];

    if (!priceId) {
      return NextResponse.json(
        { error: "유효하지 않은 플랜입니다. pro / creator / premium 중 선택하세요." },
        { status: 400 }
      );
    }

    // Get or create Stripe customer
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id, email")
      .eq("id", user.id)
      .single();

    let customerId = profile?.stripe_customer_id ?? null;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: profile?.email ?? user.email,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;

      await supabase
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    }

    try {
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ["card"],
        line_items: [{ price: priceId, quantity: 1 }],
        mode: "subscription",
        allow_promotion_codes: true,
        subscription_data: {
          metadata: { supabase_user_id: user.id, plan },
          trial_period_days: plan === "pro" ? 7 : undefined,
        },
        success_url: `${siteUrl}/payment/success?plan=${plan}`,
        cancel_url: `${siteUrl}/pricing?canceled=true`,
        metadata: { userId: user.id, plan },
      });

      return NextResponse.json({ url: session.url });
    } catch (err) {
      console.error("Stripe subscription checkout error:", err);
      return NextResponse.json(
        { error: "구독 세션 생성 중 오류가 발생했습니다." },
        { status: 500 }
      );
    }
  }

  // ── Single purchase checkout ──────────────────────────────────
  const productSlug = typeof body.productSlug === "string" ? body.productSlug : "";

  if (!/^[a-z0-9-]+$/.test(productSlug) || productSlug.length > 100) {
    return NextResponse.json({ error: "잘못된 상품 정보입니다." }, { status: 400 });
  }

  // Query Supabase for product (public read, no RLS issue)
  const sb = createServiceClient();
  const { data: product } = await sb
    .from("products")
    .select("id, title, slug, short_description, price, preview_image_url, is_free, external_buy_url")
    .eq("slug", productSlug)
    .single();

  if (!product) {
    return NextResponse.json({ error: "상품을 찾을 수 없습니다." }, { status: 404 });
  }

  if (product.is_free || product.price <= 0) {
    return NextResponse.json({ error: "무료 상품은 결제가 필요 없습니다." }, { status: 400 });
  }

  // Check if already purchased
  if (user) {
    const { data: existingOrder } = await supabase
      .from("orders")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", product.id)
      .eq("payment_status", "completed")
      .single();

    if (existingOrder) {
      return NextResponse.json(
        { error: "이미 구매한 상품입니다." },
        { status: 409 }
      );
    }
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: user?.email ?? undefined,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.title,
              description: product.short_description ?? undefined,
              images: product.preview_image_url ? [product.preview_image_url] : [],
            },
            unit_amount: Math.round(product.price * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      allow_promotion_codes: true,
      success_url: `${siteUrl}/payment/success?product=${productSlug}`,
      cancel_url: `${siteUrl}/payment/cancel?product=${productSlug}`,
      metadata: {
        productSlug,
        productId: product.id,
        userId: user?.id ?? "",
      },
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: "결제 세션 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
