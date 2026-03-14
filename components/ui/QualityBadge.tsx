import type { AIQualityScore } from "@/types";

interface QualityBadgeProps {
  score: AIQualityScore;
  compact?: boolean;
}

const scoreColor = (s: number) => {
  if (s >= 8) return "text-green-600 dark:text-green-400";
  if (s >= 6) return "text-amber-600 dark:text-amber-400";
  return "text-red-500 dark:text-red-400";
};

const barColor = (s: number) => {
  if (s >= 8) return "bg-green-500";
  if (s >= 6) return "bg-amber-500";
  return "bg-red-500";
};

const labels: Record<"clarity" | "structure" | "stability" | "aiCompatibility", string> = {
  clarity: "명확성",
  structure: "구조",
  stability: "출력 안정성",
  aiCompatibility: "AI 호환성",
};

export default function QualityBadge({ score, compact = false }: QualityBadgeProps) {
  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1 text-xs font-bold ${scoreColor(score.overall)}`}
        title={`품질 점수: ${score.overall}/10`}
      >
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        품질 {score.overall}/10
      </span>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900/60 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Prompt Quality Score</h4>
        <div className={`text-2xl font-black ${scoreColor(score.overall)}`}>
          {score.overall}<span className="text-sm font-normal text-gray-400">/10</span>
        </div>
      </div>
      <div className="space-y-3">
        {(Object.entries(labels) as ["clarity" | "structure" | "stability" | "aiCompatibility", string][]).map(([key, label]) => (
          <div key={key}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500 dark:text-gray-400">{label}</span>
              <span className={`font-semibold ${scoreColor(score[key])}`}>{score[key]}</span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${barColor(score[key])}`}
                style={{ width: `${score[key] * 10}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
