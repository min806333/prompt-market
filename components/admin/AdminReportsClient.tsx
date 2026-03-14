"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const TYPE_LABELS: Record<string, string> = {
  spam: "스팸",
  duplicate: "중복",
  not_working: "작동불가",
  inappropriate: "부적절",
};

const STATUS_FILTERS = [
  { value: "pending", label: "대기 중" },
  { value: "reviewed", label: "검토 중" },
  { value: "resolved", label: "해결됨" },
  { value: "dismissed", label: "기각" },
  { value: "all", label: "전체" },
];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
    reviewed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    resolved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    dismissed: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  };
  const labels: Record<string, string> = {
    pending: "대기",
    reviewed: "검토 중",
    resolved: "해결됨",
    dismissed: "기각",
  };
  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${map[status] ?? map.pending}`}>
      {labels[status] ?? status}
    </span>
  );
}

interface Report {
  id: string;
  report_type: string;
  description?: string;
  status: string;
  created_at: string;
  reporter: { email?: string; display_name?: string } | null;
  prompt: { id?: string; title?: string; slug?: string; status?: string } | null;
}

export default function AdminReportsClient({
  reports,
  total,
  page,
  limit,
  currentStatus,
}: {
  reports: Report[];
  total: number;
  page: number;
  limit: number;
  currentStatus: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  async function handleAction(id: string, action: string, promptId?: string) {
    const confirmText =
      action === "resolve"
        ? "이 신고를 처리(해결)하시겠습니까? 신고된 프롬프트를 함께 숨길 수 있습니다."
        : action === "dismiss"
        ? "이 신고를 기각하시겠습니까?"
        : null;

    if (confirmText && !confirm(confirmText)) return;

    setLoading(`${id}:${action}`);
    try {
      const res = await fetch("/api/admin/reports", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action, promptId }),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.error ?? "오류 발생"); return; }
      router.refresh();
    } catch { alert("네트워크 오류"); }
    finally { setLoading(null); }
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">신고 관리</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">전체 {total.toLocaleString()}건</p>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => router.push(`?status=${f.value}`)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              currentStatus === f.value
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-indigo-400 hover:text-indigo-600"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {reports.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-16 text-center text-gray-400">
            신고 내역이 없습니다.
          </div>
        ) : (
          reports.map((r) => (
            <div
              key={r.id}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
            >
              <div className="px-6 py-4 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-2.5 py-0.5 rounded-full">
                      {TYPE_LABELS[r.report_type] ?? r.report_type}
                    </span>
                    <StatusBadge status={r.status} />
                    <span className="text-xs text-gray-400">
                      {new Date(r.created_at).toLocaleDateString("ko-KR")}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">신고 대상: </span>
                    {r.prompt?.title ? (
                      <a
                        href={`/products/${r.prompt.slug}`}
                        target="_blank"
                        className="text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        {r.prompt.title}
                      </a>
                    ) : (
                      <span className="text-gray-400">삭제된 프롬프트</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    신고자: {r.reporter?.email ?? "알 수 없음"}
                  </div>
                  {r.description && (
                    <button
                      onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                      className="text-xs text-indigo-500 hover:text-indigo-700 mt-1"
                    >
                      {expanded === r.id ? "설명 접기" : "설명 보기"}
                    </button>
                  )}
                  {expanded === r.id && r.description && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2">
                      {r.description}
                    </p>
                  )}
                </div>
                {r.status === "pending" || r.status === "reviewed" ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleAction(r.id, "review")}
                      disabled={loading !== null || r.status === "reviewed"}
                      className="px-3 py-1.5 text-xs font-medium text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 disabled:opacity-40 transition-colors"
                    >
                      {loading === `${r.id}:review` ? "..." : "검토 시작"}
                    </button>
                    <button
                      onClick={() => handleAction(r.id, "resolve", r.prompt?.id)}
                      disabled={loading !== null}
                      className="px-3 py-1.5 text-xs font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 disabled:opacity-40 transition-colors"
                    >
                      {loading === `${r.id}:resolve` ? "..." : "해결 처리"}
                    </button>
                    <button
                      onClick={() => handleAction(r.id, "dismiss")}
                      disabled={loading !== null}
                      className="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 disabled:opacity-40 transition-colors"
                    >
                      {loading === `${r.id}:dismiss` ? "..." : "기각"}
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-gray-500 tabular-nums">
            {(page - 1) * limit + 1}–{Math.min(page * limit, total)} / {total}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => router.push(`?status=${currentStatus}&page=${page - 1}`)}
              disabled={page <= 1}
              className="px-3 py-1.5 text-xs border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 bg-white dark:bg-gray-900"
            >
              이전
            </button>
            <button
              onClick={() => router.push(`?status=${currentStatus}&page=${page + 1}`)}
              disabled={page >= totalPages}
              className="px-3 py-1.5 text-xs border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 bg-white dark:bg-gray-900"
            >
              다음
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
