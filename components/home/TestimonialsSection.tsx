"use client";

import { useTranslations } from "next-intl";
import type { Testimonial } from "@/types";
import Container from "@/components/layout/Container";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 mb-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 fill-current ${i < rating ? "text-yellow-400" : "text-gray-200 dark:text-gray-700"}`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="flex-shrink-0 w-80 bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm select-none">
      <StarRating rating={testimonial.rating ?? 5} />
      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-5 line-clamp-4">
        &ldquo;{testimonial.quote}&rdquo;
      </p>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center text-brand-700 dark:text-brand-300 font-bold text-sm flex-shrink-0">
          {testimonial.authorName[0]}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {testimonial.authorName}
          </p>
          <p className="text-xs text-gray-400">{testimonial.authorRole}</p>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const t = useTranslations("testimonials");

  const doubled = [...testimonials, ...testimonials];

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900/50 overflow-hidden">
      <style>{`
        @keyframes marquee-scroll {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .marquee-track {
          display: flex;
          gap: 1.5rem;
          width: max-content;
          animation: marquee-scroll 60s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        .marquee-fade-left {
          background: linear-gradient(to right, rgb(249 250 251) 0%, transparent 100%);
        }
        .marquee-fade-right {
          background: linear-gradient(to left, rgb(249 250 251) 0%, transparent 100%);
        }
        :is(.dark) .marquee-fade-left {
          background: linear-gradient(to right, rgba(17,24,39,0.5) 0%, transparent 100%);
        }
        :is(.dark) .marquee-fade-right {
          background: linear-gradient(to left, rgba(17,24,39,0.5) 0%, transparent 100%);
        }
      `}</style>

      <Container>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            {t("title")}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">{t("subtitle")}</p>
        </div>
      </Container>

      <div className="relative">
        <div className="marquee-fade-left absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none" />
        <div className="marquee-fade-right absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none" />

        <div className="overflow-hidden py-2">
          <div className="marquee-track px-6">
            {doubled.map((testimonial, idx) => (
              <TestimonialCard key={`${testimonial.id}-${idx}`} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
