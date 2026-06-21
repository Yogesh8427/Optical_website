'use client';
import { useMemo } from 'react';
import { useFrames } from '@/hooks/useFrames';
import ProductCard from '@/components/products/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { useOffers } from '@/hooks/useOffers';
import { motion } from 'framer-motion';

export default function FeaturedProducts() {
  const { t } = useLanguage();
  const { data, isLoading } = useFrames({ featured: true, limit: 8 });
  const frames = data?.data ?? [];
  const { data: offersData } = useOffers(true);
  const offerMap = useMemo(() => {
    const map = new Map();
    offersData?.data?.forEach((o: { productIds?: Array<{ _id?: string } | string>; discountType: string; discountValue: number }) => o.productIds?.forEach((p) => map.set((p as { _id?: string })._id ?? p, o)));
    return map;
  }, [offersData]);

  return (
    <section className="relative overflow-hidden py-20" style={{ background: 'linear-gradient(135deg, var(--theme-primary, #2563eb) 0%, color-mix(in srgb, var(--theme-primary, #2563eb) 60%, #000) 100%)' }}>
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="text-[10rem] md:text-[16rem] font-black text-white/5 whitespace-nowrap tracking-widest">
          FEATURED
        </span>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-white/60">
              Featured
            </span>
            <h2 className="mt-3 text-4xl md:text-5xl font-black text-white tracking-tight">
              {t.home.featuredProducts}
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1 border-2 border-white text-white font-bold px-5 py-2 rounded-xl hover:bg-white hover:text-slate-950 transition-colors shrink-0 text-sm"
          >
            {t.home.viewAll} &rarr;
          </Link>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-72 rounded-xl bg-slate-800" />
              ))
            : frames.map((frame, idx) => (
                <motion.div
                  key={frame._id}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.06 }}
                >
                  <ProductCard frame={frame} offer={offerMap.get(frame._id) ?? null} />
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
}

