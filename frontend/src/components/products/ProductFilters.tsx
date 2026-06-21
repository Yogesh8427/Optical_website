'use client';
import { useCategories } from '@/hooks/useCategories';
import { useBrands } from '@/hooks/useBrands';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

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
  const { t, localize } = useLanguage();
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
    onChange({ ...filters, category: pid });
  }

  function selectSub(sid: string) {
    onChange({ ...filters, category: sid });
  }

  function clearCategory() {
    onChange({ ...filters, category: '' });
  }

  return (
    <div className="space-y-6">
      {/* Section title */}
      <p
        className="text-xs font-black uppercase tracking-widest"
        style={{ color: 'var(--theme-primary)' }}
      >
        Filters
      </p>

      {/* ── Category ── */}
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">
          {t.products.category}
        </p>

        {/* Step 1 — parent buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={clearCategory}
            className={`px-3 py-1.5 rounded-xl text-sm font-bold transition-all ${
              !filters.category ? '' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
            style={
              !filters.category
                ? { background: 'var(--theme-primary)', color: '#fff' }
                : undefined
            }
          >
            {t.products.all}
          </button>
          {parents.map((p) => (
            <button
              key={p._id}
              onClick={() => selectParent(p._id)}
              className={`px-3 py-1.5 rounded-xl text-sm font-bold transition-all ${
                activeParent?._id === p._id
                  ? ''
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              style={
                activeParent?._id === p._id
                  ? { background: 'var(--theme-primary)', color: '#fff' }
                  : undefined
              }
            >
              {localize(p)}
            </button>
          ))}
        </div>

        {/* Step 2 — sub-category chips */}
        {activeParent && activeSubs.length > 0 && (
          <div className="mt-3 pl-3 border-l-2 border-slate-200">
            <p className="text-xs text-slate-400 mb-2 flex items-center gap-1 font-semibold">
              <ChevronRight className="w-3 h-3" /> Inside <strong>{localize(activeParent)}</strong>
            </p>
            <div className="flex flex-wrap gap-1.5">
              {/* "All X" chip */}
              <button
                onClick={() => selectParent(activeParent._id)}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                  !selectedSubId ? '' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
                style={
                  !selectedSubId
                    ? { background: 'var(--theme-primary)', color: '#fff' }
                    : undefined
                }
              >
                All {localize(activeParent)}
              </button>
              {activeSubs.map((s) => (
                <button
                  key={s._id}
                  onClick={() => selectSub(s._id)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                    selectedSubId === s._id ? '' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                  style={
                    selectedSubId === s._id
                      ? { background: 'var(--theme-primary)', color: '#fff' }
                      : undefined
                  }
                >
                  {localize(s)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Brand ── */}
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">
          {t.products.brand}
        </p>
        <Select value={filters.brand || 'all'} onValueChange={(v) => set('brand', v === 'all' ? '' : (v || ''))}>
          <SelectTrigger className="rounded-xl border-slate-200 font-medium text-sm">
            <span className="text-sm">
              {filters.brand ? (brands.find((b) => b._id === filters.brand)?.name ?? t.products.allBrands) : t.products.allBrands}
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.products.allBrands}</SelectItem>
            {brands.map((b) => <SelectItem key={b._id} value={b._id}>{b.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* ── Gender ── */}
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">
          {t.products.gender}
        </p>
        <Select value={filters.gender || 'all'} onValueChange={(v) => set('gender', v === 'all' ? '' : (v || ''))}>
          <SelectTrigger className="rounded-xl border-slate-200 font-medium text-sm">
            <SelectValue placeholder={t.products.all} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.products.all}</SelectItem>
            <SelectItem value="men">{t.products.men}</SelectItem>
            <SelectItem value="women">{t.products.women}</SelectItem>
            <SelectItem value="unisex">{t.products.unisex}</SelectItem>
            <SelectItem value="kids">{t.products.kids}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ── Material ── */}
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">
          {t.products.material}
        </p>
        <Input
          className="rounded-xl border-slate-200 text-sm"
          placeholder="e.g. Metal, Acetate"
          value={filters.material}
          onChange={(e) => set('material', e.target.value)}
        />
      </div>

      {/* ── Price ── */}
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">
          {t.products.priceRange}
        </p>
        <div className="flex gap-2">
          <Input
            className="rounded-xl border-slate-200 text-sm"
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => set('minPrice', e.target.value)}
          />
          <Input
            className="rounded-xl border-slate-200 text-sm"
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => set('maxPrice', e.target.value)}
          />
        </div>
      </div>

      {/* Reset button */}
      <button
        onClick={onReset}
        className="w-full py-2.5 rounded-xl font-black text-sm border-2 transition-all hover:opacity-80"
        style={{
          borderColor: 'var(--theme-primary)',
          color: 'var(--theme-primary)',
          background: 'transparent',
        }}
      >
        {t.products.resetFilters}
      </button>
    </div>
  );
}
