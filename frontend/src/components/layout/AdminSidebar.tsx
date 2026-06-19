'use client';
import Link from 'next/link';
import NextImage from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  Glasses, LayoutDashboard, Image, Tag, Award, Layers, List,
  MessageSquare, Settings, LogOut, Star, HelpCircle, ChevronRight, X,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useSettings } from '@/hooks/useSettings';
import { cn } from '@/lib/utils';

const navGroups = [
  {
    label: 'Overview',
    items: [
      { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    ],
  },
  {
    label: 'Store Content',
    items: [
      { href: '/admin/banners',    label: 'Banners',    icon: Image },
      { href: '/admin/categories', label: 'Categories', icon: Tag },
      { href: '/admin/brands',     label: 'Brands',     icon: Award },
      { href: '/admin/frames',     label: 'Products',   icon: Glasses },
    ],
  },
  {
    label: 'Lens Options',
    items: [
      { href: '/admin/lens-brands', label: 'Lens Brands', icon: Layers },
      { href: '/admin/lens-types',  label: 'Lens Types',  icon: List },
    ],
  },
  {
    label: 'Engagement',
    items: [
      { href: '/admin/inquiries',    label: 'Inquiries',    icon: MessageSquare },
      { href: '/admin/testimonials', label: 'Testimonials', icon: Star },
      { href: '/admin/faqs',         label: 'FAQs',         icon: HelpCircle },
    ],
  },
  {
    label: 'Configuration',
    items: [
      { href: '/admin/settings', label: 'Settings', icon: Settings },
    ],
  },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: Props) {
  const pathname = usePathname();
  const router   = useRouter();
  const logout      = useAuthStore((s) => s.logout);
  const { data: settingsData } = useSettings();
  const logoUrl   = settingsData?.data?.logo;
  const storeName = settingsData?.data?.storeName || 'OptiVision';

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + '/');
  }

  function handleLogout() {
    logout();
    router.push('/admin/login');
  }

  const sidebar = (
    <aside className="w-64 bg-slate-900 text-slate-100 h-full flex flex-col">
      {/* Logo */}
      <div className="flex items-center justify-between gap-3 px-5 py-5 border-b border-slate-800">
        <div className="flex items-center gap-3 min-w-0">
          {logoUrl ? (
            <NextImage
              src={logoUrl}
              alt={storeName}
              width={110}
              height={36}
              className="h-9 w-auto object-contain brightness-0 invert"
              priority
            />
          ) : (
            <>
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30 shrink-0">
                <Glasses className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-sm text-white leading-none truncate">{storeName}</p>
                <p className="text-xs text-slate-500 mt-0.5">Admin Panel</p>
              </div>
            </>
          )}
        </div>
        {/* Close button — mobile only */}
        <button
          onClick={onClose}
          className="lg:hidden w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-5">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest px-3 mb-1.5">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map(({ href, label, icon: Icon, exact }) => {
                const active = isActive(href, exact);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={onClose}
                    className={cn(
                      'group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                      active
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className={cn('w-4 h-4 shrink-0', active ? 'text-white' : 'text-slate-500 group-hover:text-slate-300')} />
                      {label}
                    </span>
                    {active && <ChevronRight className="w-3.5 h-3.5 opacity-70" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="group flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
        >
          <LogOut className="w-4 h-4 shrink-0 group-hover:text-red-400" />
          Sign Out
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* ── Desktop: always visible ── */}
      <div className="hidden lg:flex lg:shrink-0 lg:min-h-screen">
        {sidebar}
      </div>

      {/* ── Mobile: slide-in drawer ── */}
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />
      {/* Drawer */}
      <div
        className={cn(
          'fixed top-0 left-0 z-50 h-full transition-transform duration-300 ease-in-out lg:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {sidebar}
      </div>
    </>
  );
}
