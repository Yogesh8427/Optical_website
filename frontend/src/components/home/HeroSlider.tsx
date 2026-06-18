'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Banner, ApiResponse } from '@/types';
import { cn } from '@/lib/utils';

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const { data } = useQuery<ApiResponse<Banner[]>>({
    queryKey: ['banners'],
    queryFn: () => api.get('/banners').then((r) => r.data),
  });

  const banners = data?.data ?? [];

  useEffect(() => {
    if (banners.length <= 1) return;
    const id = setInterval(() => setCurrent((c) => (c + 1) % banners.length), 5000);
    return () => clearInterval(id);
  }, [banners.length]);

  if (!banners.length) {
    return (
      <div className="relative h-[500px] bg-gradient-to-r from-blue-900 to-blue-700 flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">See the World Clearly</h1>
          <p className="text-xl text-blue-200 mb-8">Premium eyewear, customized for you</p>
          <Link href="/products" className={cn(buttonVariants({ size: 'lg' }), 'bg-white text-blue-700 hover:bg-blue-50 border-0')}>
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  const banner = banners[current];

  return (
    <div className="relative h-[500px] overflow-hidden">
      <Image src={banner.image} alt={banner.title} fill className="object-cover" priority />
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow">{banner.title}</h1>
          {banner.subtitle && <p className="text-xl text-gray-200 mb-8">{banner.subtitle}</p>}
          {banner.buttonText && banner.buttonUrl && (
            <Link href={banner.buttonUrl} className={cn(buttonVariants({ size: 'lg' }), 'bg-white text-gray-900 hover:bg-gray-100 border-0')}>
              {banner.buttonText}
            </Link>
          )}
        </div>
      </div>

      {banners.length > 1 && (
        <>
          <button onClick={() => setCurrent((c) => (c - 1 + banners.length) % banners.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full p-2 transition-colors">
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button onClick={() => setCurrent((c) => (c + 1) % banners.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full p-2 transition-colors">
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-colors ${i === current ? 'bg-white' : 'bg-white/50'}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
