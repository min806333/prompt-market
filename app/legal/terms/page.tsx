import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";

export const metadata: Metadata = { title: "이용약관" };

export default function TermsPage() {
  return (
    <div className="py-12">
      <Container size="sm">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">이용약관</h1>
        <p className="text-sm text-gray-400 mb-10">최종 수정일: 2025년 1월 1일</p>

        <div className="prose dark:prose-invert max-w-none space-y-8 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">제1조 (목적)</h2>
            <p>본 약관은 PromptMarket(이하 &ldquo;서비스&rdquo;)이 제공하는 디지털 상품 판매 서비스의 이용과 관련한 조건 및 절차를 규정함을 목적으로 합니다.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">제2조 (서비스 이용)</h2>
            <p>구매한 디지털 상품(프롬프트 파일)은 개인 및 상업적 프로젝트에 사용 가능합니다. 단, 파일 자체의 재판매 또는 재배포는 금지됩니다.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">제3조 (환불 정책)</h2>
            <p>디지털 상품의 특성상 다운로드 후에는 환불이 어렵습니다. 단, 파일 오류 또는 설명과 다른 내용이 확인된 경우 고객센터를 통해 환불을 요청할 수 있습니다.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">제4조 (면책 조항)</h2>
            <p>프롬프트를 통해 생성된 AI 콘텐츠의 품질은 AI 서비스 제공자(Suno, ChatGPT 등)의 정책 변경에 따라 달라질 수 있으며, 이에 대해 PromptMarket은 책임을 지지 않습니다.</p>
          </section>
        </div>

        <div className="mt-10">
          <Button href="/" variant="outline">홈으로 돌아가기</Button>
        </div>
      </Container>
    </div>
  );
}
