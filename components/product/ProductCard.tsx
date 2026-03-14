import Link from "next/link";
import type { Prompt } from "@/types";
import { formatPrice } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import ImageWithFallback from "@/components/ui/ImageWithFallback";

interface ProductCardProps {
  product: Prompt;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group relative flex flex-col bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-lg transition-all duration-300">
      <Link href={`/products/${product.slug}`} className="block overflow-hidden">
        <div className="relative h-48 bg-gray-100 dark:bg-gray-800">
          <ImageWithFallback
            src={product.previewImageUrl}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            fallbackText={product.category?.icon ?? "⚡"}
          />
          {product.isFree && (
            <div className="absolute top-3 left-3">
              <Badge variant="free">무료</Badge>
            </div>
          )}
          {product.isFeatured && !product.isFree && (
            <div className="absolute top-3 left-3">
              <Badge variant="brand">추천</Badge>
            </div>
          )}

          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 px-4">
            <div className="flex flex-wrap gap-1.5 justify-center">
              {product.aiTools.map((tool) => (
                <span
                  key={tool}
                  className="text-xs px-2.5 py-1 rounded-full bg-white/20 text-white font-semibold backdrop-blur-sm"
                >
                  {tool}
                </span>
              ))}
            </div>
            <span className="text-white/80 text-xs">프롬프트 {product.promptCount}종 포함</span>
          </div>
        </div>
      </Link>

      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-base">{product.category?.icon}</span>
          <Badge variant="default">{product.category?.name}</Badge>
        </div>

        <Link href={`/products/${product.slug}`}>
          <h3 className="font-bold text-gray-900 dark:text-white mb-1.5 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors leading-snug">
            {product.title}
          </h3>
        </Link>

        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 flex-1">
          {product.shortDescription}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-brand-600 dark:text-brand-400">
            {formatPrice(product.price)}
          </span>
          <Link
            href={`/products/${product.slug}`}
            className={`inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 px-3 py-1.5 text-sm ${
              product.isFree
                ? "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                : "bg-brand-600 text-white hover:bg-brand-700 shadow-sm hover:shadow-md"
            }`}
          >
            {product.isFree ? "무료 받기" : "자세히 보기"}
          </Link>
        </div>
      </div>
    </div>
  );
}
