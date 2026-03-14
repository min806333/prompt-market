"use client";

import { useState, useTransition } from "react";
import { useRouter, useParams } from "next/navigation";

const plans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: null,
    description: "가입만 하면 바로 판매 가능",
    badge: null,
    cta: "무료로 시작",
    revenueShare: null,
    features: [
      "프롬프트 탐색 및 구매",
      "Playground 하루 3회 체험",
      "무료 샘플 다운로드",
      "기본 Builder 기능",
      "프롬프트 판매 가능 (수익 70%)",
    ],
    limitations: ["프리미엄 프롬프트 접근 불가", "Playground 제한됨"],
    highlighted: false,
    sellerNote: "판매 수익 70%",
  },
  {
    id: "pro",
    name: "Pro",
    price: 9,
    period: "month",
    description: "더 많은 수익과 강력한 판매 도구",
    badge: "🔥 인기",
    cta: "Pro 시작 (7일 무료)",
    revenueShare: 80,
    features: [
      "Playground 하루 20회",
      "Prompt Builder 전체 기능",
      "Prompt Remix 기능",
      "신규 프롬프트 우선 알림",
      "일부 프리미엄 프롬프트 접근",
      "프롬프트 판매 (수익 80%)",
      "Creator 통계 기본 대시보드",
    ],
    limitations: [],
    highlighted: true,
    sellerNote: "판매 수익 80%",
  },
  {
    id: "creator",
    name: "Creator",
    price: 19,
    period: "month",
    description: "전업 Creator를 위한 완전한 도구",
    badge: "💼 Creator",
    cta: "Creator 플랜 시작",
    revenueShare: 90,
    features: [
      "Pro 모든 기능 포함",
      "프롬프트 판매 (수익 90%)",
      "Creator Dashboard 전체 접근",
      "Creator Profile 배지 및 페이지",
      "검색 노출 우선순위 향상",
      "AI 품질 분석 도구",
      "Prompt Drop (한정 판매) 기능",
    ],
    limitations: [],
    highlighted: false,
    sellerNote: "판매 수익 90%",
  },
  {
    id: "premium",
    name: "Premium",
    price: 29,
    period: "month",
    description: "모든 기능 + 최고 수익률",
    badge: "⭐ 최고",
    cta: "Premium 시작",
    revenueShare: 90,
    features: [
      "Creator 모든 기능 포함",
      "프롬프트 판매 (수익 90%)",
      "전체 프롬프트 라이브러리 접근",
      "Playground 무제한",
      "추천 섹션 우선 노출",
      "우선 고객 지원",
      "베타 기능 선공개",
    ],
    limitations: [],
    highlighted: false,
    sellerNote: "판매 수익 90%",
  },
] as const;

type PlanId = typeof plans[number]["id"];

export default function PricingCards() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) ?? "ko";
  const localePath = locale && locale !== "ko" ? `/${locale}` : "";
  const [isPending, startTransition] = useTransition();
  const [loadingPlan, setLoadingPlan] = useState<PlanId | null>(null);

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
      {/* Revenue tier summary bar */}
      <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">판매 수익률:</span>
        {[
          { label: "Free", pct: "70%", color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300" },
          { label: "Pro", pct: "80%", color: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
          { label: "Creator", pct: "90%", color: "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300" },
          { label: "Premium", pct: "90%", color: "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" },
        ].map((t) => (
          <span key={t.label} className={`text-xs font-bold px-3 py-1.5 rounded-full ${t.color}`}>
            {t.label} {t.pct}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative flex flex-col rounded-2xl border p-6 ${
              plan.highlighted
                ? "border-indigo-500 bg-indigo-600 text-white shadow-xl shadow-indigo-200 dark:shadow-indigo-900/50 scale-[1.02]"
                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
            }`}
          >
            {plan.badge && (
              <div
                className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                  plan.highlighted
                    ? "bg-white text-indigo-600"
                    : "bg-indigo-600 text-white"
                }`}
              >
                {plan.badge}
              </div>
            )}

            <div className="mb-4">
              <h3
                className={`text-xl font-black mb-1 ${
                  plan.highlighted ? "text-white" : "text-gray-900 dark:text-white"
                }`}
              >
                {plan.name}
              </h3>
              <p
                className={`text-sm ${
                  plan.highlighted ? "text-indigo-100" : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {plan.description}
              </p>
            </div>

            <div className="mb-4">
              {plan.price === 0 ? (
                <span
                  className={`text-4xl font-black ${
                    plan.highlighted ? "text-white" : "text-gray-900 dark:text-white"
                  }`}
                >
                  무료
                </span>
              ) : (
                <div className="flex items-end gap-1">
                  <span
                    className={`text-4xl font-black ${
                      plan.highlighted ? "text-white" : "text-gray-900 dark:text-white"
                    }`}
                  >
                    ${plan.price}
                  </span>
                  <span
                    className={`text-sm mb-1.5 ${
                      plan.highlighted ? "text-indigo-200" : "text-gray-400"
                    }`}
                  >
                    /월
                  </span>
                </div>
              )}

              {/* Revenue share badge */}
              <div
                className={`inline-flex items-center gap-1 mt-2 px-2.5 py-1 rounded-lg text-xs font-bold ${
                  plan.highlighted
                    ? "bg-white/20 text-white"
                    : "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                }`}
              >
                💰 판매 수익 {plan.revenueShare ?? 70}%
              </div>
            </div>

            <ul className="flex-1 space-y-2.5 mb-6">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <svg
                    className={`w-4 h-4 mt-0.5 shrink-0 ${
                      plan.highlighted ? "text-indigo-200" : "text-indigo-500 dark:text-indigo-400"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className={plan.highlighted ? "text-indigo-50" : "text-gray-600 dark:text-gray-300"}>
                    {f}
                  </span>
                </li>
              ))}
              {plan.limitations.map((l) => (
                <li key={l} className="flex items-start gap-2 text-sm">
                  <svg
                    className={`w-4 h-4 mt-0.5 shrink-0 ${
                      plan.highlighted ? "text-indigo-300" : "text-gray-300 dark:text-gray-600"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span
                    className={
                      plan.highlighted
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
              onClick={() => handleSelect(plan.id)}
              disabled={loadingPlan !== null || isPending}
              className={`w-full py-3 rounded-xl font-semibold text-sm transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed ${
                plan.highlighted
                  ? "bg-white text-indigo-600 hover:bg-indigo-50"
                  : plan.id === "free"
                  ? "border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-indigo-400 hover:text-indigo-600"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              {loadingPlan === plan.id ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  처리 중...
                </span>
              ) : (
                plan.cta
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        모든 유료 플랜은 언제든지 취소 가능합니다. Pro 플랜은 7일 무료 체험이 포함됩니다.
        <br />
        결제는 USD 기준이며, 원화 결제 시 카드사 환율이 적용됩니다.
      </div>
    </div>
  );
}
