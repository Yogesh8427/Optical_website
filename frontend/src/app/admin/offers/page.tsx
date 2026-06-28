'use client';
import { useState, useRef } from 'react';
import { useOffers, useCreateOffer, useUpdateOffer, useDeleteOffer } from '@/hooks/useOffers';
import { useBrands } from '@/hooks/useBrands';
import { useCategories } from '@/hooks/useCategories';
import { useFrames } from '@/hooks/useFrames';
import { useLensBrands } from '@/hooks/useLensBrands';
import { useLensProducts } from '@/hooks/useLensProducts';
import { Offer } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';

const emptyForm = {
  title: '',
  description: '',
  occasionName: '',
  discountType: 'percentage',
  discountValue: '',
  bgColor: '#2563eb',
  startDate: '',
  endDate: '',
  active: true,
  selectedBrands: [] as string[],
  selectedCategories: [] as string[],
  selectedProducts: [] as string[],
  selectedLensBrands: [] as string[],
  selectedLensTypes: [] as string[],
};

function fmtDate(d?: string) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function AdminOffersPage() {
  const { data, isLoading } = useOffers();
  const offers: Offer[] = data?.data ?? [];
  const { data: brandsData } = useBrands();
  const { data: catsData } = useCategories();
  const { data: framesData } = useFrames({ limit: 200 });
  const { data: lensBrandsData } = useLensBrands();
  const { data: lensProductsData } = useLensProducts();
  const allBrands = brandsData?.data ?? [];
  const allCategories = catsData?.data ?? [];
  const allFrames = framesData?.data ?? [];
  const allLensBrands = lensBrandsData?.data ?? [];
  const allLensTypes = lensProductsData?.data ?? [];
  const createOffer = useCreateOffer();
  const updateOffer = useUpdateOffer();
  const deleteOffer = useDeleteOffer();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Offer | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function openCreate() {
    setEditing(null);
    setForm({ ...emptyForm });
    setBannerFile(null);
    setOpen(true);
  }

  function getId(x: unknown): string {
    if (typeof x === 'string') return x;
    if (x && typeof x === 'object' && '_id' in x) return (x as { _id: string })._id;
    return '';
  }

  function openEdit(o: Offer) {
    setEditing(o);
    setForm({
      title: o.title,
      description: o.description,
      occasionName: o.occasionName,
      discountType: o.discountType,
      discountValue: String(o.discountValue),
      bgColor: o.bgColor || '#2563eb',
      startDate: o.startDate ? o.startDate.slice(0, 10) : '',
      endDate: o.endDate ? o.endDate.slice(0, 10) : '',
      active: o.active,
      selectedBrands: ((o as unknown as { brandIds?: unknown[] }).brandIds ?? []).map(getId).filter(Boolean),
      selectedCategories: ((o as unknown as { categoryIds?: unknown[] }).categoryIds ?? []).map(getId).filter(Boolean),
      selectedProducts: (o.productIds ?? []).map(getId).filter(Boolean),
      selectedLensBrands: ((o as unknown as { lensBrandIds?: unknown[] }).lensBrandIds ?? []).map(getId).filter(Boolean),
      selectedLensTypes: ((o as unknown as { lensProductIds?: unknown[] }).lensProductIds ?? []).map(getId).filter(Boolean),
    });
    setBannerFile(null);
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    const { selectedBrands, selectedCategories, selectedProducts, selectedLensBrands, selectedLensTypes, ...rest } = form;
    Object.entries(rest).forEach(([k, v]) => fd.append(k, String(v)));
    if (selectedBrands.length === 0) fd.append('brandIds', '');
    else selectedBrands.forEach(id => fd.append('brandIds', id));
    if (selectedCategories.length === 0) fd.append('categoryIds', '');
    else selectedCategories.forEach(id => fd.append('categoryIds', id));
    if (selectedProducts.length === 0) fd.append('productIds', '');
    else selectedProducts.forEach(id => fd.append('productIds', id));
    if (selectedLensBrands.length === 0) fd.append('lensBrandIds', '');
    else selectedLensBrands.forEach(id => fd.append('lensBrandIds', id));
    if (selectedLensTypes.length === 0) fd.append('lensProductIds', '');
    else selectedLensTypes.forEach(id => fd.append('lensProductIds', id));
    if (bannerFile) fd.append('bannerImage', bannerFile);
    try {
      if (editing) {
        await updateOffer.mutateAsync({ id: editing._id, form: fd });
        toast.success('Offer updated');
      } else {
        await createOffer.mutateAsync(fd);
        toast.success('Offer created');
      }
      setOpen(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error saving offer');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this offer?')) return;
    try { await deleteOffer.mutateAsync(id); toast.success('Offer deleted'); }
    catch { toast.error('Error deleting offer'); }
  }

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800">Offers</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage promotional offers</p>
        </div>
        <Button onClick={openCreate} size="sm" className="gap-1.5">
          <Plus className="w-4 h-4 md:mr-1" /><span className="hidden md:inline">New Offer</span>
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="py-10 text-center text-slate-400 text-sm">Loading...</div>
        ) : offers.length === 0 ? (
          <div className="py-10 text-center text-slate-400 text-sm">No offers yet. Create your first offer.</div>
        ) : (
          <>
            {/* ── Mobile cards ── */}
            <div className="divide-y divide-slate-50 md:hidden">
              {offers.map((o) => (
                <div key={o._id} className="px-4 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: o.bgColor || '#2563eb' }} />
                      <p className="font-semibold text-slate-800 text-sm truncate">{o.title}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(o)}><Pencil className="w-3.5 h-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400" onClick={() => handleDelete(o._id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 items-center">
                    <Badge className="bg-orange-100 text-orange-700 border-0 font-semibold text-xs">
                      {o.discountType === 'percentage' ? `${o.discountValue}% OFF` : `₹${o.discountValue} OFF`}
                    </Badge>
                    <Badge className={o.active ? 'bg-green-100 text-green-700 border-0 text-xs' : 'bg-slate-100 text-slate-500 border-0 text-xs'}>
                      {o.active ? 'Active' : 'Inactive'}
                    </Badge>
                    {o.occasionName && <span className="text-xs text-slate-400">{o.occasionName}</span>}
                  </div>
                  {(o.startDate || o.endDate) && (
                    <p className="text-xs text-slate-400 mt-1">{fmtDate(o.startDate)} → {fmtDate(o.endDate)}</p>
                  )}
                </div>
              ))}
            </div>

            {/* ── Desktop table ── */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b text-xs text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Title</th>
                    <th className="px-4 py-3 text-left font-medium">Occasion</th>
                    <th className="px-4 py-3 text-left font-medium">Discount</th>
                    <th className="px-4 py-3 text-left font-medium">Dates</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {offers.map((o) => (
                    <tr key={o._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: o.bgColor || '#2563eb' }} />
                          <span className="font-medium text-slate-800">{o.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{o.occasionName || '—'}</td>
                      <td className="px-4 py-3">
                        <Badge className="bg-orange-100 text-orange-700 border-0 font-semibold">
                          {o.discountType === 'percentage' ? `${o.discountValue}% OFF` : `₹${o.discountValue} OFF`}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs">
                        {o.startDate || o.endDate ? `${fmtDate(o.startDate)} → ${fmtDate(o.endDate)}` : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={o.active ? 'bg-green-100 text-green-700 border-0' : 'bg-slate-100 text-slate-500 border-0'}>
                          {o.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button size="sm" variant="ghost" onClick={() => openEdit(o)} className="h-8 w-8 p-0"><Pencil className="w-3.5 h-3.5" /></Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(o._id)} className="h-8 w-8 p-0 text-red-400 hover:text-red-600 hover:bg-red-50"><Trash2 className="w-3.5 h-3.5" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* ── Create / Edit dialog ── */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[calc(100vw-1.5rem)] sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Offer' : 'Create Offer'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label>Title *</Label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} />
            </div>
            <div className="space-y-1.5">
              <Label>Occasion Name</Label>
              <Input value={form.occasionName} onChange={e => setForm(f => ({ ...f, occasionName: e.target.value }))} placeholder="e.g. Diwali Sale" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Discount Type</Label>
                <Select value={form.discountType} onValueChange={v => setForm(f => ({ ...f, discountType: v ?? f.discountType }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="flat">Flat (₹)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Discount Value</Label>
                <Input type="number" min="0" value={form.discountValue} onChange={e => setForm(f => ({ ...f, discountValue: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Start Date</Label>
                <Input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>End Date</Label>
                <Input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Background Color</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={form.bgColor} onChange={e => setForm(f => ({ ...f, bgColor: e.target.value }))} className="h-9 w-14 rounded border border-slate-200 cursor-pointer shrink-0" />
                <Input value={form.bgColor} onChange={e => setForm(f => ({ ...f, bgColor: e.target.value }))} className="flex-1" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Banner Image</Label>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => setBannerFile(e.target.files?.[0] ?? null)} />
              <div className="flex items-center gap-2 flex-wrap">
                <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                  Choose File
                </Button>
                <span className="text-sm text-slate-500 break-all">
                  {bannerFile ? bannerFile.name : editing?.bannerImage ? 'Current image set' : 'No file chosen'}
                </span>
              </div>
            </div>
            {/* Apply to Brands */}
            {allBrands.length > 0 && (
              <div className="space-y-1.5">
                <Label>Apply to Brands <span className="text-slate-400 font-normal text-xs">(optional — leave empty for all)</span></Label>
                <div className="flex flex-wrap gap-2 p-3 border border-slate-200 rounded-xl max-h-32 overflow-y-auto">
                  {allBrands.map((b: { _id: string; name: string }) => {
                    const selected = form.selectedBrands.includes(b._id);
                    return (
                      <button key={b._id} type="button"
                        onClick={() => setForm(f => ({ ...f, selectedBrands: selected ? f.selectedBrands.filter(id => id !== b._id) : [...f.selectedBrands, b._id] }))}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${selected ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'}`}>
                        {b.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Apply to Categories — sub-categories only (frames are assigned to sub-categories) */}
            {allCategories.length > 0 && (() => {
              const subCats = allCategories.filter((c: { _id: string; name: string; parentId?: unknown }) => !!c.parentId);
              if (!subCats.length) return null;
              return (
                <div className="space-y-1.5">
                  <Label>Apply to Categories <span className="text-slate-400 font-normal text-xs">(optional)</span></Label>
                  <div className="flex flex-wrap gap-2 p-3 border border-slate-200 rounded-xl max-h-32 overflow-y-auto">
                    {subCats.map((c: { _id: string; name: string; parentId?: { name?: string } | string }) => {
                      const selected = form.selectedCategories.includes(c._id);
                      const parentName = c.parentId && typeof c.parentId === 'object' ? (c.parentId as { name?: string }).name : null;
                      return (
                        <button key={c._id} type="button"
                          onClick={() => setForm(f => ({ ...f, selectedCategories: selected ? f.selectedCategories.filter(id => id !== c._id) : [...f.selectedCategories, c._id] }))}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${selected ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'}`}>
                          {parentName ? `${parentName} › ${c.name}` : c.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* Apply to Specific Products */}
            {allFrames.length > 0 && (
              <div className="space-y-1.5">
                <Label>Apply to Specific Products <span className="text-slate-400 font-normal text-xs">(optional)</span></Label>
                <div className="flex flex-col gap-1 p-3 border border-slate-200 rounded-xl max-h-40 overflow-y-auto">
                  {allFrames.map((f: { _id: string; name: string }) => {
                    const selected = form.selectedProducts.includes(f._id);
                    return (
                      <label key={f._id} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 px-1 py-0.5 rounded">
                        <input type="checkbox" checked={selected}
                          onChange={() => setForm(fm => ({ ...fm, selectedProducts: selected ? fm.selectedProducts.filter(id => id !== f._id) : [...fm.selectedProducts, f._id] }))}
                          className="accent-blue-600" />
                        <span className="text-sm text-slate-700">{f.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Apply to Lens Brands */}
            {allLensBrands.length > 0 && (
              <div className="space-y-1.5">
                <Label>Apply to Lens Brands <span className="text-slate-400 font-normal text-xs">(optional — show badge when user picks this lens brand)</span></Label>
                <div className="flex flex-wrap gap-2 p-3 border border-slate-200 rounded-xl max-h-32 overflow-y-auto">
                  {allLensBrands.map((lb: { _id: string; name: string }) => {
                    const selected = form.selectedLensBrands.includes(lb._id);
                    return (
                      <button key={lb._id} type="button"
                        onClick={() => setForm(f => ({ ...f, selectedLensBrands: selected ? f.selectedLensBrands.filter(id => id !== lb._id) : [...f.selectedLensBrands, lb._id] }))}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${selected ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-slate-600 border-slate-200 hover:border-purple-300'}`}>
                        {lb.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Apply to Lens Products (Lens Types) */}
            {allLensTypes.length > 0 && (
              <div className="space-y-1.5">
                <Label>Apply to Lens Products <span className="text-slate-400 font-normal text-xs">(optional — show badge on specific lens products)</span></Label>
                <div className="flex flex-col gap-1 p-3 border border-slate-200 rounded-xl max-h-40 overflow-y-auto">
                  {allLensTypes.map((lt: { _id: string; name: string; lensTypeId?: { name: string } }) => {
                    const selected = form.selectedLensTypes.includes(lt._id);
                    return (
                      <label key={lt._id} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 px-1 py-0.5 rounded">
                        <input type="checkbox" checked={selected}
                          onChange={() => setForm(fm => ({ ...fm, selectedLensTypes: selected ? fm.selectedLensTypes.filter(id => id !== lt._id) : [...fm.selectedLensTypes, lt._id] }))}
                          className="accent-purple-600" />
                        <span className="text-sm text-slate-700">{lt.name}</span>
                        {lt.lensTypeId?.name && <span className="text-xs text-slate-400">({lt.lensTypeId.name})</span>}
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <input type="checkbox" id="offerActive" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} className="rounded" />
              <Label htmlFor="offerActive">Active</Label>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" className="flex-1" disabled={createOffer.isPending || updateOffer.isPending}>
                {editing ? 'Update Offer' : 'Create Offer'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
