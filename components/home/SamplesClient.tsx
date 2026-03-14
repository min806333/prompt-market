"use client";

import { useState } from "react";
import Link from "next/link";
import type { Prompt } from "@/types";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import ProductCard from "@/components/product/ProductCard";
import { useToast } from "@/components/ui/ToastProvider";

interface SamplesClientProps {
  freeProduct: Prompt;
  relatedProducts: Prompt[];
}

export default function SamplesClient({ freeProduct, relatedProducts }: SamplesClientProps) {
  const [email, setEmail] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const sampleTexts = freeProduct.samples?.map((s) => s.sampleText) ?? [];

  async function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await fetch("/api/email-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "sample", sourceProductId: freeProduct.id }),
      });
      setUnlocked(true);
      toast.success("이메일이 등록되었습니다. 샘플 프롬프트를 확인하세요!");
    } catch {
      toast.error("오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="py-10">
      <Container size="md">
        <div className="text-center mb-10">
          <Badge variant="free" className="mb-4">무료 샘플</Badge>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-3">
            {freeProduct.title}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {freeProduct.shortDescription}
          </p>
        </div>

        {!unlocked ? (
          <div className="bg-gradient-to-br from-brand-50 to-purple-50 dark:from-brand-950/40 dark:to-purple-950/40 border border-brand-100 dark:border-brand-900 rounded-3xl p-8 mb-10">
            <div className="text-center mb-6">
              <p className="text-2xl mb-3">🔓</p>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                이메일 입력 후 바로 확인
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                무료로 샘플 {freeProduct.promptCount}종을 즉시 열람할 수 있어요
              </p>
            </div>
            <form onSubmit={handleUnlock} className="flex gap-3 max-w-sm mx-auto">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" className="shrink-0" disabled={loading}>
                {loading ? "처리중..." : "무료로 보기"}
              </Button>
            </form>
          </div>
        ) : (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-6 p-4 rounded-2xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900">
              <span>✅</span>
              <p className="text-sm font-medium text-green-700 dark:text-green-400">
                이메일이 등록되었습니다. 샘플 프롬프트를 자유롭게 사용해보세요!
              </p>
            </div>

            <div className="space-y-4">
              {sampleTexts.map((prompt, idx) => (
                <PromptBlock key={idx} index={idx + 1} prompt={prompt} />
              ))}
            </div>
          </div>
        )}

        {!unlocked && (
          <div className="space-y-3 mb-10">
            {sampleTexts.map((prompt, idx) => (
              <div
                key={idx}
                className="relative bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 overflow-hidden"
              >
                <p className="text-sm font-mono text-gray-700 dark:text-gray-300 blur-sm select-none">
                  {prompt}
                </p>
                <div className="absolute inset-0 bg-gradient-to-r from-white/60 to-white/80 dark:from-gray-950/60 dark:to-gray-950/80 flex items-center justify-center">
                  <span className="text-xs font-semibold text-brand-600 dark:text-brand-400">
                    이메일 등록 후 열람 가능
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-10 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  더 많은 프롬프트가 필요하다면?
                </h2>
                <p className="text-gray-400 text-sm mt-1">유료 번들로 50종 이상을 한 번에</p>
              </div>
              <Link href="/products" className="text-sm text-brand-600 dark:text-brand-400 hover:underline">
                전체 보기 →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}

function PromptBlock({ index, prompt }: { index: number; prompt: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="relative bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-100 dark:bg-brand-950 px-2 py-0.5 rounded-md">
          #{index}
        </span>
      </div>
      <p className="text-sm font-mono text-gray-700 dark:text-gray-300 leading-relaxed pr-16">
        {prompt}
      </p>
      <button
        onClick={copy}
        className="absolute top-4 right-4 px-3 py-1.5 text-xs font-medium rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-brand-400 hover:text-brand-600 transition-colors"
      >
        {copied ? "복사됨!" : "복사"}
      </button>
    </div>
  );
}
