import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import Container from "./Container";

export default function Footer() {
  const t = useTranslations("footer");
  const tLegal = useTranslations("legal");
  const locale = useLocale();
  const lp = locale === "en" ? "/en" : "";

  const footerLinks = [
    {
      title: t("sections.market"),
      links: [
        { label: t("links.allProducts"), href: `${lp}/products` },
        { label: t("links.leaderboard"), href: `${lp}/leaderboard` },
        { label: t("links.gameDevPack"), href: `${lp}/collections/game-dev` },
        { label: t("links.freeSamples"), href: `${lp}/samples` },
      ],
    },
    {
      title: t("sections.services"),
      links: [
        { label: t("links.playground"), href: `${lp}/playground` },
        { label: t("links.builder"), href: `${lp}/builder` },
        { label: t("links.sell"), href: `${lp}/sell` },
        { label: t("links.pricing"), href: `${lp}/pricing` },
      ],
    },
    {
      title: t("sections.info"),
      links: [
        { label: t("links.announcements"), href: `${lp}/announcements` },
        { label: t("links.mypage"), href: `${lp}/dashboard` },
        { label: t("links.support"), href: `${lp}/support` },
      ],
    },
    {
      title: t("sections.legal"),
      links: [
        { label: tLegal("terms"), href: `${lp}/legal/terms` },
        { label: tLegal("privacy"), href: `${lp}/legal/privacy` },
        { label: tLegal("refund"), href: `${lp}/legal/refund` },
        { label: tLegal("content"), href: `${lp}/legal/content` },
        { label: tLegal("copyright"), href: `${lp}/legal/copyright` },
        { label: tLegal("cookie"), href: `${lp}/legal/cookie` },
        { label: tLegal("dmca"), href: `${lp}/legal/dmca` },
      ],
    },
  ];

  return (
    <footer className="bg-gray-950 text-gray-400 mt-24">
      <Container>
        <div className="py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10">
          <div className="md:col-span-1">
            <Link href={lp || "/"} className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-indigo-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
              <span className="font-bold text-lg text-white">Promto</span>
            </Link>
            <p className="text-sm leading-relaxed">
              {t("tagline")}
              <br />
              {t("taglineSub")}
            </p>
          </div>
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-white mb-3">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-800 py-6 text-center text-xs">
          © {new Date().getFullYear()} PromptMarket. {t("copyright")}
        </div>
      </Container>
    </footer>
  );
}
