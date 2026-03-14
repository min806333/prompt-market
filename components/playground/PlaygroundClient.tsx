"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Prompt } from "@/types";
import Container from "@/components/layout/Container";
import { useTranslations } from "next-intl";

interface PlaygroundClientProps {
  initialPrompt: Prompt | null;
  availablePrompts: Prompt[];
}

interface PlaygroundResult {
  content: string;
  resultType: "text" | "image" | "audio" | "video" | "copy";
  imageUrl?: string;
  audioUrl?: string;
  videoUrl?: string;
  platformUrl?: string;
  remainingToday: number;
}

export default function PlaygroundClient({ initialPrompt, availablePrompts }: PlaygroundClientProps) {
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(initialPrompt);
  const [selectedSample, setSelectedSample] = useState<string>(
    initialPrompt?.samples?.[0]?.sampleText ?? ""
  );
  const [customText, setCustomText] = useState("");
  const [activeInput, setActiveInput] = useState<"sample" | "custom">("sample");
  const [model, setModel] = useState("gpt-4o-mini");
  const [result, setResult] = useState<PlaygroundResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("playground");

  const promptText = activeInput === "sample" ? selectedSample : customText;

  async function runTest() {
    if (!promptText.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/playground", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promptText, model }),
      });
      const data = await res.json() as Partial<PlaygroundResult> & { error?: string; remainingToday?: number };
      if (!res.ok) {
        setError(data.error ?? "An error occurred.");
        return;
      }
      setResult({
        content: data.content ?? "",
        resultType: data.resultType ?? "text",
        imageUrl: data.imageUrl,
        audioUrl: data.audioUrl,
        videoUrl: data.videoUrl,
        platformUrl: data.platformUrl,
        remainingToday: data.remainingToday ?? 0,
      });
    } catch {
      setError("A network error occurred.");
    } finally {
      setLoading(false);
    }
  }

  const modelOptions = [
    { value: "gpt-4o-mini", label: "GPT-4o Mini", desc: "⚡ Text", badge: "API" },
    { value: "gpt-4o", label: "GPT-4o", desc: "✨ Text", badge: "API" },
    { value: "dalle", label: "DALL-E 3", desc: "🎨 Image", badge: "API" },
    { value: "flux", label: "Flux", desc: "🎨 Image", badge: "API" },
    { value: "kling-image", label: "Kling Kolors", desc: "🎨 Image", badge: "API" },
    { value: "musicgen", label: "MusicGen", desc: "🎵 Music", badge: "API" },
    { value: "kling", label: "Kling Video", desc: "🎬 Video", badge: "API" },
    { value: "suno", label: "Suno", desc: "🎵 Music", badge: "Copy" },
    { value: "midjourney", label: "Midjourney", desc: "🎨 Image", badge: "Copy" },
    { value: "runway", label: "Runway", desc: "🎬 Video", badge: "Copy" },
    { value: "pika", label: "Pika", desc: "🎬 Video", badge: "Copy" },
  ];

  const renderResult = () => {
    if (!result) return null;

    const { resultType, content, imageUrl, audioUrl, videoUrl, platformUrl } = result;

    if (resultType === "image" && imageUrl) {
      return (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{t("resultImage")}</p>
            <a
              href={imageUrl}
              download="generated-image.png"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-3 py-1.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-indigo-400 transition-colors"
            >
              {t("download")}
            </a>
          </div>
          <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <Image
              src={imageUrl}
              alt="AI generated image"
              width={1024}
              height={1024}
              className="w-full h-auto"
              unoptimized
            />
          </div>
        </div>
      );
    }

    if (resultType === "audio" && audioUrl) {
      return (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{t("resultAudio")}</p>
            <a
              href={audioUrl}
              download="generated-music.mp3"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-3 py-1.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-indigo-400 transition-colors"
            >
              {t("download")}
            </a>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{t("generatedAudioLabel")}</p>
            <audio controls className="w-full" src={audioUrl}>
              Your browser does not support the audio element.
            </audio>
          </div>
        </div>
      );
    }

    if (resultType === "video" && videoUrl) {
      return (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{t("resultVideo")}</p>
            <a
              href={videoUrl}
              download="generated-video.mp4"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-3 py-1.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-indigo-400 transition-colors"
            >
              {t("download")}
            </a>
          </div>
          <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <video controls className="w-full" src={videoUrl}>
              Your browser does not support the video element.
            </video>
          </div>
        </div>
      );
    }

    // Text or Copy result
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            {resultType === "copy" ? t("resultCopy") : "Result"}
          </p>
          <button
            onClick={() => navigator.clipboard.writeText(content)}
            className="text-xs px-3 py-1.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-indigo-400 transition-colors"
          >
            Copy
          </button>
        </div>
        {resultType === "copy" && platformUrl && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800">
            <a
              href={platformUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              {t("openPlatform")}
            </a>
          </div>
        )}
        <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
          {content}
        </div>
        {selectedPrompt && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-400 mb-2">{t("likeResult")}</p>
            <Link
              href={`/products/${selectedPrompt.slug}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
            >
              {t("buyAll", { count: selectedPrompt.promptCount })}
            </Link>
          </div>
        )}
      </div>
    );
  };

  return (
    <Container>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">⚡</span>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">{t("title")}</h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          {t("subtitle")}{" "}
          <span className="font-medium text-indigo-600 dark:text-indigo-400">{t("freeLimit")}</span>
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Input */}
        <div className="space-y-5">
          {/* Prompt selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {t("selectPrompt")}
            </label>
            <select
              value={selectedPrompt?.id ?? ""}
              onChange={(e) => {
                const p = availablePrompts.find((p) => p.id === e.target.value) ?? null;
                setSelectedPrompt(p);
                setSelectedSample(p?.samples?.[0]?.sampleText ?? "");
                setResult(null);
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">{t("selectPlaceholder")}</option>
              {availablePrompts.map((p) => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>

          {/* Sample selection */}
          {selectedPrompt?.samples && selectedPrompt.samples.length > 0 && (
            <div>
              <div className="flex gap-2 mb-2">
                <button
                  onClick={() => setActiveInput("sample")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    activeInput === "sample"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {t("selectSample")}
                </button>
                <button
                  onClick={() => setActiveInput("custom")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    activeInput === "custom"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {t("customInput")}
                </button>
              </div>

              {activeInput === "sample" ? (
                <div className="space-y-2">
                  {selectedPrompt.samples.map((s, idx) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedSample(s.sampleText)}
                      className={`w-full text-left p-3 rounded-xl border text-sm transition-colors ${
                        selectedSample === s.sampleText
                          ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 text-gray-900 dark:text-white"
                          : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-indigo-300"
                      }`}
                    >
                      <span className="text-xs font-bold text-indigo-500 mr-2">#{idx + 1}</span>
                      <span className="line-clamp-2 font-mono">{s.sampleText}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <textarea
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder={t("customPlaceholder")}
                  rows={6}
                  maxLength={2000}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              )}
            </div>
          )}

          {/* Model selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {t("aiModel")}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {modelOptions.map((m) => (
                <button
                  key={m.value}
                  onClick={() => setModel(m.value)}
                  className={`py-2.5 px-3 rounded-xl border text-sm transition-colors text-left ${
                    model === m.value
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 font-semibold"
                      : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-indigo-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-medium text-xs">{m.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      m.badge === "API"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-500"
                    }`}>
                      {m.badge}
                    </span>
                  </div>
                  <span className="block text-xs opacity-60">{m.desc}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              <span className="font-semibold text-green-600">API</span> = {t("badgeApiDesc")} &nbsp;|&nbsp;
              <span className="font-semibold text-gray-500">Copy</span> = {t("badgeCopyDesc")}
            </p>
          </div>

          {/* Selected prompt preview */}
          {promptText && (
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                {t("inputPreview")}
              </p>
              <p className="text-sm font-mono text-gray-700 dark:text-gray-300 line-clamp-4">{promptText}</p>
            </div>
          )}

          <button
            onClick={runTest}
            disabled={!promptText.trim() || loading}
            className="w-full py-3.5 rounded-xl font-bold text-base bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {t("running")}
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t("runTest")}
              </>
            )}
          </button>

          {result !== null && (
            <p className="text-xs text-center text-gray-400">
              {t("remaining", { count: result.remainingToday })}
            </p>
          )}
        </div>

        {/* Right: Result */}
        <div>
          <div className="h-full min-h-64 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
            {!result && !error && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
                <div className="text-5xl mb-4">🤖</div>
                <p className="font-medium">{t("emptyResult")}</p>
                <p className="text-sm mt-1">{t("emptyHint")}</p>
              </div>
            )}

            {loading && (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
                <svg className="w-10 h-10 animate-spin text-indigo-500 mb-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <p className="font-medium">{t("running")}</p>
                {["dalle", "flux", "kling-image"].includes(model) && (
                  <p className="text-xs mt-2 text-gray-400">{t("loadingImage")}</p>
                )}
                {model === "musicgen" && (
                  <p className="text-xs mt-2 text-gray-400">{t("loadingMusic")}</p>
                )}
                {model === "kling" && (
                  <p className="text-xs mt-2 text-gray-400">{t("loadingVideo")}</p>
                )}
              </div>
            )}

            {error && (
              <div className="flex flex-col items-center justify-center text-center">
                <div className="text-4xl mb-3">⚠️</div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-3">{error}</p>
                {(error.includes("로그인") || error.includes("Log in")) && (
                  <Link
                    href="/auth/login"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    {t("loginBtn")}
                  </Link>
                )}
              </div>
            )}

            {result && !loading && renderResult()}
          </div>
        </div>
      </div>

      {/* Info banner */}
      <div className="mt-10 p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900">
        <h3 className="font-bold text-indigo-900 dark:text-indigo-300 mb-2">{t("guideTitle")}</h3>
        <ul className="text-sm text-indigo-700 dark:text-indigo-400 space-y-1">
          <li>• {t("guideFree")}</li>
          <li>• {t("guidePro")}</li>
          <li>• <strong className="text-green-700">API</strong>: {t("guideApi")}</li>
          <li>• <strong className="text-gray-600">Copy</strong>: {t("guideCopy")}</li>
        </ul>
      </div>
    </Container>
  );
}
