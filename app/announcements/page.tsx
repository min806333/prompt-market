import type { Metadata } from "next";
import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/service";
import Container from "@/components/layout/Container";
import SectionTitle from "@/components/ui/SectionTitle";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "공지사항 — Promto",
  description: "Promto의 새 소식과 업데이트를 확인하세요.",
};

const categoryLabel: Record<string, string> = {
  notice: "공지",
  update: "업데이트",
  event: "이벤트",
};
const categoryColor: Record<string, string> = {
  notice: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  update: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  event: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function AnnouncementsPage() {
  const sb = createServiceClient();

  let { data, error } = await sb
    .from("announcements")
    .select("*")
    .eq("is_published", true)
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    ({ data } = await sb
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false }));
  }

  const items = data ?? [];
  const pinned = items.filter((a) => a.is_pinned);
  const rest = items.filter((a) => !a.is_pinned);
  const getHref = (ann: { slug?: string | null; id: string }) =>
    `/announcements/${ann.slug ?? ann.id}`;

  return (
    <div className="py-12">
      <Container>
        <SectionTitle
          title="공지사항"
          subtitle="Promto의 새 소식과 업데이트를 확인하세요"
          className="mb-10"
        />

        {pinned.length > 0 && (
          <div className="mb-8">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">📌 고정 공지</p>
            <div className="space-y-3">
              {pinned.map((ann) => (
                <Link
                  key={ann.id}
                  href={getHref(ann)}
                  className="flex items-start justify-between gap-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-2xl px-6 py-4 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${categoryColor[ann.category] ?? ""}`}>
                        {categoryLabel[ann.category] ?? ann.category}
                      </span>
                      <span className="text-xs text-gray-400">{formatDate(ann.created_at)}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {ann.title}
                    </h3>
                    {ann.summary && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate">{ann.summary}</p>
                    )}
                  </div>
                  <svg className="w-5 h-5 text-gray-300 dark:text-gray-600 shrink-0 mt-0.5 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {rest.map((ann) => (
            <Link
              key={ann.id}
              href={getHref(ann)}
              className="flex items-start justify-between gap-4 py-5 hover:bg-gray-50 dark:hover:bg-gray-900/50 -mx-4 px-4 rounded-xl transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${categoryColor[ann.category] ?? ""}`}>
                    {categoryLabel[ann.category] ?? ann.category}
                  </span>
                  <span className="text-xs text-gray-400">{formatDate(ann.created_at)}</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {ann.title}
                </h3>
                {ann.summary && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate">{ann.summary}</p>
                )}
              </div>
              <svg className="w-5 h-5 text-gray-300 dark:text-gray-600 shrink-0 mt-0.5 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
          {items.length === 0 && (
            <p className="text-gray-400 text-center py-16">공지사항이 없습니다.</p>
          )}
        </div>
      </Container>
    </div>
  );
}
