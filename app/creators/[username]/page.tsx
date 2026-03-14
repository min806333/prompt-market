import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Creator, Prompt } from "@/types";
import { prompts } from "@/lib/data/mockData";
import Container from "@/components/layout/Container";
import PromptCard from "@/components/marketplace/PromptCard";

const mockCreators: Creator[] = [
  {
    id: "creator-1",
    userId: "user-admin",
    username: "promto_official",
    displayName: "Promto Official",
    bio: "인디 크리에이터를 위한 최고의 AI 프롬프트를 제작합니다. 게임 음악, 기획서, 앱 소개문 전문.",
    websiteUrl: "https://promto.kr",
    socialLinks: {},
    totalSales: 494,
    totalRevenue: 5890,
    ratingAvg: 4.9,
    reviewCount: 150,
    followerCount: 320,
    isVerified: true,
    verifiedAt: "2024-11-01",
    createdAt: "2024-11-01T00:00:00Z",
  },
];

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const creator = mockCreators.find((c) => c.username === username);
  if (!creator) return {};
  return {
    title: `${creator.displayName} | Promto`,
    description: creator.bio ?? `${creator.displayName}의 AI 프롬프트 컬렉션`,
  };
}

export default async function CreatorProfilePage({ params }: Props) {
  const { username } = await params;
  const creator = mockCreators.find((c) => c.username === username);
  if (!creator) notFound();

  const creatorPrompts = prompts.filter(
    (p) => p.status === "approved"
  );

  return (
    <div className="py-10">
      <Container>
        {/* Profile header */}
        <div className="flex flex-col md:flex-row gap-6 mb-10 pb-10 border-b border-gray-100 dark:border-gray-800">
          <div className="w-20 h-20 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-3xl font-black shrink-0">
            {creator.displayName[0]}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-black text-gray-900 dark:text-white">{creator.displayName}</h1>
              {creator.isVerified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified Creator
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">@{creator.username}</p>
            {creator.bio && (
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4 max-w-xl">{creator.bio}</p>
            )}
            <div className="flex flex-wrap gap-4">
              {[
                { label: "총 판매", value: creator.totalSales.toLocaleString() },
                { label: "평균 평점", value: creator.ratingAvg.toFixed(1) + " ⭐" },
                { label: "후기 수", value: creator.reviewCount.toLocaleString() + "건" },
                { label: "팔로워", value: creator.followerCount.toLocaleString() + "명" },
              ].map((stat) => (
                <div key={stat.label} className="text-center px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                  <p className="text-lg font-black text-gray-900 dark:text-white">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Creator's prompts */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            프롬프트 컬렉션 ({creatorPrompts.length}개)
          </h2>
          {creatorPrompts.length === 0 ? (
            <p className="text-gray-400 text-sm">등록된 프롬프트가 없습니다.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {creatorPrompts.map((prompt) => (
                <PromptCard key={prompt.id} prompt={prompt} />
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
