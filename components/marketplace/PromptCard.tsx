"use client";

import Link from "next/link";
import type { Prompt } from "@/types";
import ImageWithFallback from "@/components/ui/ImageWithFallback";

interface PromptCardProps {
  prompt: Prompt;
  isFavorited?: boolean;
  onFavoriteToggle?: (id: string) => void;
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((s) => (
          <svg key={s} className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? "text-yellow-400" : "text-gray-200 dark:text-gray-700"}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-xs text-gray-500 dark:text-gray-400">({count})</span>
    </div>
  );
}

const difficultyLabel: Record<string, string> = {
  beginner: "초급", intermediate: "중급", advanced: "고급",
};
const difficultyColor: Record<string, string> = {
  beginner: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  intermediate: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  advanced: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function PromptCard({ prompt, isFavorited = false, onFavoriteToggle }: PromptCardProps) {
  return (
    <div className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-700 transition-all duration-200">
      <Link href={`/products/${prompt.slug}`} className="block">
        <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 overflow-hidden">
          {prompt.previewImageUrl ? (
            <ImageWithFallback
              src={prompt.previewImageUrl}
              alt={prompt.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              fallbackText={prompt.category?.icon ?? "⚡"}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-4xl">
              {prompt.category?.icon ?? "⚡"}
            </div>
          )}
          <div className="absolute top-2 left-2 flex gap-1.5 flex-wrap">
            {prompt.isFree && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-500 text-white">FREE</span>
            )}
            {prompt.isLimitedDrop && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-500 text-white">LIMITED</span>
            )}
            {prompt.isBundle && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-purple-500 text-white">BUNDLE</span>
            )}
          </div>
          {prompt.isLimitedDrop && prompt.stockRemaining !== undefined && (
            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full text-xs font-medium bg-black/60 text-white">
              {prompt.stockRemaining}개 남음
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Link href={`/products/${prompt.slug}`} className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {prompt.title}
            </h3>
          </Link>
          {onFavoriteToggle && (
            <button
              onClick={(e) => { e.preventDefault(); onFavoriteToggle(prompt.id); }}
              className="shrink-0 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="즐겨찾기"
            >
              <svg className={`w-5 h-5 transition-colors ${isFavorited ? "text-red-500 fill-red-500" : "text-gray-300 dark:text-gray-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          )}
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">{prompt.shortDescription}</p>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${difficultyColor[prompt.difficulty]}`}>
            {difficultyLabel[prompt.difficulty]}
          </span>
          {prompt.aiTools.slice(0, 2).map((tool) => (
            <span key={tool} className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium">
              {tool}
            </span>
          ))}
          {prompt.aiTools.length > 2 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500">
              +{prompt.aiTools.length - 2}
            </span>
          )}
        </div>

        {prompt.reviewCount > 0 && (
          <div className="mb-3">
            <StarRating rating={prompt.ratingAvg} count={prompt.reviewCount} />
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-gray-800">
          {prompt.creator ? (
            <Link href={`/creators/${prompt.creator.username}`} className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
              <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                {prompt.creator.displayName?.[0]?.toUpperCase() ?? "C"}
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[80px]">
                {prompt.creator.displayName}
              </span>
              {prompt.creator.isVerified && (
                <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </Link>
          ) : (
            <span className="text-xs text-gray-400">{prompt.promptCount}개 프롬프트</span>
          )}
          <span className={`font-bold text-base ${prompt.isFree ? "text-green-600 dark:text-green-400" : "text-gray-900 dark:text-white"}`}>
            {prompt.isFree ? "무료" : `$${prompt.price.toFixed(2)}`}
          </span>
        </div>
      </div>
    </div>
  );
}
