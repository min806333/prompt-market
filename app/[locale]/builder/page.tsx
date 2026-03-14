import type { Metadata } from "next";
import PromptBuilderClient from "@/components/builder/PromptBuilderClient";

export const metadata: Metadata = {
  title: "프롬프트 빌더 | Promto",
  description: "AI에게 최적화된 프롬프트를 구조화된 입력으로 쉽게 생성하세요.",
};

export default function PromptBuilderPage() {
  return (
    <div className="py-10">
      <PromptBuilderClient />
    </div>
  );
}
