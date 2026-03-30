import { createServiceClient } from "@/lib/supabase/service";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = { title: "관리자 대시보드 — Promto Admin" };

// ── SVG 아이콘 ──────────────────────────────────────────────
const IconUsers = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M17 20h5v-2a4 4 0 00-5-5M9 20H4v-2a4 4 0 015-5m0 0a4 4 0 118 0m-8 0a4 4 0 000-8" />
  </svg>
);
const IconPalette = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
  </svg>
);
const IconDocument = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);
const IconCreditCard = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);
const IconCurrencyDollar = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const IconFlag = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
  </svg>
);
const IconClock = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const IconChartBar = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);
const IconChat = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

function StatCard({
  icon,
  label,
  value,
  sub,
  highlight,
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  highlight?: "red" | "orange" | "green";
}) {
  const hl = {
    red: "border-l-red-500",
    orange: "border-l-orange-500",
    green: "border-l-green-500",
  };
  return (
    <div
      className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 border-l-4 ${highlight ? hl[highlight] : "border-l-indigo-500"} p-6`}
    >
      <div className="text-gray-400 dark:text-gray-500 mb-3">{icon}</div>
      <div className="text-3xl font-black text-gray-900 dark:text-white tabular-nums">{value}</div>
      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">{label}</div>
      {sub && <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{sub}</div>}
    </div>
  );
}

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const lp = locale === "ko" ? "" : `/${locale}`;

  // Server-side admin role verification
  const client = await createClient();
  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    redirect(`${lp}/auth/login`);
  }

  const { data: profile } = await client
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    redirect(lp || "/");
  }

  const sb = createServiceClient();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    { count: userCount },
    { count: productCount },
    { count: orderCount },
    { count: pendingReports },
    { count: pendingProducts },
    { count: todayOrders },
    { data: revenueRows },
    { count: creatorCount },
    { count: openTickets },
  ] = await Promise.all([
    sb.from("profiles").select("*", { count: "exact", head: true }),
    sb.from("products").select("*", { count: "exact", head: true }),
    sb.from("orders").select("*", { count: "exact", head: true }).eq("payment_status", "completed"),
    sb.from("reports").select("*", { count: "exact", head: true }).eq("status", "pending"),
    sb.from("products").select("*", { count: "exact", head: true }).eq("status", "pending"),
    sb
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("payment_status", "completed")
      .gte("created_at", today.toISOString()),
    sb.from("orders").select("amount").eq("payment_status", "completed"),
    sb.from("creators").select("*", { count: "exact", head: true }),
    sb.from("support_tickets").select("*", { count: "exact", head: true }).eq("status", "open"),
  ]);

  const totalRevenue =
    revenueRows?.reduce((s, r) => s + (Number(r.amount) || 0), 0) ?? 0;

  const menuItems = [
    { href: `${lp}/admin/reports?status=pending`, label: "신고 처리", badge: pendingReports, color: "text-red-600" },
    { href: `${lp}/admin/products?status=pending`, label: "프롬프트 승인", badge: pendingProducts, color: "text-orange-600" },
    { href: `${lp}/admin/support`, label: "고객 문의", badge: openTickets, color: "text-teal-600" },
    { href: `${lp}/admin/users`, label: "사용자 관리", badge: null, color: "text-blue-600" },
    { href: `${lp}/admin/orders`, label: "주문 조회", badge: null, color: "text-green-600" },
    { href: `${lp}/admin/announcements`, label: "공지 작성", badge: null, color: "text-indigo-600" },
    { href: `${lp}/admin/products`, label: "전체 프롬프트", badge: null, color: "text-purple-600" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">관리자 대시보드</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          플랫폼 전체 현황을 한눈에 확인하세요.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard icon={<IconUsers />} label="전체 사용자" value={userCount ?? 0} />
        <StatCard icon={<IconPalette />} label="크리에이터" value={creatorCount ?? 0} />
        <StatCard icon={<IconDocument />} label="전체 프롬프트" value={productCount ?? 0} />
        <StatCard
          icon={<IconCreditCard />}
          label="완료 주문"
          value={orderCount ?? 0}
          sub={`오늘 ${todayOrders ?? 0}건`}
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          icon={<IconCurrencyDollar />}
          label="총 수익"
          value={`$${totalRevenue.toFixed(2)}`}
          sub="누적 결제 합산"
        />
        <StatCard
          icon={<IconFlag />}
          label="미처리 신고"
          value={pendingReports ?? 0}
          sub={pendingReports ? "처리 필요" : "모두 처리됨"}
          highlight={pendingReports ? "red" : "green"}
        />
        <StatCard
          icon={<IconClock />}
          label="승인 대기 프롬프트"
          value={pendingProducts ?? 0}
          sub={pendingProducts ? "검토 필요" : "대기 없음"}
          highlight={pendingProducts ? "orange" : "green"}
        />
        <StatCard
          icon={<IconChartBar />}
          label="플랫폼 수익 (30%)"
          value={`$${(totalRevenue * 0.3).toFixed(2)}`}
          sub="추정치"
        />
        <StatCard
          icon={<IconChat />}
          label="미처리 고객 문의"
          value={openTickets ?? 0}
          sub={openTickets ? "답변 필요" : "모두 처리됨"}
          highlight={openTickets ? "orange" : "green"}
        />
      </div>

      <div className="mt-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">빠른 관리 메뉴</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {menuItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors group"
            >
              <span className={`text-sm font-medium ${item.color}`}>{item.label}</span>
              {item.badge != null && item.badge > 0 && (
                <span className="text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
