"use client";

import ImageWithFallback from "@/components/ui/ImageWithFallback";

interface ProductHeroImageProps {
  src: string;
  alt: string;
  fallbackText?: string;
}

export default function ProductHeroImage({ src, alt, fallbackText = "⚡" }: ProductHeroImageProps) {
  return (
    <ImageWithFallback
      src={src}
      alt={alt}
      fill
      className="object-cover"
      priority
      sizes="(max-width: 1200px) 100vw, 1152px"
      fallbackText={fallbackText}
    />
  );
}
