import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { cookies } from "next/headers";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ToastProvider } from "@/components/ui/ToastProvider";
import koMessages from "@/messages/ko.json";
import enMessages from "@/messages/en.json";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.promto.kr";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Promto — AI Prompt Marketplace",
    template: "%s | Promto",
  },
  description:
    "인디 크리에이터를 위한 AI 프롬프트 마켓플레이스. ChatGPT, Claude, Suno 등 AI 툴용 실전 프롬프트를 구매하고 판매하세요.",
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Promto",
    title: "Promto — AI Prompt Marketplace",
    description:
      "인디 크리에이터를 위한 AI 프롬프트 마켓플레이스. ChatGPT, Claude, Suno 등 AI 툴용 실전 프롬프트를 구매하고 판매하세요.",
    locale: "ko_KR",
    alternateLocale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Promto — AI Prompt Marketplace",
    description:
      "인디 크리에이터를 위한 AI 프롬프트 마켓플레이스. ChatGPT, Claude, Suno 등 AI 툴용 실전 프롬프트를 구매하고 판매하세요.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: SITE_URL,
    languages: { ko: SITE_URL, en: `${SITE_URL}/en` },
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value ?? "ko";
  const messages = locale === "en" ? enMessages : koMessages;

  return (
    <html lang={locale} className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider>
            <AuthProvider>
              <ToastProvider>{children}</ToastProvider>
            </AuthProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
