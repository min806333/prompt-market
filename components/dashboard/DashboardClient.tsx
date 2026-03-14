"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/ToastProvider";
import { useTranslations, useLocale } from "next-intl";

type Tab = "overview" | "purchases" | "selling" | "settings";

export default function DashboardClient() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const locale = useLocale();
  const lp = locale === "en" ? "/en" : "";
  const [tab, setTab] = useState<Tab>("overview");
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  const supabase = createClient();
  const t = useTranslations("dashboard");

  useEffect(() => {
    if (!loading && !user) {
      router.push(`${lp}/auth/login`);
    }
    if (user) {
      setDisplayName(user.user_metadata?.full_name ?? "");
    }
  }, [user, loading, router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.auth.updateUser({
      data: { full_name: displayName },
    });
    setSaving(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(t("settings.saved"));
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push(lp || "/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const avatarLetter =
    user.user_metadata?.full_name?.[0]?.toUpperCase() ??
    user.email?.[0]?.toUpperCase() ??
    "U";

  const userName = user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "User";

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "overview", label: t("tabs.overview"), icon: "🏠" },
    { id: "purchases", label: t("tabs.purchases"), icon: "📦" },
    { id: "selling", label: t("tabs.selling"), icon: "💰" },
    { id: "settings", label: t("tabs.settings"), icon: "⚙️" },
  ];

  return (
    <div className="py-10 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <Container>
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64 shrink-0">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 mb-4">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold mb-3">
                  {avatarLetter}
                </div>
                <p className="font-semibold text-gray-900 dark:text-white">{userName}</p>
                <p className="text-xs text-gray-400 mt-1 truncate w-full">{user.email}</p>
                <span className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                  {t("plan.free")}
                </span>
              </div>
            </div>

            <nav className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
              {tabs.map((tabItem) => (
                <button
                  key={tabItem.id}
                  onClick={() => setTab(tabItem.id)}
                  className={`flex items-center gap-3 w-full px-5 py-3.5 text-sm font-medium transition-colors ${
                    tab === tabItem.id
                      ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <span>{tabItem.icon}</span>
                  {tabItem.label}
                </button>
              ))}
              <div className="border-t border-gray-100 dark:border-gray-800">
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 w-full px-5 py-3.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <span>🚪</span> {t("settings.signOut")}
                </button>
              </div>
            </nav>
          </aside>

          <div className="flex-1">
            {tab === "overview" && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t("greeting", { name: userName })}
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: t("stats.purchased"), value: "0", icon: "🛍️", color: "bg-blue-50 dark:bg-blue-900/20" },
                    { label: t("stats.selling"), value: "0", icon: "💰", color: "bg-green-50 dark:bg-green-900/20" },
                    { label: t("stats.subscription"), value: t("plan.free"), icon: "⭐", color: "bg-yellow-50 dark:bg-yellow-900/20" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className={`${stat.color} rounded-2xl border border-gray-100 dark:border-gray-800 p-6 text-center`}
                    >
                      <p className="text-3xl mb-2">{stat.icon}</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                  <h2 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">
                    {t("quickMenu")}
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    <Button href={`${lp}/products`} variant="outline" className="justify-center">
                      {t("browseProducts")}
                    </Button>
                    <Button href={`${lp}/sell`} className="justify-center">
                      {t("startSelling")}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {tab === "purchases" && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                <h2 className="font-bold text-xl mb-6 text-gray-900 dark:text-white">
                  {t("purchases.title")}
                </h2>
                <div className="text-center py-16">
                  <p className="text-4xl mb-4">📦</p>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">{t("purchases.empty")}</p>
                  <Button href="/products">{t("purchases.browse")}</Button>
                </div>
              </div>
            )}

            {tab === "selling" && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-bold text-xl text-gray-900 dark:text-white">
                    {t("selling.title")}
                  </h2>
                  <Button href="/sell/new" size="sm">{t("selling.addNew")}</Button>
                </div>
                <div className="text-center py-16">
                  <p className="text-4xl mb-4">💰</p>
                  <p className="text-gray-500 dark:text-gray-400 mb-6 whitespace-pre-line">
                    {t("selling.empty")}
                  </p>
                  <Button href="/sell/new">{t("selling.addFirst")}</Button>
                </div>
              </div>
            )}

            {tab === "settings" && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                  <h2 className="font-bold text-xl mb-6 text-gray-900 dark:text-white">
                    {t("settings.title")}
                  </h2>
                  <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4 max-w-md">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        {t("settings.nickname")}
                      </label>
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        {t("settings.email")}
                      </label>
                      <input
                        type="email"
                        value={user.email ?? ""}
                        disabled
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-400 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-400 mt-1">{t("settings.emailHint")}</p>
                    </div>
                    <Button type="submit" disabled={saving} className="w-fit">
                      {saving ? t("settings.saving") : t("settings.save")}
                    </Button>
                  </form>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                  <h2 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">
                    {t("settings.payment")}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {t("settings.paymentDesc")}
                  </p>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <span className="text-2xl">💳</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {t("settings.noPayment")}
                      </p>
                      <p className="text-xs text-gray-400">{t("settings.noPaymentDesc")}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                  <h2 className="font-bold text-xl mb-4 text-gray-900 dark:text-white">
                    {t("settings.notifications")}
                  </h2>
                  <div className="space-y-4">
                    {[
                      {
                        label: t("settings.notifNewProduct"),
                        desc: t("settings.notifNewProductDesc"),
                        defaultOn: true,
                      },
                      {
                        label: t("settings.notifEmail"),
                        desc: t("settings.notifEmailDesc"),
                        defaultOn: false,
                      },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                          <p className="text-xs text-gray-400">{item.desc}</p>
                        </div>
                        <label className="relative cursor-pointer">
                          <input type="checkbox" defaultChecked={item.defaultOn} className="sr-only peer" />
                          <div className="w-10 h-6 rounded-full bg-gray-200 dark:bg-gray-700 peer-checked:bg-indigo-600 transition-colors">
                            <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                  <h2 className="font-bold text-xl mb-4 text-gray-900 dark:text-white">
                    {t("settings.theme")}
                  </h2>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{t("settings.themeLabel")}</p>
                      <p className="text-xs text-gray-400">{t("settings.themeDesc")}</p>
                    </div>
                    <Link
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        document.documentElement.classList.toggle("dark");
                      }}
                      className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      Toggle
                    </Link>
                  </div>
                </div>

                <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/30 p-6">
                  <h2 className="font-bold text-lg mb-2 text-red-700 dark:text-red-400">
                    {t("settings.dangerZone")}
                  </h2>
                  <p className="text-sm text-red-600/80 dark:text-red-400/70 mb-4">
                    {t("settings.deleteAccount")}
                  </p>
                  <button
                    onClick={() => toast.error("Please contact support to delete your account.")}
                    className="px-4 py-2 text-sm font-medium text-red-700 dark:text-red-400 border border-red-300 dark:border-red-700 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  >
                    {t("settings.deleteAccount")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
