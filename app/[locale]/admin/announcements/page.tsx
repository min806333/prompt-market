import type { Metadata } from "next";
import { createServiceClient } from "@/lib/supabase/service";
import AdminAnnouncementsClient from "@/components/admin/AdminAnnouncementsClient";

export const metadata: Metadata = { title: "공지사항 관리 — Promto Admin" };

export default async function AdminAnnouncementsPage() {
  const sb = createServiceClient();
  const { data } = await sb
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false });

  return <AdminAnnouncementsClient announcements={(data ?? []) as any[]} />;
}
