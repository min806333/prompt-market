import type { Metadata } from "next";
import { prompts } from "@/lib/data/mockData";
import PlaygroundClient from "@/components/playground/PlaygroundClient";

export const metadata: Metadata = {
  title: "프롬프트 테스트 | Promto",
  description: "구매 전 AI 프롬프트를 직접 테스트해보세요. 하루 3회 무료 체험.",
};

interface Props {
  searchParams: Promise<{ promptId?: string }>;
}

export default async function PlaygroundPage({ searchParams }: Props) {
  const { promptId } = await searchParams;
  const selectedPrompt = promptId ? prompts.find((p) => p.id === promptId) ?? null : null;

  const textPrompts = prompts.filter(
    (p) => p.aiTools.some((t) => ["ChatGPT", "Claude"].includes(t)) && p.status === "approved"
  );

  return (
    <div className="py-10">
      <PlaygroundClient
        initialPrompt={selectedPrompt}
        availablePrompts={textPrompts}
      />
    </div>
  );
}
