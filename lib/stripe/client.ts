import Stripe from "stripe";

// Phase 2 확장 포인트: STRIPE_SECRET_KEY 환경변수 설정 후 활성화
export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2025-02-24.acacia" })
  : null;
