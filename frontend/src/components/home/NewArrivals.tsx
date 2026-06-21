'use client';
import { useMemo } from 'react';
import { useFrames } from '@/hooks/useFrames';
import ProductCard from '@/components/products/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useOffers } from '@/hooks/useOffers';
import { motion } from 'framer-motion';

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
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-xs font-black uppercase tracking-widest" style={{ color: 'var(--theme-primary)' }}>
            New Arrivals
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Just Dropped
          </h2>
          <p className="mt-3 text-slate-500 text-lg">Fresh styles added to our collection</p>
        </motion.div>

        {/* Grid with stagger */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-72 rounded-xl bg-slate-100" />
              ))
            : frames.map((frame, idx) => (
                <motion.div
                  key={frame._id}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: idx * 0.08 }}
                >
                  <ProductCard frame={frame} offer={offerMap.get(frame._id) ?? null} />
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
}
