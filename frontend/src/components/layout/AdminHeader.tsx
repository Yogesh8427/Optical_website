'use client';
import { usePathname } from 'next/navigation';
import { Bell, User } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const pageTitles: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/banners': 'Banners',
  '/admin/categories': 'Categories',
  '/admin/brands': 'Brands',
  '/admin/frames': 'Frames',
  '/admin/lens-brands': 'Lens Brands',
  '/admin/lens-types': 'Lens Types',
  '/admin/inquiries': 'Inquiries',
  '/admin/testimonials': 'Testimonials',
  '/admin/faqs': 'FAQs',
  '/admin/settings': 'Settings',
};

export default function AdminHeader() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const title = pageTitles[pathname] ?? 'Admin';

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
      <div>
        <h1 className="text-lg font-semibold text-slate-800">{title}</h1>
        <p className="text-xs text-slate-400">OptiVision Admin Panel</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Notification bell — decorative for now */}
        <button className="relative w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
          <Bell className="w-4 h-4 text-slate-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full" />
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-slate-800 leading-none">{user?.name ?? 'Admin'}</p>
            <p className="text-xs text-slate-400 mt-0.5 capitalize">{user?.role ?? 'admin'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
