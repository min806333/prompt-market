import type { Product } from "@/types";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
}

export default function ProductGrid({
  products,
  emptyMessage = "조건에 맞는 상품이 없습니다.",
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400 dark:text-gray-600">
        <p className="text-4xl mb-4">📭</p>
        <p className="text-lg font-medium">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
