'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminHeader from '@/components/layout/AdminHeader';
import { useAuthStore } from '@/store/authStore';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hydrate  = useAuthStore((s) => s.hydrate);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { hydrate(); }, [hydrate]);

  // Close drawer on route change
  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  if (pathname === '/admin/login') return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
