"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import type { Prompt } from "@/types";
import { formatPrice } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import { useToast } from "@/components/ui/ToastProvider";

interface ProductDetailClientProps {
  product: Prompt;
}

type TabKey = "description" | "prompts" | "tips" | "results";

const difficultyColor: Record<string, string> = {
  beginner: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  intermediate: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  advanced: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [tab, setTab] = useState<TabKey>("description");
  const [copied, setCopied] = useState<number | null>(null);
  const toast = useToast();
  const t = useTranslations("product");
  const locale = useLocale();
  const lp = locale === "en" ? "/en" : "";

  const sampleTexts = product.samples?.map((s) => s.sampleText) ?? [];

  function copyPrompt(text: string, idx: number) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(idx);
      toast.success(t("copied"));
      setTimeout(() => setCopied(null), 2000);
    });
  }

  function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: product.title, url }).catch(() => null);
    } else {
      navigator.clipboard.writeText(url).then(() => {
        toast.success(t("linkCopied"));
      });
    }
  }

  function handleBuy() {
    if (product.isFree) {
      if (product.fileUrls[0]) {
        window.open(product.fileUrls[0], "_blank");
      } else {
        toast.info(t("filePending"));
      }
      return;
    }
    if (product.externalBuyUrl) {
      window.open(product.externalBuyUrl, "_blank", "noopener,noreferrer");
    }
  }

  const tabs: { key: TabKey; label: string }[] = [
    { key: "description", label: t("tabs.description") },
    { key: "prompts", label: t("tabs.prompts", { count: sampleTexts.length }) },
    ...(product.usageTips && product.usageTips.length > 0
      ? [{ key: "tips" as TabKey, label: t("tabs.tips") }]
      : []),
    ...(product.results && product.results.length > 0
      ? [{ key: "results" as TabKey, label: t("tabs.results") }]
      : []),
  ];

  return (
    <div className="lg:grid lg:grid-cols-3 lg:gap-10">
      {/* Left: detail content */}
      <div className="lg:col-span-2">
        {/* Meta badges */}
        <div className="flex flex-wrap gap-2 mb-5">
          {product.category && (
            <Link href={`${lp}/products?category=${product.category.slug}`}>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition-colors">
                {product.category.icon} {product.category.name}
              </span>
            </Link>
          )}
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${difficultyColor[product.difficulty]}`}>
            {t(`difficulty.${product.difficulty}`)}
          </span>
          {product.isFree && <Badge variant="free">FREE</Badge>}
          {product.isBundle && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
              BUNDLE
            </span>
          )}
          {product.isLimitedDrop && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 animate-pulse">
              LIMITED{" "}
              {product.stockRemaining !== undefined
                ? t("stockRemaining", { count: product.stockRemaining })
                : ""}
            </span>
          )}
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
            v{product.version}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {product.tags.map((tag) => (
            <Link key={tag} href={`${lp}/products?q=${tag}`}>
              <span className="text-xs px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400 transition-colors">
                #{tag}
              </span>
            </Link>
          ))}
        </div>

        {/* Creator card */}
        {product.creator && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 mb-6">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {product.creator.displayName?.[0]?.toUpperCase() ?? "C"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <Link
                  href={`${lp}/creators/${product.creator.username}`}
                  className="text-sm font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  {product.creator.displayName}
                </Link>
                {product.creator.isVerified && (
                  <svg className="w-4 h-4 text-blue-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <p className="text-xs text-gray-400">
                {t("sellerStats", {
                  count: product.creator.totalSales,
                  rating: product.creator.ratingAvg,
                })}
              </p>
            </div>
            <Link
              href={`${lp}/creators/${product.creator.username}`}
              className="shrink-0 text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              {t("viewProfile")}
            </Link>
          </div>
        )}

        {/* Tabs */}
        <div
          className="flex border-b border-gray-200 dark:border-gray-800 mb-6 overflow-x-auto"
          role="tablist"
        >
          {tabs.map((tabItem) => (
            <button
              key={tabItem.key}
              role="tab"
              aria-selected={tab === tabItem.key}
              onClick={() => setTab(tabItem.key)}
              className={`shrink-0 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                tab === tabItem.key
                  ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                  : "border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              {tabItem.label}
            </button>
          ))}
        </div>

        <div role="tabpanel">
          {tab === "description" && (
            <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
              {product.fullDescription}
            </div>
          )}

          {tab === "prompts" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t("fullCountLabel", { count: product.promptCount })}
                </p>
                <Link
                  href={`${lp}/playground?promptId=${product.id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {t("testPlayground")}
                </Link>
              </div>
              {sampleTexts.map((prompt, idx) => (
                <div
                  key={idx}
                  className="relative bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded">
                      {t("sampleLabel", { num: idx + 1 })}
                    </span>
                  </div>
                  <p className="text-sm font-mono text-gray-700 dark:text-gray-300 leading-relaxed pr-20">
                    {prompt}
                  </p>
                  <button
                    onClick={() => copyPrompt(prompt, idx)}
                    className={`absolute top-4 right-3 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                      copied === idx
                        ? "bg-green-50 border-green-300 text-green-600 dark:bg-green-950 dark:border-green-700 dark:text-green-400"
                        : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-indigo-400 hover:text-indigo-600"
                    }`}
                  >
                    {copied === idx ? t("copiedPrompt") : t("copyPrompt")}
                  </button>
                </div>
              ))}
            </div>
          )}

          {tab === "tips" && (
            <div className="space-y-3">
              {product.usageTips?.map((tip, idx) => (
                <div key={idx} className="flex gap-3 p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900">
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold text-sm shrink-0 w-5">{idx + 1}.</span>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{tip}</p>
                </div>
              ))}
            </div>
          )}

          {tab === "results" && (
            <div className="space-y-4">
              {product.results?.map((result, idx) => (
                <div key={idx} className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                  {result.resultType === "image" && (
                    <img src={result.resultUrl} alt={result.caption ?? `Result ${idx + 1}`} className="w-full" />
                  )}
                  {result.caption && (
                    <p className="text-xs text-gray-500 p-3">{result.caption}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: purchase sidebar */}
      <div className="mt-10 lg:mt-0">
        <div className="sticky top-24 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
          <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mb-1">
            {product.isFree ? t("downloadFree") : formatPrice(product.price)}
          </div>
          {!product.isFree && (
            <p className="text-xs text-gray-400 mb-5">{t("vatNote")}</p>
          )}

          <div className="space-y-2.5 mb-6 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">{t("promptCount")}</span>
              <span className="font-semibold text-gray-900 dark:text-white">{product.promptCount}</span>
            </div>
            {product.fileFormat && (
              <div className="flex justify-between">
                <span className="text-gray-500">{t("fileFormat")}</span>
                <span className="font-semibold text-gray-900 dark:text-white">{product.fileFormat}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500">{t("difficultyLabel")}</span>
              <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${difficultyColor[product.difficulty]}`}>
                {t(`difficulty.${product.difficulty}`)}
              </span>
            </div>
            {product.salesCount > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-500">{t("salesCountLabel")}</span>
                <span className="font-semibold text-gray-900 dark:text-white">{product.salesCount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex flex-col gap-1">
              <span className="text-gray-500">{t("supportedAI")}</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {product.aiTools.map((tool) => (
                  <span key={tool} className="px-2 py-0.5 text-xs rounded-md bg-gray-100 dark:bg-gray-800 font-medium text-gray-700 dark:text-gray-300">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleBuy}
            className={`w-full py-3.5 rounded-xl font-semibold text-base transition-all active:scale-95 mb-2 ${
              product.isFree
                ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg"
            }`}
          >
            {product.isFree ? t("downloadFree") : `${t("buyNow")} →`}
          </button>

          <Link
            href={`${lp}/playground?promptId=${product.id}`}
            className="w-full py-2.5 rounded-xl font-medium text-sm border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors flex items-center justify-center gap-2 mb-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {t("testBefore")}
          </Link>

          <button
            onClick={handleShare}
            className="w-full py-2.5 rounded-xl font-medium text-sm border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            {t("shareBtn")}
          </button>

          <p className="mt-3 text-xs text-center text-gray-400">{t("instantDownload")}</p>
        </div>
      </div>
    </div>
  );
}
