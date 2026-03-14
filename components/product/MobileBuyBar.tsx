"use client";

import type { Prompt } from "@/types";
import { formatPrice } from "@/lib/utils";

interface MobileBuyBarProps {
  product: Prompt;
}

export default function MobileBuyBar({ product }: MobileBuyBarProps) {
  function handleBuy() {
    if (product.isFree) {
      if (product.fileUrls[0]) window.open(product.fileUrls[0], "_blank");
      return;
    }
    if (product.externalBuyUrl) {
      window.open(product.externalBuyUrl, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="flex-1">
        <p className="text-xs text-gray-400 truncate">{product.title}</p>
        <p className="text-lg font-black text-brand-600 dark:text-brand-400 leading-tight">
          {formatPrice(product.price)}
        </p>
      </div>
      <button
        onClick={handleBuy}
        className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all active:scale-95 ${
          product.isFree
            ? "bg-emerald-500 hover:bg-emerald-600 text-white"
            : "bg-brand-600 hover:bg-brand-700 text-white shadow-md"
        }`}
      >
        {product.isFree ? "무료 다운로드" : "구매하기 →"}
      </button>
    </div>
  );
}
