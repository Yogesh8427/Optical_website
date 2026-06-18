'use client';
import { useSettings } from '@/hooks/useSettings';
import { MessageCircle, Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function ContactPage() {
  const { data } = useSettings();
  const s = data?.data;

  const whatsapp     = s?.whatsappNumber || '';
  const phone        = s?.phone          || '';
  const email        = s?.email          || '';
  const address      = s?.address        || '';
  const hours        = s?.businessHours  || '';
  const mapsUrl      = s?.googleMapsUrl  || '';
  const storeName    = s?.storeName      || 'Us';

  const contactCards = [
    {
      show: !!whatsapp,
      icon: <MessageCircle className="w-6 h-6 text-green-600" />,
      bg: 'bg-green-50 border-green-100',
      iconBg: 'bg-green-100',
      title: 'WhatsApp',
      subtitle: 'Quick replies on chat',
      content: (
        <a
          href={`https://wa.me/${whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <MessageCircle className="w-4 h-4" /> Open WhatsApp
        </a>
      ),
    },
    {
      show: !!phone,
      icon: <Phone className="w-6 h-6 text-blue-600" />,
      bg: 'bg-blue-50 border-blue-100',
      iconBg: 'bg-blue-100',
      title: 'Phone',
      subtitle: 'Call us directly',
      content: (
        <a href={`tel:${phone}`} className="inline-block mt-3 text-blue-700 font-semibold hover:underline">
          {phone}
        </a>
      ),
    },
    {
      show: !!email,
      icon: <Mail className="w-6 h-6 text-purple-600" />,
      bg: 'bg-purple-50 border-purple-100',
      iconBg: 'bg-purple-100',
      title: 'Email',
      subtitle: 'We reply within 24 hours',
      content: (
        <a href={`mailto:${email}`} className="inline-block mt-3 text-purple-700 font-semibold hover:underline break-all">
          {email}
        </a>
      ),
    },
    {
      show: !!address,
      icon: <MapPin className="w-6 h-6 text-red-500" />,
      bg: 'bg-red-50 border-red-100',
      iconBg: 'bg-red-100',
      title: 'Visit Us',
      subtitle: 'Come see our collection',
      content: (
        <div className="mt-3 space-y-1">
          <p className="text-gray-700 text-sm whitespace-pre-line">{address}</p>
          {mapsUrl && (
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-block text-xs text-red-600 hover:underline mt-1">
              📍 View on Google Maps
            </a>
          )}
        </div>
      ),
    },
    {
      show: !!hours,
      icon: <Clock className="w-6 h-6 text-orange-500" />,
      bg: 'bg-orange-50 border-orange-100',
      iconBg: 'bg-orange-100',
      title: 'Business Hours',
      subtitle: 'When we are open',
      content: <p className="mt-3 text-gray-700 text-sm whitespace-pre-line">{hours}</p>,
    },
  ].filter((c) => c.show);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-3">Contact {storeName}</h1>
      <p className="text-gray-500 text-lg mb-10">We&apos;d love to hear from you. Reach us through any of the channels below.</p>

      {contactCards.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {contactCards.map((card, i) => (
            <div key={i} className={`flex items-start gap-4 p-5 border rounded-2xl ${card.bg}`}>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${card.iconBg}`}>
                {card.icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{card.title}</h3>
                <p className="text-gray-500 text-sm">{card.subtitle}</p>
                {card.content}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">Contact details not set yet.</p>
          <p className="text-sm mt-1">Go to <strong>Admin → Settings</strong> to add your contact info.</p>
        </div>
      )}

      {/* Google Maps embed */}
      {mapsUrl && (
        <div className="mt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Find Us</h2>
          <div className="rounded-2xl overflow-hidden border h-72">
            <iframe
              src={mapsUrl.replace('/maps/', '/maps/embed/v1/place?key=EMBED&').includes('embed') ? mapsUrl : `https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      )}
    </div>
  );
}
