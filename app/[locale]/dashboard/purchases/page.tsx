import type { Metadata } from "next";
import PurchasesClient from "@/components/dashboard/PurchasesClient";

export const metadata: Metadata = { title: "구매 내역" };

export default function PurchasesPage() {
  return <PurchasesClient />;
}
