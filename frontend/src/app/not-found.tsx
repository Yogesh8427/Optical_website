import Link from 'next/link';
import { Eye, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Eye className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* 404 text */}
        <h1 className="text-8xl font-black text-blue-600 mb-2 leading-none">404</h1>
        <h2 className="text-2xl font-bold text-slate-800 mb-3">Page Not Found</h2>
        <p className="text-slate-500 mb-8 leading-relaxed">
          Looks like this page has gone out of focus. The link may be broken
          or the page may have been removed.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-lg shadow-blue-500/25"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-6 py-3 rounded-xl border border-slate-200 transition-colors"
          >
            <Search className="w-4 h-4" />
            Browse Products
          </Link>
        </div>

      </div>
    </div>
  );
}
