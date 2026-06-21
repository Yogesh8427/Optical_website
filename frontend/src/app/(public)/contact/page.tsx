'use client';
import { useSettings } from '@/hooks/useSettings';
import { MessageCircle, Phone, Mail, MapPin, Clock } from 'lucide-react';
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
      icon: <MessageCircle className="w-6 h-6" />,
      title: 'WhatsApp',
      subtitle: 'Quick replies on chat',
      content: (
        <a
          href={`https://wa.me/${whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl transition-colors"
        >
          <MessageCircle className="w-4 h-4" /> Open WhatsApp
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
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8" style={{ background: 'linear-gradient(135deg, var(--theme-primary, #2563eb) 0%, color-mix(in srgb, var(--theme-primary, #2563eb) 60%, #000) 100%)' }}>
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
            className="text-xs font-black uppercase tracking-widest mb-4 text-white/60"
          >
            Contact
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-5xl font-black tracking-tight text-white mb-4"
          >
            Contact {storeName}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-slate-400 text-lg"
          >
            We&apos;d love to hear from you. Reach us through any of the channels below.
          </motion.p>
        </div>
      </section>

      {/* Cards */}
      <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {contactCards.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {contactCards.map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="relative overflow-hidden flex items-start gap-4 p-5 rounded-2xl shadow-md text-white"
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
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 mb-6">
                Find Us
              </h2>
              <div className="rounded-2xl overflow-hidden border border-slate-800 h-72 shadow-md">
                <iframe
                  src={
                    mapsUrl.replace('/maps/', '/maps/embed/v1/place?key=EMBED&').includes('embed')
                      ? mapsUrl
                      : `https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`
                  }
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
