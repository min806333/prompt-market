"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import type { Category } from "@/types";
import Container from "@/components/layout/Container";

const DEFAULT_LOCALE = "ko";

const CATEGORY_EN: Record<string, { name: string; description: string }> = {
  "game-music": {
    name: "Game Music",
    description: "BGM, OST, and sound effects for games",
  },
  "planning-docs": {
    name: "Planning & Docs",
    description: "Game design docs, descriptions, and UI text prompts",
  },
  "video-content": {
    name: "Video & Content",
    description: "YouTube, montage, and short-form content prompts",
  },
  "app-description": {
    name: "App Description",
    description: "App Store & Google Play description generation prompts",
  },
  "ai-image": {
    name: "AI Image",
    description: "Midjourney, DALL-E, Stable Diffusion image prompts",
  },
  "ai-video": {
    name: "AI Video",
    description: "Runway, Sora, Kling, Pika video generation prompts",
  },
};

// icon slug → SVG 매핑
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  music: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
    </svg>
  ),
  doc: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  video: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M15 10l4.553-2.069A1 1 0 0121 8.882v6.236a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  app: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  image: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  film: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
    </svg>
  ),
};

interface CategorySectionProps {
  categories: Category[];
}

export default function CategorySection({ categories }: CategorySectionProps) {
  const t = useTranslations("categories");
  const locale = useLocale();
  const localePath = locale === DEFAULT_LOCALE ? "" : `/${locale}`;

  return (
    <section className="py-16">
      <Container>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            {t("title")}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const en = CATEGORY_EN[cat.slug];
            const displayName = locale !== DEFAULT_LOCALE && en ? en.name : cat.name;
            const displayDesc = locale !== DEFAULT_LOCALE && en ? en.description : cat.description;
            const iconNode = CATEGORY_ICONS[cat.icon] ?? (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M7 7h.01M7 3h5l5 5v5M7 3l-4 4v12a2 2 0 002 2h14a2 2 0 002-2V8" />
              </svg>
            );

            return (
              <Link
                key={cat.slug}
                href={`${localePath}/products?category=${cat.slug}`}
                className="group flex flex-col items-center p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-brand-300 dark:hover:border-brand-700 hover:bg-brand-50 dark:hover:bg-brand-950/30 transition-all duration-200 text-center"
              >
                <span className="text-brand-500 dark:text-brand-400 mb-3 group-hover:scale-110 transition-transform duration-200">
                  {iconNode}
                </span>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">
                  {displayName}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-500 line-clamp-2 mb-2">
                  {displayDesc}
                </p>
                {cat.productCount !== undefined && (
                  <span className="text-xs font-semibold text-brand-600 dark:text-brand-400">
                    {t("productCount", { count: cat.productCount })}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
