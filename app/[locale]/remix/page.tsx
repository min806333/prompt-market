import type { Metadata } from "next";
import { prompts } from "@/lib/data/mockData";
import RemixClient from "@/components/remix/RemixClient";

export const metadata: Metadata = {
  title: "프롬프트 리믹스 | Promto",
  description: "기존 프롬프트를 파라미터로 수정해 나만의 프롬프트를 만드세요.",
};

interface Props {
  searchParams: Promise<{ promptId?: string }>;
}

export default async function RemixPage({ searchParams }: Props) {
  const { promptId } = await searchParams;
  const basePrompt = promptId ? prompts.find((p) => p.id === promptId) ?? null : null;
  const allPrompts = prompts.filter((p) => p.status === "approved");

  return (
    <div className="py-10">
      <RemixClient basePrompt={basePrompt} allPrompts={allPrompts} />
    </div>
  );
}
