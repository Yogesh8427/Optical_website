'use client';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Testimonial, ApiResponse } from '@/types';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Testimonials() {
  const { data } = useQuery<ApiResponse<Testimonial[]>>({
    queryKey: ['testimonials'],
    queryFn: () => api.get('/testimonials').then((r) => r.data),
  });
  const testimonials = data?.data ?? [];
  if (!testimonials.length) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-xs font-black uppercase tracking-widest" style={{ color: 'var(--theme-primary)' }}>
            Testimonials
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            What Our Customers Say
          </h2>
        </motion.div>

        {/* Horizontal scroll on mobile, 3-col grid on desktop */}
        <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
          {testimonials.map((t, idx) => (
            <motion.div
              key={t._id}
              className="flex-shrink-0 w-80 md:w-auto snap-start"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.1 }}
            >
              <div className="h-full flex flex-col border border-slate-200 rounded-2xl p-7 shadow-sm hover:shadow-lg transition-shadow duration-300">
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
