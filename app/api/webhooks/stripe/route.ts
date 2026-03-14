/**
 * Stripe Webhook Handler
 *
 * Security:
 *  - Signature verification via stripe.webhooks.constructEvent()
 *  - Idempotency via processed_events table (stripe event.id)
 *  - Service-role Supabase client (bypasses RLS)
 *
 * Handled events:
 *  - checkout.session.completed
 *  - invoice.payment_succeeded
 *  - customer.subscription.updated
 *  - customer.subscription.deleted
 *  - invoice.payment_failed
 *  - charge.refunded
 */

import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe/client";
import { createServiceClient } from "@/lib/supabase/service";
import {
  handleCheckoutSessionCompleted,
  handleInvoicePaymentSucceeded,
  handleSubscriptionUpdated,
  handleSubscriptionDeleted,
  handleInvoicePaymentFailed,
  handleChargeRefunded,
} from "@/lib/stripe/handlers";

// App Router reads raw body via req.text() — no config needed

const SUPPORTED_EVENTS = new Set([
  "checkout.session.completed",
  "invoice.payment_succeeded",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.payment_failed",
  "charge.refunded",
]);

export async function POST(req: NextRequest) {
  // ── 1. Guard: Stripe configured ──────────────────────────────
  if (!stripe) {
    console.error("[Webhook] Stripe client not initialised");
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[Webhook] STRIPE_WEBHOOK_SECRET not set");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 503 });
  }

  // ── 2. Signature verification ────────────────────────────────
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;
  const rawBody = await req.text(); // raw body required for HMAC verification

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[Webhook] Signature verification failed: ${message}`);
    return NextResponse.json({ error: `Webhook signature invalid: ${message}` }, { status: 400 });
  }

  // ── 3. Skip unsupported events early ─────────────────────────
  if (!SUPPORTED_EVENTS.has(event.type)) {
    return NextResponse.json({ received: true, skipped: true });
  }

  // ── 4. Idempotency check ─────────────────────────────────────
  const supabase = createServiceClient();

  const { data: alreadyProcessed } = await supabase
    .from("processed_events")
    .select("id")
    .eq("stripe_event_id", event.id)
    .single();

  if (alreadyProcessed) {
    console.log(`[Webhook] Duplicate event ignored: ${event.id}`);
    return NextResponse.json({ received: true, duplicate: true });
  }

  // ── 5. Mark as processing (reserve the event ID) ─────────────
  const { error: reserveError } = await supabase.from("processed_events").insert({
    stripe_event_id: event.id,
    event_type: event.type,
    processed_at: new Date().toISOString(),
    status: "processing",
  });

  if (reserveError) {
    // Another process already inserted this event (race condition handled)
    if (reserveError.code === "23505") {
      console.log(`[Webhook] Race condition handled for event: ${event.id}`);
      return NextResponse.json({ received: true, duplicate: true });
    }
    console.error(`[Webhook] Failed to reserve event: ${reserveError.message}`);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  // ── 6. Dispatch to handler ────────────────────────────────────
  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case "invoice.payment_succeeded":
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case "charge.refunded":
        await handleChargeRefunded(event.data.object as Stripe.Charge);
        break;
    }

    // ── 7. Mark as completed ──────────────────────────────────
    await supabase
      .from("processed_events")
      .update({ status: "completed" })
      .eq("stripe_event_id", event.id);

    console.log(`[Webhook] Event processed: ${event.type} (${event.id})`);
    return NextResponse.json({ received: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[Webhook] Handler error for ${event.type}: ${message}`);

    // Mark as failed — allows manual retry
    await supabase
      .from("processed_events")
      .update({ status: "failed", error_message: message })
      .eq("stripe_event_id", event.id);

    // Return 500 so Stripe retries the event
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }
}
