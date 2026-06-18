'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useCategories } from '@/hooks/useCategories';
import { Glasses, Sun, Monitor, Dumbbell, Baby, Sparkles } from 'lucide-react';

const categoryIcons: Record<string, { icon: React.ElementType; color: string }> = {
  'mens-glasses':     { icon: Glasses,  color: 'text-blue-400' },
  'womens-glasses':   { icon: Sparkles, color: 'text-pink-400' },
  'kids-glasses':     { icon: Baby,     color: 'text-yellow-400' },
  'sunglasses':       { icon: Sun,      color: 'text-orange-400' },
  'computer-glasses': { icon: Monitor,  color: 'text-purple-400' },
  'sports-eyewear':   { icon: Dumbbell, color: 'text-green-400' },
};
const fallbackIcon = { icon: Glasses, color: 'text-gray-400' };

export default function CategoryGrid() {
  const { data, isLoading } = useCategories();
  const categories = data?.data?.filter((c) => c.active) ?? [];

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-36 bg-gray-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">Shop by Category</h2>
        <p className="text-center text-gray-500 mb-10">Find the perfect frames for every occasion</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const { icon: Icon, color } = categoryIcons[cat.slug] ?? fallbackIcon;
            return (
              <Link
                key={cat._id}
                href={`/category/${cat.slug}`}
                className="group relative flex flex-col items-center overflow-hidden rounded-2xl border border-gray-100 bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                {/* Image or icon fallback */}
                <div className="relative w-full h-32 bg-gray-100">
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Icon className={`w-10 h-10 ${color}`} />
                    </div>
                  )}
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>

                {/* Label */}
                <div className="absolute bottom-0 left-0 right-0 p-2 text-center">
                  <span className="text-white text-xs font-semibold drop-shadow leading-tight">
                    {cat.name}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
