"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";

const SAMPLE_PROMPTS_EN = [
  "Relaxing puzzle game background music, soft piano with gentle glockenspiel, 100 BPM, peaceful and focused atmosphere, loopable",
  "You are a professional game designer. Create a Game Design Document outline for a [GENRE] game targeting [TARGET_AUDIENCE]...",
];

export default function SamplePreviewSection() {
  const t = useTranslations("samplePreview");

  const samplePrompts = [
    { label: t("puzzleBgmLabel"), prompt: SAMPLE_PROMPTS_EN[0], tool: "Suno" },
    { label: t("gameDesignLabel"), prompt: SAMPLE_PROMPTS_EN[1], tool: "ChatGPT" },
  ];

  return (
    <section className="py-16">
      <Container>
        <div className="rounded-3xl bg-gradient-to-br from-brand-50 to-purple-50 dark:from-brand-950/40 dark:to-purple-950/40 border border-brand-100 dark:border-brand-900 p-8 md:p-12">
          <div className="text-center mb-8">
            <span className="inline-block px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-3">
              {t("badge")}
            </span>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              {t("title")}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">{t("subtitle")}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {samplePrompts.map((item) => (
              <div
                key={item.label}
                className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950 px-2 py-0.5 rounded-md">
                    {item.label}
                  </span>
                  <span className="text-xs text-gray-400">{item.tool}</span>
                </div>
                <p className="text-sm font-mono text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
                  {item.prompt}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button href="/samples" size="lg">
              {t("cta")}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
