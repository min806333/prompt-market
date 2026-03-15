import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { createServiceClient } from "@/lib/supabase/service";
import Container from "@/components/layout/Container";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

async function fetchAnnouncement(id: string) {
  const sb = createServiceClient();
  const { data: bySlug } = await sb
    .from("announcements")
    .select("*")
    .eq("slug", id)
    .eq("is_published", true)
    .maybeSingle();

  if (bySlug) return bySlug;

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(id)) {
    const { data: byId } = await sb
      .from("announcements")
      .select("*")
      .eq("id", id)
      .eq("is_published", true)
      .maybeSingle();
    return byId ?? null;
  }

  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const ann = await fetchAnnouncement(id);
  if (!ann) return {};
  return {
    title: `${ann.title} — Promto`,
    description: ann.summary ?? ann.title,
  };
}

const categoryColor: Record<string, string> = {
  notice: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  update: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  event: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
};

function renderMarkdown(text: string) {
  return text.split("\n").map((line, i) => {
    if (line.startsWith("**") && line.endsWith("**")) {
      return (
        <p key={i} className="font-bold text-gray-900 dark:text-white mt-4 mb-1">
          {line.replace(/\*\*/g, "")}
        </p>
      );
    }
    if (line.startsWith("- ")) {
      return (
        <li key={i} className="ml-4 list-disc text-gray-600 dark:text-gray-400">
          {line.slice(2).replace(/\*\*(.*?)\*\*/g, "$1")}
        </li>
      );
    }
    if (line.trim() === "") return <br key={i} />;
    return (
      <p key={i} className="text-gray-600 dark:text-gray-400">
        {line.replace(/\*\*(.*?)\*\*/g, (_, m) => m)}
      </p>
    );
  });
}

export default async function AnnouncementDetailPage({ params }: Props) {
  const { locale, id } = await params;
  const lp = locale === "ko" ? "" : `/${locale}`;

  const ta = await getTranslations({ locale, namespace: "announcement" });
  const getCategoryLabel = (cat: string): string => {
    const map: Record<string, string> = {
      notice: ta("notice"),
      update: ta("update"),
      event: ta("event"),
    };
    return map[cat] ?? cat;
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(locale === "ko" ? "ko-KR" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const ann = await fetchAnnouncement(id);
  if (!ann) notFound();

  const sb = createServiceClient();
  const { data: others } = await sb
    .from("announcements")
    .select("id, slug, title, category, created_at, summary")
    .eq("is_published", true)
    .neq("id", ann.id)
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <div className="py-12">
      <Container size="md">
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href={lp || "/"} className="hover:text-gray-600 dark:hover:text-gray-300">
            {locale === "ko" ? "홈" : "Home"}
          </Link>
          <span>/</span>
          <Link href={`${lp}/announcements`} className="hover:text-gray-600 dark:hover:text-gray-300">
            {locale === "ko" ? "공지사항" : "Announcements"}
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white truncate max-w-xs">{ann.title}</span>
        </nav>

        <article>
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${categoryColor[ann.category] ?? ""}`}>
              {getCategoryLabel(ann.category)}
            </span>
            {ann.is_pinned && (
              <span className="text-xs text-gray-400">📌 {locale === "ko" ? "고정" : "Pinned"}</span>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{ann.title}</h1>
          <p className="text-sm text-gray-400 mb-8">{formatDate(ann.created_at)}</p>

          <div className="prose dark:prose-invert max-w-none bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8 space-y-2">
            {renderMarkdown(ann.content)}
          </div>
        </article>

        {(others ?? []).length > 0 && (
          <div className="mt-12">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {locale === "ko" ? "다른 공지사항" : "Other Announcements"}
            </h2>
            <div className="space-y-2">
              {(others ?? []).map((o) => (
                <Link
                  key={o.id}
                  href={`${lp}/announcements/${o.slug ?? o.id}`}
                  className="flex items-center justify-between gap-4 py-3 px-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold shrink-0 ${categoryColor[o.category] ?? ""}`}>
                      {getCategoryLabel(o.category)}
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">
                      {o.title}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">{formatDate(o.created_at)}</span>
                </Link>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link href={`${lp}/announcements`} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                {locale === "ko" ? "공지사항 전체 보기 →" : "View all announcements →"}
              </Link>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
