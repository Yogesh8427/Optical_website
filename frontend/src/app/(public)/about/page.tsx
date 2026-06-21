'use client';
import { useSettings } from '@/hooks/useSettings';
import { motion } from 'framer-motion';
import { Store, Target, Eye, Check } from 'lucide-react';

export default function AboutPage() {
  const { data, isLoading } = useSettings();
  const s = data?.data;
  const about = s?.aboutContent;

  const heading    = about?.heading    || '';
  const subheading = about?.subheading || '';
  const body       = about?.body       || '';
  const mission    = about?.mission    || '';
  const vision     = about?.vision     || '';
  const highlights = about?.highlights?.filter(Boolean) ?? [];
  const storeName  = s?.storeName      || 'Our Store';

  const hasContent = heading || body || mission || vision || highlights.length > 0;

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-4 animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-1/2" />
        <div className="h-5 bg-gray-100 rounded w-1/3" />
        <div className="h-32 bg-gray-100 rounded mt-8" />
      </div>
    );
  }

  if (!hasContent) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mx-auto" style={{ background: 'color-mix(in srgb, var(--theme-primary, #2563eb) 12%, white)' }}><Store className="w-8 h-8" style={{ color: 'var(--theme-primary, #2563eb)' }} /></div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-800 mb-3">
          About {storeName}
        </h1>
        <p className="text-slate-500 text-lg">
          Our story is coming soon. Check back later!
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8" style={{ background: 'linear-gradient(135deg, var(--theme-primary, #2563eb) 0%, color-mix(in srgb, var(--theme-primary, #2563eb) 60%, #000) 100%)' }}>
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="text-[10rem] md:text-[16rem] font-black text-white/5 whitespace-nowrap tracking-widest">
            ABOUT
          </span>
        </div>
        <div className="relative max-w-4xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-xs font-black uppercase tracking-widest mb-4 text-white/60"
          >
            About
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-5xl font-black tracking-tight text-white mb-4"
          >
            {heading || `About ${storeName}`}
          </motion.h1>
          {subheading && (
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-slate-400 text-lg"
            >
              {subheading}
            </motion.p>
          )}
        </div>
      </section>

      {/* Body */}
      <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {body && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="text-slate-600 text-lg leading-relaxed whitespace-pre-line mb-12"
            >
              {body}
            </motion.div>
          )}

          {/* Mission + Vision */}
          {(mission || vision) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {mission && (
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0 }}
                  className="relative overflow-hidden rounded-2xl shadow-md p-6 text-white"
                  style={{ background: 'linear-gradient(135deg, var(--theme-primary, #2563eb) 0%, color-mix(in srgb, var(--theme-primary, #2563eb) 60%, #000) 100%)' }}
                >
                  <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />
                  <h3 className="text-lg font-black mb-3 text-white flex items-center gap-1.5">
                    <Target className="w-4 h-4" />Our Mission
                  </h3>
                  <p className="text-white/70 leading-relaxed">{mission}</p>
                </motion.div>
              )}
              {vision && (
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="relative overflow-hidden rounded-2xl shadow-md p-6 text-white"
                  style={{ background: 'linear-gradient(135deg, var(--theme-primary, #2563eb) 0%, color-mix(in srgb, var(--theme-primary, #2563eb) 60%, #000) 100%)' }}
                >
                  <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />
                  <h3 className="text-lg font-black mb-3 text-white flex items-center gap-1.5">
                    <Eye className="w-4 h-4" />Our Vision
                  </h3>
                  <p className="text-white/70 leading-relaxed">{vision}</p>
                </motion.div>
              )}
            </div>
          )}

          {/* Highlights */}
          {highlights.length > 0 && (
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 mb-8"
              >
                Why Choose {storeName}?
              </motion.h2>
              <ul className="space-y-4">
                {highlights.map((point, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="flex items-center gap-4 bg-white border border-slate-100 rounded-2xl shadow-md px-5 py-4"
                  >
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white text-sm font-black"
                      style={{ background: 'var(--theme-primary)' }}
                    >
                    <Check className="w-4 h-4" />
                    </span>
                    <span className="text-gray-800 font-bold">{point}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
