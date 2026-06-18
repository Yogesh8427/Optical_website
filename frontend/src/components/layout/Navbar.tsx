'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

const links = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-700">
            <Eye className="w-6 h-6" />
            OptiVision
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="text-gray-600 hover:text-blue-700 font-medium transition-colors">
                {l.label}
              </Link>
            ))}
          </div>

          {/* Mobile toggle */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t px-4 pb-4">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="block py-2 text-gray-700 hover:text-blue-700 font-medium" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
