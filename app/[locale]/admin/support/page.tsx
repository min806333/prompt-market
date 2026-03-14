import type { Metadata } from "next";
import { createServiceClient } from "@/lib/supabase/service";
import AdminSupportClient from "@/components/admin/AdminSupportClient";
import Link from "next/link";

export const metadata: Metadata = { title: "고객 문의 관리 — Promto Admin" };

export default async function AdminSupportPage() {
  const sb = createServiceClient();
  const { data: tickets } = await sb
    .from("support_tickets")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin"
          className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          ← 관리자 홈
        </Link>
      </div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">고객 문의 관리</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          고객센터 문의 및 법적 문의를 처리합니다.
        </p>
      </div>
      <AdminSupportClient initialTickets={tickets ?? []} />
    </div>
  );
}
