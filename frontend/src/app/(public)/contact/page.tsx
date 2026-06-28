'use client';
import { useSettings } from '@/hooks/useSettings';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}
import { motion } from 'framer-motion';

export default function ContactPage() {
  const { data } = useSettings();
  const s = data?.data;

  const whatsapp  = s?.whatsappNumber || '';
  const phone     = s?.phone          || '';
  const email     = s?.email          || '';
  const address   = s?.address        || '';
  const hours     = s?.businessHours  || '';
  const mapsUrl   = s?.googleMapsUrl  || '';
  const storeName = s?.storeName      || 'Us';

  const contactCards = [
    {
      show: !!whatsapp,
      icon: <WhatsAppIcon className="w-6 h-6" />,
      title: 'WhatsApp',
      subtitle: 'Quick replies on chat',
      content: (
        <a
          href={`https://wa.me/${whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl transition-colors"
        >
          <WhatsAppIcon className="w-4 h-4" /> Open WhatsApp
        </a>
      ),
    },
    {
      show: !!phone,
      icon: <Phone className="w-6 h-6" />,
      title: 'Phone',
      subtitle: 'Call us directly',
      content: (
        <a
          href={`tel:${phone}`}
          className="inline-block mt-3 font-bold hover:underline text-white"
        >
          {phone}
        </a>
      ),
    },
    {
      show: !!email,
      icon: <Mail className="w-6 h-6" />,
      title: 'Email',
      subtitle: 'We reply within 24 hours',
      content: (
        <a
          href={`mailto:${email}`}
          className="inline-block mt-3 font-bold hover:underline break-all text-white"
        >
          {email}
        </a>
      ),
    },
    {
      show: !!address,
      icon: <MapPin className="w-6 h-6" />,
      title: 'Visit Us',
      subtitle: 'Come see our collection',
      content: (
        <div className="mt-3 space-y-1">
          <p className="text-white/70 text-sm whitespace-pre-line">{address}</p>
          {mapsUrl && (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-xs font-bold hover:underline mt-1 text-white"
            >
              View on Google Maps →
            </a>
          )}
        </div>
      ),
    },
    {
      show: !!hours,
      icon: <Clock className="w-6 h-6" />,
      title: 'Business Hours',
      subtitle: 'When we are open',
      content: <p className="mt-3 text-white/70 text-sm whitespace-pre-line">{hours}</p>,
    },
  ].filter((c) => c.show);

  return (
    <div className="pb-20">
      {/* Hero */}
      <section className="relative overflow-hidden py-8 md:py-20 px-4 sm:px-6 lg:px-8" style={{ background: 'linear-gradient(135deg, var(--theme-primary, #2563eb) 0%, color-mix(in srgb, var(--theme-primary, #2563eb) 60%, #000) 100%)' }}>
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="text-[10rem] md:text-[16rem] font-black text-white/5 whitespace-nowrap tracking-widest">
            CONTACT
          </span>
        </div>
        <div className="relative max-w-4xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-xs font-black uppercase tracking-widest mb-2 text-white/60"
          >
            Contact
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-2xl md:text-5xl font-black tracking-tight text-white mb-2 md:mb-4"
          >
            Contact {storeName}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-slate-400 text-sm md:text-lg"
          >
            We&apos;d love to hear from you. Reach us through any of the channels below.
          </motion.p>
        </div>
      </section>

      {/* Cards */}
      <section className="bg-white py-5 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {contactCards.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-5">
              {contactCards.map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="relative overflow-hidden flex items-start gap-3 p-4 md:p-5 rounded-2xl shadow-md text-white"
                  style={{ background: 'linear-gradient(135deg, var(--theme-primary, #2563eb) 0%, color-mix(in srgb, var(--theme-primary, #2563eb) 60%, #000) 100%)' }}
                >
                  <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/5 pointer-events-none" />
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-white/20">
                    <span className="text-white">{card.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-black text-white">{card.title}</h3>
                    <p className="text-white/60 text-sm">{card.subtitle}</p>
                    {card.content}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400">
              <p className="text-lg font-bold">Contact details not set yet.</p>
              <p className="text-sm mt-1">Go to <strong>Admin → Settings</strong> to add your contact info.</p>
            </div>
          )}

          {/* Google Maps */}
          {mapsUrl && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="mt-12"
            >
              <h2 className="text-2xl md:text-5xl font-black tracking-tight text-gray-900 mb-4 md:mb-6">
                Find Us
              </h2>
              <div className="rounded-2xl overflow-hidden border border-slate-800 h-72 shadow-md">
                <iframe
                  src={(() => {
                    if (!mapsUrl && !address) return '';
                    // Already an embed URL — use as-is
                    if (mapsUrl.includes('/maps/embed')) return mapsUrl;
                    // Extract coordinates from share URL  e.g. @12.345,67.890
                    const coordMatch = mapsUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
                    if (coordMatch) {
                      return `https://maps.google.com/maps?q=${coordMatch[1]},${coordMatch[2]}&output=embed`;
                    }
                    // Extract place ID from URL
                    const placeMatch = mapsUrl.match(/place\/([^/]+)/);
                    if (placeMatch) {
                      return `https://maps.google.com/maps?q=${encodeURIComponent(placeMatch[1].replace(/\+/g,' '))}&output=embed`;
                    }
                    // Fallback: use address
                    return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
                  })()}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
