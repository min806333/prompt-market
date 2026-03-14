import { Suspense } from "react";
import type { Metadata } from "next";
import type { SortOption, SearchFilters, Difficulty } from "@/types";
import { filterAndSortPrompts, categories } from "@/lib/data/mockData";
import Container from "@/components/layout/Container";
import MarketplaceClient from "@/components/marketplace/MarketplaceClient";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Prompt Market | Promto",
  description: "AI prompt market for indie creators. Game music, design docs, video content and more.",
};

interface ProductsPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    aiTool?: string;
    difficulty?: string;
    minPrice?: string;
    maxPrice?: string;
    minRating?: string;
    isFree?: string;
    sort?: string;
    page?: string;
  }>;
}

const CAT_NAME_EN: Record<string, string> = {
  "game-music": "Game Music",
  "planning-docs": "Planning / Docs",
  "video-content": "Video / Content",
  "app-description": "App / Game Desc",
  "image-graphic": "AI Image",
  "ai-image": "AI Image",
  "ai-video": "AI Video",
  "text-copy": "Text / Copy",
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const t = await getTranslations("marketplace");

  const sort = (params.sort ?? "newest") as SortOption;
  const page = Math.max(1, parseInt(params.page ?? "1"));

  const filters: SearchFilters = {
    query: params.q,
    category: params.category,
    aiTool: params.aiTool,
    difficulty: params.difficulty as Difficulty | undefined,
    minPrice: params.minPrice ? parseFloat(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? parseFloat(params.maxPrice) : undefined,
    minRating: params.minRating ? parseFloat(params.minRating) : undefined,
    isFree: params.isFree === "true" ? true : undefined,
  };

  const { items, total } = filterAndSortPrompts(filters, sort, page);
  const currentCategory = categories.find((c) => c.slug === filters.category);

  const getCategoryTitle = (cat: typeof currentCategory) => {
    if (!cat) return "";
    const enName = CAT_NAME_EN[cat.slug] ?? cat.name;
    return `${cat.icon} ${enName}`;
  };

  const pageTitle = currentCategory
    ? getCategoryTitle(currentCategory)
    : filters.query
    ? `"${filters.query}"`
    : t("filtersLabel") === "Filters" ? "All Prompts" : "전체 프롬프트";

  return (
    <div className="py-10">
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {pageTitle}
          </h1>
          {filters.query && (
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {t("showing", { count: total })}
            </p>
          )}
        </div>

        <Suspense
          fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse h-72" />
              ))}
            </div>
          }
        >
          <MarketplaceClient
            prompts={items}
            totalCount={total}
            filters={filters}
            sort={sort}
            page={page}
          />
        </Suspense>
      </Container>
    </div>
  );
}
