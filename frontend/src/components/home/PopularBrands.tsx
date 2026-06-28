'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useBrands } from '@/hooks/useBrands';
import { motion } from 'framer-motion';

function getInitials(name: string) {
  return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
}

export default function PopularBrands() {
  const { data, isLoading } = useBrands();
  const brands = data?.data?.filter((b) => b.active) ?? [];
  const useMarquee = brands.length >= 6;

  if (isLoading) {
    return (
      <section className="relative overflow-hidden py-8 md:py-20" style={{ background: 'linear-gradient(135deg, var(--theme-primary, #2563eb) 0%, color-mix(in srgb, var(--theme-primary, #2563eb) 60%, #000) 100%)' }}>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="hidden md:block text-[10rem] md:text-[16rem] font-black text-white/5 whitespace-nowrap tracking-widest">BRANDS</span>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 md:mb-12 text-center">
            <span className="text-xs font-black uppercase tracking-widest text-white/60">
              Brands
            </span>
            <h2 className="mt-2 text-2xl md:text-5xl font-black text-white tracking-tight">Popular Brands</h2>
          </div>
          <div className="flex justify-center gap-4 flex-wrap">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="w-32 h-12 bg-zinc-800 rounded-full animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden py-8 md:py-20" style={{ background: 'linear-gradient(135deg, var(--theme-primary, #2563eb) 0%, color-mix(in srgb, var(--theme-primary, #2563eb) 60%, #000) 100%)' }}>
      {/* Floating orbs */}
      <div className="pointer-events-none select-none absolute inset-0">
        <div className="absolute -top-16 right-1/4 w-80 h-80 rounded-full bg-white/10 blur-3xl animate-float" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-0 -left-20 w-96 h-96 rounded-full bg-white/8 blur-3xl animate-breathe" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 right-0 w-64 h-64 rounded-full bg-white/10 blur-3xl animate-float-drift" style={{ animationDelay: '3s' }} />
      </div>
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="text-[10rem] md:text-[16rem] font-black text-white/5 whitespace-nowrap tracking-widest">
          BRANDS
        </span>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          className="mb-6 md:mb-12 text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-xs font-black uppercase tracking-widest text-white/60">
            Brands
          </span>
          <h2 className="mt-2 text-2xl md:text-5xl font-black text-white tracking-tight">Popular Brands</h2>
          <p className="mt-3 text-zinc-400 text-lg">Trusted names in premium eyewear</p>
        </motion.div>
      </div>

      {useMarquee ? (
        /* Marquee: two rows scrolling left, CSS-only */
        <div className="space-y-4">
          {/* Row 1 — scroll left */}
          <div className="flex gap-4 w-max animate-[marquee_28s_linear_infinite]">
            {[...brands, ...brands].map((brand, idx) => (
              <BrandPill key={`r1-${idx}`} brand={brand} />
            ))}
          </div>
          {/* Row 2 — scroll left slightly offset */}
          <div className="flex gap-4 w-max animate-[marquee_22s_linear_infinite]">
            {[...brands, ...brands].map((brand, idx) => (
              <BrandPill key={`r2-${idx}`} brand={brand} />
            ))}
          </div>

          <style>{`
            @keyframes marquee {
              0%   { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
          `}</style>
        </div>
      ) : (
        /* Static centered row for fewer than 6 brands */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {brands.map((brand) => (
              <BrandPill key={brand._id} brand={brand} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

type Brand = { _id: string; name: string; logo?: string; active: boolean };

function BrandPill({ brand }: { brand: Brand }) {
  return (
    <Link
      href={`/products?brand=${brand._id}`}
      className="group flex items-center gap-3 px-5 py-2.5 bg-white rounded-full shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 shrink-0"
    >
      {brand.logo ? (
        <div className="relative w-7 h-7 rounded-full overflow-hidden bg-zinc-100 shrink-0">
          <Image
            src={brand.logo}
            alt={brand.name}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <span
          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0"
          style={{ background: 'var(--theme-primary)' }}
        >
          {getInitials(brand.name)}
        </span>
      )}
      <span className="text-sm font-bold text-slate-900 whitespace-nowrap">{brand.name}</span>
    </Link>
  );
}
