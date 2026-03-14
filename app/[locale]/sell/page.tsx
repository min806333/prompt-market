import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import SectionTitle from "@/components/ui/SectionTitle";

export const metadata: Metadata = {
  title: "판매하기 — 프롬프트로 수익 창출",
  description:
    "직접 만든 AI 프롬프트를 PromptMarket에서 판매하고 수익을 창출하세요. 무료로 시작, 판매 수익의 최대 90%를 받으세요.",
};

const steps = [
  { step: "01", title: "회원가입 & 상품 등록", desc: "무료 가입 후 프롬프트 파일과 설명을 작성해 즉시 등록합니다.", icon: "📝" },
  { step: "02", title: "심사 및 승인", desc: "품질 기준을 통과한 상품이 마켓에 노출됩니다. 보통 24시간 이내.", icon: "✅" },
  { step: "03", title: "판매 시작", desc: "구매자가 결제하면 자동으로 파일이 전달됩니다.", icon: "🚀" },
  { step: "04", title: "수익 정산", desc: "판매 금액의 70~90%가 Stripe를 통해 정기 정산됩니다.", icon: "💰" },
];

const revenueTiers = [
  {
    plan: "Free",
    price: "무료",
    share: "70%",
    platform: "30%",
    color: "border-gray-200 dark:border-gray-700",
    badge: null,
    highlights: ["즉시 판매 시작", "기본 상품 등록"],
  },
  {
    plan: "Pro",
    price: "$9/월",
    share: "80%",
    platform: "20%",
    color: "border-blue-300 dark:border-blue-700",
    badge: "🔥",
    highlights: ["+10% 수익", "Creator 통계 대시보드", "검색 노출 향상"],
  },
  {
    plan: "Creator",
    price: "$19/월",
    share: "90%",
    platform: "10%",
    color: "border-indigo-400 dark:border-indigo-500",
    badge: "💼",
    highlights: ["+20% 수익", "우선 노출", "Prompt Drop 기능", "Creator 배지"],
  },
  {
    plan: "Premium",
    price: "$29/월",
    share: "90%",
    platform: "10%",
    color: "border-purple-400 dark:border-purple-500",
    badge: "⭐",
    highlights: ["Creator 모든 기능", "라이브러리 전체 접근", "무제한 Playground"],
  },
];

const earningExamples = [
  { price: "$9.99", sales: 10, plan: "Free", share: 0.7, label: "월 10건" },
  { price: "$9.99", sales: 50, plan: "Pro", share: 0.8, label: "월 50건" },
  { price: "$14.99", sales: 100, plan: "Creator", share: 0.9, label: "월 100건" },
];

export default function SellPage() {
  return (
    <div className="py-16">
      <Container>
        {/* Hero */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-6">
            💰 Creator Marketplace
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            당신의 프롬프트로
            <br />
            <span className="text-indigo-600 dark:text-indigo-400">수익을 창출하세요</span>
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            무료 가입만으로 즉시 판매 시작. 구독 플랜으로 수익률을{" "}
            <strong className="text-gray-900 dark:text-white">70% → 90%</strong>까지 높이세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/sell/new" size="lg">
              무료로 판매 시작
            </Button>
            <Button href="/pricing" variant="outline" size="lg">
              수익률 높이기 →
            </Button>
          </div>
          <p className="mt-4 text-sm text-gray-400">신용카드 불필요 · 가입 즉시 판매 가능</p>
        </div>

        {/* Revenue tier cards */}
        <div className="mb-16">
          <SectionTitle
            title="플랜별 수익 구조"
            subtitle="플랜을 업그레이드할수록 더 많은 수익을 가져갑니다"
            className="mb-8"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {revenueTiers.map((tier) => (
              <div
                key={tier.plan}
                className={`relative bg-white dark:bg-gray-900 rounded-2xl border-2 ${tier.color} p-6`}
              >
                {tier.badge && (
                  <span className="absolute -top-3 right-4 text-lg">{tier.badge}</span>
                )}
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-gray-900 dark:text-white">{tier.plan}</span>
                  <span className="text-sm text-gray-400">{tier.price}</span>
                </div>
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                    <span>판매자 수익</span>
                    <span className="font-bold text-green-600 dark:text-green-400">{tier.share}</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                      style={{ width: tier.share }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
                    <span>플랫폼 수수료 {tier.platform}</span>
                  </div>
                </div>
                <ul className="space-y-1">
                  {tier.highlights.map((h) => (
                    <li key={h} className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-indigo-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Earning calculator example */}
        <div className="mb-16 bg-gray-50 dark:bg-gray-900/60 rounded-3xl p-8">
          <SectionTitle
            title="수익 예시"
            subtitle="실제 판매 상황에서 예상 수익을 확인하세요"
            className="mb-8"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {earningExamples.map((ex) => {
              const gross = ex.price.replace("$", "");
              const net = (parseFloat(gross) * ex.sales * ex.share).toFixed(2);
              const total = (parseFloat(gross) * ex.sales).toFixed(2);
              return (
                <div key={ex.label} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{ex.label}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold">{ex.plan}</span>
                  </div>
                  <div className="space-y-1 text-sm mb-4">
                    <div className="flex justify-between text-gray-500 dark:text-gray-400">
                      <span>상품 가격</span><span>{ex.price}</span>
                    </div>
                    <div className="flex justify-between text-gray-500 dark:text-gray-400">
                      <span>판매 수량</span><span>{ex.sales}건</span>
                    </div>
                    <div className="flex justify-between text-gray-500 dark:text-gray-400">
                      <span>총 매출</span><span>${total}</span>
                    </div>
                    <div className="flex justify-between text-gray-400 dark:text-gray-600 text-xs">
                      <span>플랫폼 수수료 ({Math.round((1 - ex.share) * 100)}%)</span>
                      <span>-${(parseFloat(total) * (1 - ex.share)).toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-between items-baseline">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">내 수익</span>
                    <span className="text-2xl font-black text-green-600 dark:text-green-400">${net}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Steps */}
        <SectionTitle title="판매 프로세스" subtitle="4단계로 쉽게 시작할 수 있습니다" className="mb-10" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {steps.map((s) => (
            <div key={s.step} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{s.icon}</span>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2.5 py-1 rounded-full">
                  STEP {s.step}
                </span>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">{s.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-10 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">지금 바로 시작하세요</h2>
          <p className="text-indigo-100 mb-2 max-w-md mx-auto">
            무료 가입 후 즉시 판매 시작 — 수익의 70%는 바로 내 것입니다.
          </p>
          <p className="text-indigo-200 text-sm mb-8 max-w-md mx-auto">
            Pro/Creator 플랜으로 업그레이드하면 수익률이 80~90%로 올라갑니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button href="/sell/new" variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-indigo-600">
              무료로 판매 시작
            </Button>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-semibold bg-white/20 text-white hover:bg-white/30 transition"
            >
              플랜 비교하기
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
