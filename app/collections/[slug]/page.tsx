import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  collections,
  getCollection,
  getCollectionPrompts,
} from "@/lib/data/mockData";
import Container from "@/components/layout/Container";
import ProductGrid from "@/components/product/ProductGrid";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const col = getCollection(slug);
  if (!col) return {};
  return {
    title: `${col.title} — 컬렉션 | PromptMarket`,
    description: col.description,
  };
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();

  const items = getCollectionPrompts(collection);

  return (
    <div className="py-12">
      <Container>
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-gray-600 dark:hover:text-gray-300">홈</Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white">컬렉션</span>
          <span>/</span>
          <span className="text-gray-900 dark:text-white">{collection.title}</span>
        </nav>

        <div className="flex items-center gap-4 mb-8">
          <span className="text-5xl">{collection.icon}</span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {collection.title}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">{collection.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
          <span className="text-sm text-gray-400">{items.length}개 프롬프트</span>
        </div>

        {items.length > 0 ? (
          <ProductGrid products={items} />
        ) : (
          <p className="text-center text-gray-400 py-16">이 컬렉션에 아직 상품이 없습니다.</p>
        )}

        {/* Other collections */}
        <div className="mt-16">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">다른 컬렉션</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {collections
              .filter((c) => c.slug !== slug)
              .map((c) => (
                <Link
                  key={c.id}
                  href={`/collections/${c.slug}`}
                  className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 px-5 py-4 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors group"
                >
                  <span className="text-2xl">{c.icon}</span>
                  <div>
                    <p className="font-semibold text-sm text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {c.title}
                    </p>
                    <p className="text-xs text-gray-400 truncate max-w-[160px]">{c.description}</p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
