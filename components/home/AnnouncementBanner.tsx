"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import type { Announcement } from "@/types";

interface AnnouncementBannerProps {
  announcement: Announcement;
}

const categoryColor: Record<string, string> = {
  notice: "bg-blue-600",
  update: "bg-green-600",
  event: "bg-orange-600",
};

export default function AnnouncementBanner({ announcement }: AnnouncementBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const t = useTranslations("announcement");

  useEffect(() => {
    const key = `ann-dismissed-${announcement.id}`;
    if (typeof window !== "undefined" && localStorage.getItem(key)) {
      setDismissed(true);
    }
  }, [announcement.id]);

  function dismiss() {
    const key = `ann-dismissed-${announcement.id}`;
    localStorage.setItem(key, "1");
    setDismissed(true);
  }

  if (dismissed) return null;

  const bgColor = categoryColor[announcement.category] ?? "bg-blue-600";
  const categoryLabel = t(announcement.category as "notice" | "update" | "event");

  return (
    <div className={`${bgColor} text-white text-sm`}>
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-3">
        <span className="shrink-0 font-bold text-xs bg-white/20 px-2 py-0.5 rounded-full">
          {categoryLabel}
        </span>
        <Link
          href={`/announcements/${announcement.slug}`}
          className="flex-1 truncate hover:underline"
        >
          {announcement.title}
        </Link>
        <button
          onClick={dismiss}
          aria-label={t("close")}
          className="shrink-0 hover:opacity-70 transition-opacity"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
