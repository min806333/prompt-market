"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Status = string;

const STATUS_FILTERS = [
  { value: "all", label: "전체" },
  { value: "pending", label: "대기 중" },
  { value: "approved", label: "승인됨" },
  { value: "rejected", label: "거절됨" },
  { value: "draft", label: "초안" },
];

function StatusBadge({ status }: { status: Status }) {
  const map: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
    approved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    draft: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  };
  const labels: Record<string, string> = {
    pending: "대기",
    approved: "승인",
    rejected: "거절",
    draft: "초안",
  };
  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${map[status] ?? map.pending}`}>
      {labels[status] ?? status}
    </span>
  );
}

interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  status: string;
  is_featured: boolean;
  is_free: boolean;
  sales_count: number;
  created_at: string;
  creator: { display_name?: string; username?: string } | null;
}

export default function AdminProductsClient({
  products,
  total,
  page,
  limit,
  currentStatus,
}: {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  currentStatus: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function handleAction(id: string, action: string) {
    setLoading(`${id}:${action}`);
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.error ?? "오류가 발생했습니다."); return; }
      router.refresh();
    } catch { alert("네트워크 오류가 발생했습니다."); }
    finally { setLoading(null); }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`"${title}" 프롬프트를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) return;
    setLoading(`${id}:delete`);
    try {
      const res = await fetch("/api/admin/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) { const d = await res.json(); alert(d.error ?? "삭제 실패"); return; }
      router.refresh();
    } catch { alert("네트워크 오류"); }
    finally { setLoading(null); }
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">프롬프트 관리</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">전체 {total.toLocaleString()}개</p>
        </div>
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

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                {["프롬프트", "상태", "가격", "판매", "등록일", "액션"].map((h, i) => (
                  <th
                    key={h}
                    className={`px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${i === 5 ? "text-right" : "text-left"}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center text-gray-400">
                    프롬프트가 없습니다.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-medium text-sm text-gray-900 dark:text-white line-clamp-1">{p.title}</div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {p.creator?.display_name ?? p.creator?.username ?? "크리에이터 없음"}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={p.status ?? "pending"} />
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300">
                      {p.is_free || Number(p.price) === 0 ? "무료" : `$${Number(p.price).toFixed(2)}`}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300 tabular-nums">
                      {p.sales_count ?? 0}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400 tabular-nums">
                      {new Date(p.created_at).toLocaleDateString("ko-KR")}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        {p.status !== "approved" && (
                          <button
                            onClick={() => handleAction(p.id, "approve")}
                            disabled={loading !== null}
                            className="px-2.5 py-1 text-xs font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors disabled:opacity-40"
                          >
                            {loading === `${p.id}:approve` ? "..." : "승인"}
                          </button>
                        )}
                        {p.status !== "rejected" && (
                          <button
                            onClick={() => handleAction(p.id, "reject")}
                            disabled={loading !== null}
                            className="px-2.5 py-1 text-xs font-medium text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors disabled:opacity-40"
                          >
                            {loading === `${p.id}:reject` ? "..." : "거절"}
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(p.id, p.title)}
                          disabled={loading !== null}
                          className="px-2.5 py-1 text-xs font-medium text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors disabled:opacity-40"
                        >
                          {loading === `${p.id}:delete` ? "..." : "삭제"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 dark:border-gray-800">
            <p className="text-xs text-gray-500 tabular-nums">
              {(page - 1) * limit + 1}–{Math.min(page * limit, total)} / {total}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => router.push(`?status=${currentStatus}&page=${page - 1}`)}
                disabled={page <= 1}
                className="px-3 py-1.5 text-xs border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                이전
              </button>
              <button
                onClick={() => router.push(`?status=${currentStatus}&page=${page + 1}`)}
                disabled={page >= totalPages}
                className="px-3 py-1.5 text-xs border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                다음
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
