'use client';
import { use, useState } from 'react';
import { useFrames } from '@/hooks/useFrames';
import { useCategories } from '@/hooks/useCategories';
import ProductCard from '@/components/products/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Glasses } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedSubId, setSelectedSubId] = useState('');
  const { localize } = useLanguage(); // '' = all (parent), or a sub-cat _id

  const { data: catData } = useCategories();
  const allCats = catData?.data ?? [];

  // The category matching this slug
  const category = allCats.find((c) => c.slug === slug);

  // Helper: get parent _id string from a category
  const parentIdOf = (cat: typeof allCats[0]): string | null => {
    const p = cat.parentId;
    if (!p) return null;
    return typeof p === 'string' ? p : (p as { _id: string })._id;
  };

  // Is this a parent category (no parentId)?
  const isParent = category ? !parentIdOf(category) : false;

  // Sub-categories of this category (only relevant when isParent)
  const subCategories = category ? allCats.filter((c) => parentIdOf(c) === category._id) : [];

  // The category ID we actually pass to the API:
  // - if user picked a specific sub → use that sub's _id
  // - otherwise → use the parent's _id (backend expands to all children)
  const activeCategoryId = selectedSubId || category?._id;

  const { data, isLoading } = useFrames({
    category: activeCategoryId,
    search: search || undefined,
    page,
    limit: 12,
  });

  const frames = data?.data ?? [];
  const pagination = data?.pagination;

  function pickSub(id: string) {
    setSelectedSubId(id);
    setPage(1);
  }

  const activeSubName = selectedSubId
    ? (subCategories.find((s) => s._id === selectedSubId) ? localize(subCategories.find((s) => s._id === selectedSubId)!) : '')
    : '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-900 mb-1">{category ? localize(category) : slug}</h1>
      {category?.description && <p className="text-gray-500 mb-4 text-sm">{category.description}</p>}

      {/* Sub-category chips — only when this is a parent with children */}
      {isParent && subCategories.length > 0 && (
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Filter by type</p>
          <div className="flex flex-wrap gap-2">
            {/* "All" chip */}
            <button
              onClick={() => pickSub('')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                !selectedSubId
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              All {category ? localize(category) : ''}
            </button>

            {/* Sub-category chips */}
            {subCategories.map((sub) => (
              <button
                key={sub._id}
                onClick={() => pickSub(sub._id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  selectedSubId === sub._id
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'
                }`}
              >
                {localize(sub)}
              </button>
            ))}
          </div>

          {/* Active sub breadcrumb */}
          {activeSubName && (
            <p className="mt-2 text-xs text-blue-600">
              Showing: <strong>{category ? localize(category) : ''}</strong> → <strong>{activeSubName}</strong>
              <button onClick={() => pickSub('')} className="ml-2 text-gray-400 hover:text-red-500 underline">clear</button>
            </p>
          )}
        </div>
      )}

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          className="pl-10"
          placeholder={`Search in ${activeSubName || category?.name || 'this category'}…`}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-xl" />)}
        </div>
      ) : frames.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Glasses className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p className="font-medium">No products found{activeSubName ? ` in "${activeSubName}"` : ''}.</p>
          {selectedSubId && (
            <button onClick={() => pickSub('')} className="mt-2 text-sm text-blue-600 underline">
              Show all  {category ? localize(category) : ''}
            </button>
          )}
        </div>
      ) : (
        <>
          <p className="text-xs text-gray-400 mb-4">{pagination?.total ?? frames.length} product{(pagination?.total ?? frames.length) !== 1 ? 's' : ''} found</p>
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
