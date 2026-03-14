import type { Product } from "@/types";

interface ProductJsonLdProps {
  product: Product;
  averageRating?: number;
  reviewCount?: number;
}

export default function ProductJsonLd({
  product,
  averageRating,
  reviewCount,
}: ProductJsonLdProps) {
  const BASE =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://promptmarket.vercel.app";

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.shortDescription,
    image: [product.previewImageUrl],
    url: `${BASE}/products/${product.slug}`,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "USD",
      availability:
        "https://schema.org/InStock",
      seller: { "@type": "Organization", name: "PromptMarket" },
    },
  };

  if (averageRating && reviewCount && reviewCount > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: averageRating,
      reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
