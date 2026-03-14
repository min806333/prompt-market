"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { path: "/admin", label: "대시보드", icon: "📊", exact: true },
  { path: "/admin/products", label: "프롬프트 관리", icon: "📝", exact: false },
  { path: "/admin/reports", label: "신고 관리", icon: "🚨", exact: false },
  { path: "/admin/users", label: "사용자 관리", icon: "👥", exact: false },
  { path: "/admin/orders", label: "주문 관리", icon: "💳", exact: false },
  { path: "/admin/announcements", label: "공지사항", icon: "📢", exact: false },
];

export default function AdminSidebar({ locale }: { locale: string }) {
  const pathname = usePathname();
  const prefix = locale === "en" ? "/en" : "";

  return (
    <aside className="w-56 shrink-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 sticky top-0 self-start h-screen overflow-y-auto">
      <div className="px-4 pt-6 pb-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-red-600 px-2.5 py-1 rounded-lg uppercase tracking-wider">
          <span>⚡</span> Admin
        </span>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">관리자 전용 패널</p>
      </div>

      <nav className="space-y-0.5 px-3 pb-4">
        {navItems.map(({ path, label, icon, exact }) => {
          const href = `${prefix}${path}`;
          const isActive = exact
            ? pathname === href
            : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={path}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              <span className="text-base leading-none">{icon}</span>
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-gray-100 dark:border-gray-800">
        <Link
          href={prefix || "/"}
          className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          사이트로 돌아가기
        </Link>
      </div>
    </aside>
  );
}
