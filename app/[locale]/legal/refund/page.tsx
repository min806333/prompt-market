import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import LegalPageLayout from "@/components/legal/LegalPageLayout";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "refundPage" });
  return { title: t("title") };
}

export default async function RefundPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "refundPage" });
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
          items: [t("refundCase1"), t("refundCase2"), t("refundCase3"), t("refundCase4")],
        },
        { title: t("section3Title"), content: t("section3Content") },
        { title: t("section4Title"), content: t("section4Content") },
        { title: t("section5Title"), content: t("section5Content") },
      ]}
    />
  );
}
