"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import type { SortOption } from "@/types";

interface SortBarProps {
  currentSort: SortOption;
  totalCount: number;
  filteredCount: number;
}

export default function SortBar({ currentSort, totalCount, filteredCount }: SortBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("marketplace");

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "popular", label: t("sort.popular") },
    { value: "newest", label: t("sort.newest") },
    { value: "rating", label: t("sort.rating") },
    { value: "price_asc", label: t("sort.price_asc") },
    { value: "price_desc", label: t("sort.price_desc") },
  ];

  const setSort = (sort: SortOption) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sort);
    params.delete("page");
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {t("showing", { count: filteredCount })}
        {filteredCount !== totalCount && (
          <span className="ml-1">{t("ofTotal", { total: totalCount })}</span>
        )}
      </p>
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
        {sortOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setSort(opt.value)}
            className={`shrink-0 px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${
              currentSort === opt.value
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
