'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Eye, LayoutDashboard, Image, Tag, Award, Glasses, Layers, List, MessageSquare, Settings, LogOut, Star, HelpCircle } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/banners', label: 'Banners', icon: Image },
  { href: '/admin/categories', label: 'Categories', icon: Tag },
  { href: '/admin/brands', label: 'Brands', icon: Award },
  { href: '/admin/frames', label: 'Frames', icon: Glasses },
  { href: '/admin/lens-brands', label: 'Lens Brands', icon: Layers },
  { href: '/admin/lens-types', label: 'Lens Types', icon: List },
  { href: '/admin/inquiries', label: 'Inquiries', icon: MessageSquare },
  { href: '/admin/testimonials', label: 'Testimonials', icon: Star },
  { href: '/admin/faqs', label: 'FAQs', icon: HelpCircle },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

  function handleLogout() {
    logout();
    router.push('/admin/login');
  }

  return (
    <aside className="w-64 bg-gray-900 text-gray-100 min-h-screen flex flex-col">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-800">
        <Eye className="w-6 h-6 text-blue-400" />
        <span className="font-bold text-lg">OptiVision Admin</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              pathname === href
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
