import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import LegalPageLayout from "@/components/legal/LegalPageLayout";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "copyrightPage" });
  return { title: t("title") };
}

export default async function CopyrightPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "copyrightPage" });
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
          content: t("section2Content"),
          items: [t("prohibited1"), t("prohibited2"), t("prohibited3")],
        },
        { title: t("section3Title"), content: t("section3Content") },
        { title: t("section4Title"), content: t("section4Content") },
      ]}
    />
  );
}
