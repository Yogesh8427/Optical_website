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

  const { data, isLoading } = useQuery<ApiResponse<Banner[]>>({
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

  if (isLoading) {
    return (
      <div className="relative h-[520px] overflow-hidden bg-slate-200 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-shimmer bg-[length:200%_100%]" />
      </div>
    );
  }

  if (!banners.length) {
    return (
      <div className="relative h-[520px] flex items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--theme-primary,#2563eb) 0%, color-mix(in srgb, var(--theme-primary,#2563eb) 55%,#000) 100%)' }}>
        {/* Floating orbs */}
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-white/10 blur-3xl animate-breathe" />
        <div className="absolute -bottom-16 -left-16 w-80 h-80 rounded-full bg-white/8 blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-white/5 blur-3xl animate-breathe" style={{ animationDelay: '3s' }} />
        {/* Watermark */}
        <span className="pointer-events-none select-none absolute text-[8rem] md:text-[14rem] font-black text-white/5 leading-none">VISION</span>
        <div className="text-center text-white px-4 relative z-10">
          <p className="text-white/60 uppercase tracking-widest text-xs font-black mb-4">
            <span className="inline-block w-6 h-px bg-white/40 mr-2 align-middle" />
            Welcome to Our Store
            <span className="inline-block w-6 h-px bg-white/40 ml-2 align-middle" />
          </p>
          <h1 className="text-5xl md:text-7xl font-black mb-5 leading-tight [text-shadow:0_2px_20px_rgba(0,0,0,0.4)]">See the World<br />Clearly</h1>
          <p className="text-lg text-white/70 mb-8 max-w-md mx-auto">Premium eyewear, perfectly customized for you</p>
          <Link href="/products" className={cn(buttonVariants({ size: 'lg' }), 'btn-glow bg-white border-0 px-8 text-base font-black shadow-2xl hover:bg-white/90')} style={{ color: 'var(--theme-primary,#2563eb)' }}>
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />

          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white px-6 max-w-3xl">
              <p key={`tag-${current}`} className="animate-fade-up inline-flex items-center gap-2 uppercase tracking-widest text-xs font-black mb-4">
                <span className="inline-block w-6 h-px bg-white/60" />
                <span className="text-white/80">New Collection</span>
                <span className="inline-block w-6 h-px bg-white/60" />
              </p>
              <h1 key={`title-${current}`} className="animate-fade-up-delay text-4xl md:text-6xl font-black mb-4 leading-tight drop-shadow-2xl [text-shadow:0_2px_20px_rgba(0,0,0,0.6)]">
                {banners[current].title}
              </h1>
              {banners[current].subtitle && (
                <p key={`sub-${current}`} className="animate-fade-up-delay text-base md:text-xl text-white/80 mb-8 drop-shadow-lg">
                  {banners[current].subtitle}
                </p>
              )}
              {banners[current].buttonText && banners[current].buttonUrl && (
                <div key={`btn-${current}`} className="animate-fade-up-delay2">
                  <Link
                    href={banners[current].buttonUrl}
                    className={cn(buttonVariants({ size: 'lg' }), 'bg-white text-gray-900 hover:bg-gray-100 border-0 px-8 text-base font-semibold shadow-xl')}
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
