'use client';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Testimonial, ApiResponse } from '@/types';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Testimonials() {
  const { data, isLoading } = useQuery<ApiResponse<Testimonial[]>>({
    queryKey: ['testimonials'],
    queryFn: () => api.get('/testimonials').then((r) => r.data),
  });
  const testimonials = data?.data ?? [];
  if (isLoading) return (
    <section className="py-6 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-8 w-48 bg-slate-200 rounded-xl animate-pulse mx-auto mb-5 md:mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-slate-100 animate-pulse h-48" />
          ))}
        </div>
      </div>
    </section>
  );
  if (!testimonials.length) return null;

  return (
    <section className="py-6 md:py-20 bg-white relative overflow-hidden">
      {/* Subtle animated background blobs */}
      <div className="pointer-events-none select-none absolute inset-0">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl animate-breathe" style={{ background: 'color-mix(in srgb, var(--theme-primary,#2563eb) 8%, transparent)' }} />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full blur-3xl animate-float-slow" style={{ background: 'color-mix(in srgb, var(--theme-primary,#2563eb) 6%, transparent)', animationDelay: '2s' }} />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section header */}
        <motion.div
          className="mb-5 md:mb-12 text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-xs font-black uppercase tracking-widest" style={{ color: 'var(--theme-primary)' }}>
            Testimonials
          </span>
          <h2 className="mt-3 text-2xl md:text-5xl font-black text-slate-900 tracking-tight">
            What Our Customers Say
          </h2>
        </motion.div>

        {/* Horizontal scroll on mobile, grid on desktop */}
        <div className="flex overflow-x-auto gap-4 pb-3 snap-x snap-mandatory [touch-action:pan-x] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:pb-0">
          {testimonials.map((t, idx) => (
            <motion.div
              key={t._id}
              className="flex-shrink-0 w-[280px] md:w-auto snap-start"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.1 }}
            >
              <div className="card-shimmer h-full flex flex-col border border-slate-200 rounded-2xl p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                {/* Large quote mark */}
                <div
                  className="text-7xl font-black leading-none mb-3 select-none"
                  style={{ color: 'var(--theme-primary)', opacity: 0.25 }}
                  aria-hidden="true"
                >
                  &ldquo;
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < t.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200 fill-slate-200'}`}
                    />
                  ))}
                </div>

                {/* Review text */}
                <p className="text-slate-600 text-sm leading-relaxed flex-1 mb-5">
                  &ldquo;{t.text}&rdquo;
                </p>

                {/* Reviewer name */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0"
                    style={{ background: 'var(--theme-primary)' }}
                  >
                    {t.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-bold text-slate-900 text-sm">{t.name}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
