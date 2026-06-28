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
    <section className="py-6 md:py-20 bg-white relative overflow-hidden">
      {/* Background accent */}
      <div className="pointer-events-none select-none absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-64 rounded-full blur-3xl animate-breathe" style={{ background: 'color-mix(in srgb, var(--theme-primary,#2563eb) 6%, transparent)' }} />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section header */}
        <motion.div
          className="mb-5 md:mb-12 text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-xs font-black uppercase tracking-widest" style={{ color: 'var(--theme-primary)' }}>
            New Arrivals
          </span>
          <h2 className="mt-3 text-2xl md:text-5xl font-black text-slate-900 tracking-tight">
            Just Dropped
          </h2>
          <p className="mt-1 text-slate-500 text-sm md:text-lg">Fresh styles added to our collection</p>
        </motion.div>

        {/* Horizontal scroll on mobile, grid on desktop */}
        <div className="flex overflow-x-auto gap-4 pb-3 snap-x snap-mandatory [touch-action:pan-x] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-4 md:gap-5 md:overflow-visible md:pb-0">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-[140px] md:w-auto snap-start">
                  <Skeleton className="h-56 rounded-xl bg-slate-100" />
                </div>
              ))
            : frames.map((frame, idx) => (
                <motion.div
                  key={frame._id}
                  className="flex-shrink-0 w-[140px] md:w-auto snap-start"
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
