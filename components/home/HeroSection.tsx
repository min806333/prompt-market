"use client";

import { useTranslations } from "next-intl";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";

export default function HeroSection() {
  const t = useTranslations("hero");

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-gray-950 to-gray-900 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-800/20 via-transparent to-transparent pointer-events-none" />

      <Container>
        <div className="relative z-10 py-24 md:py-32 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-900/60 border border-brand-700/50 text-brand-300 text-sm font-medium mb-8">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
            <span>{t("badge")}</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6 tracking-tight">
            {t("title1")}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-400">
              {t("title2")}
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-10 max-w-2xl mx-auto">
            {t("description")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/products" size="lg">
              {t("cta1")}
            </Button>
            <Button href="/samples" size="lg" variant="outline">
              {t("cta2")}
            </Button>
          </div>

          <div className="mt-14 flex flex-wrap justify-center gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <span className="text-brand-400 font-bold text-lg">{t("stat1Value")}</span>
              <span>{t("stat1Label")}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-brand-400 font-bold text-lg">{t("stat2Value")}</span>
              <span>{t("stat2Label")}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-brand-400 font-bold text-lg">{t("stat3Value")}</span>
              <span>{t("stat3Label")}</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
