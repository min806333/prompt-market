"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";

interface ImageWithFallbackProps extends Omit<ImageProps, "onError"> {
  fallbackText?: string;
}

export default function ImageWithFallback({
  fallbackText = "⚡",
  alt,
  ...props
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-5xl select-none">
        {fallbackText}
      </div>
    );
  }

  return (
    <Image
      {...props}
      alt={alt}
      onError={() => setHasError(true)}
    />
  );
}
