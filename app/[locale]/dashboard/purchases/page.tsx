import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import PurchasesClient from "@/components/dashboard/PurchasesClient";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "dashboard" });
  return { title: t("purchases.metaTitle"), description: t("purchases.metaDesc") };
}

export default function PurchasesPage() {
  return <PurchasesClient />;
}
