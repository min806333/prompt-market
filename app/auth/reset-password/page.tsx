"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/ToastProvider";
import Button from "@/components/ui/Button";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const toast = useToast();
  const supabase = createClient();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      setSent(true);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-950">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-10 text-center max-w-md w-full">
          <p className="text-5xl mb-6">📬</p>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">이메일을 확인하세요</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">비밀번호 재설정 링크를 발송했습니다.</p>
          <Button href="/auth/login" variant="outline">로그인으로 돌아가기</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-950">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-8">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <span className="text-3xl">⚡</span>
              <span className="font-bold text-xl text-gray-900 dark:text-white">PromptMarket</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">비밀번호 찾기</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">가입한 이메일을 입력하세요</p>
          </div>
          <form onSubmit={handleReset} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>
            <Button type="submit" className="w-full justify-center" disabled={loading}>
              {loading ? "발송 중..." : "재설정 링크 보내기"}
            </Button>
          </form>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            <Link href="/auth/login" className="text-indigo-600 dark:text-indigo-400 hover:underline">로그인으로 돌아가기</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
