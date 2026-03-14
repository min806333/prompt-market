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

            return (
              <Link
                key={cat.slug}
                href={`${localePath}/products?category=${cat.slug}`}
                className="group flex flex-col items-center p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-brand-300 dark:hover:border-brand-700 hover:bg-brand-50 dark:hover:bg-brand-950/30 transition-all duration-200 text-center"
              >
                <span className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">
                  {cat.icon}
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
