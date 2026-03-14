/**
 * Stripe Webhook Event Handlers
 * Each handler is responsible for a single Stripe event type.
 * All DB mutations use service-role client to bypass RLS.
 */

import type Stripe from "stripe";
import { createServiceClient } from "@/lib/supabase/service";

// ─────────────────────────────────────────────
// 1. checkout.session.completed
//    Single purchase: create order + grant access
// ─────────────────────────────────────────────
export async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
): Promise<void> {
  const { metadata, customer, customer_email, amount_total, mode } = session;

  const supabase = createServiceClient();

  if (mode === "subscription") {
    // Subscription checkout — subscription handler will cover the rest
    // Just ensure profile has stripe_customer_id
    if (customer && customer_email) {
      await supabase
        .from("profiles")
        .update({ stripe_customer_id: customer as string })
        .eq("email", customer_email);
    }
    return;
  }

  // One-time purchase
  const productSlug = metadata?.productSlug;
  const userId = metadata?.userId;

  if (!productSlug) {
    console.warn("[Webhook] checkout.session.completed: missing productSlug in metadata");
    return;
  }

  // Look up product
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id, price, creator_id")
    .eq("slug", productSlug)
    .single();

  if (productError || !product) {
    console.error(`[Webhook] Product not found for slug: ${productSlug}`);
    return;
  }

  // Resolve user_id: from metadata or by stripe_customer_id
  let resolvedUserId = userId ?? null;
  if (!resolvedUserId && customer) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("stripe_customer_id", customer as string)
      .single();
    resolvedUserId = profile?.id ?? null;
  }

  // Upsert order (idempotent — unique on stripe_session_id)
  const { error: orderError } = await supabase.from("orders").upsert(
    {
      user_id: resolvedUserId,
      product_id: product.id,
      amount: (amount_total ?? 0) / 100,
      payment_status: "completed",
      payment_method: "stripe",
      stripe_session_id: session.id,
      stripe_payment_intent:
        typeof session.payment_intent === "string" ? session.payment_intent : null,
    },
    { onConflict: "stripe_session_id", ignoreDuplicates: true }
  );

  if (orderError) {
    throw new Error(`[Webhook] Order upsert failed: ${orderError.message}`);
  }

  // Increment product sales_count
  await supabase.rpc("increment_product_sales", { p_product_id: product.id });

  // Creator revenue: tiered by seller's subscription plan
  // free: 70%  |  pro: 80%  |  creator/premium: 90%
  if (product.creator_id && amount_total) {
    const { data: creatorProfile } = await supabase
      .from("profiles")
      .select("subscription_status")
      .eq("id", product.creator_id)
      .single();

    const creatorPlan = creatorProfile?.subscription_status ?? "free";
    const revenueShare =
      creatorPlan === "creator" || creatorPlan === "premium"
        ? 0.9
        : creatorPlan === "pro"
        ? 0.8
        : 0.7; // free tier
    const creatorRevenue = Math.round(amount_total * revenueShare) / 100;

    await supabase.rpc("add_creator_revenue", {
      p_creator_id: product.creator_id,
      p_amount: creatorRevenue,
    });
  }

  console.log(`[Webhook] Order created for session ${session.id}`);
}

