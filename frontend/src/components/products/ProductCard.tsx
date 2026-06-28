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
  const img = frame.images?.[0] ? frame.images[0].split(',')[0].trim() : null;
  const displayName = localize(frame);

  return (
    <motion.div
      whileHover={{ y: -6, boxShadow: '0 24px 48px rgba(0,0,0,0.13)' }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 340, damping: 24 }}
      className="group rounded-2xl h-full"
    >
      <Link href={`/product/${frame.slug}`} className="card-shimmer flex flex-col h-full rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-2xl transition-all duration-300">
        {/* Image area — fixed height so all cards align */}
        <div className="relative h-[110px] sm:h-52 shrink-0 bg-slate-50 overflow-hidden">
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

        {/* Content area — flex-1 pushes price to bottom so all cards are same height */}
        <div className="flex flex-col p-2 sm:p-4 bg-white">
          <h3 className="font-bold text-slate-900 text-[11px] sm:text-sm leading-snug line-clamp-1 sm:line-clamp-2">{displayName}</h3>
          <span className="font-black text-xs sm:text-base mt-1" style={{ color: 'var(--theme-primary, #2563eb)' }}>
            ₹{frame.framePrice.toLocaleString()}
          </span>
          <Badge variant="outline" className="text-[10px] capitalize text-slate-400 border-slate-200 hidden sm:flex mt-1">
            {frame.gender}
          </Badge>
        </div>
      </Link>
    </motion.div>
  );
}
