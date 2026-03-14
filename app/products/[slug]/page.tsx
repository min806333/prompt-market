import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getProductBySlug,
  getRelatedProducts,
  getReviewsByProduct,
  getAverageRating,
  products,
} from "@/lib/data/mockData";
import Container from "@/components/layout/Container";
import ProductGrid from "@/components/product/ProductGrid";
import ProductDetailClient from "@/components/product/ProductDetailClient";
import ProductHeroImage from "@/components/product/ProductHeroImage";
import ReviewsSection from "@/components/product/ReviewsSection";
import CommentsSection from "@/components/product/CommentsSection";
import CategoryBadge from "@/components/ui/CategoryBadge";
import MobileBuyBar from "@/components/product/MobileBuyBar";
import ProductJsonLd from "@/components/product/ProductJsonLd";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.title,
    description: product.shortDescription,
    keywords: product.tags,
    openGraph: {
      title: product.title,
      description: product.shortDescription,
      images: [{ url: product.previewImageUrl, width: 800, height: 450 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description: product.shortDescription,
      images: [product.previewImageUrl],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product);
  const productReviews = getReviewsByProduct(product.id);
  const avgRating = getAverageRating(product.id);

  return (
    <>
      <ProductJsonLd
        product={product}
        averageRating={avgRating}
        reviewCount={productReviews.length}
      />

      <div className="py-10 pb-24 md:pb-10">
        <Container>
          <nav aria-label="breadcrumb" className="flex items-center gap-2 text-sm text-gray-400 mb-8">
            <Link href="/" className="hover:text-gray-600 dark:hover:text-gray-300">홈</Link>
            <span aria-hidden="true">/</span>
            <Link href="/products" className="hover:text-gray-600 dark:hover:text-gray-300">상품</Link>
            <span aria-hidden="true">/</span>
            <span className="text-gray-900 dark:text-white truncate max-w-xs" aria-current="page">
              {product.title}
            </span>
          </nav>

          <div className="mb-8">
            <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-6">
              <ProductHeroImage
                src={product.previewImageUrl}
                alt={product.title}
                fallbackText={product.category?.icon ?? "⚡"}
              />
            </div>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <CategoryBadge
                name={product.category?.name ?? ""}
                icon={product.category?.icon ?? ""}
                slug={product.category?.slug ?? ""}
              />
              {avgRating > 0 && (
                <span className="flex items-center gap-1 text-sm text-amber-500 font-medium">
                  ★ {avgRating}
                  <span className="text-gray-400 font-normal">({productReviews.length}개 후기)</span>
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">
              {product.title}
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              {product.shortDescription}
            </p>
          </div>

          <ProductDetailClient product={product} />
          <ReviewsSection reviews={productReviews} averageRating={avgRating} />
          <CommentsSection promptId={product.id} />

          {related.length > 0 && (
            <div className="mt-20">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">관련 상품</h2>
              <ProductGrid products={related} />
            </div>
          )}
        </Container>
      </div>

      <MobileBuyBar product={product} />
    </>
  );
}
