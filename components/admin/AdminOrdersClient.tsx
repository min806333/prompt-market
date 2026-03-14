"use client";

import { useRouter } from "next/navigation";

const STATUS_FILTERS = [
  { value: "all", label: "전체" },
  { value: "completed", label: "완료" },
  { value: "pending", label: "대기" },
  { value: "failed", label: "실패" },
  { value: "refunded", label: "환불" },
];

function PayStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
    failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    refunded: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  };
  const labels: Record<string, string> = { completed: "완료", pending: "대기", failed: "실패", refunded: "환불" };
  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${map[status] ?? map.pending}`}>
      {labels[status] ?? status}
    </span>
  );
}

interface Order {
  id: string;
  amount: number;
  payment_status: string;
  payment_method?: string;
  created_at: string;
  download_count: number;
  user: { email?: string; display_name?: string } | null;
  product: { title?: string; slug?: string } | null;
}

export default function AdminOrdersClient({
  orders,
  total,
  page,
  limit,
  currentStatus,
}: {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  currentStatus: string;
}) {
  const router = useRouter();

  const totalRevenue = orders
    .filter((o) => o.payment_status === "completed")
    .reduce((s, o) => s + Number(o.amount), 0);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">주문 관리</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">전체 {total.toLocaleString()}건</p>
        </div>
        {currentStatus === "all" || currentStatus === "completed" ? (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl px-4 py-3 text-right">
            <div className="text-xs text-green-600 dark:text-green-400">현재 페이지 완료 주문</div>
            <div className="text-lg font-black text-green-700 dark:text-green-300">
              ${totalRevenue.toFixed(2)}
            </div>
          </div>
        ) : null}
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
                {["주문자", "상품", "금액", "결제 방법", "상태", "다운로드", "날짜"].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-gray-400">주문 내역이 없습니다.</td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">{o.user?.email ?? "알 수 없음"}</div>
                      {o.user?.display_name && (
                        <div className="text-xs text-gray-400">{o.user.display_name}</div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {o.product?.title ? (
                        <a
                          href={`/products/${o.product.slug}`}
                          target="_blank"
                          className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline line-clamp-1"
                        >
                          {o.product.title}
                        </a>
                      ) : (
                        <span className="text-sm text-gray-400">삭제된 상품</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-gray-900 dark:text-white tabular-nums">
                      ${Number(o.amount).toFixed(2)}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {o.payment_method ?? "-"}
                    </td>
                    <td className="px-5 py-4">
                      <PayStatusBadge status={o.payment_status} />
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500 tabular-nums">
                      {o.download_count ?? 0}회
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400 tabular-nums">
                      {new Date(o.created_at).toLocaleDateString("ko-KR")}
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
              <button onClick={() => router.push(`?status=${currentStatus}&page=${page - 1}`)} disabled={page <= 1} className="px-3 py-1.5 text-xs border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800">이전</button>
              <button onClick={() => router.push(`?status=${currentStatus}&page=${page + 1}`)} disabled={page >= totalPages} className="px-3 py-1.5 text-xs border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800">다음</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
