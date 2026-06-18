'use client';
import { useFrames } from '@/hooks/useFrames';
import ProductCard from '@/components/products/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function NewArrivals() {
  const { data, isLoading } = useFrames({ limit: 4 });
  const frames = data?.data ?? [];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">New Arrivals</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-xl" />)
            : frames.map((frame) => <ProductCard key={frame._id} frame={frame} />)}
        </div>
      </div>
    </section>
  );
}
