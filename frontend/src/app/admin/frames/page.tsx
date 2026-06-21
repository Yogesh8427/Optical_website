'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useFrames, useCreateFrame, useUpdateFrame, useDeleteFrame, useBulkImportFrames } from '@/hooks/useFrames';
import CsvImportButton from '@/components/admin/CsvImportButton';
import { useCategories } from '@/hooks/useCategories';
import { useBrands } from '@/hooks/useBrands';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Plus, X, Eye, Glasses, Check } from 'lucide-react';
import { toast } from 'sonner';
import type { Frame } from '@/types';

interface ColorRow { color: string; file: File | null; existingUrl: string }
const emptyForm = { name: '', description: '', categoryId: '', brandId: '', framePrice: '', material: '', gender: 'unisex', featured: false, active: true, requiresLens: true, inStock: true, hi_name: '', hi_description: '' };

function emptyColor(): ColorRow { return { color: '', file: null, existingUrl: '' }; }

export default function ProductsPage() {
  const { data, isLoading } = useFrames({ limit: 50 });
  const { data: catData } = useCategories();
  const { data: brandData } = useBrands();
  const create = useCreateFrame();
  const update = useUpdateFrame();
  const remove = useDeleteFrame();
  const bulkImport = useBulkImportFrames();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Frame | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [colorRows, setColorRows] = useState<ColorRow[]>([emptyColor()]);
  const [sizes, setSizes] = useState<string[]>(['']);

  const categories = catData?.data?.filter((c) => c.active) ?? [];
  const brands = brandData?.data?.filter((b) => b.active) ?? [];

  function set(key: string, value: string | boolean | null) {
    setForm((f) => ({ ...f, [key]: value ?? '' }));
  }

  function updateColor(i: number, field: keyof ColorRow, value: string | File | null) {
    setColorRows((rows) => rows.map((r, idx) => idx === i ? { ...r, [field]: value } : r));
  }
  function addColor() { setColorRows((r) => [...r, emptyColor()]); }
  function removeColor(i: number) { setColorRows((r) => r.filter((_, idx) => idx !== i)); }

  function updateSize(i: number, val: string) {
    setSizes((s) => s.map((v, idx) => idx === i ? val : v));
  }
  function addSize() { setSizes((s) => [...s, '']); }
  function removeSize(i: number) { setSizes((s) => s.filter((_, idx) => idx !== i)); }

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setColorRows([emptyColor()]);
    setSizes(['']);
    setModalOpen(true);
  }

  function openEdit(f: Frame) {
    setEditing(f);
    setForm({
      name: f.name, description: f.description,
      categoryId: f.categoryId?._id ?? '', brandId: f.brandId?._id ?? '',
      framePrice: String(f.framePrice), material: f.material, gender: f.gender,
      featured: f.featured, active: f.active,
      requiresLens: f.requiresLens !== false,
      inStock: f.inStock !== false,
      hi_name: f.translations?.hi?.name ?? '',
      hi_description: f.translations?.hi?.description ?? '',
    });
    const rows: ColorRow[] = f.colors?.length
      ? f.colors.map((color, i) => ({ color, file: null, existingUrl: f.images?.[i] ?? '' }))
      : [emptyColor()];
    setColorRows(rows);
    setSizes(f.sizes?.length ? f.sizes : ['']);
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
    const colorNames = colorRows.map((r) => r.color.trim()).filter(Boolean);
    fd.append('colors', colorNames.join(','));
    const sizeList = sizes.map((s) => s.trim()).filter(Boolean);
    fd.append('sizes', sizeList.join(','));
    colorRows.forEach((row) => { if (row.file) fd.append('images', row.file); });

    const action = editing
      ? update.mutateAsync({ id: editing._id, form: fd })
      : create.mutateAsync(fd);
    action
      .then(() => { toast.success('Saved'); setModalOpen(false); })
      .catch((err) => toast.error(err?.response?.data?.message ?? 'Failed'));
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this product?')) return;
    remove.mutate(id, { onSuccess: () => toast.success('Deleted'), onError: () => toast.error('Failed') });
  }

  const frames = data?.data ?? [];

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold text-slate-800">Products</h1>
        <div className="flex items-center gap-2">
          <CsvImportButton
            label="Import CSV"
            templateColumns={['name', 'category', 'brand', 'price', 'material', 'gender', 'colors', 'sizes', 'description', 'featured', 'requires_lens', 'active']}
            templateRows={[
              ['Ray-Ban Aviator Classic', 'Metal Frames', 'Ray-Ban', '2999', 'Metal', 'men', 'Gold|Silver|Black', 'Small|Medium|Large', 'Timeless aviator style with UV protection', 'true', 'true', 'true'],
              ['Titan EyePlus Round', 'Metal Frames', 'Titan', '1899', 'Metal', 'women', 'Brown|Rose Gold', 'Small|Medium', 'Elegant round frames in lightweight metal', 'false', 'true', 'true'],
              ['Fastrack Wraparound', 'Sunglasses', 'Fastrack', '1299', 'Plastic', 'men', 'Black|Blue', 'One Size', 'Sporty wraparound sunglasses', 'false', 'false', 'true'],
            ]}
            tip='colors and sizes use | to separate values e.g. "Black|Gold|Silver". brand must already exist in Admin → Brands. category must already exist in Admin → Categories.'
            onImport={(rows) => bulkImport.mutateAsync(rows)}
          />
          <Button onClick={openCreate} size="sm">
            <Plus className="w-4 h-4 md:mr-2" /><span className="hidden md:inline">Add Product</span>
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Mobile cards */}
        <div className="divide-y divide-slate-50 md:hidden">
          {isLoading ? (
            <div className="py-10 text-center text-slate-400 text-sm">Loading...</div>
          ) : frames.length === 0 ? (
            <div className="py-10 text-center text-slate-400 text-sm">No products yet</div>
          ) : frames.map((f) => (
            <div key={f._id} className="flex items-center gap-3 px-4 py-3">
              {f.images?.[0]
                ? <Image src={f.images[0]} alt={f.name} width={48} height={40} className="object-cover rounded-lg shrink-0 w-12 h-10" />
                : <div className="w-12 h-10 bg-slate-100 rounded-lg shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-medium text-slate-800 text-sm truncate">{f.name}</p>
                  {f.requiresLens !== false && (
                    <span title="Requires lens prescription"><Eye className="w-3 h-3 text-blue-500 shrink-0" /></span>
                  )}
                </div>
                <p className="text-xs text-slate-400">{f.brandId?.name} · <span className="text-blue-600 font-medium">₹{f.framePrice.toLocaleString()}</span></p>
              </div>
              <Badge variant={f.active ? 'default' : 'secondary'} className="shrink-0 text-xs">{f.active ? 'Active' : 'Inactive'}</Badge>
              {f.inStock === false && <Badge className="shrink-0 text-xs bg-red-100 text-red-700 border-0">Out of Stock</Badge>}
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(f)}><Pencil className="w-3.5 h-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(f._id)}><Trash2 className="w-3.5 h-3.5 text-red-500" /></Button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b text-xs text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Image</th>
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Brand</th>
                <th className="px-4 py-3 text-left font-medium">Price</th>
                <th className="px-4 py-3 text-left font-medium">Lens?</th>
                <th className="px-4 py-3 text-left font-medium">Colors</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr><td colSpan={8} className="text-center py-8 text-slate-400">Loading...</td></tr>
              ) : frames.map((f) => (
                <tr key={f._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3">
                    {f.images?.[0]
                      ? <Image src={f.images[0]} alt={f.name} width={48} height={40} className="object-cover rounded-lg w-12 h-10" />
                      : <div className="w-12 h-10 bg-slate-100 rounded-lg" />}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800">{f.name}</td>
                  <td className="px-4 py-3 text-slate-500">{f.brandId?.name}</td>
                  <td className="px-4 py-3 font-medium text-blue-700">₹{f.framePrice.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    {f.requiresLens !== false
                      ? <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium"><Glasses className="w-3 h-3" /> Yes</span>
                      : <span className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">No</span>
                    }
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {f.colors?.slice(0, 3).map((c) => (
                        <span key={c} className="text-xs bg-slate-100 rounded-full px-2 py-0.5 text-slate-600">{c}</span>
                      ))}
                      {(f.colors?.length ?? 0) > 3 && <span className="text-xs text-slate-400">+{f.colors.length - 3}</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 space-x-1">
                    <Badge variant={f.active ? 'default' : 'secondary'}>{f.active ? 'Active' : 'Inactive'}</Badge>
                    {f.inStock === false && <Badge className="bg-red-100 text-red-700 border-0">Out of Stock</Badge>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(f)}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(f._id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="w-[calc(100vw-1.5rem)] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? 'Edit Product' : 'New Product'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* ── Lens Requirement Banner ── */}
            <div
              className={`rounded-xl p-4 border-2 cursor-pointer transition-all ${
                form.requiresLens
                  ? 'border-blue-300 bg-blue-50'
                  : 'border-slate-200 bg-slate-50'
              }`}
              onClick={() => set('requiresLens', !form.requiresLens)}
            >
              <div className="flex items-start gap-3">
                <div className={`w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                  form.requiresLens ? 'bg-blue-600 border-blue-600' : 'border-slate-300'
                }`}>
                  {form.requiresLens && <Check className="w-3 h-3 text-white" />}
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">Requires Lens / Prescription</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {form.requiresLens
                      ? 'Customer will go through the 8-step Lens Wizard to choose lens type, brand, and upload prescription.'
                      : 'Customer will get a simple WhatsApp inquiry button — no lens wizard needed. Good for sunglasses, accessories, etc.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Basic info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Product Name *</Label>
                <Input value={form.name} onChange={(e) => set('name', e.target.value)} required className="mt-1" placeholder="e.g. Ray-Ban Aviator, Lens Solution 100ml…" />
              </div>

              <div>
                <Label>Category *</Label>
                <Select value={form.categoryId} onValueChange={(v) => set('categoryId', v)}>
                  <SelectTrigger className="mt-1">
                    <span className="text-sm">
                      {form.categoryId ? (categories.find((c) => c._id === form.categoryId)?.name ?? 'Select category') : 'Select category'}
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    {(() => {
                      const parents = categories.filter((c) => !c.parentId);
                      const children = (pid: string) => categories.filter((c) => {
                        const p = c.parentId; return p && (typeof p === 'string' ? p : p._id) === pid;
                      });
                      const orphans = categories.filter((c) => {
                        if (!c.parentId) return false;
                        const pid = typeof c.parentId === 'string' ? c.parentId : c.parentId._id;
                        return !parents.find((p) => p._id === pid);
                      });
                      return (
                        <>
                          {parents.map((p) => {
                            const subs = children(p._id);
                            return subs.length > 0 ? (
                              <div key={p._id}>
                                <div className="px-2 py-1 text-xs font-bold text-slate-400 uppercase tracking-wide">{p.name}</div>
                                {subs.map((s) => <SelectItem key={s._id} value={s._id} className="pl-6">↳ {s.name}</SelectItem>)}
                              </div>
                            ) : (
                              <SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>
                            );
                          })}
                          {orphans.map((c) => <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>)}
                        </>
                      );
                    })()}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Brand *</Label>
                <Select value={form.brandId} onValueChange={(v) => set('brandId', v)}>
                  <SelectTrigger className="mt-1">
                    <span className="text-sm">
                      {form.brandId ? (brands.find((b) => b._id === form.brandId)?.name ?? 'Select brand') : 'Select brand'}
                    </span>
                  </SelectTrigger>
                  <SelectContent>{brands.map((b) => <SelectItem key={b._id} value={b._id}>{b.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div>
                <Label>Price (₹) *</Label>
                <Input type="number" value={form.framePrice} onChange={(e) => set('framePrice', e.target.value)} required className="mt-1" />
              </div>

              <div>
                <Label>Material</Label>
                <Input value={form.material} onChange={(e) => set('material', e.target.value)} className="mt-1" placeholder="Metal, Plastic, Solution…" />
              </div>

              <div>
                <Label>Gender</Label>
                <Select value={form.gender} onValueChange={(v) => set('gender', v)}>
                  <SelectTrigger className="mt-1">
                    <span className="text-sm capitalize">{form.gender || 'Select'}</span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="men">Men</SelectItem>
                    <SelectItem value="women">Women</SelectItem>
                    <SelectItem value="unisex">Unisex</SelectItem>
                    <SelectItem value="kids">Kids</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2">
                <Label>Description</Label>
                <Textarea value={form.description} onChange={(e) => set('description', e.target.value)} className="mt-1" rows={2} />
              </div>

              {/* Hindi Translation */}
              <div className="col-span-2 rounded-xl border border-orange-100 bg-orange-50 p-3 space-y-2">
                <p className="text-xs font-bold text-orange-700">🇮🇳 Hindi Translation <span className="font-normal text-orange-500">(optional — shown when user switches to हिं)</span></p>
                <div>
                  <Label className="text-xs">नाम — Product Name in Hindi</Label>
                  <Input value={form.hi_name} onChange={(e) => set('hi_name', e.target.value)} className="mt-1 text-sm" placeholder="e.g. रे-बैन एविएटर क्लासिक" />
                </div>
                <div>
                  <Label className="text-xs">विवरण — Description in Hindi</Label>
                  <Textarea value={form.hi_description} onChange={(e) => set('hi_description', e.target.value)} className="mt-1 text-sm" rows={2} placeholder="Hindi description…" />
                </div>
              </div>
            </div>

            {/* Colors + Images */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-semibold">Colors & Images</Label>
                <Button type="button" variant="outline" size="sm" onClick={addColor}>
                  <Plus className="w-3 h-3 mr-1" /> Add Color
                </Button>
              </div>
              <div className="space-y-2">
                {colorRows.map((row, i) => (
                  <div key={i} className="bg-slate-50 rounded-xl p-2.5 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg overflow-hidden border bg-white shrink-0">
                        {row.file ? (
                          <img src={URL.createObjectURL(row.file)} alt="" className="w-full h-full object-cover" />
                        ) : row.existingUrl ? (
                          <img src={row.existingUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs">?</div>
                        )}
                      </div>
                      <Input
                        placeholder={`Color ${i + 1} e.g. Gold`}
                        value={row.color}
                        onChange={(e) => updateColor(i, 'color', e.target.value)}
                        className="flex-1 h-9"
                      />
                      {colorRows.length > 1 && (
                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => removeColor(i)}>
                          <X className="w-4 h-4 text-red-400" />
                        </Button>
                      )}
                    </div>
                    <label className="cursor-pointer block">
                      <span className="text-xs bg-white border rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100 transition-colors inline-block">
                        {row.file ? `✓ ${row.file.name}` : row.existingUrl ? 'Replace image' : 'Upload image'}
                      </span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => updateColor(i, 'file', e.target.files?.[0] ?? null)} />
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-semibold">Sizes / Variants</Label>
                <Button type="button" variant="outline" size="sm" onClick={addSize}>
                  <Plus className="w-3 h-3 mr-1" /> Add Size
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((sz, i) => (
                  <div key={i} className="flex items-center gap-1 bg-slate-50 rounded-lg border px-2 py-1">
                    <Input
                      placeholder="e.g. S, M, 100ml"
                      value={sz}
                      onChange={(e) => updateSize(i, e.target.value)}
                      className="w-28 h-7 border-0 bg-transparent p-0 text-sm focus-visible:ring-0"
                    />
                    {sizes.length > 1 && (
                      <button type="button" onClick={() => removeSize(i)}>
                        <X className="w-3.5 h-3.5 text-red-400 hover:text-red-600" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-1">e.g. S, M, L  or  50mm, 52mm  or  100ml, 200ml</p>
            </div>

            {/* Featured / Active / In Stock */}
            <div className="flex flex-wrap gap-4 sm:gap-6">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} />
                <Label htmlFor="featured">Featured</Label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="active" checked={form.active} onChange={(e) => set('active', e.target.checked)} />
                <Label htmlFor="active">Active</Label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="inStock" checked={form.inStock} onChange={(e) => set('inStock', e.target.checked)} />
                <Label htmlFor="inStock">In Stock</Label>
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="flex-1">Cancel</Button>
              <Button type="submit" className="flex-1">Save Product</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
