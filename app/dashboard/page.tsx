import type { Metadata } from "next";
import DashboardClient from "@/components/dashboard/DashboardClient";

export const metadata: Metadata = { title: "마이페이지" };

export default function DashboardPage() {
  return <DashboardClient />;
}
