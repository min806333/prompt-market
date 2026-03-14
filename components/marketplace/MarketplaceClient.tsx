"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import type { Prompt, SortOption, SearchFilters } from "@/types";
import PromptCard from "@/components/marketplace/PromptCard";
import FilterSidebar from "@/components/marketplace/FilterSidebar";
import SortBar from "@/components/marketplace/SortBar";

const PAGE_SIZE = 12;

interface MarketplaceClientProps {
  prompts: Prompt[];
  totalCount: number;
  filters: SearchFilters;
  sort: SortOption;
  page: number;
}

export default function MarketplaceClient({
  prompts,
  totalCount,
  filters,
  sort,
  page,
}: MarketplaceClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const t = useTranslations("marketplace");

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const goToPage = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    router.push(`/products?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const activeFilterCount = [
    filters.category,
    filters.aiTool,
    filters.difficulty,
    filters.minPrice,
    filters.maxPrice,
    filters.minRating,
    filters.isFree,
  ].filter(Boolean).length;

  return (
    <div className="flex gap-8">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-56 shrink-0">
        <div className="sticky top-24">
          <FilterSidebar filters={filters} />
        </div>
      </aside>

      {/* Mobile filter overlay */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white dark:bg-gray-900 shadow-xl overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-gray-900 dark:text-white text-lg">{t("filtersLabel")}</h2>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <FilterSidebar filters={filters} onClose={() => setMobileFilterOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-indigo-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            {t("filterMobile")}
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
          <div className="flex-1">
            <SortBar currentSort={sort} totalCount={totalCount} filteredCount={prompts.length + (page - 1) * PAGE_SIZE} />
          </div>
        </div>

        {prompts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {t("noResults")}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {t("noResultsHint")}
              </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {prompts.map((prompt) => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  isFavorited={favorites.has(prompt.id)}
                  onFavoriteToggle={toggleFavorite}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-12">
                <button
                  onClick={() => goToPage(page - 1)}
                  disabled={page <= 1}
                  className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium disabled:opacity-40 hover:border-indigo-400 transition-colors"
                >
                  {t("prev")}
                </button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 7) pageNum = i + 1;
                  else if (page <= 4) pageNum = i + 1;
                  else if (page >= totalPages - 3) pageNum = totalPages - 6 + i;
                  else pageNum = page - 3 + i;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => goToPage(pageNum)}
                      className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${
                        pageNum === page
                          ? "bg-indigo-600 text-white"
                          : "border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-indigo-400"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => goToPage(page + 1)}
                  disabled={page >= totalPages}
                  className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium disabled:opacity-40 hover:border-indigo-400 transition-colors"
                >
                  {t("next")}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
