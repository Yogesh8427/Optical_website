'use client';
import { use, useState } from 'react';
import { useFrames } from '@/hooks/useFrames';
import { useCategories } from '@/hooks/useCategories';
import ProductCard from '@/components/products/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data: catData } = useCategories();
  const category = catData?.data?.find((c) => c.slug === slug);

  const { data, isLoading } = useFrames({
    category: category?._id,
    search: search || undefined,
    page,
    limit: 12,
  });

  const frames = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{category?.name ?? slug}</h1>
      {category?.description && <p className="text-gray-600 mb-6">{category.description}</p>}

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input className="pl-10" placeholder="Search in this category..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-xl" />)}
        </div>
      ) : frames.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No frames found in this category.</div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
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
  );
}
