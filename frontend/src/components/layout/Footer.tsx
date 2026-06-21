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
    <footer className="bg-slate-950 text-slate-400 mt-auto mb-16 md:mb-0">
      {/* Top accent bar */}
      <div className="h-1 w-full" style={{ background: 'var(--theme-primary)' }} />

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
                  className="h-9 w-9 object-contain rounded-xl shrink-0"
                />
              ) : (
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--theme-primary)' }}>
                  <Eye className="w-5 h-5 text-white" />
                </div>
              )}
              <span className="font-black text-lg text-white tracking-tight">{storeName}</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed mb-5">
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
                    className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-xs font-black text-slate-400 hover:text-white transition-all"
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--theme-primary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '')}
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-black mb-4 text-xs uppercase tracking-widest">{t.footer.quickLinks}</h3>
            <ul className="space-y-2.5">
              {([['/', t.nav.home], ['/products', t.nav.products], ['/about', t.nav.about], ['/contact', t.nav.contact]] as [string, string][]).map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-slate-500 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-black mb-4 text-xs uppercase tracking-widest">Legal</h3>
            <ul className="space-y-2.5">
              {([['/privacy-policy', t.footer.privacy], ['/terms', t.footer.terms], ['/coupons', 'Coupons & Offers']] as [string, string][]).map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-slate-500 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-black mb-4 text-xs uppercase tracking-widest">{t.contact.title}</h3>
            <ul className="space-y-3">
              {whatsapp && (
                <li>
                  <a
                    href={`https://wa.me/${whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 text-sm text-slate-500 hover:text-green-400 transition-colors"
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
                    className="flex items-start gap-2 text-sm text-slate-500 hover:text-white transition-colors"
                  >
                    <Phone className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>{phone}</span>
                  </a>
                </li>
              )}
              {email && (
                <li>
                  <a
                    href={`mailto:${email}`}
                    className="flex items-start gap-2 text-sm text-slate-500 hover:text-white transition-colors"
                  >
                    <Mail className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span className="break-all">{email}</span>
                  </a>
                </li>
              )}
              {address && (
                <li className="flex items-start gap-2 text-sm text-slate-500">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>{address}</span>
                </li>
              )}
              {!whatsapp && !phone && !email && !address && (
                <li className="text-sm text-slate-600 italic">Contact info not set</li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-slate-600">
            &copy; {new Date().getFullYear()} {storeName}. {t.footer.rights}
          </p>
          <p className="text-xs text-slate-700">
            Crafted with care for perfect vision
          </p>
        </div>
      </div>
    </footer>
  );
}
