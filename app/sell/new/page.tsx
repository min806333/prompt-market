"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/layout/Container";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/ui/ToastProvider";
import { createClient } from "@/lib/supabase/client";

const categories = [
  { id: "game-music", name: "게임 음악" },
  { id: "planning-docs", name: "기획/문서" },
  { id: "video-content", name: "영상/콘텐츠" },
  { id: "app-description", name: "앱/게임 소개" },
  { id: "other", name: "기타" },
];

const aiTools = ["ChatGPT", "Claude", "Suno", "Udio", "Midjourney", "Stable Diffusion", "기타"];

const ALLOWED_TYPES: Record<string, string> = {
  "text/plain": "TXT",
  "application/pdf": "PDF",
  "application/zip": "ZIP",
  "application/x-zip-compressed": "ZIP",
  "text/markdown": "MD",
};
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const MAX_FILES = 3;

interface UploadedFile {
  file: File;
  preview: string;
  format: string;
}

export default function NewProductPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    shortDesc: "",
    fullDesc: "",
    price: "",
    category: "",
    promptCount: "",
    usageTips: "",
    externalBuyUrl: "",
    selectedTools: [] as string[],
  });
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      setProfileLoading(false);
      return;
    }
    const supabase = createClient();
    supabase
      .from("profiles")
      .select("subscription_status")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        setSubscriptionStatus(data?.subscription_status ?? "free");
        setProfileLoading(false);
      });
  }, [user, loading]);

  // Any logged-in user can sell (free plan = 70% revenue)
  const canSell = !!user;
  const revenueShare =
    subscriptionStatus === "creator" || subscriptionStatus === "premium"
      ? 90
      : subscriptionStatus === "pro"
      ? 80
      : 70;

  const toggleTool = (tool: string) => {
    setForm((prev) => ({
      ...prev,
      selectedTools: prev.selectedTools.includes(tool)
        ? prev.selectedTools.filter((t) => t !== tool)
        : [...prev.selectedTools, tool],
    }));
  };

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES[file.type]) return `${file.name}: TXT, PDF, ZIP, MD 파일만 업로드 가능합니다.`;
    if (file.size > MAX_FILE_SIZE) return `${file.name}: 파일 크기는 20MB 이하여야 합니다.`;
    return null;
  };

  const addFiles = (newFiles: FileList | File[]) => {
    const fileArr = Array.from(newFiles);
    const remaining = MAX_FILES - uploadedFiles.length;

    if (remaining <= 0) {
      toast.error(`최대 ${MAX_FILES}개 파일까지 업로드 가능합니다.`);
      return;
    }

    const toAdd: UploadedFile[] = [];
    for (const file of fileArr.slice(0, remaining)) {
      const err = validateFile(file);
      if (err) { toast.error(err); continue; }
      const isDuplicate = uploadedFiles.some((f) => f.file.name === file.name && f.file.size === file.size);
      if (isDuplicate) { toast.error(`${file.name}: 이미 추가된 파일입니다.`); continue; }
      toAdd.push({ file, preview: file.name, format: ALLOWED_TYPES[file.type] });
    }

    if (toAdd.length > 0) {
      setUploadedFiles((prev) => [...prev, ...toAdd]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category) { toast.error("카테고리를 선택해주세요."); return; }
    if (form.selectedTools.length === 0) { toast.error("사용 가능한 AI 툴을 선택해주세요."); return; }
    if (uploadedFiles.length === 0) { toast.error("파일을 최소 1개 이상 업로드해주세요."); return; }

    setSubmitting(true);
    // Phase 2: Supabase Storage 업로드 + seller_products INSERT
    await new Promise((r) => setTimeout(r, 1200));
    toast.success("상품 등록 신청이 완료되었습니다! 24시간 내 심사 결과를 알려드립니다.");
    router.push("/dashboard");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const fileIconMap: Record<string, string> = {
    TXT: "📄", PDF: "📕", ZIP: "📦", MD: "📝",
  };

  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <Container size="md">
        {/* Auth gate */}
        {!loading && !user && (
          <div className="text-center py-20">
            <p className="text-gray-600 dark:text-gray-400 mb-4">로그인 후 이용 가능합니다.</p>
            <a href="/auth/login" className="inline-block px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition">로그인</a>
          </div>
        )}
        {loading && (
          <div className="text-center py-20 text-gray-400">불러오는 중...</div>
        )}
        {!loading && user && (
        <>
        {/* Revenue share banner */}
        <div className="mb-6 flex items-center gap-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl px-5 py-3">
          <span className="text-2xl">💰</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-green-800 dark:text-green-300">
              현재 내 판매 수익: <strong>{revenueShare}%</strong>
              {revenueShare < 90 && (
                <a href="/pricing" className="ml-2 text-xs underline text-green-700 dark:text-green-400">플랜 업그레이드로 최대 90%까지 →</a>
              )}
            </p>
            <p className="text-xs text-green-600 dark:text-green-500 mt-0.5">
              Free 70% · Pro 80% · Creator/Premium 90%
            </p>
          </div>
        </div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">새 상품 등록</h1>
          <p className="text-gray-500 dark:text-gray-400">프롬프트 상품 정보를 입력하세요. 심사 후 24시간 이내 마켓에 노출됩니다.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 기본 정보 */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 space-y-5">
            <h2 className="font-bold text-lg text-gray-900 dark:text-white">기본 정보</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">상품명 *</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="예: 퍼즐 게임 BGM 프롬프트 50종" required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">짧은 설명 *</label>
              <input type="text" value={form.shortDesc} onChange={(e) => setForm({ ...form, shortDesc: e.target.value })}
                placeholder="한 줄로 상품을 설명하세요" required maxLength={120}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">상세 설명 *</label>
              <textarea value={form.fullDesc} onChange={(e) => setForm({ ...form, fullDesc: e.target.value })}
                placeholder="포함 내용, 사용 방법, 기대 효과 등을 자세히 설명하세요" required rows={6}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">카테고리 *</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition">
                  <option value="">선택하세요</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">프롬프트 수 *</label>
                <input type="number" value={form.promptCount} onChange={(e) => setForm({ ...form, promptCount: e.target.value })}
                  placeholder="50" min="1" required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">가격 (USD) *</label>
              <div className="relative max-w-xs">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
                <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="9.99" min="0" step="0.01" required
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" />
              </div>
            </div>
          </div>

          {/* 파일 업로드 */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-lg text-gray-900 dark:text-white">파일 업로드 *</h2>
                <p className="text-sm text-gray-400 mt-0.5">TXT, PDF, ZIP 최대 3개 · 파일당 20MB 이하</p>
              </div>
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                uploadedFiles.length >= MAX_FILES
                  ? "bg-red-50 dark:bg-red-900/20 text-red-500"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-500"
              }`}>
                {uploadedFiles.length} / {MAX_FILES}
              </span>
            </div>

            {/* 드래그 앤 드롭 영역 */}
            {uploadedFiles.length < MAX_FILES && (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
                  dragging
                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }`}
              >
                <p className="text-3xl mb-3">📂</p>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  클릭하거나 파일을 드래그해서 업로드
                </p>
                <p className="text-xs text-gray-400 mt-1">TXT · PDF · ZIP · MD</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".txt,.pdf,.zip,.md"
                  className="hidden"
                  onChange={(e) => e.target.files && addFiles(e.target.files)}
                />
              </div>
            )}

            {/* 업로드된 파일 목록 */}
            {uploadedFiles.length > 0 && (
              <div className="flex flex-col gap-2">
                {uploadedFiles.map((uf, i) => (
                  <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                    <span className="text-2xl">{fileIconMap[uf.format] ?? "📄"}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{uf.file.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {uf.format} · {formatFileSize(uf.file.size)}
                      </p>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium">
                      준비됨
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      aria-label="파일 삭제"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
              <span className="text-blue-500 mt-0.5">ℹ️</span>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                <strong>파일 형식 가이드:</strong> 프롬프트 텍스트는 <strong>TXT</strong>,
                설명 포함 문서는 <strong>PDF</strong>, 여러 파일 묶음은 <strong>ZIP</strong>으로 제공하세요.
              </p>
            </div>
          </div>

          {/* AI 툴 선택 */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 space-y-4">
            <h2 className="font-bold text-lg text-gray-900 dark:text-white">사용 가능한 AI 툴 *</h2>
            <div className="flex flex-wrap gap-2">
              {aiTools.map((tool) => (
                <button key={tool} type="button" onClick={() => toggleTool(tool)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                    form.selectedTools.includes(tool)
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-indigo-400"
                  }`}>
                  {tool}
                </button>
              ))}
            </div>
          </div>

          {/* 추가 정보 */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 space-y-4">
            <h2 className="font-bold text-lg text-gray-900 dark:text-white">추가 정보</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">사용 팁</label>
              <textarea value={form.usageTips} onChange={(e) => setForm({ ...form, usageTips: e.target.value })}
                placeholder="구매자에게 도움이 되는 사용 팁을 입력하세요 (줄바꿈으로 구분)" rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">외부 결제 링크 (선택)</label>
              <input type="url" value={form.externalBuyUrl} onChange={(e) => setForm({ ...form, externalBuyUrl: e.target.value })}
                placeholder="https://gumroad.com/..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" />
            </div>
          </div>

          {/* 수수료 안내 */}
          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800 p-4 flex items-start gap-3">
            <span className="text-xl">💡</span>
            <div className="text-sm text-indigo-700 dark:text-indigo-300">
              <strong>수수료 안내:</strong> 판매 금액의 10%가 플랫폼 운영 수수료로 공제되고,
              <strong> 90%가 판매자에게 정산</strong>됩니다.
            </div>
          </div>

          <div className="flex gap-4">
            <a href="/sell" className="flex-1 inline-flex items-center justify-center font-semibold rounded-xl px-5 py-2.5 text-sm border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
              취소
            </a>
            <button type="submit" disabled={submitting}
              className="flex-1 inline-flex items-center justify-center font-semibold rounded-xl px-5 py-2.5 text-sm bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
              {submitting ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  등록 중...
                </span>
              ) : "상품 등록 신청"}
            </button>
          </div>
        </form>
        </>
        )}
      </Container>
    </div>
  );
}
