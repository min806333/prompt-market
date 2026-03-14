import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const prefix = locale === "en" ? "/en" : "";

  if (!user) {
    redirect(`${prefix}/auth/login?redirectTo=${prefix}/admin`);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect(prefix || "/");
  }

  return (
    <div className="flex" style={{ minHeight: "calc(100vh - 64px)" }}>
      <AdminSidebar locale={locale} />
      <main className="flex-1 min-w-0 overflow-auto bg-gray-50 dark:bg-gray-950">
        {children}
      </main>
    </div>
  );
}
