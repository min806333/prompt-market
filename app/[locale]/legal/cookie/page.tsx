import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import LegalPageLayout from "@/components/legal/LegalPageLayout";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cookiePage" });
  return { title: t("title") };
}

export default async function CookiePolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "cookiePage" });
  const tLegal = await getTranslations({ locale, namespace: "legal" });

  return (
    <LegalPageLayout
      title={t("title")}
      lastUpdated={t("lastUpdated")}
      intro={t("intro")}
      backHomeLabel={tLegal("backHome")}
      sections={[
        { title: t("section1Title"), content: t("section1Content") },
        {
          title: t("section2Title"),
          items: [
            `${t("cookie1Name")}: ${t("cookie1Desc")}`,
            `${t("cookie2Name")}: ${t("cookie2Desc")}`,
            `${t("cookie3Name")}: ${t("cookie3Desc")}`,
            `${t("cookie4Name")}: ${t("cookie4Desc")}`,
          ],
        },
        { title: t("section3Title"), content: t("section3Content") },
        { title: t("section4Title"), content: t("section4Content") },
      ]}
    />
  );
}
