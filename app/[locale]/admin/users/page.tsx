import type { Metadata } from "next";
import { createServiceClient } from "@/lib/supabase/service";
import AdminUsersClient from "@/components/admin/AdminUsersClient";

export const metadata: Metadata = { title: "사용자 관리 — Promto Admin" };

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const sp = await searchParams;
  const role = sp.role ?? "all";
  const page = Math.max(1, parseInt(sp.page ?? "1"));
  const limit = 20;
  const offset = (page - 1) * limit;

  const sb = createServiceClient();
  let query = sb
    .from("profiles")
    .select("id, email, display_name, role, subscription_status, created_at", {
      count: "exact",
    })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (role !== "all") query = query.eq("role", role);

  const { data, count } = await query;

  return (
    <AdminUsersClient
      users={(data ?? []) as any[]}
      total={count ?? 0}
      page={page}
      limit={limit}
      currentRole={role}
    />
  );
}
