'use client';
import { useFrames } from '@/hooks/useFrames';
import ProductCard from '@/components/products/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export default function FeaturedProducts() {
  const { t } = useLanguage();
  const { data, isLoading } = useFrames({ featured: true, limit: 8 });
  const frames = data?.data ?? [];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold text-gray-900">{t.home.featuredProducts}</h2>
          <Link href="/products" className={buttonVariants({ variant: 'outline' })}>{t.home.viewAll}</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-xl" />)
            : frames.map((frame) => <ProductCard key={frame._id} frame={frame} />)}
        </div>
      </div>
    </section>
  );
}
