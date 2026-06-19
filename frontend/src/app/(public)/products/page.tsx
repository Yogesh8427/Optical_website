'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useFrames } from '@/hooks/useFrames';
import ProductCard from '@/components/products/ProductCard';
import ProductFilters from '@/components/products/ProductFilters';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Search } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { useLanguage } from '@/contexts/LanguageContext';

interface Filters { category: string; brand: string; gender: string; material: string; minPrice: string; maxPrice: string; }
const EMPTY: Filters = { category: '', brand: '', gender: '', material: '', minPrice: '', maxPrice: '' };

export default function ProductsPage() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const { data: catData } = useCategories();

  const [filters, setFilters] = useState<Filters>(EMPTY);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-1">
        {activeCatName ? activeCatName : t.products.title}
      </h1>
      {activeCatName && (
        <p className="text-sm text-gray-400 mb-6">
          Showing results for <span className="text-blue-600 font-medium">{activeCatName}</span>
          <button className="ml-2 text-gray-400 hover:text-red-500 underline text-xs" onClick={() => setFilters(EMPTY)}>
            Clear
          </button>
        </p>
      )}
      {!activeCatName && <div className="mb-6" />}

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          className="pl-10"
          placeholder={t.products.search}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      <div className="flex gap-6">
        {/* Sidebar filters */}
        <aside className="hidden md:block w-60 shrink-0">
          <ProductFilters
            filters={filters}
            onChange={(f) => { setFilters(f); setPage(1); }}
            onReset={() => { setFilters(EMPTY); setPage(1); }}
          />
        </aside>

        {/* Product grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-xl" />)}
            </div>
          ) : frames.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg font-medium mb-2">{t.products.noResults}</p>
              <p className="text-sm">{t.products.tryAdjust}</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-400 mb-4">{pagination?.total ?? frames.length} {t.products.found}</p>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
                {frames.map((frame) => <ProductCard key={frame._id} frame={frame} />)}
              </div>
              {pagination && pagination.pages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <Button variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>{t.products.previous}</Button>
                  <span className="flex items-center px-4 text-sm text-gray-600">{t.products.page} {page} {t.products.of} {pagination.pages}</span>
                  <Button variant="outline" disabled={page >= pagination.pages} onClick={() => setPage(page + 1)}>{t.products.next}</Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
