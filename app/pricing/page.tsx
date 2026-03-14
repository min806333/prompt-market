import type { Metadata } from "next";
import PricingCards from "@/components/pricing/PricingCards";
import Container from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "요금제 | Promto",
  description: "무료부터 프리미엄까지. 인디 크리에이터를 위한 AI 프롬프트 마켓플레이스 요금제를 확인하세요.",
};

export default function PricingPage() {
  return (
    <div className="py-16">
      <Container>
        <div className="text-center mb-14">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4">
            요금제 선택
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            무료로 시작하고, 필요할 때 업그레이드하세요.
            Pro 플랜은 <span className="text-indigo-600 dark:text-indigo-400 font-semibold">7일 무료 체험</span>이 포함됩니다.
          </p>
        </div>
        <PricingCards />
      </Container>
    </div>
  );
}
