"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Container from "@/components/layout/Container";

interface FaqItem {
  q: string;
  a: string;
}

interface FaqSection {
  category: string;
  items: FaqItem[];
}

interface ContactCard {
  title: string;
  desc: string;
  sub: string;
}

function FaqItemComponent({ q, a }: FaqItem) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-6 py-4 text-left"
      >
        <span className="font-medium text-gray-900 dark:text-white text-sm">{q}</span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform shrink-0 ml-4 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-6 pb-4 text-sm text-gray-500 dark:text-gray-400 leading-relaxed border-t border-gray-50 dark:border-gray-800 pt-3">
          {a}
        </div>
      )}
    </div>
  );
}

export default function SupportClient() {
  const t = useTranslations("support");
  const [submitted, setSubmitted] = useState(false);

  const faqSections = t.raw("faqSections") as FaqSection[];
  const contactCardKeys = ["email", "chat", "inquiry"] as const;
  const contactIcons = { email: "📧", chat: "💬", inquiry: "📋" };
  const contactHrefs = {
    email: "mailto:support@promto.kr",
    chat: "#contact",
    inquiry: "#contact",
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      category: (form.elements.namedItem("category") as HTMLSelectElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("failed");
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 6000);
      form.reset();
    } catch {
      alert(t("contactForm.error"));
    }
  };

  const categories = t.raw("contactForm.categories") as string[];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-16">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4">
              {t("title")}
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              {t("subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {contactCardKeys.map((key) => {
              const card = t.raw(`contactCards.${key}`) as ContactCard;
              return (
                <a
                  key={key}
                  href={contactHrefs[key]}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 text-center hover:shadow-md transition-shadow"
                >
                  <div className="text-4xl mb-3">{contactIcons[key]}</div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">{card.title}</h3>
                  <p className="text-indigo-600 dark:text-indigo-400 text-sm font-medium">{card.desc}</p>
                  <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
                </a>
              );
            })}
          </div>

          <div className="space-y-8 mb-16">
            {faqSections.map((section) => (
              <div key={section.category}>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-indigo-600 rounded-full inline-block" />
                  {section.category}
                </h2>
                <div className="space-y-3">
                  {section.items.map((item) => (
                    <FaqItemComponent key={item.q} q={item.q} a={item.a} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div
            id="contact"
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {t("contactForm.title")}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              {t("contactForm.desc")}
            </p>

            {submitted && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-sm text-green-700 dark:text-green-400">
                {t("contactForm.success")}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    {t("contactForm.nameLabel")}
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder={t("contactForm.namePlaceholder")}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    {t("contactForm.emailLabel")}
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="example@email.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  {t("contactForm.categoryLabel")}
                </label>
                <select
                  name="category"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm"
                >
                  {categories.map((cat) => (
                    <option key={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  {t("contactForm.messageLabel")}
                </label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder={t("contactForm.messagePlaceholder")}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors text-sm"
              >
                {t("contactForm.submit")}
              </button>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
}
