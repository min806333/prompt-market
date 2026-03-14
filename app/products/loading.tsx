import Container from "@/components/layout/Container";
import ProductGridSkeleton from "@/components/product/ProductGridSkeleton";
import Skeleton from "@/components/ui/Skeleton";

export default function ProductsLoading() {
  return (
    <div className="py-10">
      <Container>
        <div className="mb-8">
          <Skeleton className="h-9 w-40 mb-2" />
          <Skeleton className="h-5 w-24" />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-24 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>
        <ProductGridSkeleton count={6} />
      </Container>
    </div>
  );
}
