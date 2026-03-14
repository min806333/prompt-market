"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Category = "notice" | "update" | "event";

const CATEGORY_LABELS: Record<Category, string> = { notice: "공지", update: "업데이트", event: "이벤트" };
const CATEGORY_COLORS: Record<Category, string> = {
  notice: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  update: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  event: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
};

interface Announcement {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  content: string;
  category: Category;
  is_pinned: boolean;
  image_url?: string;
  created_at: string;
}

interface FormState {
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: Category;
  is_pinned: boolean;
  image_url: string;
}

const EMPTY_FORM: FormState = {
  title: "",
  slug: "",
  summary: "",
  content: "",
  category: "notice",
  is_pinned: false,
  image_url: "",
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[가-힣]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

export default function AdminAnnouncementsClient({
  announcements,
}: {
  announcements: Announcement[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  function openCreate() {
    setEditId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  function openEdit(a: Announcement) {
    setEditId(a.id);
    setForm({
      title: a.title,
      slug: a.slug,
      summary: a.summary ?? "",
      content: a.content,
      category: a.category,
      is_pinned: a.is_pinned,
      image_url: a.image_url ?? "",
    });
    setShowForm(true);
  }

  function handleTitleChange(v: string) {
    setForm((f) => ({ ...f, title: v, slug: editId ? f.slug : slugify(v) }));
  }

  async function handleSave() {
    if (!form.title.trim() || !form.content.trim()) {
      alert("제목과 내용은 필수입니다.");
      return;
    }
    setSaving(true);
    try {
      const payload = editId ? { id: editId, ...form } : form;
      const res = await fetch("/api/admin/announcements", {
        method: editId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.error ?? "저장 실패"); return; }
      setShowForm(false);
      router.refresh();
    } catch { alert("네트워크 오류"); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`"${title}" 공지를 삭제하시겠습니까?`)) return;
    setLoading(`${id}:delete`);
    try {
      const res = await fetch("/api/admin/announcements", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) { const d = await res.json(); alert(d.error ?? "삭제 실패"); return; }
      router.refresh();
    } catch { alert("네트워크 오류"); }
    finally { setLoading(null); }
  }

  async function togglePin(a: Announcement) {
    setLoading(`${a.id}:pin`);
    try {
      const res = await fetch("/api/admin/announcements", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: a.id, is_pinned: !a.is_pinned }),
      });
      if (!res.ok) { const d = await res.json(); alert(d.error ?? "변경 실패"); return; }
      router.refresh();
    } catch { alert("네트워크 오류"); }
    finally { setLoading(null); }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">공지사항 관리</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">전체 {announcements.length}건</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          새 공지 작성
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="font-bold text-gray-900 dark:text-white">
                {editId ? "공지 수정" : "새 공지 작성"}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block mb-1.5">제목 *</label>
                <input
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                  placeholder="공지 제목"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block mb-1.5">슬러그 *</label>
                  <input
                    value={form.slug}
                    onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                    placeholder="url-slug"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block mb-1.5">카테고리</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as Category }))}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                  >
                    <option value="notice">공지</option>
                    <option value="update">업데이트</option>
                    <option value="event">이벤트</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block mb-1.5">요약</label>
                <input
                  value={form.summary}
                  onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                  placeholder="짧은 요약 (선택)"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block mb-1.5">내용 *</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  rows={6}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white resize-none"
                  placeholder="공지 내용을 입력하세요..."
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  id="pinned"
                  type="checkbox"
                  checked={form.is_pinned}
                  onChange={(e) => setForm((f) => ({ ...f, is_pinned: e.target.checked }))}
                  className="w-4 h-4 rounded text-indigo-600"
                />
                <label htmlFor="pinned" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                  상단 고정
                </label>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
                취소
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60"
              >
                {saving ? "저장 중..." : editId ? "수정 완료" : "작성 완료"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {announcements.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-16 text-center text-gray-400">
            공지사항이 없습니다.
          </div>
        ) : (
          announcements.map((a) => (
            <div
              key={a.id}
              className={`bg-white dark:bg-gray-900 rounded-2xl border overflow-hidden ${
                a.is_pinned
                  ? "border-indigo-200 dark:border-indigo-800"
                  : "border-gray-200 dark:border-gray-800"
              }`}
            >
              <div className="px-6 py-4 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${CATEGORY_COLORS[a.category]}`}>
                      {CATEGORY_LABELS[a.category]}
                    </span>
                    {a.is_pinned && (
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                        📌 고정
                      </span>
                    )}
                    <span className="text-xs text-gray-400">
                      {new Date(a.created_at).toLocaleDateString("ko-KR")}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{a.title}</h3>
                  {a.summary && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{a.summary}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => togglePin(a)}
                    disabled={loading !== null}
                    className="px-2.5 py-1.5 text-xs font-medium text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg hover:bg-indigo-100 disabled:opacity-40 transition-colors"
                  >
                    {loading === `${a.id}:pin` ? "..." : a.is_pinned ? "고정 해제" : "고정"}
                  </button>
                  <button
                    onClick={() => openEdit(a)}
                    className="px-2.5 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(a.id, a.title)}
                    disabled={loading !== null}
                    className="px-2.5 py-1.5 text-xs font-medium text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 disabled:opacity-40 transition-colors"
                  >
                    {loading === `${a.id}:delete` ? "..." : "삭제"}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
