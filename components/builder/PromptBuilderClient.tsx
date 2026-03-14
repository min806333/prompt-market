"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import Container from "@/components/layout/Container";

const styleOptions = ["Cinematic", "Upbeat", "Melancholic", "Epic", "Relaxing", "Mysterious", "Cheerful", "Intense"];
const toneOptions = ["Professional", "Casual", "Playful", "Serious", "Creative", "Minimalist"];
const aiModelOptions = ["ChatGPT", "Claude", "Suno", "Udio", "Midjourney", "Stable Diffusion"];

interface BuilderState {
  subject: string;
  style: string;
  tone: string;
  aiModel: string;
  extraContext: string;
}

export default function PromptBuilderClient() {
  const t = useTranslations("builder");
  const locale = useLocale();
  const lp = locale === "en" ? "/en" : "";

  const [state, setState] = useState<BuilderState>({
    subject: "",
    style: "",
    tone: "",
    aiModel: "",
    extraContext: "",
  });
  const [copied, setCopied] = useState(false);

  const subjects = t.raw("subjects") as string[];

  function buildPrompt(): string {
    const parts: string[] = [];
    if (state.aiModel) parts.push(t("promptTemplate.modelPrefix", { model: state.aiModel }));
    if (state.subject) parts.push(t("promptTemplate.subjectSuffix", { subject: state.subject }));
    if (state.style) parts.push(t("promptTemplate.style", { style: state.style }));
    if (state.tone) parts.push(t("promptTemplate.tone", { tone: state.tone }));
    if (state.extraContext) parts.push(state.extraContext);
    return parts.join(" ") || t("emptyPrompt");
  }

  const generatedPrompt = buildPrompt();
  const isReady = !!(state.subject || state.style || state.tone);

  function copyPrompt() {
    navigator.clipboard.writeText(generatedPrompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function reset() {
    setState({ subject: "", style: "", tone: "", aiModel: "", extraContext: "" });
  }

  const OptionGroup = ({
    label, options, value, onChange,
  }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) => (
    <div>
      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(value === opt ? "" : opt)}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition-colors ${
              value === opt
                ? "bg-indigo-600 text-white border-indigo-600"
                : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-indigo-400"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <Container>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🔧</span>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">{t("title")}</h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400">{t("subtitle")}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 space-y-5">
            <OptionGroup
              label={t("labels.aiModel")}
              options={aiModelOptions}
              value={state.aiModel}
              onChange={(v) => setState((s) => ({ ...s, aiModel: v }))}
            />
            <OptionGroup
              label={t("labels.subject")}
              options={subjects}
              value={state.subject}
              onChange={(v) => setState((s) => ({ ...s, subject: v }))}
            />
            <OptionGroup
              label={t("labels.style")}
              options={styleOptions}
              value={state.style}
              onChange={(v) => setState((s) => ({ ...s, style: v }))}
            />
            <OptionGroup
              label={t("labels.tone")}
              options={toneOptions}
              value={state.tone}
              onChange={(v) => setState((s) => ({ ...s, tone: v }))}
            />
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {t("labels.extraContext")}
              </p>
              <textarea
                value={state.extraContext}
                onChange={(e) => setState((s) => ({ ...s, extraContext: e.target.value }))}
                placeholder={t("placeholders.extraContext")}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>
          </div>

          <button
            onClick={reset}
            className="w-full py-2.5 rounded-xl text-sm font-medium border border-gray-200 dark:border-gray-700 text-gray-500 hover:border-red-400 hover:text-red-500 transition-colors"
          >
            {t("reset")}
          </button>
        </div>

        <div>
          <div className="sticky top-24 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{t("outputLabel")}</p>
              {isReady && (
                <button
                  onClick={copyPrompt}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                    copied
                      ? "bg-green-50 border-green-300 text-green-600"
                      : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 hover:border-indigo-400"
                  }`}
                >
                  {copied ? t("copied") : t("copy")}
                </button>
              )}
            </div>
            <div
              className={`min-h-32 p-4 rounded-xl text-sm leading-relaxed font-mono ${
                isReady
                  ? "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                  : "bg-gray-50 dark:bg-gray-900 text-gray-400 italic"
              }`}
            >
              {generatedPrompt}
            </div>

            {isReady && (
              <div className="mt-4 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900">
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                  {t("hintTitle")}
                </p>
                <Link href={`${lp}/products`} className="text-xs text-indigo-500 underline mt-1 block">
                  {t("hintLink")}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}
