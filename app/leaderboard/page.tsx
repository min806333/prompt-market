"use client";

import { useState } from "react";
import Link from "next/link";
import { prompts } from "@/lib/data/mockData";
import type { Prompt } from "@/types";
import Container from "@/components/layout/Container";
import ProductGrid from "@/components/product/ProductGrid";

const tabs = [
  { id: "trending", label: "🔥 트렌딩" },
  { id: "top-rated", label: "⭐ 최고 평점" },
  { id: "most-sold", label: "💰 최다 판매" },
] as const;

type TabId = typeof tabs[number]["id"];

function getRankedPrompts(tab: TabId): Prompt[] {
  const list = [...prompts].filter((p) => !p.isFree);
  switch (tab) {
    case "trending":
      return list.sort((a, b) => (b.reviewCount + b.salesCount) - (a.reviewCount + a.salesCount));
    case "top-rated":
      return list.sort((a, b) => b.ratingAvg - a.ratingAvg || b.reviewCount - a.reviewCount);
    case "most-sold":
      return list.sort((a, b) => b.salesCount - a.salesCount);
  }
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-2xl">🥇</span>;
  if (rank === 2) return <span className="text-2xl">🥈</span>;
  if (rank === 3) return <span className="text-2xl">🥉</span>;
  return (
    <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-sm font-bold text-gray-500 dark:text-gray-400">
      {rank}
    </span>
  );
}

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<TabId>("trending");
  const ranked = getRankedPrompts(activeTab);

  return (
    <div className="py-12">
      <Container>
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">리더보드</h1>
          <p className="text-gray-500 dark:text-gray-400">가장 인기 있는 프롬프트를 한 눈에</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 justify-center mb-8 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200 dark:shadow-indigo-900"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Ranked list - top 3 large, rest as list */}
        {ranked.length === 0 ? (
          <p className="text-center text-gray-400 py-16">아직 데이터가 없습니다.</p>
        ) : (
          <div className="space-y-8">
            {/* Top 3 as cards */}
            {ranked.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">TOP 3</p>
                <ProductGrid products={ranked.slice(0, 3)} />
              </div>
            )}

            {/* Rest as list */}
            {ranked.length > 3 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">그 외</p>
                <div className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                  {ranked.slice(3).map((prompt, i) => (
                    <Link
                      key={prompt.id}
                      href={`/products/${prompt.slug}`}
                      className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                    >
                      <RankBadge rank={i + 4} />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                          {prompt.title}
                        </p>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-xs text-gray-400">{prompt.category?.name}</span>
                          {prompt.ratingAvg > 0 && (
                            <span className="text-xs text-amber-500">★ {prompt.ratingAvg}</span>
                          )}
                          {prompt.salesCount > 0 && (
                            <span className="text-xs text-gray-400">{prompt.salesCount}건 판매</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-indigo-600 dark:text-indigo-400">
                          {prompt.isFree ? "무료" : `$${prompt.price}`}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Collections CTA */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: "게임 개발자 필수", icon: "🎮", slug: "game-dev" },
            { title: "유튜브 크리에이터", icon: "▶️", slug: "youtube-creators" },
            { title: "앱 출시 준비", icon: "📱", slug: "app-launch" },
          ].map((col) => (
            <Link
              key={col.slug}
              href={`/collections/${col.slug}`}
              className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 px-5 py-4 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors group"
            >
              <span className="text-2xl">{col.icon}</span>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-sm">
                  {col.title}
                </p>
                <p className="text-xs text-gray-400">컬렉션 보기 →</p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}
