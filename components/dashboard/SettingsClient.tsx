"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import Container from "@/components/layout/Container";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/ToastProvider";
import { useTranslations } from "next-intl";
import LanguageSelector from "@/components/ui/LanguageSelector";

export default function SettingsClient() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [notifNewProduct, setNotifNewProduct] = useState(true);
  const [notifEmail, setNotifEmail] = useState(false);
  const toast = useToast();
  const supabase = createClient();
  const t = useTranslations("dashboard");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
    if (user) {
      setDisplayName(user.user_metadata?.full_name ?? "");
      setEmail(user.email ?? "");
    }
  }, [user, loading, router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      toast.error(t("settings.nickname") + " required");
      return;
    }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ data: { full_name: displayName } });
    setSaving(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(t("settings.saved"));
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const handleDeleteAccount = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    const { error } = await supabase.rpc("delete_user_account");
    setDeleting(false);
    if (error) {
      toast.error(error.message);
      setConfirmDelete(false);
    } else {
      await signOut();
      toast.success("Account deleted.");
      router.push("/");
    }
  };

  if (loading) return null;
  if (!user) return null;

  return (
    <Container className="py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/dashboard"
            className="text-sm text-gray-500 hover:text-brand-600 dark:hover:text-brand-400 flex items-center gap-1"
          >
            ← {t("tabs.overview")}
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("tabs.settings")}</h1>
        </div>

        <div className="space-y-6">
          {/* Profile */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t("settings.title")}</h2>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  {t("settings.nickname")}
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  {t("settings.email")}
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                />
                <p className="text-xs text-gray-400 mt-1">{t("settings.emailHint")}</p>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-medium hover:bg-brand-700 disabled:opacity-50 transition-colors"
              >
                {saving ? t("settings.saving") : t("settings.save")}
              </button>
            </form>
          </div>

          {/* Payment Info */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t("settings.payment")}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t("settings.paymentDesc")}</p>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <span className="text-2xl">💳</span>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{t("settings.noPayment")}</p>
                <p className="text-xs text-gray-400">{t("settings.noPaymentDesc")}</p>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t("settings.notifications")}</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{t("settings.notifNewProduct")}</p>
                  <p className="text-xs text-gray-400">{t("settings.notifNewProductDesc")}</p>
                </div>
                <label className="relative cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifNewProduct}
                    onChange={(e) => setNotifNewProduct(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 rounded-full bg-gray-200 dark:bg-gray-700 peer-checked:bg-indigo-600 transition-colors relative">
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${notifNewProduct ? "translate-x-5" : "translate-x-1"}`} />
                  </div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{t("settings.notifEmail")}</p>
                  <p className="text-xs text-gray-400">{t("settings.notifEmailDesc")}</p>
                </div>
                <label className="relative cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifEmail}
                    onChange={(e) => setNotifEmail(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 rounded-full bg-gray-200 dark:bg-gray-700 peer-checked:bg-indigo-600 transition-colors relative">
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${notifEmail ? "translate-x-5" : "translate-x-1"}`} />
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Language */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t("settings.language")}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t("settings.languageDesc")}</p>
            <LanguageSelector />
          </div>

          {/* Appearance */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t("settings.theme")}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t("settings.themeDesc")}</p>
            <button
              onClick={() => document.documentElement.classList.toggle("dark")}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
            >
              <span>🌓</span> {t("settings.themeLabel")}
            </button>
          </div>

          {/* Account Management */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t("settings.dangerZone")}</h2>
            <div className="space-y-3">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
              >
                <span>🚪</span> {t("settings.signOut")}
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-colors disabled:opacity-50 ${
                  confirmDelete
                    ? "border-red-400 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400"
                    : "border-gray-200 dark:border-gray-700 text-gray-500 hover:border-red-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                }`}
              >
                <span>⚠️</span>
                {confirmDelete
                  ? deleting
                    ? t("settings.deleting")
                    : t("settings.confirmDelete")
                  : t("settings.deleteAccount")}
              </button>
              {confirmDelete && (
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="w-full px-4 py-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  {t("settings.cancelDelete")}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
