'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useCategories } from '@/hooks/useCategories';
import { Glasses, Sun, Monitor, Dumbbell, Baby, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const categoryIcons: Record<string, { icon: React.ElementType; color: string }> = {
  'mens-glasses':     { icon: Glasses,  color: 'text-slate-300' },
  'womens-glasses':   { icon: Sparkles, color: 'text-slate-300' },
  'kids-glasses':     { icon: Baby,     color: 'text-slate-300' },
  'sunglasses':       { icon: Sun,      color: 'text-slate-300' },
  'computer-glasses': { icon: Monitor,  color: 'text-slate-300' },
  'sports-eyewear':   { icon: Dumbbell, color: 'text-slate-300' },
};
const fallbackIcon = { icon: Glasses, color: 'text-slate-300' };

export default function CategoryGrid() {
  const { t, localize } = useLanguage();
  const { data, isLoading } = useCategories();
  // Only show top-level (parent) categories on home screen
  const categories = data?.data?.filter((c) => c.active && !c.parentId) ?? [];

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="text-xs font-black uppercase tracking-widest" style={{ color: 'var(--theme-primary)' }}>
              Collections
            </span>
            <h2 className="mt-3 text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Browse Categories</h2>
          </div>
          <div className="flex gap-5 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:overflow-visible">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-56 md:w-auto h-48 md:h-64 bg-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

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
            Collections
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Browse Categories
          </h2>
          <p className="mt-3 text-slate-500 text-lg">{t.home.categorySubtitle}</p>
        </motion.div>

        {/* Horizontal scroll on mobile, 3-col grid on desktop */}
        <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
          {categories.map((cat, idx) => {
            const { icon: Icon } = categoryIcons[cat.slug] ?? fallbackIcon;
            return (
              <motion.div
                key={cat._id}
                className="flex-shrink-0 w-56 md:w-auto snap-start"
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.07 }}
              >
                <Link
                  href={`/category/${cat.slug}`}
                  className="group relative flex flex-col overflow-hidden rounded-2xl h-48 md:h-64 shadow-md hover:shadow-2xl transition-shadow duration-300"
                >
                  {/* Image or icon */}
                  <div className="absolute inset-0 bg-slate-800">
                    {cat.image ? (
                      <Image
                        src={cat.image}
                        alt={localize(cat)}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-90"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Icon className="w-16 h-16 text-slate-500" />
                      </div>
                    )}
                  </div>

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                  {/* Label at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <span className="text-white text-lg font-black leading-tight drop-shadow-lg">
                      {localize(cat)}
                    </span>
                  </div>

                  {/* Hover accent line */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-1 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                    style={{ background: 'var(--theme-primary)' }}
                  />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
