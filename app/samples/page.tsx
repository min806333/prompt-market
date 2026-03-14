import type { Metadata } from "next";
import { products } from "@/lib/data/mockData";
import SamplesClient from "@/components/home/SamplesClient";

export const metadata: Metadata = {
  title: "무료 샘플",
  description: "AI 프롬프트 무료 샘플 5종을 이메일 등록 후 즉시 받아보세요",
};

export default function SamplesPage() {
  const freeProduct = products.find((p) => p.isFree)!;
  const relatedProducts = products.filter(
    (p) => !p.isFree && p.category?.slug === freeProduct.category?.slug
  ).slice(0, 2);

  return <SamplesClient freeProduct={freeProduct} relatedProducts={relatedProducts} />;
}
