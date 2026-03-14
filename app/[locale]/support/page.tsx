import type { Metadata } from "next";
import SupportClient from "@/components/support/SupportClient";

export const metadata: Metadata = {
  title: "고객센터 — PromptMarket",
  description: "PromptMarket 고객센터입니다. 자주 묻는 질문과 문의 방법을 확인하세요.",
};

export default function SupportPage() {
  return <SupportClient />;
}
