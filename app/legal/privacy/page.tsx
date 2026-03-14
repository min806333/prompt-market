import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";

export const metadata: Metadata = { title: "개인정보처리방침" };

export default function PrivacyPage() {
  return (
    <div className="py-12">
      <Container size="sm">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">개인정보처리방침</h1>
        <p className="text-sm text-gray-400 mb-10">최종 수정일: 2025년 1월 1일</p>

        <div className="space-y-8 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">수집하는 개인정보</h2>
            <p>이메일 주소 (뉴스레터 구독, 무료 샘플 신청 시), 결제 정보 (Stripe를 통해 처리되며 당사에 저장되지 않음)</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">개인정보 이용 목적</h2>
            <p>신상품 안내, 할인 정보 발송, 구매 확인 및 다운로드 링크 전달</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">개인정보 보유 기간</h2>
            <p>회원 탈퇴 또는 수신 거부 요청 시까지 보유합니다.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">문의</h2>
            <p>개인정보 관련 문의: <a href="mailto:privacy@promptmarket.io" className="text-brand-600 dark:text-brand-400 hover:underline">privacy@promptmarket.io</a></p>
          </section>
        </div>

        <div className="mt-10">
          <Button href="/" variant="outline">홈으로 돌아가기</Button>
        </div>
      </Container>
    </div>
  );
}
