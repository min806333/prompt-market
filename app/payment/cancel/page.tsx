import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";

export const metadata: Metadata = { title: "결제 취소" };

interface Props {
  searchParams: Promise<{ product?: string }>;
}

export default async function PaymentCancelPage({ searchParams }: Props) {
  const { product } = await searchParams;

  return (
    <div className="py-20">
      <Container size="sm">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-3">
            결제가 취소되었습니다
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
            결제가 완료되지 않았습니다.
            <br />다시 시도하거나 다른 결제 수단을 사용해보세요.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button href={product ? `/products/${product}` : "/products"} size="lg">
              다시 시도하기
            </Button>
            <Button href="/samples" size="lg" variant="outline">무료 샘플 받기</Button>
          </div>

          <p className="mt-8 text-xs text-gray-400">결제 관련 문의는 이메일로 연락해주세요.</p>
        </div>
      </Container>
    </div>
  );
}
