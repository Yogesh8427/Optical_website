'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/layout/AdminSidebar';
import { useAuthStore } from '@/store/authStore';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => { hydrate(); }, [hydrate]);

  if (pathname === '/admin/login') return <>{children}</>;

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 bg-gray-50 p-6 overflow-auto">{children}</main>
    </div>
  );
}
