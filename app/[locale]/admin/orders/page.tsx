import type { Metadata } from "next";
import { createServiceClient } from "@/lib/supabase/service";
import AdminOrdersClient from "@/components/admin/AdminOrdersClient";

export const metadata: Metadata = { title: "주문 관리 — Promto Admin" };

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const sp = await searchParams;
  const status = sp.status ?? "all";
  const page = Math.max(1, parseInt(sp.page ?? "1"));
  const limit = 20;
  const offset = (page - 1) * limit;

  const sb = createServiceClient();
  let query = sb
    .from("orders")
    .select(
      `id, amount, payment_status, payment_method, created_at, download_count,
       user:user_id(email, display_name),
       product:product_id(title, slug)`,
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status !== "all") query = query.eq("payment_status", status);

  const { data, count } = await query;

  return (
    <AdminOrdersClient
      orders={(data ?? []) as any[]}
      total={count ?? 0}
      page={page}
      limit={limit}
      currentStatus={status}
    />
  );
}
