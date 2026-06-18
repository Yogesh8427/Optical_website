'use client';
import { useState } from 'react';
import { useFrames } from '@/hooks/useFrames';
import ProductCard from '@/components/products/ProductCard';
import ProductFilters from '@/components/products/ProductFilters';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Search } from 'lucide-react';

const EMPTY: Filters = { category: '', brand: '', gender: '', material: '', minPrice: '', maxPrice: '' };
interface Filters { category: string; brand: string; gender: string; material: string; minPrice: string; maxPrice: string; }

export default function ProductsPage() {
  const [filters, setFilters] = useState<Filters>(EMPTY);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">All Products</h1>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          className="pl-10"
          placeholder="Search frames..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      <div className="flex gap-6">
        {/* Sidebar filters */}
        <aside className="hidden md:block w-60 shrink-0">
          <ProductFilters filters={filters} onChange={(f) => { setFilters(f); setPage(1); }} onReset={() => { setFilters(EMPTY); setPage(1); }} />
        </aside>

        {/* Product grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-xl" />)}
            </div>
          ) : frames.length === 0 ? (
            <div className="text-center py-20 text-gray-500">No frames found. Try adjusting your filters.</div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
                {frames.map((frame) => <ProductCard key={frame._id} frame={frame} />)}
              </div>
              {pagination && pagination.pages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <Button variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
                  <span className="flex items-center px-4 text-sm text-gray-600">Page {page} of {pagination.pages}</span>
                  <Button variant="outline" disabled={page >= pagination.pages} onClick={() => setPage(page + 1)}>Next</Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
