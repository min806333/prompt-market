"use client";

import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";

interface Ticket {
  id: string;
  name: string;
  email: string;
  category: string;
  message: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  admin_reply: string | null;
  created_at: string;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  open: { label: "미처리", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  in_progress: { label: "처리중", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  resolved: { label: "완료", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  closed: { label: "닫힘", color: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400" },
};

const CATEGORY_COLORS: Record<string, string> = {
  "법적 문의 (저작권/DMCA)": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  "환불 신청": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  "버그 신고": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function AdminSupportClient({ initialTickets }: { initialTickets: Ticket[] }) {
  const [tickets, setTickets] = useState(initialTickets);
  const [filter, setFilter] = useState<"all" | "open" | "in_progress" | "resolved" | "closed">("all");
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [reply, setReply] = useState("");
  const [isPending, startTransition] = useTransition();
  const supabase = createClient();

  const filtered = filter === "all" ? tickets : tickets.filter((t) => t.status === filter);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("support_tickets").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
    if (!error) {
      setTickets((prev) => prev.map((t) => t.id === id ? { ...t, status: status as Ticket["status"] } : t));
      if (selected?.id === id) setSelected((prev) => prev ? { ...prev, status: status as Ticket["status"] } : null);
    }
  };

  const saveReply = async () => {
    if (!selected || !reply.trim()) return;
    startTransition(async () => {
      const { error } = await supabase
        .from("support_tickets")
        .update({ admin_reply: reply.trim(), status: "resolved", updated_at: new Date().toISOString() })
        .eq("id", selected.id);
      if (!error) {
        setTickets((prev) => prev.map((t) => t.id === selected.id ? { ...t, admin_reply: reply.trim(), status: "resolved" } : t));
        setSelected((prev) => prev ? { ...prev, admin_reply: reply.trim(), status: "resolved" } : null);
        setReply("");
      }
    });
  };

  const counts = {
    all: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    in_progress: tickets.filter((t) => t.status === "in_progress").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
    closed: tickets.filter((t) => t.status === "closed").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {(["all", "open", "in_progress", "resolved", "closed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filter === f
                ? "bg-indigo-600 text-white"
                : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            {f === "all" ? "전체" : STATUS_LABELS[f].label}
            <span className="ml-1.5 text-xs opacity-70">({counts[f]})</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-12 text-center">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-gray-400">문의가 없습니다</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">접수일</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">이름</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">유형</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">내용 미리보기</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">상태</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {filtered.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                  onClick={() => { setSelected(ticket); setReply(ticket.admin_reply ?? ""); }}
                >
                  <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">
                    {new Date(ticket.created_at).toLocaleDateString("ko-KR")}
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-gray-900 dark:text-white">{ticket.name}</p>
                    <p className="text-xs text-gray-400 truncate max-w-[120px]">{ticket.email}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${CATEGORY_COLORS[ticket.category] ?? "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"}`}>
                      {ticket.category}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <p className="text-gray-500 truncate max-w-[200px]">{ticket.message}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_LABELS[ticket.status]?.color}`}>
                      {STATUS_LABELS[ticket.status]?.label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                      {ticket.status === "open" && (
                        <button
                          onClick={() => updateStatus(ticket.id, "in_progress")}
                          className="px-2.5 py-1 text-xs rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 transition-colors"
                        >
                          처리중
                        </button>
                      )}
                      {ticket.status !== "resolved" && ticket.status !== "closed" && (
                        <button
                          onClick={() => updateStatus(ticket.id, "resolved")}
                          className="px-2.5 py-1 text-xs rounded-lg bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 transition-colors"
                        >
                          완료
                        </button>
                      )}
                      {ticket.status !== "closed" && (
                        <button
                          onClick={() => updateStatus(ticket.id, "closed")}
                          className="px-2.5 py-1 text-xs rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 transition-colors"
                        >
                          닫기
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelected(null)}>
          <div
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{selected.name}</h3>
                <p className="text-sm text-gray-400">{selected.email}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex gap-2 mb-4">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${CATEGORY_COLORS[selected.category] ?? "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"}`}>
                {selected.category}
              </span>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_LABELS[selected.status]?.color}`}>
                {STATUS_LABELS[selected.status]?.label}
              </span>
              <span className="text-xs text-gray-400 ml-auto">
                {new Date(selected.created_at).toLocaleString("ko-KR")}
              </span>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-5">
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{selected.message}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">관리자 답변</label>
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                rows={4}
                placeholder="답변 내용을 입력하세요..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
              />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={saveReply}
                  disabled={isPending || !reply.trim()}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  {isPending ? "저장 중..." : "답변 저장 및 완료 처리"}
                </button>
                <div className="flex gap-1 ml-auto">
                  {selected.status !== "in_progress" && (
                    <button onClick={() => updateStatus(selected.id, "in_progress")} className="px-3 py-2 text-xs rounded-xl bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 transition-colors">처리중으로 변경</button>
                  )}
                  {selected.status !== "closed" && (
                    <button onClick={() => updateStatus(selected.id, "closed")} className="px-3 py-2 text-xs rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 transition-colors">닫기</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
