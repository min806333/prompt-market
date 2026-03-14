import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import PricingCards from "@/components/pricing/PricingCards";
import Container from "@/components/layout/Container";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "pricing" });
  return {
    title: t("metaTitle"),
    description: t("metaDesc"),
  };
}

export default async function PricingPage({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale: params.locale, namespace: "pricing" });
  return (
    <div className="py-16">
      <Container>
        <div className="text-center mb-14">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4">
            {t("title")}
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            {t("subtitle")}
            <br />
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-base">
              {t("trialNote")}
            </span>
          </p>
        </div>
        <PricingCards />
      </Container>
    </div>
  );
}
