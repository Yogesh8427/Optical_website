'use client';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { FAQ, ApiResponse } from '@/types';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FAQSection() {
  const { data, isLoading } = useQuery<ApiResponse<FAQ[]>>({
    queryKey: ['faqs'],
    queryFn: () => api.get('/faqs').then((r) => r.data),
  });
  const faqs = data?.data ?? [];
  const [open, setOpen] = useState<string | null>(null);

  if (isLoading) return (
    <section className="py-20 bg-slate-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-8 w-32 bg-slate-700 rounded-xl animate-pulse mx-auto mb-12" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-14 bg-slate-800 rounded-2xl animate-pulse mb-3" />
        ))}
      </div>
    </section>
  );
  if (!faqs.length) return null;

  return (
    <section className="py-20 bg-slate-950 relative overflow-hidden">
      <div className="pointer-events-none select-none absolute inset-0">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl animate-breathe" style={{ background: 'color-mix(in srgb, var(--theme-primary,#2563eb) 15%, transparent)' }} />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full blur-3xl animate-float-drift" style={{ background: 'color-mix(in srgb, var(--theme-primary,#2563eb) 10%, transparent)', animationDelay: '2s' }} />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Split layout: left heading + CTA | right accordion */}
        <div className="flex flex-col lg:flex-row lg:gap-20">

          {/* Left column */}
          <motion.div
            className="lg:w-2/5 mb-12 lg:mb-0 lg:sticky lg:top-24 lg:self-start"
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <span className="text-xs font-black uppercase tracking-widest" style={{ color: 'var(--theme-primary, #2563eb)' }}>
              FAQ
            </span>
            <h2 className="mt-3 text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Frequently Asked Questions
            </h2>
            <p className="mt-5 text-slate-400 text-lg leading-relaxed">
              Can&apos;t find your answer here? Reach out to our team — we&apos;re happy to help.
            </p>
            <a
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-opacity hover:opacity-90"
              style={{ background: 'var(--theme-primary)' }}
            >
              Contact Us &rarr;
            </a>
          </motion.div>

          {/* Right column — accordion */}
          <div className="lg:w-3/5 space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = open === faq._id;
              return (
                <motion.div
                  key={faq._id}
                  className="border border-slate-700 rounded-xl overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.06 }}
                >
                  <button
                    className="w-full flex items-center justify-between px-6 py-5 text-left font-bold text-white hover:bg-slate-800/60 transition-colors duration-200"
                    onClick={() => setOpen(isOpen ? null : faq._id)}
                    aria-expanded={isOpen}
                  >
                    <span className="pr-4 text-base">{faq.question}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="shrink-0"
                    >
                      <ChevronDown
                        className="w-5 h-5 text-slate-400"
                        style={isOpen ? { color: 'var(--theme-primary)' } : {}}
                      />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5 text-slate-400 text-sm leading-relaxed border-t border-slate-700/60 pt-4">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
