'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Glasses, LayoutDashboard, Image, Tag, Award, Layers, List,
  MessageSquare, Settings, LogOut, Star, HelpCircle, ChevronRight,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
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
      { href: '/admin/banners', label: 'Banners', icon: Image },
      { href: '/admin/categories', label: 'Categories', icon: Tag },
      { href: '/admin/brands', label: 'Brands', icon: Award },
      { href: '/admin/frames', label: 'Frames', icon: Glasses },
    ],
  },
  {
    label: 'Lens Options',
    items: [
      { href: '/admin/lens-brands', label: 'Lens Brands', icon: Layers },
      { href: '/admin/lens-types', label: 'Lens Types', icon: List },
    ],
  },
  {
    label: 'Engagement',
    items: [
      { href: '/admin/inquiries', label: 'Inquiries', icon: MessageSquare },
      { href: '/admin/testimonials', label: 'Testimonials', icon: Star },
      { href: '/admin/faqs', label: 'FAQs', icon: HelpCircle },
    ],
  },
  {
    label: 'Configuration',
    items: [
      { href: '/admin/settings', label: 'Settings', icon: Settings },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + '/');
  }

  function handleLogout() {
    logout();
    router.push('/admin/login');
  }

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 min-h-screen flex flex-col shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-800">
        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
          <Glasses className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-bold text-sm text-white leading-none">OptiVision</p>
          <p className="text-xs text-slate-500 mt-0.5">Admin Panel</p>
        </div>
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
                    className={cn(
                      'group flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150',
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
          className="group flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
        >
          <LogOut className="w-4 h-4 shrink-0 group-hover:text-red-400" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
