import type { Metadata } from "next";
import { createServiceClient } from "@/lib/supabase/service";
import AdminReportsClient from "@/components/admin/AdminReportsClient";

export const metadata: Metadata = { title: "신고 관리 — Promto Admin" };

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const sp = await searchParams;
  const status = sp.status ?? "pending";
  const page = Math.max(1, parseInt(sp.page ?? "1"));
  const limit = 20;
  const offset = (page - 1) * limit;

  const sb = createServiceClient();
  let query = sb
    .from("reports")
    .select(
      `id, report_type, description, status, created_at,
       reporter:reporter_id(email, display_name),
       prompt:prompt_id(id, title, slug, status)`,
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status !== "all") query = query.eq("status", status);

  const { data, count } = await query;

  return (
    <AdminReportsClient
      reports={(data ?? []) as any[]}
      total={count ?? 0}
      page={page}
      limit={limit}
      currentStatus={status}
    />
  );
}
