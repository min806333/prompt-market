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
    default: "Promto | AI Prompt Marketplace",
    template: "%s | Promto",
  },
  description: "인디 크리에이터를 위한 AI 프롬프트 마켓플레이스. 게임 음악, 영상 제작, 기획서 등 실전 프롬프트를 구매하고 판매하세요.",
  keywords: ["AI 프롬프트", "프롬프트 마켓", "Suno", "ChatGPT", "인디 게임", "크리에이터"],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Promto",
    title: "Promto | AI Prompt Marketplace",
    description: "인디 크리에이터를 위한 AI 프롬프트 마켓플레이스. 바로 쓸 수 있는 실전 프롬프트를 구매하고 판매하세요.",
    images: [{ url: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&h=630&fit=crop", width: 1200, height: 630, alt: "Promto — AI Prompt Marketplace" }],
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Promto | AI Prompt Marketplace",
    description: "인디 크리에이터를 위한 AI 프롬프트 마켓플레이스.",
    images: ["https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&h=630&fit=crop"],
  },
  alternates: { canonical: SITE_URL, languages: { ko: SITE_URL, en: `${SITE_URL}/en` } },
  robots: { index: true, follow: true },
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
