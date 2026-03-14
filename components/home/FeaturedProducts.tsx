"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import type { Product } from "@/types";
import Container from "@/components/layout/Container";
import ProductGrid from "@/components/product/ProductGrid";

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const t = useTranslations("featured");

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
      <Container>
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t("title")}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">{t("subtitle")}</p>
          </div>
          <Link
            href="/products"
            className="hidden md:flex items-center gap-1 text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline"
          >
            {t("viewAll")}
          </Link>
        </div>

        <ProductGrid products={products} />

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/products"
            className="text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline"
          >
            {t("viewAllMobile")}
          </Link>
        </div>
      </Container>
    </section>
  );
}
