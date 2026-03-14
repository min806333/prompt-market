"use client";

import { useTranslations } from "next-intl";
import type { Testimonial } from "@/types";
import Container from "@/components/layout/Container";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const t = useTranslations("testimonials");

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
      <Container>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            {t("title")}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800"
            >
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="mt-5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center text-brand-700 dark:text-brand-300 font-bold text-sm">
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
          ))}
        </div>
      </Container>
    </section>
  );
}
