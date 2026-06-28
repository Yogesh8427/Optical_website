'use client';
import { useOffers } from '@/hooks/useOffers';
import { Offer } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

function getOfferLink(offer: Offer & { brandIds?: Array<{_id:string;name:string}>; categoryIds?: Array<{_id:string;slug:string}> }) {
  const b = offer.brandIds?.[0];
  const c = offer.categoryIds?.[0];
  const products = offer.productIds ?? [];

  if (b) return `/products?brand=${typeof b === 'object' ? b._id : b}`;
  if (c) return `/products?category=${typeof c === 'object' ? c.slug ?? c._id : c}`;

  // Single product — go directly to product detail page
  if (products.length === 1) {
    const p = products[0] as { slug?: string; _id?: string } | string;
    const slug = typeof p === 'object' ? p.slug ?? p._id : p;
    if (slug) return `/product/${slug}`;
  }

  // Multiple products — go to products page (badges will show on matching cards)
  return '/products';
}

export default function OffersSection() {
  const { data } = useOffers(true);
  const offers: Offer[] = data?.data ?? [];
  if (!offers.length) return null;

  return (
    <section className="py-6 md:py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 md:mb-10">
          <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: 'var(--theme-primary)' }}>
            OFFERS
          </p>
          <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">Exclusive Deals</h2>
        </div>

        <div className="flex overflow-x-auto overflow-y-hidden gap-4 pb-3 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-5 md:overflow-visible md:pb-0">
          {offers.map((offer, i) => (
            <motion.div
              key={offer._id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: 'easeOut' }}
              className="flex-shrink-0 w-[260px] md:w-auto snap-start relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 min-h-[200px] flex flex-col justify-between"
              style={{ backgroundColor: offer.bgColor || '#2563eb' }}
            >
              {/* Background image */}
              {offer.bannerImage && (
                <Image
                  src={offer.bannerImage}
                  alt={offer.title}
                  fill
                  className="object-cover"
                />
              )}

              {/* Dark overlay when image exists */}
              {offer.bannerImage && (
                <div className="absolute inset-0 bg-black/55 z-0" />
              )}

              {/* Content */}
              <div className="relative z-10 p-6 flex flex-col justify-between h-full min-h-[200px]">
                {/* Top: occasion tag */}
                <div>
                  {offer.occasionName && (
                    <span className="inline-block text-xs font-bold bg-white/20 text-white px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm mb-3">
                      {offer.occasionName}
                    </span>
                  )}
                  {!offer.bannerImage && (
                    <>
                      <h3 className="text-xl font-black text-white mt-1">{offer.title}</h3>
                      {offer.description && (
                        <p className="text-white/80 text-sm mt-1 leading-relaxed">{offer.description}</p>
                      )}
                    </>
                  )}
                </div>

                {/* Bottom: discount + CTA */}
                <div className="mt-auto">
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <span className="text-4xl font-black text-white leading-none">
                        {offer.discountType === 'percentage' ? `${offer.discountValue}%` : `₹${offer.discountValue}`}
                      </span>
                      <span className="block text-white/80 text-sm font-bold -mt-0.5">OFF</span>
                      {offer.endDate && (
                        <p className="text-white/60 text-xs mt-2">
                          Valid till {new Date(offer.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      )}
                    </div>
                    <Link
                      href={getOfferLink(offer as Offer & { brandIds?: Array<{_id:string;name:string}>; categoryIds?: Array<{_id:string;slug:string}> })}
                      className="shrink-0 text-xs bg-white text-slate-900 font-bold px-4 py-2 rounded-full hover:bg-white/90 transition-colors"
                    >
                      Shop Now →
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
