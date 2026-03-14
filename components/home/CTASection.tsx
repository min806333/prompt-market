"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/components/ui/ToastProvider";

export default function CTASection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const t = useTranslations("cta");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch("/api/email-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "cta" }),
      });
      if (res.ok) {
        setSubmitted(true);
        toast.success(t("successToast"));
      } else {
        toast.error(t("errorToast"));
      }
    } catch {
      toast.error(t("networkError"));
    } finally {
      setLoading(false);
      setEmail("");
    }
  }

  return (
    <section className="py-20 bg-gradient-to-br from-brand-600 to-brand-800 text-white">
      <Container>
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black mb-4">{t("title")}</h2>
          <p className="text-brand-100 mb-8 text-lg">{t("subtitle")}</p>

          {submitted ? (
            <div className="py-4 px-6 rounded-2xl bg-white/20 text-white font-semibold">
              {t("successMsg")}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder={t("emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-brand-200 focus:ring-white"
                required
              />
              <Button type="submit" variant="secondary" className="shrink-0" disabled={loading}>
                {loading ? t("subscribing") : t("subscribeBtn")}
              </Button>
            </form>
          )}
        </div>
      </Container>
    </section>
  );
}
