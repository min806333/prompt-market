"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { SortOption } from "@/types";

const sortOptions: { label: string; value: SortOption }[] = [
  { label: "최신순", value: "newest" },
  { label: "인기순", value: "popular" },
  { label: "가격 낮은 순", value: "price_asc" },
  { label: "가격 높은 순", value: "price_desc" },
  { label: "평점순", value: "rating" },
];

export default function SortDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("sort") || "newest";

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`/products?${params.toString()}`);
  }

  return (
    <select
      value={current}
      onChange={(e) => handleChange(e.target.value)}
      className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
    >
      {sortOptions.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
