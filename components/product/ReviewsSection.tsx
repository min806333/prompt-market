import type { Review } from "@/types";
import StarRating from "@/components/ui/StarRating";

interface ReviewsSectionProps {
  reviews: Review[];
  averageRating: number;
}

export default function ReviewsSection({ reviews, averageRating }: ReviewsSectionProps) {
  if (reviews.length === 0) return null;

  return (
    <div className="mt-10 pt-10 border-t border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-4 mb-6">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-gray-900 dark:text-white">
              {averageRating}
            </span>
            <span className="text-gray-400">/ 5</span>
          </div>
          <StarRating rating={Math.round(averageRating)} size="lg" />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">구매자 후기 {reviews.length}건</p>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center text-brand-700 dark:text-brand-300 font-bold text-sm">
                  {(review.authorName ?? review.user?.displayName ?? "?")[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {review.authorName ?? review.user?.displayName ?? "익명"}
                    </p>
                    {review.isVerified && (
                      <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                        ✓ 구매 확인
                      </span>
                    )}
                  </div>
                  {review.authorRole && (
                    <p className="text-xs text-gray-400">{review.authorRole}</p>
                  )}
                </div>
              </div>
              <StarRating rating={review.rating} />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              &ldquo;{review.content}&rdquo;
            </p>
            <p className="text-xs text-gray-400 mt-2">{review.createdAt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
