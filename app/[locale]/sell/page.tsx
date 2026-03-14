import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import SectionTitle from "@/components/ui/SectionTitle";

const TIER_COLORS = [
  "border-gray-200 dark:border-gray-700",
  "border-blue-300 dark:border-blue-700",
  "border-indigo-400 dark:border-indigo-500",
  "border-purple-400 dark:border-purple-500",
];

const TIER_BADGES: (string | null)[] = [null, "🔥", "💼", "⭐"];

const EARNING_DATA = [
  { price: "$9.99", sales: 10, share: 0.7 },
  { price: "$9.99", sales: 50, share: 0.8 },
  { price: "$14.99", sales: 100, share: 0.9 },
];

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "sell" });
  return { title: t("metaTitle"), description: t("metaDesc") };
}

export default async function SellPage({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: "sell" });
  const locale = await getLocale();
  const lp = locale === "en" ? "/en" : "";

  const tiers = t.raw("tiers") as Array<{
    plan: string;
    price: string;
    share: string;
    platform: string;
    highlights: string[];
  }>;

  const steps = t.raw("steps") as Array<{
    step: string;
    title: string;
    desc: string;
    icon: string;
  }>;

  return (
    <div className="py-16">
      <Container>
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-6">
            {t("hero.badge")}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {t("hero.titleLine1")}
            <br />
            <span className="text-indigo-600 dark:text-indigo-400">{t("hero.titleLine2")}</span>
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            {t("hero.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href={`${lp}/sell/new`} size="lg">
              {t("hero.ctaStart")}
            </Button>
            <Button href={`${lp}/pricing`} variant="outline" size="lg">
              {t("hero.ctaCompare")}
            </Button>
          </div>
          <p className="mt-4 text-sm text-gray-400">{t("hero.noCard")}</p>
        </div>

        <div className="mb-16">
          <SectionTitle
            title={t("revenueSection.title")}
            subtitle={t("revenueSection.subtitle")}
            className="mb-8"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {tiers.map((tier, idx) => (
              <div
                key={tier.plan}
                className={`relative bg-white dark:bg-gray-900 rounded-2xl border-2 ${TIER_COLORS[idx] ?? "border-gray-200"} p-6`}
              >
                {TIER_BADGES[idx] && (
                  <span className="absolute -top-3 right-4 text-lg">{TIER_BADGES[idx]}</span>
                )}
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-gray-900 dark:text-white">{tier.plan}</span>
                  <span className="text-sm text-gray-400">{tier.price}</span>
                </div>
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                    <span>{t("revenueSection.sellerRevenue")}</span>
                    <span className="font-bold text-green-600 dark:text-green-400">{tier.share}</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                      style={{ width: tier.share }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
                    <span>{t("revenueSection.platformFee", { pct: tier.platform })}</span>
                  </div>
                </div>
                <ul className="space-y-1">
                  {tier.highlights.map((h) => (
                    <li key={h} className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-indigo-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-16 bg-gray-50 dark:bg-gray-900/60 rounded-3xl p-8">
          <SectionTitle
            title={t("earningsSection.title")}
            subtitle={t("earningsSection.subtitle")}
            className="mb-8"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {EARNING_DATA.map((ex, idx) => {
              const gross = ex.price.replace("$", "");
              const net = (parseFloat(gross) * ex.sales * ex.share).toFixed(2);
              const total = (parseFloat(gross) * ex.sales).toFixed(2);
              const planLabel = tiers[idx]?.plan ?? "";
              const countLabel = t("earningsSection.quantityUnit", { count: ex.sales });
              return (
                <div key={idx} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{countLabel}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold">{planLabel}</span>
                  </div>
                  <div className="space-y-1 text-sm mb-4">
                    <div className="flex justify-between text-gray-500 dark:text-gray-400">
                      <span>{t("earningsSection.price")}</span><span>{ex.price}</span>
                    </div>
                    <div className="flex justify-between text-gray-500 dark:text-gray-400">
                      <span>{t("earningsSection.quantity")}</span><span>{countLabel}</span>
                    </div>
                    <div className="flex justify-between text-gray-500 dark:text-gray-400">
                      <span>{t("earningsSection.totalRevenue")}</span><span>${total}</span>
                    </div>
                    <div className="flex justify-between text-gray-400 dark:text-gray-600 text-xs">
                      <span>{t("earningsSection.platformFee", { pct: Math.round((1 - ex.share) * 100) })}</span>
                      <span>-${(parseFloat(total) * (1 - ex.share)).toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-between items-baseline">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("earningsSection.myRevenue")}</span>
                    <span className="text-2xl font-black text-green-600 dark:text-green-400">${net}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <SectionTitle title={t("stepsSection.title")} subtitle={t("stepsSection.subtitle")} className="mb-10" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {steps.map((s) => (
            <div key={s.step} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{s.icon}</span>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2.5 py-1 rounded-full">
                  STEP {s.step}
                </span>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">{s.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-10 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">{t("cta.title")}</h2>
          <p className="text-indigo-100 mb-2 max-w-md mx-auto">{t("cta.desc")}</p>
          <p className="text-indigo-200 text-sm mb-8 max-w-md mx-auto">{t("cta.desc2")}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button href={`${lp}/sell/new`} variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-indigo-600">
              {t("cta.startFree")}
            </Button>
            <Link
              href={`${lp}/pricing`}
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-semibold bg-white/20 text-white hover:bg-white/30 transition"
            >
              {t("cta.comparePlans")}
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
