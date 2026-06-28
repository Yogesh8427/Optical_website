'use client';
import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSettings } from '@/hooks/useSettings';

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

export default function ContactSection() {
  const { data: settingsData } = useSettings();
  const s = settingsData?.data;

  const whatsapp = s?.whatsappNumber || '';
  const phone    = s?.phone          || '';
  const email    = s?.email          || '';
  const address  = s?.address        || '';
  const mapsUrl  = s?.googleMapsUrl  || (address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}` : '');

  const cards = [
    {
      Icon: WhatsAppIcon,
      label: 'WhatsApp',
      sub: whatsapp || 'Quick replies on chat',
      href: whatsapp ? `https://wa.me/${whatsapp.replace(/\D/g, '')}` : '/contact',
      external: true,
    },
    {
      Icon: Phone,
      label: 'Call Us',
      sub: phone || 'Mon – Sat, 10am – 7pm',
      href: phone ? `tel:${phone}` : '/contact',
      external: !!phone,
    },
    {
      Icon: Mail,
      label: 'Email Us',
      sub: email || 'Drop us a message',
      href: email ? `mailto:${email}` : '/contact',
      external: !!email,
    },
    {
      Icon: MapPin,
      label: 'Visit Store',
      sub: address || 'Come see us in person',
      href: mapsUrl || '/contact',
      external: true,
    },
  ];

  return (
    <section
      className="py-8 md:py-20 text-white relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, var(--theme-primary, #2563eb) 0%, color-mix(in srgb, var(--theme-primary, #2563eb) 60%, #000) 100%)' }}
    >
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="hidden md:block text-[10rem] md:text-[16rem] font-black text-white/5 whitespace-nowrap tracking-widest">TALK</span>
      </div>

      {/* Floating orbs */}
      <div className="pointer-events-none select-none absolute inset-0">
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/8 blur-3xl animate-breathe" />
        <div className="absolute -bottom-12 -left-12 w-56 h-56 rounded-full bg-white/8 blur-3xl animate-float-slow" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs font-black uppercase tracking-widest mb-3 text-white/60">CONTACT</p>
        <h2 className="text-2xl md:text-5xl font-black tracking-tight mb-3">Let&apos;s Talk</h2>
        <p className="text-white/70 mb-8 md:mb-14 text-sm md:text-lg max-w-xl mx-auto leading-relaxed">
          Have questions about frames or lenses? We&apos;d love to help you find the perfect eyewear.
        </p>

        {/* Contact cards — 4 equal boxes */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {cards.map((card, i) => {
            const Icon = card.Icon;
            const content = (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.08, ease: 'easeOut' }}
                className="h-40 bg-white/10 border border-white/20 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 backdrop-blur-sm hover:bg-white/20 transition-all cursor-pointer"
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-white/20 shrink-0">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-center">
                  <p className="font-black text-white text-sm">{card.label}</p>
                  <p className="text-white/60 text-xs leading-snug mt-0.5 line-clamp-2">{card.sub}</p>
                </div>
              </motion.div>
            );

            return card.external ? (
              <a key={card.label} href={card.href} target="_blank" rel="noopener noreferrer">
                {content}
              </a>
            ) : (
              <Link key={card.label} href={card.href}>
                {content}
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
