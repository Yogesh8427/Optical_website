'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid2x2, Phone, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { href: '/',         label: 'Home',     icon: Home      },
  { href: '/products', label: 'Products', icon: Grid2x2   },
  { href: '/about',    label: 'About',    icon: Info      },
  { href: '/contact',  label: 'Contact',  icon: Phone     },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-around px-2 py-1 safe-area-pb">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-all min-w-[60px]"
            >
              <div className={cn(
                'w-10 h-6 flex items-center justify-center rounded-full transition-all',
                active ? 'bg-blue-100' : ''
              )}>
                <Icon className={cn(
                  'w-5 h-5 transition-all',
                  active ? 'text-blue-600' : 'text-gray-400'
                )} />
              </div>
              <span className={cn(
                'text-[10px] font-medium transition-all',
                active ? 'text-blue-600' : 'text-gray-400'
              )}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
