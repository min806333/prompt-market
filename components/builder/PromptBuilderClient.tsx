"use client";

import { useState } from "react";
import Container from "@/components/layout/Container";

const styleOptions = ["Cinematic", "Upbeat", "Melancholic", "Epic", "Relaxing", "Mysterious", "Cheerful", "Intense"];
const toneOptions = ["Professional", "Casual", "Playful", "Serious", "Creative", "Minimalist"];
const aiModelOptions = ["ChatGPT", "Claude", "Suno", "Udio", "Midjourney", "Stable Diffusion"];
const subjectOptions = ["게임 BGM", "기획서", "앱 소개문", "마케팅 카피", "캐릭터 설정", "영상 스크립트", "UI 텍스트"];

interface BuilderState {
  subject: string;
  style: string;
  tone: string;
  aiModel: string;
  extraContext: string;
}

function buildPrompt(state: BuilderState): string {
  const parts: string[] = [];
  if (state.aiModel) parts.push(`[${state.aiModel} 전용]`);
  if (state.subject) parts.push(`${state.subject}을(를) 작성해줘.`);
  if (state.style) parts.push(`스타일: ${state.style}.`);
  if (state.tone) parts.push(`톤: ${state.tone}.`);
  if (state.extraContext) parts.push(state.extraContext);
  return parts.join(" ") || "프롬프트를 구성하려면 아래 항목을 선택하세요.";
}

export default function PromptBuilderClient() {
  const [state, setState] = useState<BuilderState>({
    subject: "",
    style: "",
    tone: "",
    aiModel: "",
    extraContext: "",
  });
  const [copied, setCopied] = useState(false);

  const generatedPrompt = buildPrompt(state);
  const isReady = state.subject || state.style || state.tone;

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
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Prompt Builder</h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          선택지를 골라 원하는 AI 프롬프트를 쉽게 조합하세요.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 space-y-5">
            <OptionGroup
              label="AI 모델"
              options={aiModelOptions}
              value={state.aiModel}
              onChange={(v) => setState((s) => ({ ...s, aiModel: v }))}
            />
            <OptionGroup
              label="주제"
              options={subjectOptions}
              value={state.subject}
              onChange={(v) => setState((s) => ({ ...s, subject: v }))}
            />
            <OptionGroup
              label="스타일"
              options={styleOptions}
              value={state.style}
              onChange={(v) => setState((s) => ({ ...s, style: v }))}
            />
            <OptionGroup
              label="톤"
              options={toneOptions}
              value={state.tone}
              onChange={(v) => setState((s) => ({ ...s, tone: v }))}
            />
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">추가 맥락 (선택)</p>
              <textarea
                value={state.extraContext}
                onChange={(e) => setState((s) => ({ ...s, extraContext: e.target.value }))}
                placeholder="게임 이름, 장르, 구체적인 요구사항 등을 입력하세요."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>
          </div>

          <button
            onClick={reset}
            className="w-full py-2.5 rounded-xl text-sm font-medium border border-gray-200 dark:border-gray-700 text-gray-500 hover:border-red-400 hover:text-red-500 transition-colors"
          >
            초기화
          </button>
        </div>

        <div>
          <div className="sticky top-24 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold text-gray-700 dark:text-gray-300">생성된 프롬프트</p>
              {isReady && (
                <button
                  onClick={copyPrompt}
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
            <div className={`min-h-32 p-4 rounded-xl text-sm leading-relaxed font-mono ${
              isReady
                ? "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                : "bg-gray-50 dark:bg-gray-900 text-gray-400 italic"
            }`}>
              {generatedPrompt}
            </div>

            {isReady && (
              <div className="mt-4 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900">
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                  💡 이 프롬프트를 더 전문적으로 쓰고 싶다면?
                </p>
                <a href="/products" className="text-xs text-indigo-500 underline mt-1 block">
                  검증된 프롬프트 팩 보러가기 →
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}
