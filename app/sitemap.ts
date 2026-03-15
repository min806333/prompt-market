import type { MetadataRoute } from "next";
import { products, categories } from "@/lib/data/mockData";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.promto.kr";

function bothLocales(path: string): MetadataRoute.Sitemap[number] {
  const koUrl = `${BASE}${path}`;
  const enUrl = `${BASE}/en${path}`;
  return {
    url: koUrl,
    lastModified: new Date(),
    alternates: { languages: { ko: koUrl, en: enUrl } },
  };
}

const LEGAL_ROUTES = [
  "/legal/terms",
  "/legal/privacy",
  "/legal/refund",
  "/legal/content",
  "/legal/copyright",
  "/legal/cookie",
  "/legal/dmca",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { ...bothLocales("/"), changeFrequency: "weekly", priority: 1 },
    { ...bothLocales("/products"), changeFrequency: "daily", priority: 0.9 },
    { ...bothLocales("/samples"), changeFrequency: "weekly", priority: 0.8 },
    { ...bothLocales("/leaderboard"), changeFrequency: "daily", priority: 0.7 },
    { ...bothLocales("/pricing"), changeFrequency: "monthly", priority: 0.6 },
  ];

  const legalRoutes: MetadataRoute.Sitemap = LEGAL_ROUTES.map((r) => ({
    ...bothLocales(r),
    changeFrequency: "yearly" as const,
    priority: 0.2,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    ...bothLocales(`/products?category=${cat.slug}`),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    ...bothLocales(`/products/${p.slug}`),
    lastModified: new Date(p.createdAt),
    changeFrequency: "monthly" as const,
    priority: p.isFeatured ? 0.85 : 0.75,
  }));

  return [...staticRoutes, ...legalRoutes, ...categoryRoutes, ...productRoutes];
}
