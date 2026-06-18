'use client';
import { useState, useEffect, useCallback } from 'react';
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
  const [prev, setPrev] = useState<number | null>(null);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [animating, setAnimating] = useState(false);

  const { data } = useQuery<ApiResponse<Banner[]>>({
    queryKey: ['banners'],
    queryFn: () => api.get('/banners').then((r) => r.data),
  });

  const banners = data?.data?.filter((b) => b.active) ?? [];

  const goTo = useCallback((index: number, dir: 'left' | 'right') => {
    if (animating) return;
    setDirection(dir);
    setPrev(current);
    setAnimating(true);
    setCurrent(index);
    setTimeout(() => { setPrev(null); setAnimating(false); }, 600);
  }, [animating, current]);

  const next = useCallback(() => goTo((current + 1) % banners.length, 'right'), [current, banners.length, goTo]);
  const back = useCallback(() => goTo((current - 1 + banners.length) % banners.length, 'left'), [current, banners.length, goTo]);

  useEffect(() => {
    if (banners.length <= 1) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [banners.length, next]);

  // Slide animation classes
  const enterClass = direction === 'right'
    ? 'animate-slide-in-right'
    : 'animate-slide-in-left';
  const exitClass = direction === 'right'
    ? 'animate-slide-out-left'
    : 'animate-slide-out-right';

  if (!banners.length) {
    return (
      <div className="relative h-[520px] bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-[-80px] right-[-80px] w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-60px] left-[-60px] w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="text-center text-white px-4 relative z-10">
          <p className="text-blue-300 uppercase tracking-widest text-sm font-medium mb-3">Welcome to Our Store</p>
          <h1 className="text-5xl md:text-7xl font-bold mb-5 leading-tight">See the World<br />Clearly</h1>
          <p className="text-xl text-blue-200 mb-8 max-w-md mx-auto">Premium eyewear, perfectly customized for you</p>
          <Link href="/products" className={cn(buttonVariants({ size: 'lg' }), 'bg-white text-blue-700 hover:bg-blue-50 border-0 px-8 text-base font-semibold')}>
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes slideOutLeft {
          from { transform: translateX(0);     opacity: 1; }
          to   { transform: translateX(-100%); opacity: 0; }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-100%); opacity: 0; }
          to   { transform: translateX(0);     opacity: 1; }
        }
        @keyframes slideOutRight {
          from { transform: translateX(0);    opacity: 1; }
          to   { transform: translateX(100%); opacity: 0; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .animate-slide-in-right  { animation: slideInRight  0.6s cubic-bezier(.4,0,.2,1) forwards; }
        .animate-slide-out-left  { animation: slideOutLeft  0.6s cubic-bezier(.4,0,.2,1) forwards; }
        .animate-slide-in-left   { animation: slideInLeft   0.6s cubic-bezier(.4,0,.2,1) forwards; }
        .animate-slide-out-right { animation: slideOutRight 0.6s cubic-bezier(.4,0,.2,1) forwards; }
        .animate-fade-up         { animation: fadeUp 0.7s 0.2s cubic-bezier(.4,0,.2,1) both; }
        .animate-fade-up-delay   { animation: fadeUp 0.7s 0.4s cubic-bezier(.4,0,.2,1) both; }
        .animate-fade-up-delay2  { animation: fadeUp 0.7s 0.6s cubic-bezier(.4,0,.2,1) both; }
      `}</style>

      <div className="relative h-[520px] overflow-hidden bg-gray-900 select-none">

        {/* Exiting slide */}
        {prev !== null && (
          <div className={`absolute inset-0 z-10 ${exitClass}`}>
            <Image
              src={banners[prev].image}
              alt={banners[prev].title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          </div>
        )}

        {/* Entering / current slide */}
        <div className={`absolute inset-0 z-20 ${animating ? enterClass : ''}`}>
          <Image
            src={banners[current].image}
            alt={banners[current].title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white px-6 max-w-3xl">
              <p key={`tag-${current}`} className="animate-fade-up text-blue-300 uppercase tracking-widest text-xs font-semibold mb-3">
                New Collection
              </p>
              <h1 key={`title-${current}`} className="animate-fade-up-delay text-4xl md:text-6xl font-extrabold mb-4 leading-tight drop-shadow-lg">
                {banners[current].title}
              </h1>
              {banners[current].subtitle && (
                <p key={`sub-${current}`} className="animate-fade-up-delay text-lg md:text-xl text-gray-200 mb-8">
                  {banners[current].subtitle}
                </p>
              )}
              {banners[current].buttonText && banners[current].buttonUrl && (
                <div key={`btn-${current}`} className="animate-fade-up-delay2">
                  <Link
                    href={banners[current].buttonUrl}
                    className={cn(buttonVariants({ size: 'lg' }), 'bg-white text-gray-900 hover:bg-gray-100 border-0 px-8 text-base font-semibold shadow-lg')}
                  >
                    {banners[current].buttonText}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Prev / Next arrows */}
        {banners.length > 1 && (
          <>
            <button
              onClick={back}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-black/60 backdrop-blur-sm text-white rounded-full p-3 transition-all duration-200 hover:scale-110"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-black/60 backdrop-blur-sm text-white rounded-full p-3 transition-all duration-200 hover:scale-110"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i, i > current ? 'right' : 'left')}
                  className={cn(
                    'rounded-full transition-all duration-300',
                    i === current
                      ? 'bg-white w-6 h-2'
                      : 'bg-white/50 hover:bg-white/80 w-2 h-2'
                  )}
                />
              ))}
            </div>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 z-30 h-[3px] bg-white/20 w-full">
              <div
                key={current}
                className="h-full bg-white"
                style={{ animation: 'progress 5s linear forwards' }}
              />
            </div>
            <style>{`
              @keyframes progress {
                from { width: 0%; }
                to   { width: 100%; }
              }
            `}</style>
          </>
        )}
      </div>
    </>
  );
}
