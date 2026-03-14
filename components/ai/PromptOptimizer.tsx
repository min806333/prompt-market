"use client";

import { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/ui/ToastProvider";
import type { OptimizedPrompt } from "@/types";

const AI_MODELS = ["ChatGPT", "Claude", "Gemini", "Midjourney", "Suno", "Udio"];

export default function PromptOptimizer() {
  const { user } = useAuth();
  const toast = useToast();
  const [prompt, setPrompt] = useState("");
  const [targetModel, setTargetModel] = useState("ChatGPT");
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OptimizedPrompt | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleOptimize() {
    if (!prompt.trim()) {
      toast.error("프롬프트를 입력해주세요.");
      return;
    }
    if (!user) {
      toast.error("로그인 후 이용 가능합니다.");
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/ai/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, targetModel, goal }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "최적화에 실패했습니다.");
        return;
      }
      setResult(data);
    } catch {
      toast.error("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  function copyResult() {
    if (!result) return;
    navigator.clipboard.writeText(result.optimized).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-3xl border border-indigo-100 dark:border-indigo-900 p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-xl">
          ✨
        </div>
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white">AI Prompt Optimizer</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            프롬프트를 입력하면 AI가 자동으로 개선해드립니다
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            개선할 프롬프트
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="여기에 개선하고 싶은 프롬프트를 입력하세요..."
            rows={4}
            maxLength={2000}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
          <p className="text-xs text-gray-400 mt-1 text-right">{prompt.length}/2000</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              대상 AI 모델
            </label>
            <select
              value={targetModel}
              onChange={(e) => setTargetModel(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {AI_MODELS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              목표 (선택)
            </label>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="예: 더 창의적으로"
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <button
          onClick={handleOptimize}
          disabled={loading || !prompt.trim()}
          className="w-full py-3 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              최적화 중...
            </>
          ) : (
            <>✨ 프롬프트 최적화</>
          )}
        </button>

        {!user && (
          <p className="text-xs text-center text-gray-400">
            <a href="/auth/login" className="text-indigo-600 dark:text-indigo-400 hover:underline">로그인</a>
            {" "}후 이용 가능합니다
          </p>
        )}
      </div>

      {/* Result */}
      {result && (
        <div className="mt-6 space-y-4">
          <div className="border-t border-indigo-100 dark:border-indigo-900 pt-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">최적화된 프롬프트</h4>
              <button
                onClick={copyResult}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                {copied ? (
                  <><svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>복사됨</>
                ) : (
                  <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>복사</>
                )}
              </button>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
              {result.optimized}
            </div>
          </div>

          {result.improvements.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">개선 사항</h4>
              <ul className="space-y-1.5">
                {result.improvements.map((imp, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="text-green-500 shrink-0 mt-0.5">✓</span>
                    {imp}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-5 gap-2">
            {(["clarity", "structure", "stability", "aiCompatibility", "overall"] as const).map((key) => {
              const labelMap = {
                clarity: "명확성", structure: "구조", stability: "안정성",
                aiCompatibility: "AI 호환", overall: "종합"
              };
              const s = result.qualityScore[key];
              const isGood = s >= 8;
              return (
                <div key={key} className="text-center">
                  <div className={`text-xl font-black ${isGood ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"}`}>
                    {s}
                  </div>
                  <div className="text-xs text-gray-400">{labelMap[key]}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
