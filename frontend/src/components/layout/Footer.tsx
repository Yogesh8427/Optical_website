'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, MapPin, Phone, Mail } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSettings } from '@/hooks/useSettings';

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

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
    { title: 'WhatsApp', href: whatsapp ? `https://wa.me/${whatsapp.replace(/\D/g,'')}` : '', Icon: WhatsAppIcon,  color: '#25D366' },
    { title: 'Facebook',  href: social?.facebook,  Icon: FacebookIcon,  color: '#1877F2' },
    { title: 'Instagram', href: social?.instagram, Icon: InstagramIcon, color: '#E1306C' },
    { title: 'YouTube',   href: social?.youtube,   Icon: YoutubeIcon,   color: '#FF0000' },
    { title: 'X / Twitter', href: social?.twitter, Icon: TwitterIcon,   color: '#ffffff' },
  ].filter((s) => s.href?.trim());

  return (
    <footer className="bg-slate-950 text-slate-400 mt-auto">
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
                    key={s.title}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.title}
                    title={s.title}
                    className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200 hover:scale-110"
                    onMouseEnter={(e) => { e.currentTarget.style.background = s.color; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.color = ''; }}
                  >
                    <s.Icon className="w-4 h-4" />
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
                    href={`https://wa.me/${whatsapp.replace(/\D/g,'')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 text-sm text-slate-500 hover:text-green-400 transition-colors"
                  >
                    <WhatsAppIcon className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
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
        <div className="border-t border-slate-800 pt-6 pb-20 md:pb-6 flex flex-col sm:flex-row items-center justify-between gap-2">
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
