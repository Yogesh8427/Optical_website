'use client';
import Link from 'next/link';
import { MessageCircle, Phone, Mail, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const cards = [
  { icon: MessageCircle, label: 'WhatsApp',    sub: 'Quick replies on chat'    },
  { icon: Phone,         label: 'Call Us',     sub: 'Mon – Sat, 10am – 7pm'   },
  { icon: MapPin,        label: 'Visit Store', sub: 'Come see us in person'    },
];

export default function ContactSection() {
  return (
    <section
      className="py-20 text-white relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, var(--theme-primary, #2563eb) 0%, color-mix(in srgb, var(--theme-primary, #2563eb) 60%, #000) 100%)' }}
    >
      {/* Watermark background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="text-[10rem] md:text-[16rem] font-black text-white/5 whitespace-nowrap tracking-widest">
          TALK
        </span>
      </div>

      {/* Decorative circles */}
      <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Label */}
        <p className="text-xs font-black uppercase tracking-widest mb-3 text-white/60">
          CONTACT
        </p>

        {/* Heading */}
        <h2 className="text-5xl font-black tracking-tight mb-4">Let&apos;s Talk</h2>
        <p className="text-white/70 mb-14 text-lg max-w-xl mx-auto leading-relaxed">
          Have questions about frames or lenses? We&apos;d love to help you find the perfect eyewear.
        </p>

        {/* Contact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.1, ease: 'easeOut' }}
                className="bg-white/10 border border-white/20 rounded-2xl p-6 flex flex-col items-center gap-3 backdrop-blur-sm"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/20">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="font-black text-white text-base">{card.label}</p>
                <p className="text-white/60 text-sm">{card.sub}</p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold px-7 py-3 rounded-xl transition-colors text-sm shadow-lg"
          >
            <MessageCircle className="w-5 h-5" />
            WhatsApp Us
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 border-2 border-white/50 text-white font-bold px-7 py-3 rounded-xl transition-colors text-sm hover:bg-white/10"
          >
            <Phone className="w-5 h-5" />
            Call Us
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 border-2 border-white/50 text-white font-bold px-7 py-3 rounded-xl transition-colors text-sm hover:bg-white/10"
          >
            <Mail className="w-5 h-5" />
            Email Us
          </Link>
        </div>
      </div>
    </section>
  );
}
