"use client";

import { useState } from "react";
import type { Prompt } from "@/types";
import Container from "@/components/layout/Container";
import Link from "next/link";

interface RemixClientProps {
  basePrompt: Prompt | null;
  allPrompts: Prompt[];
}

export default function RemixClient({ basePrompt, allPrompts }: RemixClientProps) {
  const [selected, setSelected] = useState<Prompt | null>(basePrompt);
  const [sampleIdx, setSampleIdx] = useState(0);
  const [params, setParams] = useState<Record<string, string>>({});
  const [remixedText, setRemixedText] = useState("");
  const [copied, setCopied] = useState(false);

  const sampleText = selected?.samples?.[sampleIdx]?.sampleText ?? "";

  const placeholders = Array.from(
    sampleText.matchAll(/\[([A-Z_]+)\]/g),
    (m) => m[1]
  );
  const uniquePlaceholders = [...new Set(placeholders)];

  function buildRemixed(): string {
    let result = sampleText;
    for (const [key, val] of Object.entries(params)) {
      if (val) result = result.replaceAll(`[${key}]`, val);
    }
    return result;
  }

  function handleGenerate() {
    setRemixedText(buildRemixed());
  }

  function copyResult() {
    navigator.clipboard.writeText(remixedText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <Container>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🔀</span>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Prompt Remix</h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          기존 프롬프트의 파라미터를 수정해서 나만의 버전을 만드세요.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-5">
          {/* Select prompt */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">베이스 프롬프트 선택</label>
            <select
              value={selected?.id ?? ""}
              onChange={(e) => {
                const p = allPrompts.find((p) => p.id === e.target.value) ?? null;
                setSelected(p);
                setSampleIdx(0);
                setParams({});
                setRemixedText("");
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">-- 프롬프트를 선택하세요 --</option>
              {allPrompts.map((p) => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>

          {selected && (selected.samples?.length ?? 0) > 1 && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">샘플 선택</label>
              <div className="flex flex-wrap gap-2">
                {selected.samples?.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => { setSampleIdx(i); setParams({}); setRemixedText(""); }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                      sampleIdx === i
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    샘플 #{i + 1}
                  </button>
                ))}
              </div>
            </div>
          )}

          {sampleText && (
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
              <p className="text-xs font-semibold text-gray-400 mb-2">원본 프롬프트</p>
              <p className="text-sm font-mono text-gray-700 dark:text-gray-300 leading-relaxed">{sampleText}</p>
            </div>
          )}

          {uniquePlaceholders.length > 0 && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 space-y-4">
              <p className="text-sm font-bold text-gray-700 dark:text-gray-300">파라미터 채우기</p>
              {uniquePlaceholders.map((ph) => (
                <div key={ph}>
                  <label className="block text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
                    [{ph}]
                  </label>
                  <input
                    type="text"
                    value={params[ph] ?? ""}
                    onChange={(e) => setParams((prev) => ({ ...prev, [ph]: e.target.value }))}
                    placeholder={`${ph}에 해당하는 값 입력`}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              ))}
            </div>
          )}

          {sampleText && (
            <button
              onClick={handleGenerate}
              disabled={!sampleText}
              className="w-full py-3 rounded-xl font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-all active:scale-95"
            >
              🔀 리믹스 생성
            </button>
          )}

          {!selected && (
            <div className="text-center py-10 text-gray-400">
              <p className="text-4xl mb-3">🔀</p>
              <p className="text-sm">베이스 프롬프트를 선택하세요</p>
            </div>
          )}
        </div>

        {/* Result */}
        <div>
          <div className="sticky top-24 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 min-h-64">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold text-gray-700 dark:text-gray-300">리믹스 결과</p>
              {remixedText && (
                <button
                  onClick={copyResult}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                    copied
                      ? "bg-green-50 border-green-300 text-green-600"
                      : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 hover:border-indigo-400"
                  }`}
                >
                  {copied ? "✓ 복사됨" : "복사"}
                </button>
              )}
            </div>
            {remixedText ? (
              <>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 font-mono text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {remixedText}
                </div>
                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/playground?promptId=${selected?.id}`}
                    className="flex-1 py-2.5 text-center text-sm font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                  >
                    Playground에서 테스트 →
                  </Link>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 py-12">
                <p className="text-4xl mb-3">✨</p>
                <p className="text-sm">파라미터를 입력하고 리믹스를 생성하세요</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}
