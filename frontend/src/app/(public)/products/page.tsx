'use client';
import { useState, useEffect, useMemo, Suspense } from 'react';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { useSearchParams } from 'next/navigation';
import { useFrames } from '@/hooks/useFrames';
import ProductCard from '@/components/products/ProductCard';
import ProductFilters from '@/components/products/ProductFilters';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, SearchX, SlidersHorizontal, X } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { useLanguage } from '@/contexts/LanguageContext';
import { useOffers } from '@/hooks/useOffers';
import { motion } from 'framer-motion';

interface Filters { category: string; brand: string; gender: string; material: string; minPrice: string; maxPrice: string; }
const EMPTY: Filters = { category: '', brand: '', gender: '', material: '', minPrice: '', maxPrice: '' };

function ProductsPageInner() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const { data: catData } = useCategories();

  const [filters, setFilters] = useState<Filters>(EMPTY);
  const [filterOpen, setFilterOpen] = useState(false);
  useBodyScrollLock(filterOpen);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // Read ?category= or ?brand= from URL on first load
  useEffect(() => {
    const cat = searchParams.get('category');
    const brand = searchParams.get('brand');

    // URL may pass a slug (from category grid) or an _id (from brand links)
    // Try to resolve slug → _id for category
    if (cat && catData?.data) {
      const matched = catData.data.find((c) => c.slug === cat || c._id === cat);
      if (matched) {
        setFilters((f) => ({ ...f, category: matched._id }));
        return;
      }
    }
    if (brand) setFilters((f) => ({ ...f, brand }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, catData]);

  const { data: offersData } = useOffers(true);
  const offerMap = useMemo(() => {
    const map = new Map();
    offersData?.data?.forEach((o: { productIds?: Array<{ _id?: string } | string>; discountType: string; discountValue: number }) => o.productIds?.forEach((p) => map.set((p as { _id?: string })._id ?? p, o)));
    return map;
  }, [offersData]);

  const { data, isLoading } = useFrames({
    search: search || undefined,
    category: filters.category && filters.category !== 'all' ? filters.category : undefined,
    brand: filters.brand && filters.brand !== 'all' ? filters.brand : undefined,
    gender: filters.gender && filters.gender !== 'all' ? filters.gender : undefined,
    material: filters.material || undefined,
    minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
    maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
    page,
    limit: 12,
  });

  const frames = data?.data ?? [];
  const pagination = data?.pagination;

  // Resolve active category name for heading
  const activeCatName = catData?.data?.find((c) => c._id === filters.category)?.name;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Dark Hero Header ── */}
      <section className="relative overflow-hidden text-white py-12 px-4 sm:px-6 lg:px-8" style={{ background: 'linear-gradient(135deg, var(--theme-primary, #2563eb) 0%, color-mix(in srgb, var(--theme-primary, #2563eb) 60%, #000) 100%)' }}>
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="text-[10rem] md:text-[16rem] font-black text-white/5 whitespace-nowrap tracking-widest">
            FRAMES
          </span>
        </div>
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs font-black uppercase tracking-widest mb-3 text-white/60">
              Browse
            </p>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-6">
              {activeCatName ? activeCatName : t.products.title}
            </h1>

            {activeCatName && (
              <p className="text-sm text-slate-400 mb-5">
                Showing results for{' '}
                <span className="font-bold text-white">
                  {activeCatName}
                </span>
                <button
                  className="ml-3 text-slate-500 hover:text-red-400 underline text-xs font-bold transition-colors"
                  onClick={() => setFilters(EMPTY)}
                >
                  Clear
                </button>
              </p>
            )}

            {/* Search Input */}
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                className="w-full pl-11 pr-4 py-3 bg-white/15 text-white placeholder-white/50 rounded-xl border border-white/20 focus:outline-none focus:border-white/50 focus:bg-white/20 text-sm font-medium transition-colors backdrop-blur-sm"
                placeholder={t.products.search}
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Mobile filter drawer backdrop ── */}
      {filterOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setFilterOpen(false)}
        />
      )}

      {/* ── Mobile filter drawer ── */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 md:hidden bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ${
          filterOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ maxHeight: '85vh' }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <p className="font-black text-slate-800 text-base">Filters</p>
          <button
            onClick={() => setFilterOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4 text-slate-600" />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-4" style={{ maxHeight: 'calc(85vh - 64px)' }}>
          <ProductFilters
            filters={filters}
            onChange={(f) => { setFilters(f); setPage(1); }}
            onReset={() => { setFilters(EMPTY); setPage(1); }}
          />
          <button
            onClick={() => setFilterOpen(false)}
            className="w-full mt-4 py-3 rounded-xl text-white font-black text-sm btn-glow"
            style={{ background: 'var(--theme-primary, #2563eb)' }}
          >
            Show Results
          </button>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Sidebar filters — desktop only */}
          <aside className="hidden md:block w-64 shrink-0">
            <div className="sticky top-6 bg-white rounded-2xl shadow-md border-t-4 p-5" style={{ borderTopColor: 'var(--theme-primary)' }}>
              <ProductFilters
                filters={filters}
                onChange={(f) => { setFilters(f); setPage(1); }}
                onReset={() => { setFilters(EMPTY); setPage(1); }}
              />
            </div>
          </aside>

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-72 rounded-2xl" />
                ))}
              </div>
            ) : frames.length === 0 ? (
              <motion.div
                className="text-center py-24"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 mx-auto" style={{ background: 'color-mix(in srgb, var(--theme-primary, #2563eb) 10%, white)' }}><SearchX className="w-10 h-10" style={{ color: 'var(--theme-primary, #2563eb)' }} /></div>
                <h2 className="text-5xl font-black tracking-tight text-slate-900 mb-3">
                  {t.products.noResults}
                </h2>
                <p className="text-slate-400 text-base font-medium">{t.products.tryAdjust}</p>
              </motion.div>
            ) : (
              <>
                {/* Count bar + mobile filter button */}
                <div className="flex items-center justify-between mb-5">
                  <p className="text-sm font-bold text-slate-500">
                    <span className="text-lg font-black" style={{ color: 'var(--theme-primary)' }}>
                      {pagination?.total ?? frames.length}
                    </span>{' '}
                    {t.products.found}
                  </p>
                  {/* Mobile filter trigger */}
                  <button
                    onClick={() => setFilterOpen(true)}
                    className="md:hidden flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-bold text-sm transition-colors relative"
                    style={{ borderColor: 'var(--theme-primary, #2563eb)', color: 'var(--theme-primary, #2563eb)' }}
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filter
                    {Object.values(filters).some(Boolean) && (
                      <span
                        className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-white text-[10px] font-black flex items-center justify-center"
                        style={{ background: 'var(--theme-primary, #2563eb)' }}
                      >
                        {Object.values(filters).filter(Boolean).length}
                      </span>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
                  {frames.map((frame, i) => (
                    <motion.div
                      key={frame._id}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <ProductCard frame={frame} offer={offerMap.get(frame._id) ?? null} />
                    </motion.div>
                  ))}
                </div>

                {pagination && pagination.pages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-10">
                    <button
                      className="px-4 py-2 rounded-xl font-bold text-sm border-2 border-slate-200 bg-white text-slate-600 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                    >
                      {t.products.previous}
                    </button>

                    {Array.from({ length: pagination.pages }).map((_, i) => {
                      const p = i + 1;
                      const isActive = p === page;
                      return (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className="w-9 h-9 rounded-xl font-bold text-sm transition-all"
                          style={
                            isActive
                              ? { background: 'var(--theme-primary)', color: '#fff' }
                              : { background: '#f1f5f9', color: '#475569' }
                          }
                        >
                          {p}
                        </button>
                      );
                    })}

                    <button
                      className="px-4 py-2 rounded-xl font-bold text-sm border-2 border-slate-200 bg-white text-slate-600 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                      disabled={page >= pagination.pages}
                      onClick={() => setPage(page + 1)}
                    >
                      {t.products.next}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductsPageInner />
    </Suspense>
  );
}
