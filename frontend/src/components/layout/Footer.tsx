'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSettings } from '@/hooks/useSettings';

export default function Footer() {
  const { t } = useLanguage();
  const { data: settingsData } = useSettings();
  const settings  = settingsData?.data;
  const logoUrl   = settings?.logo;
  const storeName = settings?.storeName || 'OptiVision';
  const phone     = settings?.phone || '';
  const email     = settings?.email || '';
  const address   = settings?.address || '';
  const whatsapp  = settings?.whatsappNumber || '';
  const social    = settings?.socialLinks;

  const socialLinks = [
    { label: 'FB',  title: 'Facebook',  href: social?.facebook  },
    { label: 'IG',  title: 'Instagram', href: social?.instagram },
    { label: 'YT',  title: 'Youtube',   href: social?.youtube   },
    { label: 'TW',  title: 'Twitter',   href: social?.twitter   },
  ].filter((s) => s.href?.trim());

  return (
    <footer className="bg-gray-950 text-gray-400 mt-auto mb-16 md:mb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={storeName}
                  width={36}
                  height={36}
                  className="h-9 w-9 object-contain rounded-lg shrink-0"
                />
              ) : (
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
                  <Eye className="w-5 h-5 text-white" />
                </div>
              )}
              <span className="font-bold text-lg text-white">{storeName}</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              {t.footer.tagline}
            </p>
            {/* Social */}
            {socialLinks.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.title}
                    title={s.title}
                    className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-blue-600 flex items-center justify-center text-xs font-bold text-gray-400 hover:text-white transition-all"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t.footer.quickLinks}</h3>
            <ul className="space-y-2.5">
              {([['/', t.nav.home], ['/products', t.nav.products], ['/about', t.nav.about], ['/contact', t.nav.contact]] as [string, string][]).map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-gray-500 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Legal</h3>
            <ul className="space-y-2.5">
              {([['/privacy-policy', t.footer.privacy], ['/terms', t.footer.terms], ['/coupons', '🎟️ Coupons & Offers']] as [string, string][]).map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-gray-500 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t.contact.title}</h3>
            <ul className="space-y-3">
              {whatsapp && (
                <li>
                  <a
                    href={`https://wa.me/${whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 text-sm text-gray-500 hover:text-green-400 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    <span>WhatsApp Us</span>
                  </a>
                </li>
              )}
              {phone && (
                <li>
                  <a
                    href={`tel:${phone}`}
                    className="flex items-start gap-2 text-sm text-gray-500 hover:text-blue-400 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <span>{phone}</span>
                  </a>
                </li>
              )}
              {email && (
                <li>
                  <a
                    href={`mailto:${email}`}
                    className="flex items-start gap-2 text-sm text-gray-500 hover:text-purple-400 transition-colors"
                  >
                    <Mail className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span className="break-all">{email}</span>
                  </a>
                </li>
              )}
              {address && (
                <li className="flex items-start gap-2 text-sm text-gray-500">
                  <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{address}</span>
                </li>
              )}
              {!whatsapp && !phone && !email && !address && (
                <li className="text-sm text-gray-600 italic">Contact info not set</li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} {storeName}. {t.footer.rights}
          </p>
          <p className="text-xs text-gray-700">
            Crafted with ❤️ for perfect vision
          </p>
        </div>
      </div>
    </footer>
  );
}
