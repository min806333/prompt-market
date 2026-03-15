import { notFound } from "next/navigation";
import { getMessages, setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/ui/ScrollToTop";
import AnnouncementBanner from "@/components/home/AnnouncementBanner";
import { createServiceClient } from "@/lib/supabase/service";
import type { Announcement } from "@/types";

const locales = ["ko", "en"] as const;
type Locale = (typeof locales)[number];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  let pinnedAnnouncement: Announcement | null = null;
  try {
    const sb = createServiceClient();
    const { data } = await sb
      .from("announcements")
      .select("id, title, slug, category, summary, content, created_at, image_url, is_pinned")
      .eq("is_pinned", true)
      .limit(1)
      .maybeSingle();

    if (data) {
      pinnedAnnouncement = {
        id: data.id,
        title: data.title,
        slug: data.slug ?? data.id,
        content: data.content ?? "",
        summary: data.summary ?? undefined,
        category: (data.category as Announcement["category"]) ?? "notice",
        isPinned: true,
        imageUrl: data.image_url ?? undefined,
        createdAt: data.created_at ?? "",
      };
    }
  } catch {
    // 배너는 선택적 — 오류 무시
  }

  return (
    <NextIntlClientProvider messages={messages}>
      {pinnedAnnouncement && <AnnouncementBanner announcement={pinnedAnnouncement} />}
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <ScrollToTop />
    </NextIntlClientProvider>
  );
}
