'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Glasses } from 'lucide-react';
import type { Frame } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ProductCard({ frame, offer }: { frame: Frame; offer?: { discountType: string; discountValue: number } | null }) {
  const { localize } = useLanguage();
  const img = frame.images?.[0];
  const displayName = localize(frame);

  return (
    <motion.div
      whileHover={{ y: -6, boxShadow: '0 24px 48px rgba(0,0,0,0.13)' }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 340, damping: 24 }}
      className="group rounded-2xl"
    >
      <Link href={`/product/${frame.slug}`} className="block rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-shadow duration-300">
        {/* Image area */}
        <div className="relative h-36 sm:h-56 bg-slate-50 overflow-hidden">
          {img ? (
            <Image
              src={img}
              alt={frame.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-300">
              <Glasses className="w-12 h-12" />
              <span className="text-xs font-medium">No image</span>
            </div>
          )}

          {/* Offer badge */}
          {offer && (
            <div
              className="absolute top-2 left-2 z-10 text-white text-xs font-black px-2 py-0.5 rounded-lg"
              style={{ background: 'var(--theme-primary)' }}
            >
              {offer.discountType === 'percentage' ? `${offer.discountValue}% OFF` : `₹${offer.discountValue} OFF`}
            </div>
          )}

          {/* Featured badge */}
          {frame.featured && !offer && (
            <div className="absolute top-2 left-2 z-10 bg-amber-400 text-amber-900 text-xs font-black px-2 py-0.5 rounded-lg">
              Featured
            </div>
          )}

          {/* Out of Stock */}
          {frame.inStock === false && (
            <div className="absolute top-2 right-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg">
              Out of Stock
            </div>
          )}
        </div>

        {/* Content area */}
        <div className="p-2.5 sm:p-4 bg-white">
          <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-0.5 font-medium hidden sm:block">{frame.brandId?.name}</p>
          <h3 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug mb-2 line-clamp-2">{displayName}</h3>
          <div className="flex items-center justify-between">
            <span className="font-black text-sm sm:text-base" style={{ color: 'var(--theme-primary, #2563eb)' }}>
              ₹{frame.framePrice.toLocaleString()}
            </span>
            <Badge variant="outline" className="text-[10px] sm:text-xs capitalize text-slate-400 border-slate-200 hidden sm:flex">
              {frame.gender}
            </Badge>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
