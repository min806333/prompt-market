import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="py-24">
      <Container size="sm">
        <div className="text-center">
          <p className="text-8xl font-black text-gray-100 dark:text-gray-800 mb-2 select-none">
            404
          </p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            페이지를 찾을 수 없습니다
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-10 leading-relaxed">
            주소가 잘못되었거나 삭제된 페이지입니다.
            <br />
            아래 링크에서 원하는 상품을 찾아보세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button href="/" size="lg">홈으로 이동</Button>
            <Button href="/products" size="lg" variant="outline">상품 목록 보기</Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
