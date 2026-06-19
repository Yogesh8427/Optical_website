'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, User, Menu, Inbox, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useSettings } from '@/hooks/useSettings';
import { useInquiries, useUpdateInquiryStatus } from '@/hooks/useInquiries';

const pageTitles: Record<string, string> = {
  '/admin':              'Dashboard',
  '/admin/banners':      'Banners',
  '/admin/categories':   'Categories',
  '/admin/brands':       'Brands',
  '/admin/frames':       'Products',
  '/admin/lens-brands':  'Lens Brands',
  '/admin/lens-types':   'Lens Types',
  '/admin/inquiries':    'Inquiries',
  '/admin/testimonials': 'Testimonials',
  '/admin/faqs':         'FAQs',
  '/admin/settings':     'Settings',
};

interface Props { onMenuClick: () => void; }

export default function AdminHeader({ onMenuClick }: Props) {
  const pathname  = usePathname();
  const router    = useRouter();
  const user      = useAuthStore((s) => s.user);
  const title     = pageTitles[pathname] ?? 'Admin';
  const { data: settingsData } = useSettings();
  const storeName = settingsData?.data?.storeName || 'OptiVision';

  /* ── Notification state ───────────────────────────── */
  const [open, setOpen]       = useState(false);
  const dropdownRef           = useRef<HTMLDivElement>(null);
  const updateStatus          = useUpdateInquiryStatus();

  // Poll new inquiries every 60 s
  const { data: inqData } = useInquiries(
    { status: 'new', limit: 10 },
    { refetchInterval: 60_000 },
  );

  const newInquiries = (inqData?.data ?? []).slice(0, 8);
  const count        = newInquiries.length;

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function handleNotificationClick(inqId: string) {
    // Mark as contacted so it leaves "new" bucket
    updateStatus.mutate({ id: inqId, status: 'contacted' });
    setOpen(false);
    router.push('/admin/inquiries');
  }

  function handleViewAll() {
    setOpen(false);
    router.push('/admin/inquiries');
  }

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins  = Math.floor(diff / 60_000);
    if (mins < 1)  return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24)  return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  return (
    <header className="h-14 md:h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 shrink-0">
      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
        >
          <Menu className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-base md:text-lg font-semibold text-slate-800 leading-none">{title}</h1>
          <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">{storeName} Admin Panel</p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">

        {/* ── Bell + dropdown ─────────────────────────── */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="relative w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <Bell className="w-4 h-4 text-slate-500" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                {count > 9 ? '9+' : count}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 top-11 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden">
              {/* Header */}
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-slate-500" />
                  <p className="text-sm font-semibold text-slate-800">Notifications</p>
                </div>
                {count > 0 && (
                  <span className="text-xs bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded-full">
                    {count} new
                  </span>
                )}
              </div>

              {/* List */}
              {count === 0 ? (
                <div className="py-10 flex flex-col items-center gap-2 text-slate-400">
                  <Inbox className="w-8 h-8 text-slate-200" />
                  <p className="text-sm">No new inquiries</p>
                  <p className="text-xs text-slate-300">You're all caught up!</p>
                </div>
              ) : (
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                  {newInquiries.map((inq) => (
                    <button
                      key={inq._id}
                      onClick={() => handleNotificationClick(inq._id)}
                      className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors flex items-start gap-3 group"
                    >
                      {/* Avatar */}
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-blue-600">
                          {inq.customerName?.charAt(0)?.toUpperCase() ?? '?'}
                        </span>
                      </div>
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{inq.customerName}</p>
                        <p className="text-xs text-slate-500 truncate">
                          Inquiry for <span className="text-slate-700 font-medium">{inq.frameId?.name ?? 'a frame'}</span>
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">{timeAgo(inq.createdAt)}</p>
                      </div>
                      {/* Arrow on hover */}
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 mt-1 shrink-0 transition-colors" />
                    </button>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div className="px-4 py-2.5 border-t border-slate-100">
                <button
                  onClick={handleViewAll}
                  className="w-full text-xs font-semibold text-blue-600 hover:text-blue-700 text-center py-1 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  View all inquiries →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── User ──────────────────────────────────────── */}
        <div className="flex items-center gap-2 pl-2 md:pl-3 border-l border-slate-200">
          <div className="w-8 h-8 md:w-9 md:h-9 bg-blue-600 rounded-xl flex items-center justify-center">
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
