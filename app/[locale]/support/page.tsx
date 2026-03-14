import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import SupportClient from "@/components/support/SupportClient";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "support" });
  return {
    title: `${t("title")} — Promto`,
    description: t("subtitle"),
  };
}

export default function SupportPage() {
  return <SupportClient />;
}
