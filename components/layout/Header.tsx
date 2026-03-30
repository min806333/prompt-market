"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import Container from "./Container";
import Button from "@/components/ui/Button";
import ThemeToggle from "@/components/ui/ThemeToggle";
import LanguageSelector from "@/components/ui/LanguageSelector";
import SearchBar from "./SearchBar";
import { useAuth } from "@/components/providers/AuthProvider";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const { user, loading, signOut, isAdmin } = useAuth();
  const router = useRouter();
  const t = useTranslations("nav");
  const tAuth = useTranslations("auth");
  const tHeader = useTranslations("header");
  const locale = useLocale();
  const lp = locale === "en" ? "/en" : "";

  const navItems = [
    { label: t("products"), href: `${lp}/products` },
    { label: t("leaderboard"), href: `${lp}/leaderboard` },
    { label: t("playground"), href: `${lp}/playground` },
    { label: t("builder"), href: `${lp}/builder` },
    { label: t("pricing"), href: `${lp}/pricing` },
    { label: t("sell"), href: `${lp}/sell` },
  ];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setProfileOpen(false);
    router.push(lp || "/");
    router.refresh();
  };

  const avatarLetter =
    user?.user_metadata?.full_name?.[0]?.toUpperCase() ??
    user?.email?.[0]?.toUpperCase() ??
    "U";

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
      <Container>
        {searchOpen ? (
          <div className="flex items-center h-16 gap-3">
            <SearchBar onClose={() => setSearchOpen(false)} />
          </div>
        ) : (
          <div className="flex items-center justify-between h-16">
            <Link href={lp || "/"} className="flex items-center gap-2 shrink-0">
              <svg className="w-5 h-5 text-indigo-500" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
              <span className="font-bold text-lg text-gray-900 dark:text-white">Promto</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setSearchOpen(true)}
                aria-label={tHeader("searchAriaLabel")}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>

              <ThemeToggle />
              <LanguageSelector />

              {!loading && (
                <div className="hidden md:flex items-center gap-2">
                  {user ? (
                    <div className="relative" ref={profileRef}>
                      <button
                        onClick={() => setProfileOpen(!profileOpen)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                          {avatarLetter}
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[100px] truncate">
                          {user.user_metadata?.full_name ?? user.email?.split("@")[0]}
                        </span>
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      {profileOpen && (
                        <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 py-2 z-50">
                          <div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-800">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                              {user.user_metadata?.full_name ?? tAuth("user")}
                            </p>
                            <p className="text-xs text-gray-400 truncate">{user.email}</p>
                          </div>
                          <Link
                            href={`${lp}/dashboard`}
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          >
                            {tAuth("mypage")}
                          </Link>
                          <Link
                            href={`${lp}/dashboard/purchases`}
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          >
                            {tAuth("purchaseHistory")}
                          </Link>
                          <Link
                            href={`${lp}/sell`}
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          >
                            {tAuth("myProducts")}
                          </Link>
                          <Link
                            href={`${lp}/dashboard/settings`}
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          >
                            {tAuth("settings")}
                          </Link>
                          {isAdmin && (
                            <Link
                              href={`${lp}/admin`}
                              onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                            >
                              {tAuth("admin")}
                            </Link>
                          )}
                          <div className="border-t border-gray-100 dark:border-gray-800 mt-1 pt-1">
                            <button
                              onClick={handleSignOut}
                              className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                              {tAuth("logout")}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <Button href={`${lp}/auth/login`} variant="outline" size="sm">
                        {tAuth("login")}
                      </Button>
                      <Button href={`${lp}/auth/signup`} size="sm">
                        {tAuth("signup")}
                      </Button>
                    </>
                  )}
                </div>
              )}

              <button
                className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={tHeader("menuAriaLabel")}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {menuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        )}

        {menuOpen && !searchOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 dark:border-gray-800 mt-1">
            <nav className="flex flex-col gap-1 pt-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-2 px-4 flex flex-col gap-2">
                {user ? (
                  <>
                    <Button
                      href={`${lp}/dashboard`}
                      size="sm"
                      variant="outline"
                      className="w-full justify-center"
                      onClick={() => setMenuOpen(false)}
                    >
                      {tAuth("mypage")}
                    </Button>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setMenuOpen(false);
                      }}
                      className="w-full py-2 text-sm text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      {tAuth("logout")}
                    </button>
                  </>
                ) : (
                  <>
                    <Button
                      href={`${lp}/auth/login`}
                      size="sm"
                      variant="outline"
                      className="w-full justify-center"
                      onClick={() => setMenuOpen(false)}
                    >
                      {tAuth("login")}
                    </Button>
                    <Button
                      href={`${lp}/auth/signup`}
                      size="sm"
                      className="w-full justify-center"
                      onClick={() => setMenuOpen(false)}
                    >
                      {tAuth("signup")}
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </Container>
    </header>
  );
}
