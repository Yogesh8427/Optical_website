'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, Eye, Search, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSettings } from '@/hooks/useSettings';

export default function Navbar() {
  const [open, setOpen]         = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname                = usePathname();
  const { lang, setLang, t }    = useLanguage();
  const { data: settingsData }  = useSettings();
  const settings                = settingsData?.data;
  const logoUrl                 = settings?.logo;
  const storeName               = settings?.storeName || 'OptiVision';

  const links = [
    { href: '/',         label: t.nav.home     },
    { href: '/products', label: t.nav.products },
    { href: '/about',    label: t.nav.about    },
    { href: '/contact',  label: t.nav.contact  },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // close drawer on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <>
      <nav className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100'
          : 'bg-white border-b border-gray-100'
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              {logoUrl ? (
                <>
                  <Image
                    src={logoUrl}
                    alt={storeName}
                    width={40}
                    height={40}
                    className="h-10 w-10 object-contain rounded-lg shrink-0"
                    priority
                  />
                  <span className="font-bold text-xl text-gray-900 tracking-tight">{storeName}</span>
                </>
              ) : (
                <>
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-xl text-gray-900 tracking-tight">{storeName}</span>
                </>
              )}
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-1">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    pathname === l.href
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  )}
                >
                  {l.label}
                </Link>
              ))}
            </div>

            {/* Desktop actions */}
            <div className="hidden md:flex items-center gap-2">
              {/* Language switcher */}
              <button
                onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-slate-200 text-sm font-medium hover:border-blue-400 hover:text-blue-600 transition-all"
              >
                <span className={lang === 'en' ? 'text-blue-600 font-bold' : 'text-slate-400'}>EN</span>
                <span className="text-slate-300">|</span>
                <span className={lang === 'hi' ? 'text-blue-600 font-bold' : 'text-slate-400'}>हिं</span>
              </button>
              <Link href="/products" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                <ShoppingBag className="w-4 h-4" />
                {t.nav.browseFrames}
              </Link>
            </div>

            {/* Mobile: search + hamburger */}
            <div className="flex md:hidden items-center gap-1">
              <Link href="/products" className="p-2 rounded-lg text-gray-600 hover:bg-gray-100">
                <Search className="w-5 h-5" />
              </Link>
              <button
                onClick={() => setOpen(!open)}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label="Menu"
              >
                {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile slide-down menu */}
        <div className={cn(
          'md:hidden overflow-hidden transition-all duration-300 bg-white border-t border-gray-100',
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}>
          <div className="px-4 py-3 space-y-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  'flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  pathname === l.href
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                {l.label}
              </Link>
            ))}
            {/* Mobile language switcher */}
            <button
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1 px-3 py-2.5 rounded-xl text-sm font-medium border border-slate-200 w-full hover:border-blue-400 transition-all"
            >
              <span className={lang === 'en' ? 'text-blue-600 font-bold' : 'text-slate-400'}>EN</span>
              <span className="text-slate-300 mx-1">|</span>
              <span className={lang === 'hi' ? 'text-blue-600 font-bold' : 'text-slate-400'}>हिं</span>
            </button>
            <Link
              href="/products"
              className="flex items-center justify-center gap-2 mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              {t.nav.browseFrames}
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
