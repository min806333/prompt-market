import Link from "next/link";
import { useTranslations } from "next-intl";
import Container from "./Container";

export default function Footer() {
  const t = useTranslations("footer");
  const tLegal = useTranslations("legal");

  const footerLinks = [
    {
      title: t("sections.market"),
      links: [
        { label: t("links.allProducts"), href: "/products" },
        { label: t("links.leaderboard"), href: "/leaderboard" },
        { label: t("links.gameDevPack"), href: "/collections/game-dev" },
        { label: t("links.freeSamples"), href: "/samples" },
      ],
    },
    {
      title: t("sections.services"),
      links: [
        { label: t("links.playground"), href: "/playground" },
        { label: t("links.builder"), href: "/builder" },
        { label: t("links.sell"), href: "/sell" },
        { label: t("links.pricing"), href: "/pricing" },
      ],
    },
    {
      title: t("sections.info"),
      links: [
        { label: t("links.announcements"), href: "/announcements" },
        { label: t("links.mypage"), href: "/dashboard" },
        { label: t("links.support"), href: "/support" },
      ],
    },
    {
      title: t("sections.legal"),
      links: [
        { label: tLegal("terms"), href: "/legal/terms" },
        { label: tLegal("privacy"), href: "/legal/privacy" },
        { label: tLegal("refund"), href: "/legal/refund" },
        { label: tLegal("content"), href: "/legal/content" },
        { label: tLegal("copyright"), href: "/legal/copyright" },
        { label: tLegal("cookie"), href: "/legal/cookie" },
        { label: tLegal("dmca"), href: "/legal/dmca" },
      ],
    },
  ];

  return (
    <footer className="bg-gray-950 text-gray-400 mt-24">
      <Container>
        <div className="py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <span className="text-2xl">⚡</span>
              <span className="font-bold text-lg text-white">PromptMarket</span>
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
