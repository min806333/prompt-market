import { createServiceClient } from "@/lib/supabase/service";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "관리자 대시보드 — Promto Admin" };

function StatCard({
  icon,
  label,
  value,
  sub,
  highlight,
}: {
  icon: string;
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
      <div className="text-2xl mb-3">{icon}</div>
      <div className="text-3xl font-black text-gray-900 dark:text-white tabular-nums">{value}</div>
      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">{label}</div>
      {sub && <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{sub}</div>}
    </div>
  );
}

export default async function AdminDashboardPage() {
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
  ]);

  const totalRevenue =
    revenueRows?.reduce((s, r) => s + (Number(r.amount) || 0), 0) ?? 0;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">관리자 대시보드</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          플랫폼 전체 현황을 한눈에 확인하세요.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard icon="👥" label="전체 사용자" value={userCount ?? 0} />
        <StatCard icon="🎨" label="크리에이터" value={creatorCount ?? 0} />
        <StatCard icon="📝" label="전체 프롬프트" value={productCount ?? 0} />
        <StatCard
          icon="💳"
          label="완료 주문"
          value={orderCount ?? 0}
          sub={`오늘 ${todayOrders ?? 0}건`}
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          icon="💰"
          label="총 수익"
          value={`$${totalRevenue.toFixed(2)}`}
          sub="누적 결제 합산"
        />
        <StatCard
          icon="🚨"
          label="미처리 신고"
          value={pendingReports ?? 0}
          sub={pendingReports ? "⚠️ 처리 필요" : "✅ 모두 처리됨"}
          highlight={pendingReports ? "red" : "green"}
        />
        <StatCard
          icon="⏳"
          label="승인 대기 프롬프트"
          value={pendingProducts ?? 0}
          sub={pendingProducts ? "⚠️ 검토 필요" : "✅ 대기 없음"}
          highlight={pendingProducts ? "orange" : "green"}
        />
        <StatCard
          icon="📊"
          label="플랫폼 수익 (30%)"
          value={`$${(totalRevenue * 0.3).toFixed(2)}`}
          sub="추정치"
        />
      </div>

      <div className="mt-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">빠른 관리 메뉴</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { href: "/admin/reports?status=pending", label: "신고 처리", badge: pendingReports, icon: "🚨", color: "text-red-600" },
            { href: "/admin/products?status=pending", label: "프롬프트 승인", badge: pendingProducts, icon: "⏳", color: "text-orange-600" },
            { href: "/admin/users", label: "사용자 관리", badge: null, icon: "👥", color: "text-blue-600" },
            { href: "/admin/orders", label: "주문 조회", badge: null, icon: "💳", color: "text-green-600" },
            { href: "/admin/announcements", label: "공지 작성", badge: null, icon: "📢", color: "text-indigo-600" },
            { href: "/admin/products", label: "전체 프롬프트", badge: null, icon: "📝", color: "text-purple-600" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">{item.icon}</span>
                <span className={`text-sm font-medium ${item.color}`}>{item.label}</span>
              </div>
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
