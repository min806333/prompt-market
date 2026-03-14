import { notFound } from "next/navigation";
import { getMessages, setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/ui/ScrollToTop";
import AnnouncementBanner from "@/components/home/AnnouncementBanner";
import { announcements } from "@/lib/data/mockData";

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
  const pinnedAnnouncement = announcements.find((a) => a.isPinned);

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
