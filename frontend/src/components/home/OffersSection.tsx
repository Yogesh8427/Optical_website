'use client';
import { useOffers } from '@/hooks/useOffers';
import { Offer } from '@/types';
import Link from 'next/link';
import Image from 'next/image';

export default function OffersSection() {
  const { data } = useOffers(true);
  const offers: Offer[] = data?.data ?? [];
  if (!offers.length) return null;

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Current Offers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {offers.map((offer) => (
          <div
            key={offer._id}
            className="relative rounded-2xl overflow-hidden shadow-md min-h-[160px] flex flex-col justify-between p-6"
            style={{ backgroundColor: offer.bgColor || '#2563eb' }}
          >
            {offer.bannerImage && (
              <Image src={offer.bannerImage} alt={offer.title} fill className="object-cover opacity-20" />
            )}
            <div className="relative z-10">
              {offer.occasionName && (
                <span className="text-xs font-semibold bg-white/20 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {offer.occasionName}
                </span>
              )}
              <h3 className="text-xl font-bold text-white mt-2">{offer.title}</h3>
              {offer.description && <p className="text-white/80 text-sm mt-1">{offer.description}</p>}
            </div>
            <div className="relative z-10 flex items-center justify-between mt-4">
              <span className="text-3xl font-black text-white">
                {offer.discountType === 'percentage' ? `${offer.discountValue}% OFF` : `₹${offer.discountValue} OFF`}
              </span>
              <Link href="/products" className="text-xs bg-white text-slate-800 font-semibold px-3 py-1.5 rounded-lg hover:bg-white/90 transition-colors">
                {offer.productIds?.length > 0 ? 'Shop Now →' : 'Browse All →'}
              </Link>
            </div>
            {offer.endDate && (
              <p className="relative z-10 text-white/60 text-xs mt-2">
                Valid till {new Date(offer.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
