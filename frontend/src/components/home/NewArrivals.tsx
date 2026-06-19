'use client';
import { useMemo } from 'react';
import { useFrames } from '@/hooks/useFrames';
import ProductCard from '@/components/products/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useOffers } from '@/hooks/useOffers';

export default function NewArrivals() {
  const { data, isLoading } = useFrames({ limit: 4 });
  const frames = data?.data ?? [];
  const { data: offersData } = useOffers(true);
  const offerMap = useMemo(() => {
    const map = new Map();
    offersData?.data?.forEach((o: { productIds?: Array<{ _id?: string } | string>; discountType: string; discountValue: number }) => o.productIds?.forEach((p) => map.set((p as { _id?: string })._id ?? p, o)));
    return map;
  }, [offersData]);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">New Arrivals</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-xl" />)
            : frames.map((frame) => <ProductCard key={frame._id} frame={frame} offer={offerMap.get(frame._id) ?? null} />)}
        </div>
      </div>
    </section>
  );
}
