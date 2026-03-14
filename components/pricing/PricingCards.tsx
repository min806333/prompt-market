"use client";

import { useState, useTransition } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";

const PLAN_IDS = ["free", "pro", "creator", "premium"] as const;
type PlanId = (typeof PLAN_IDS)[number];

const PLAN_PRICES: Record<PlanId, number> = {
  free: 0,
  pro: 9,
  creator: 19,
  premium: 29,
};

const REVENUE_SHARES: Record<PlanId, number> = {
  free: 70,
  pro: 80,
  creator: 90,
  premium: 95,
};

const REVENUE_TIER_COLORS: Record<PlanId, string> = {
  free: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
  pro: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  creator: "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
  premium: "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
};

export default function PricingCards() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) ?? "ko";
  const localePath = locale && locale !== "ko" ? `/${locale}` : "";
  const [isPending, startTransition] = useTransition();
  const [loadingPlan, setLoadingPlan] = useState<PlanId | null>(null);
  const t = useTranslations("pricing");

  async function handleSelect(planId: PlanId) {
    if (planId === "free") {
      router.push(`${localePath}/sell/new`);
      return;
    }

    setLoadingPlan(planId);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "subscription", plan: planId }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          router.push(`${localePath}/auth/login?next=${localePath}/pricing`);
          return;
        }
        alert(data.error ?? "오류가 발생했습니다.");
        return;
      }

      if (data.url) {
        startTransition(() => {
          window.location.href = data.url;
        });
      }
    } catch {
      alert("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoadingPlan(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          {t("revenueLabel")}
        </span>
        {PLAN_IDS.map((planId) => (
          <span
            key={planId}
            className={`text-xs font-bold px-3 py-1.5 rounded-full ${REVENUE_TIER_COLORS[planId]}`}
          >
            {t(`plans.${planId}.name`)} {REVENUE_SHARES[planId]}%
          </span>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {PLAN_IDS.map((planId) => {
          const price = PLAN_PRICES[planId];
          const revenueShare = REVENUE_SHARES[planId];
          const isHighlighted = planId === "pro";
          const features = t.raw(`plans.${planId}.features`) as string[];
          const limitations = t.raw(`plans.${planId}.limitations`) as string[];
          const hasBadge = planId !== "free";

          return (
            <div
              key={planId}
              className={`relative flex flex-col rounded-2xl border p-6 ${
                isHighlighted
                  ? "border-indigo-500 bg-indigo-600 text-white shadow-xl shadow-indigo-200 dark:shadow-indigo-900/50 scale-[1.02]"
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
              }`}
            >
              {hasBadge && (
                <div
                  className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                    isHighlighted ? "bg-white text-indigo-600" : "bg-indigo-600 text-white"
                  }`}
                >
                  {t(`plans.${planId}.badge`)}
                </div>
              )}

              <div className="mb-4">
                <h3
                  className={`text-xl font-black mb-1 ${
                    isHighlighted ? "text-white" : "text-gray-900 dark:text-white"
                  }`}
                >
                  {t(`plans.${planId}.name`)}
                </h3>
                <p
                  className={`text-sm ${
                    isHighlighted ? "text-indigo-100" : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {t(`plans.${planId}.description`)}
                </p>
              </div>

              <div className="mb-4">
                {price === 0 ? (
                  <span
                    className={`text-4xl font-black ${
                      isHighlighted ? "text-white" : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {t("free")}
                  </span>
                ) : (
                  <div className="flex items-end gap-1">
                    <span
                      className={`text-4xl font-black ${
                        isHighlighted ? "text-white" : "text-gray-900 dark:text-white"
                      }`}
                    >
                      ${price}
                    </span>
                    <span
                      className={`text-sm mb-1.5 ${
                        isHighlighted ? "text-indigo-200" : "text-gray-400"
                      }`}
                    >
                      {t("perMonth")}
                    </span>
                  </div>
                )}

                <div
                  className={`inline-flex items-center gap-1 mt-2 px-2.5 py-1 rounded-lg text-xs font-bold ${
                    isHighlighted
                      ? "bg-white/20 text-white"
                      : "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                  }`}
                >
                  💰 {t("revenueShare", { pct: revenueShare })}
                </div>
              </div>

              <ul className="flex-1 space-y-2.5 mb-6">
                {features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <svg
                      className={`w-4 h-4 mt-0.5 shrink-0 ${
                        isHighlighted ? "text-indigo-200" : "text-indigo-500 dark:text-indigo-400"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className={isHighlighted ? "text-indigo-50" : "text-gray-600 dark:text-gray-300"}>
                      {f}
                    </span>
                  </li>
                ))}
                {limitations.map((l, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <svg
                      className={`w-4 h-4 mt-0.5 shrink-0 ${
                        isHighlighted ? "text-indigo-300" : "text-gray-300 dark:text-gray-600"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span
                      className={
                        isHighlighted
                          ? "text-indigo-300 line-through"
                          : "text-gray-400 dark:text-gray-600 line-through"
                      }
                    >
                      {l}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSelect(planId)}
                disabled={loadingPlan !== null || isPending}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed ${
                  isHighlighted
                    ? "bg-white text-indigo-600 hover:bg-indigo-50"
                    : planId === "free"
                    ? "border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-indigo-400 hover:text-indigo-600"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                {loadingPlan === planId ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {t("processing")}
                  </span>
                ) : (
                  t(`plans.${planId}.cta`)
                )}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        {t("cancelAnytime")}
        <br />
        {t("usdNote")}
      </div>
    </div>
  );
}
