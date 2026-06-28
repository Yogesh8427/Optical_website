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
      <section className="py-6 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-5 md:mb-12 text-center">
            <span className="text-xs font-black uppercase tracking-widest" style={{ color: 'var(--theme-primary)' }}>
              Collections
            </span>
            <h2 className="mt-3 text-2xl md:text-5xl font-black text-slate-900 tracking-tight">Browse Categories</h2>
          </div>
          <div className="flex overflow-x-auto overflow-y-hidden gap-4 pb-3 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:pb-0">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-36 sm:w-44 md:w-auto h-32 sm:h-40 md:h-64 bg-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-6 md:py-20 bg-white relative overflow-hidden">
      <div className="pointer-events-none select-none absolute inset-0">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl animate-float-drift" style={{ background: 'color-mix(in srgb, var(--theme-primary,#2563eb) 7%, transparent)', animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full blur-3xl animate-breathe" style={{ background: 'color-mix(in srgb, var(--theme-primary,#2563eb) 5%, transparent)' }} />
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
            Collections
          </span>
          <h2 className="mt-3 text-2xl md:text-5xl font-black text-slate-900 tracking-tight">
            Browse Categories
          </h2>
          <p className="mt-1 text-slate-500 text-sm md:text-lg">{t.home.categorySubtitle}</p>
        </motion.div>

        {/* Horizontal scroll on mobile, 3-col grid on desktop */}
        <div className="flex overflow-x-auto overflow-y-hidden gap-4 pb-3 snap-x snap-mandatory [touch-action:pan-x] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:pb-0">
          {categories.map((cat, idx) => {
            const { icon: Icon } = categoryIcons[cat.slug] ?? fallbackIcon;
            return (
              <motion.div
                key={cat._id}
                className="flex-shrink-0 w-36 sm:w-44 md:w-auto snap-start"
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.07 }}
              >
                <Link
                  href={`/category/${cat.slug}`}
                  className="group relative flex flex-col overflow-hidden rounded-2xl h-32 sm:h-40 md:h-64 shadow-md hover:shadow-2xl transition-shadow duration-300"
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
                  <div className="absolute bottom-0 left-0 right-0 p-3 md:p-5">
                    <span className="text-white text-sm md:text-lg font-black leading-tight drop-shadow-lg">
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
