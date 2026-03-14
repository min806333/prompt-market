"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Category } from "@/types";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  categories: Category[];
}

export default function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("category") || "all";

  function handleSelect(slug: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug === "all") {
      params.delete("category");
    } else {
      params.set("category", slug);
    }
    router.push(`/products?${params.toString()}`);
  }

  const allItem = { id: "all", name: "전체", slug: "all", icon: "🛒" };
  const items = [allItem, ...categories];

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <button
          key={item.slug}
          onClick={() => handleSelect(item.slug)}
          className={cn(
            "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
            current === item.slug
              ? "bg-brand-600 text-white shadow-sm"
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
          )}
        >
          <span>{item.icon}</span>
          {item.name}
        </button>
      ))}
    </div>
  );
}
