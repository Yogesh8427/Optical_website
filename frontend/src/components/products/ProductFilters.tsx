'use client';
import { useCategories } from '@/hooks/useCategories';
import { useBrands } from '@/hooks/useBrands';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface Filters {
  category: string;
  brand: string;
  gender: string;
  material: string;
  minPrice: string;
  maxPrice: string;
}

interface Props {
  filters: Filters;
  onChange: (filters: Filters) => void;
  onReset: () => void;
}

export default function ProductFilters({ filters, onChange, onReset }: Props) {
  const { data: catData } = useCategories();
  const { data: brandData } = useBrands();

  const allCats = catData?.data?.filter((c) => c.active) ?? [];
  const parents = allCats.filter((c) => !c.parentId);

  const parentIdOf = (cat: (typeof allCats)[0]): string | null => {
    const p = cat.parentId;
    if (!p) return null;
    return typeof p === 'string' ? p : (p as { _id: string })._id;
  };

  const childrenOf = (pid: string) => allCats.filter((c) => parentIdOf(c) === pid);

  // Which parent is currently "active" (selected directly, or via a child)?
  const selectedCat = allCats.find((c) => c._id === filters.category) ?? null;
  const selectedParentId = selectedCat
    ? (parentIdOf(selectedCat) ?? selectedCat._id)   // if it's a child → its parent; if parent → itself
    : null;
  const activeParent = selectedParentId ? allCats.find((c) => c._id === selectedParentId) ?? null : null;
  const activeSubs = activeParent ? childrenOf(activeParent._id) : [];
  // The selected sub-category (null if we selected the parent itself)
  const selectedSubId =
    selectedCat && parentIdOf(selectedCat) ? selectedCat._id : null;

  const brands = brandData?.data?.filter((b) => b.active) ?? [];

  function set(key: keyof Filters, value: string) {
    onChange({ ...filters, [key]: value });
  }

  function selectParent(pid: string) {
    // Select the parent → backend returns all sub-cat products
    onChange({ ...filters, category: pid });
  }

  function selectSub(sid: string) {
    onChange({ ...filters, category: sid });
  }

  function clearCategory() {
    onChange({ ...filters, category: '' });
  }

  return (
    <div className="space-y-5">

      {/* ── Category ── */}
      <div>
        <Label className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2 block">Category</Label>

        {/* Step 1 — parent buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={clearCategory}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
              !filters.category
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
            }`}
          >
            All
          </button>
          {parents.map((p) => (
            <button
              key={p._id}
              onClick={() => selectParent(p._id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                activeParent?._id === p._id
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* Step 2 — sub-category chips (shown when a parent is selected and has children) */}
        {activeParent && activeSubs.length > 0 && (
          <div className="mt-3 pl-3 border-l-2 border-blue-200">
            <p className="text-xs text-slate-400 mb-2 flex items-center gap-1">
              <ChevronRight className="w-3 h-3" /> Filter inside <strong>{activeParent.name}</strong>
            </p>
            <div className="flex flex-wrap gap-2">
              {/* "All Men/Women/Kids" chip */}
              <button
                onClick={() => selectParent(activeParent._id)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                  !selectedSubId
                    ? 'bg-blue-100 text-blue-700 border-blue-300'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-blue-200'
                }`}
              >
                All {activeParent.name}
              </button>
              {activeSubs.map((s) => (
                <button
                  key={s._id}
                  onClick={() => selectSub(s._id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                    selectedSubId === s._id
                      ? 'bg-blue-100 text-blue-700 border-blue-300'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-blue-200'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Brand ── */}
      <div>
        <Label className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2 block">Brand</Label>
        <Select value={filters.brand || 'all'} onValueChange={(v) => set('brand', v === 'all' ? '' : v)}>
          <SelectTrigger>
            <span className="text-sm">
              {filters.brand ? (brands.find((b) => b._id === filters.brand)?.name ?? 'All Brands') : 'All Brands'}
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Brands</SelectItem>
            {brands.map((b) => <SelectItem key={b._id} value={b._id}>{b.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* ── Gender ── */}
      <div>
        <Label className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2 block">Gender</Label>
        <Select value={filters.gender || 'all'} onValueChange={(v) => set('gender', v === 'all' ? '' : v)}>
          <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="men">Men</SelectItem>
            <SelectItem value="women">Women</SelectItem>
            <SelectItem value="unisex">Unisex</SelectItem>
            <SelectItem value="kids">Kids</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ── Material ── */}
      <div>
        <Label className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2 block">Material</Label>
        <Input placeholder="e.g. Metal, Acetate" value={filters.material} onChange={(e) => set('material', e.target.value)} />
      </div>

      {/* ── Price ── */}
      <div>
        <Label className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2 block">Price Range</Label>
        <div className="flex gap-2">
          <Input type="number" placeholder="Min" value={filters.minPrice} onChange={(e) => set('minPrice', e.target.value)} />
          <Input type="number" placeholder="Max" value={filters.maxPrice} onChange={(e) => set('maxPrice', e.target.value)} />
        </div>
      </div>

      <Button variant="outline" className="w-full" onClick={onReset}>Reset Filters</Button>
    </div>
  );
}
