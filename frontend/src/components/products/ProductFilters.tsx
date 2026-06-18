'use client';
import { useCategories } from '@/hooks/useCategories';
import { useBrands } from '@/hooks/useBrands';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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
  const categories = catData?.data?.filter((c) => c.active) ?? [];
  const brands = brandData?.data?.filter((b) => b.active) ?? [];

  function set(key: keyof Filters, value: string | null) {
    onChange({ ...filters, [key]: value ?? '' });
  }

  return (
    <div className="space-y-5">
      <div>
        <Label className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2 block">Category</Label>
        <Select value={filters.category || 'all'} onValueChange={(v) => set('category', v === 'all' ? '' : v)}>
          <SelectTrigger>
            <span className="text-sm">
              {filters.category
                ? (categories.find((c) => c._id === filters.category)?.name ?? 'All Categories')
                : 'All Categories'}
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((c) => <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2 block">Brand</Label>
        <Select value={filters.brand || 'all'} onValueChange={(v) => set('brand', v === 'all' ? '' : v)}>
          <SelectTrigger>
            <span className="text-sm">
              {filters.brand
                ? (brands.find((b) => b._id === filters.brand)?.name ?? 'All Brands')
                : 'All Brands'}
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Brands</SelectItem>
            {brands.map((b) => <SelectItem key={b._id} value={b._id}>{b.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2 block">Gender</Label>
        <Select value={filters.gender} onValueChange={(v) => set('gender', v)}>
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

      <div>
        <Label className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2 block">Material</Label>
        <Input placeholder="e.g. Metal, Acetate" value={filters.material} onChange={(e) => set('material', e.target.value)} />
      </div>

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
