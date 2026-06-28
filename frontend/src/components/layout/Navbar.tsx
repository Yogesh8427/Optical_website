'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, Eye, Search, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
        'hidden md:block sticky top-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-100'
          : 'bg-transparent'
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              {logoUrl ? (
                <>
                  <Image
                    src={logoUrl}
                    alt={storeName}
                    width={40}
                    height={40}
                    className="h-10 w-10 object-contain rounded-xl shrink-0"
                    priority
                  />
                  <span className="font-black text-xl text-slate-900 tracking-tight">{storeName}</span>
                </>
              ) : (
                <>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--theme-primary, #2563eb)' }}>
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-black text-xl text-slate-900 tracking-tight">{storeName}</span>
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
                    'px-4 py-2 rounded-full text-sm font-semibold transition-all',
                    pathname === l.href
                      ? 'text-white shadow-sm'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                  )}
                  style={pathname === l.href ? { background: 'var(--theme-primary, #2563eb)' } : {}}
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
                className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-slate-200 bg-white/80 text-sm font-semibold hover:border-slate-400 transition-all"
              >
                <span className={cn('transition-colors', lang === 'en' ? 'text-slate-900' : 'text-slate-400')}>EN</span>
                <span className="text-slate-300">|</span>
                <span className={cn('transition-colors', lang === 'hi' ? 'text-slate-900' : 'text-slate-400')}>हिं</span>
              </button>
              <Link
                href="/products"
                className="flex items-center gap-2 text-white text-sm font-bold px-5 py-2 rounded-xl transition-opacity hover:opacity-90"
                style={{ background: 'var(--theme-primary, #2563eb)' }}
              >
                <ShoppingBag className="w-4 h-4" />
                {t.nav.browseFrames}
              </Link>
            </div>

            {/* Mobile: search + hamburger */}
            <div className="flex md:hidden items-center gap-1">
              <Link href="/products" className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors">
                <Search className="w-5 h-5" />
              </Link>
              <button
                onClick={() => setOpen(!open)}
                className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Menu"
              >
                {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile slide-down menu with AnimatePresence */}
        <AnimatePresence>
          {open && (
            <motion.div
              key="mobile-drawer"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="md:hidden bg-white border-t border-slate-100 shadow-xl"
            >
              <div className="px-4 py-4 space-y-1">
                {links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={cn(
                      'flex items-center w-full px-4 py-3 rounded-2xl text-sm font-bold transition-colors',
                      pathname === l.href ? 'text-white' : 'text-slate-700 hover:bg-slate-50'
                    )}
                    style={pathname === l.href ? { background: 'var(--theme-primary, #2563eb)' } : {}}
                  >
                    {l.label}
                  </Link>
                ))}

                {/* Mobile language switcher */}
                <button
                  onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
                  className="flex items-center gap-1 px-4 py-3 rounded-2xl text-sm font-semibold border border-slate-200 w-full hover:border-slate-400 transition-all"
                >
                  <span className={cn('transition-colors', lang === 'en' ? 'text-slate-900' : 'text-slate-400')}>EN</span>
                  <span className="text-slate-300 mx-1">|</span>
                  <span className={cn('transition-colors', lang === 'hi' ? 'text-slate-900' : 'text-slate-400')}>हिं</span>
                </button>

                <Link
                  href="/products"
                  className="flex items-center justify-center gap-2 w-full text-white text-sm font-bold px-4 py-3 rounded-2xl transition-opacity hover:opacity-90"
                  style={{ background: 'var(--theme-primary, #2563eb)' }}
                >
                  <ShoppingBag className="w-4 h-4" />
                  {t.nav.browseFrames}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
