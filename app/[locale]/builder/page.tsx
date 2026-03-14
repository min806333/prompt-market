import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import PromptBuilderClient from "@/components/builder/PromptBuilderClient";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "builder" });
  return { title: t("metaTitle"), description: t("metaDesc") };
}

export default function PromptBuilderPage() {
  return (
    <div className="py-10">
      <PromptBuilderClient />
    </div>
  );
}
