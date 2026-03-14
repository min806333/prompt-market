import { categories, getFeaturedProducts, testimonials } from "@/lib/data/mockData";
import HeroSection from "@/components/home/HeroSection";
import CategorySection from "@/components/home/CategorySection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import SamplePreviewSection from "@/components/home/SamplePreviewSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";

export default function HomePage() {
  const featuredProducts = getFeaturedProducts();

  return (
    <>
      <HeroSection />
      <CategorySection categories={categories} />
      <FeaturedProducts products={featuredProducts} />
      <SamplePreviewSection />
      <TestimonialsSection testimonials={testimonials} />
      <CTASection />
    </>
  );
}
