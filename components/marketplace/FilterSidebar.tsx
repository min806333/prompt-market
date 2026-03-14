"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import type { SearchFilters, Difficulty } from "@/types";

const categories = [
  { slug: "game-music", nameKo: "게임 음악", nameEn: "Game Music", icon: "🎵" },
  { slug: "planning-docs", nameKo: "기획/문서", nameEn: "Planning / Docs", icon: "📄" },
  { slug: "video-content", nameKo: "영상/콘텐츠", nameEn: "Video / Content", icon: "🎬" },
  { slug: "app-description", nameKo: "앱/게임 소개", nameEn: "App / Game Desc", icon: "📱" },
  { slug: "ai-image", nameKo: "AI 이미지", nameEn: "AI Image", icon: "🎨" },
  { slug: "ai-video", nameKo: "AI 영상", nameEn: "AI Video", icon: "🎬" },
];

const aiTools = ["ChatGPT", "Claude", "Suno", "Udio", "Midjourney", "Stable Diffusion", "Runway", "Kling AI", "Pika Labs"];
const difficulties: Difficulty[] = ["beginner", "intermediate", "advanced"];

interface FilterSidebarProps {
  filters: SearchFilters;
  onClose?: () => void;
}

export default function FilterSidebar({ filters, onClose }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("marketplace");
  const locale = useLocale();

  const updateFilter = (key: string, value: string | number | boolean | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === undefined || value === "" || value === false) {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
    params.delete("page");
    router.push(`/products?${params.toString()}`);
    onClose?.();
  };

  const clearAll = () => {
    const params = new URLSearchParams();
    if (searchParams.get("q")) params.set("q", searchParams.get("q")!);
    router.push(`/products?${params.toString()}`);
    onClose?.();
  };

  const hasFilters =
    filters.category ||
    filters.aiTool ||
    filters.difficulty ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.minRating ||
    filters.isFree;

  const difficultyLabels: Record<Difficulty, string> = {
    beginner: t("beginner"),
    intermediate: t("intermediate"),
    advanced: t("advanced"),
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 dark:text-white">{t("filtersLabel")}</h3>
        {hasFilters && (
          <button onClick={clearAll} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
            {t("reset")}
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Category */}
        <div>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
            {t("category")}
          </p>
          <div className="flex flex-col gap-1">
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() =>
                  updateFilter("category", filters.category === cat.slug ? undefined : cat.slug)
                }
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-left transition-colors ${
                  filters.category === cat.slug
                    ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <span>{cat.icon}</span>
                {locale === "en" ? cat.nameEn : cat.nameKo}
              </button>
            ))}
          </div>
        </div>

        {/* AI Tool */}
        <div>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
            {t("aiTool")}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {aiTools.map((tool) => (
              <button
                key={tool}
                onClick={() => updateFilter("aiTool", filters.aiTool === tool ? undefined : tool)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                  filters.aiTool === tool
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-indigo-400"
                }`}
              >
                {tool}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
            {t("difficulty")}
          </p>
          <div className="flex flex-col gap-1">
            {difficulties.map((d) => (
              <button
                key={d}
                onClick={() =>
                  updateFilter("difficulty", filters.difficulty === d ? undefined : d)
                }
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-left transition-colors ${
                  filters.difficulty === d
                    ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                {difficultyLabels[d]}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
            {t("priceRange")}
          </p>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              placeholder="Min"
              min={0}
              defaultValue={filters.minPrice}
              onBlur={(e) =>
                updateFilter("minPrice", e.target.value ? Number(e.target.value) : undefined)
              }
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <span className="text-gray-400">~</span>
            <input
              type="number"
              placeholder="Max"
              min={0}
              defaultValue={filters.maxPrice}
              onBlur={(e) =>
                updateFilter("maxPrice", e.target.value ? Number(e.target.value) : undefined)
              }
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Min Rating */}
        <div>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
            {t("minRating")}
          </p>
          <div className="flex gap-1">
            {[4, 3, 2].map((r) => (
              <button
                key={r}
                onClick={() => updateFilter("minRating", filters.minRating === r ? undefined : r)}
                className={`flex-1 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                  filters.minRating === r
                    ? "bg-yellow-400 border-yellow-400 text-white"
                    : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-yellow-400"
                }`}
              >
                {"⭐".repeat(r)}+
              </button>
            ))}
          </div>
        </div>

        {/* Free Only */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={filters.isFree === true}
                onChange={(e) => updateFilter("isFree", e.target.checked || undefined)}
                className="sr-only"
              />
              <div
                className={`w-10 h-6 rounded-full transition-colors ${
                  filters.isFree ? "bg-indigo-600" : "bg-gray-200 dark:bg-gray-700"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                    filters.isFree ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </div>
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300">{t("freeOnly")}</span>
          </label>
        </div>
      </div>
    </div>
  );
}