// ─────────────────────────────────────────────
// 2. invoice.payment_succeeded
//    Subscription renewed or first payment
// ─────────────────────────────────────────────
export async function handleInvoicePaymentSucceeded(
  invoice: Stripe.Invoice
): Promise<void> {
  const subscriptionId =
    typeof invoice.subscription === "string"
      ? invoice.subscription
      : invoice.subscription?.id;

  if (!subscriptionId) return;

  const supabase = createServiceClient();

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("id, user_id")
    .eq("stripe_subscription_id", subscriptionId)
    .single();

  if (!subscription) {
    console.warn(`[Webhook] Subscription not found: ${subscriptionId}`);
    return;
  }

  await supabase
    .from("subscriptions")
    .update({
      status: "active",
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", subscriptionId);

  // Sync profile subscription status
  await supabase
    .from("profiles")
    .update({ subscription_status: "pro" })
    .eq("id", subscription.user_id);

  console.log(`[Webhook] Subscription renewed: ${subscriptionId}`);
}

// ─────────────────────────────────────────────
// 3. customer.subscription.updated
//    Plan change or trial end
// ─────────────────────────────────────────────
export async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription
): Promise<void> {
  const supabase = createServiceClient();

  const plan = extractPlanFromSubscription(subscription);
  const isActive = ["active", "trialing"].includes(subscription.status);

  const { data: existing } = await supabase
    .from("subscriptions")
    .select("id, user_id")
    .eq("stripe_subscription_id", subscription.id)
    .single();

  if (existing) {
    await supabase
      .from("subscriptions")
      .update({
        plan,
        status: subscription.status,
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end,
        updated_at: new Date().toISOString(),
      })
      .eq("stripe_subscription_id", subscription.id);

    await supabase
      .from("profiles")
      .update({ subscription_status: isActive ? "pro" : "free" })
      .eq("id", existing.user_id);
  } else {
    // First-time insert (subscription created via checkout)
    const customerId =
      typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer?.id;

    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("stripe_customer_id", customerId ?? "")
      .single();

    if (profile) {
      await supabase.from("subscriptions").insert({
        user_id: profile.id,
        stripe_subscription_id: subscription.id,
        stripe_customer_id: customerId,
        plan,
        status: subscription.status,
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end,
      });

      await supabase
        .from("profiles")
        .update({ subscription_status: isActive ? "pro" : "free" })
        .eq("id", profile.id);
    }
  }

  console.log(`[Webhook] Subscription updated: ${subscription.id} → ${subscription.status}`);
}

// ─────────────────────────────────────────────
// 4. customer.subscription.deleted
//    Subscription cancelled / expired
// ─────────────────────────────────────────────
export async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
): Promise<void> {
  const supabase = createServiceClient();

  const { data: existing } = await supabase
    .from("subscriptions")
    .select("id, user_id")
    .eq("stripe_subscription_id", subscription.id)
    .single();

  if (!existing) return;

  await supabase
    .from("subscriptions")
    .update({
      status: "canceled",
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", subscription.id);

  await supabase
    .from("profiles")
    .update({ subscription_status: "free" })
    .eq("id", existing.user_id);

  console.log(`[Webhook] Subscription deleted: ${subscription.id}`);
}

// ─────────────────────────────────────────────
// 5. invoice.payment_failed
//    Payment failed — notify user
// ─────────────────────────────────────────────
export async function handleInvoicePaymentFailed(
  invoice: Stripe.Invoice
): Promise<void> {
  const subscriptionId =
    typeof invoice.subscription === "string"
      ? invoice.subscription
      : invoice.subscription?.id;

  if (!subscriptionId) return;

  const supabase = createServiceClient();

  await supabase
    .from("subscriptions")
    .update({
      status: "past_due",
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", subscriptionId);

  // Log payment failure for admin review
  const customerId =
    typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id;

  if (customerId) {
    await supabase.from("payment_failures").insert({
      stripe_customer_id: customerId,
      stripe_invoice_id: invoice.id,
      amount_due: (invoice.amount_due ?? 0) / 100,
      attempt_count: invoice.attempt_count ?? 1,
    });
  }

  console.warn(`[Webhook] Payment failed for subscription: ${subscriptionId}`);
}

// ─────────────────────────────────────────────
// 6. charge.refunded
//    Refund issued — revoke access
// ─────────────────────────────────────────────
export async function handleChargeRefunded(
  charge: Stripe.Charge
): Promise<void> {
  const paymentIntentId =
    typeof charge.payment_intent === "string"
      ? charge.payment_intent
      : charge.payment_intent?.id;

  if (!paymentIntentId) return;

  const supabase = createServiceClient();

  const { data: order } = await supabase
    .from("orders")
    .select("id, user_id, product_id, amount, creator_id:products(creator_id)")
    .eq("stripe_payment_intent", paymentIntentId)
    .single();

  if (!order) {
    console.warn(`[Webhook] Order not found for payment_intent: ${paymentIntentId}`);
    return;
  }

  const isFullRefund = charge.amount_refunded >= charge.amount;
  const newStatus = isFullRefund ? "refunded" : "partially_refunded";

  await supabase
    .from("orders")
    .update({ payment_status: newStatus })
    .eq("id", order.id);

  // Decrement sales count on full refund
  if (isFullRefund) {
    await supabase.rpc("decrement_product_sales", { p_product_id: order.product_id });
  }

  console.log(`[Webhook] Charge refunded: ${charge.id} (${newStatus})`);
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function extractPlanFromSubscription(subscription: Stripe.Subscription): string {
  const item = subscription.items?.data?.[0];
  if (!item) return "pro";

  const priceId = item.price?.id ?? "";
  const priceNickname = (item.price?.nickname ?? "").toLowerCase();
  const productName = (
    typeof item.price?.product === "object" && item.price.product
      ? (item.price.product as Stripe.Product).name ?? ""
      : ""
  ).toLowerCase();

  if (priceNickname.includes("premium") || productName.includes("premium")) return "premium";
  if (priceNickname.includes("creator") || productName.includes("creator")) return "creator";
  if (priceNickname.includes("pro") || productName.includes("pro")) return "pro";

  // Fallback: check env price IDs
  if (priceId === process.env.STRIPE_PRICE_PREMIUM) return "premium";
  if (priceId === process.env.STRIPE_PRICE_CREATOR) return "creator";
  return "pro";
}
