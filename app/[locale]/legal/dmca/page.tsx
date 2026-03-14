import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import LegalPageLayout from "@/components/legal/LegalPageLayout";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "dmcaPage" });
  return { title: t("title") };
}

export default async function DMCAPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "dmcaPage" });
  const tLegal = await getTranslations({ locale, namespace: "legal" });

  return (
    <LegalPageLayout
      title={t("title")}
      lastUpdated={t("lastUpdated")}
      intro={t("intro")}
      backHomeLabel={tLegal("backHome")}
      sections={[
        {
          title: t("section1Title"),
          content: t("section1Content"),
          items: [t("requirement1"), t("requirement2"), t("requirement3"), t("requirement4")],
        },
        {
          title: t("section2Title"),
          steps: [t("step1"), t("step2"), t("step3"), t("step4")],
        },
        { title: t("section3Title"), content: t("section3Content") },
        { title: t("section4Title"), content: t("section4Content") },
      ]}
    />
  );
}
