"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const ROLE_FILTERS = [
  { value: "all", label: "전체" },
  { value: "user", label: "일반 사용자" },
  { value: "admin", label: "관리자" },
  { value: "banned", label: "차단됨" },
];

function RoleBadge({ role }: { role: string }) {
  const map: Record<string, string> = {
    admin: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
    user: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
    banned: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };
  const labels: Record<string, string> = { admin: "관리자", user: "사용자", banned: "차단됨" };
  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${map[role] ?? map.user}`}>
      {labels[role] ?? role}
    </span>
  );
}

function SubBadge({ status }: { status?: string }) {
  if (!status || status === "free") return null;
  const map: Record<string, string> = {
    pro: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    creator: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    premium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  };
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${map[status] ?? ""}`}>
      {status.toUpperCase()}
    </span>
  );
}

interface User {
  id: string;
  email: string;
  display_name?: string;
  role: string;
  subscription_status?: string;
  created_at: string;
}

export default function AdminUsersClient({
  users,
  total,
  page,
  limit,
  currentRole,
}: {
  users: User[];
  total: number;
  page: number;
  limit: number;
  currentRole: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function handleAction(id: string, action: string, email: string) {
    const msgs: Record<string, string> = {
      make_admin: `${email} 사용자를 관리자로 지정하시겠습니까?`,
      remove_admin: `${email} 사용자의 관리자 권한을 제거하시겠습니까?`,
      ban: `${email} 사용자를 차단하시겠습니까?`,
      unban: `${email} 사용자의 차단을 해제하시겠습니까?`,
    };
    if (!confirm(msgs[action] ?? "계속하시겠습니까?")) return;

    setLoading(`${id}:${action}`);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">사용자 관리</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">전체 {total.toLocaleString()}명</p>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {ROLE_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => router.push(`?role=${f.value}`)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              currentRole === f.value
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
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                {["사용자", "역할", "구독", "가입일", "액션"].map((h, i) => (
                  <th
                    key={h}
                    className={`px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${i === 4 ? "text-right" : "text-left"}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center text-gray-400">
                    사용자가 없습니다.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{u.email}</div>
                      {u.display_name && (
                        <div className="text-xs text-gray-400 mt-0.5">{u.display_name}</div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <RoleBadge role={u.role} />
                    </td>
                    <td className="px-5 py-4">
                      <SubBadge status={u.subscription_status} />
                      {(!u.subscription_status || u.subscription_status === "free") && (
                        <span className="text-xs text-gray-400">Free</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400 tabular-nums">
                      {new Date(u.created_at).toLocaleDateString("ko-KR")}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        {u.role !== "admin" && (
                          <button
                            onClick={() => handleAction(u.id, "make_admin", u.email)}
                            disabled={loading !== null}
                            className="px-2.5 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg hover:bg-indigo-100 disabled:opacity-40 transition-colors"
                          >
                            {loading === `${u.id}:make_admin` ? "..." : "관리자 지정"}
                          </button>
                        )}
                        {u.role === "admin" && (
                          <button
                            onClick={() => handleAction(u.id, "remove_admin", u.email)}
                            disabled={loading !== null}
                            className="px-2.5 py-1 text-xs font-medium text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 disabled:opacity-40 transition-colors"
                          >
                            {loading === `${u.id}:remove_admin` ? "..." : "관리자 해제"}
                          </button>
                        )}
                        {u.role !== "banned" ? (
                          <button
                            onClick={() => handleAction(u.id, "ban", u.email)}
                            disabled={loading !== null}
                            className="px-2.5 py-1 text-xs font-medium text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 disabled:opacity-40 transition-colors"
                          >
                            {loading === `${u.id}:ban` ? "..." : "차단"}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAction(u.id, "unban", u.email)}
                            disabled={loading !== null}
                            className="px-2.5 py-1 text-xs font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 disabled:opacity-40 transition-colors"
                          >
                            {loading === `${u.id}:unban` ? "..." : "차단 해제"}
                          </button>
                        )}
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
              <button onClick={() => router.push(`?role=${currentRole}&page=${page - 1}`)} disabled={page <= 1} className="px-3 py-1.5 text-xs border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800">이전</button>
              <button onClick={() => router.push(`?role=${currentRole}&page=${page + 1}`)} disabled={page >= totalPages} className="px-3 py-1.5 text-xs border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800">다음</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
