'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useBrands } from '@/hooks/useBrands';

function getInitials(name: string) {
  return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
}

export default function PopularBrands() {
  const { data, isLoading } = useBrands();
  const brands = data?.data?.filter((b) => b.active) ?? [];

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Popular Brands</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="w-36 h-28 bg-gray-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">Popular Brands</h2>
        <p className="text-center text-gray-500 mb-10">Trusted names in premium eyewear</p>

        <div className="flex flex-wrap justify-center gap-5">
          {brands.map((brand) => (
            <Link
              key={brand._id}
              href={`/products?brand=${brand._id}`}
              className="group flex flex-col items-center gap-3 w-40 pb-4 rounded-2xl border border-gray-100 bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden"
            >
              {/* Logo or initials fallback */}
              <div className="relative w-full h-28 rounded-xl overflow-hidden bg-gray-100">
                {brand.logo ? (
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-400">
                      {getInitials(brand.name)}
                    </span>
                  </div>
                )}
              </div>

              {/* Brand name */}
              <span className="text-sm font-semibold text-gray-700 text-center leading-tight">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
