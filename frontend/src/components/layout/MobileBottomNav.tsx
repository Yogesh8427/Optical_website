'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Grid2x2, Tag, Phone } from 'lucide-react';

const tabs = [
  { href: '/',         label: 'Home',     icon: Home },
  { href: '/products', label: 'Products', icon: Grid2x2 },
  { href: '/coupons',  label: 'Offers',   icon: Tag },
  { href: '/contact',  label: 'Contact',  icon: Phone },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-white/85 backdrop-blur-xl border-t border-slate-200/80 px-2 pb-safe">
        <div className="flex items-center justify-around h-16">
          {tabs.map(({ href, label, icon: Icon }) => {
            const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
            return (
              <Link key={href} href={href} className="flex-1 flex flex-col items-center justify-center gap-1 relative py-2">
                {active && (
                  <motion.div
                    layoutId="mobile-nav-pill"
                    className="absolute inset-x-1 inset-y-0 bg-blue-50 rounded-xl"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <motion.div
                  animate={{ scale: active ? 1.1 : 1, y: active ? -1 : 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="relative"
                >
                  <Icon
                    className={`w-5 h-5 transition-colors ${active ? 'text-blue-600' : 'text-slate-400'}`}
                    strokeWidth={active ? 2.5 : 1.8}
                  />
                </motion.div>
                <span className={`text-[10px] font-semibold relative transition-colors ${active ? 'text-blue-600' : 'text-slate-400'}`}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
