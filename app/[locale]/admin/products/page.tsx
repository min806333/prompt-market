import type { Metadata } from "next";
import { createServiceClient } from "@/lib/supabase/service";
import AdminProductsClient from "@/components/admin/AdminProductsClient";

export const metadata: Metadata = { title: "프롬프트 관리 — Promto Admin" };

export default async function AdminProductsPage({
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
    .from("products")
    .select(
      `id, title, slug, price, status, is_featured, is_free, sales_count, created_at,
       creator:creator_id(display_name, username)`,
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status !== "all") query = query.eq("status", status);

  const { data, count } = await query;

  return (
    <AdminProductsClient
      products={(data ?? []) as any[]}
      total={count ?? 0}
      page={page}
      limit={limit}
      currentStatus={status}
    />
  );
}
