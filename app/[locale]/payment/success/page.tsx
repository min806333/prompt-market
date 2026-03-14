import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";

export const metadata: Metadata = { title: "결제 완료 | Promto" };

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ product?: string }>;
}

export default async function PaymentSuccessPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { product } = await searchParams;
  const lp = locale === "ko" ? "" : `/${locale}`;

  return (
    <div className="py-20">
      <Container size="sm">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-3">
            결제가 완료되었습니다!
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-2 leading-relaxed">
            구매해주셔서 감사합니다.
            <br />마이페이지에서 다운로드할 수 있습니다.
          </p>

          <div className="mt-8 p-5 rounded-2xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 text-left mb-8">
            <p className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">다음 단계</p>
            <ol className="text-sm text-green-700 dark:text-green-400 space-y-1.5 list-decimal list-inside">
              <li>마이페이지에서 구매 내역을 확인하세요</li>
              <li>다운로드 버튼을 클릭해 파일을 받으세요</li>
              <li>AI 툴에 프롬프트를 붙여넣고 바로 사용하세요</li>
            </ol>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button href={`${lp}/dashboard`} size="lg">마이페이지로 이동</Button>
            {product && (
              <Button href={`${lp}/products/${product}`} size="lg" variant="outline">
                상품으로 돌아가기
              </Button>
            )}
            <Button href={`${lp}/products`} size="lg" variant="ghost">다른 상품 보기</Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
