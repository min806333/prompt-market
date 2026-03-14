import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";

export const metadata: Metadata = { title: "이메일 인증" };

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-950">
      <Container size="sm">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-10 text-center">
          <p className="text-5xl mb-6">📧</p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">이메일을 확인하세요</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
            가입하신 이메일로 인증 링크를 발송했습니다.
            <br />
            이메일의 링크를 클릭하면 로그인이 완료됩니다.
          </p>
          <Button href="/auth/login" variant="outline">로그인 페이지로</Button>
        </div>
      </Container>
    </div>
  );
}
