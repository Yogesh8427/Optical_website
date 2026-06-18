'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useFrames, useCreateFrame, useUpdateFrame, useDeleteFrame } from '@/hooks/useFrames';
import { useCategories } from '@/hooks/useCategories';
import { useBrands } from '@/hooks/useBrands';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import type { Frame } from '@/types';

// ── Types ──────────────────────────────────────────────
interface ColorRow { color: string; file: File | null; existingUrl: string }
const emptyForm = { name: '', description: '', categoryId: '', brandId: '', framePrice: '', material: '', gender: 'unisex', featured: false, active: true };

// ── Helpers ────────────────────────────────────────────
function emptyColor(): ColorRow { return { color: '', file: null, existingUrl: '' }; }

export default function FramesPage() {
  const { data, isLoading } = useFrames({ limit: 50 });
  const { data: catData } = useCategories();
  const { data: brandData } = useBrands();
  const create = useCreateFrame();
  const update = useUpdateFrame();
  const remove = useDeleteFrame();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Frame | null>(null);
  const [form, setForm] = useState(emptyForm);

  // Dynamic colors (each with optional image)
  const [colorRows, setColorRows] = useState<ColorRow[]>([emptyColor()]);

  // Dynamic sizes
  const [sizes, setSizes] = useState<string[]>(['']);

  const categories = catData?.data?.filter((c) => c.active) ?? [];
  const brands = brandData?.data?.filter((b) => b.active) ?? [];

  function set(key: string, value: string | boolean | null) {
    setForm((f) => ({ ...f, [key]: value ?? '' }));
  }

  // ── Color row helpers ──
  function updateColor(i: number, field: keyof ColorRow, value: string | File | null) {
    setColorRows((rows) => rows.map((r, idx) => idx === i ? { ...r, [field]: value } : r));
  }
  function addColor() { setColorRows((r) => [...r, emptyColor()]); }
  function removeColor(i: number) { setColorRows((r) => r.filter((_, idx) => idx !== i)); }

  // ── Size helpers ──
  function updateSize(i: number, val: string) {
    setSizes((s) => s.map((v, idx) => idx === i ? val : v));
  }
  function addSize() { setSizes((s) => [...s, '']); }
  function removeSize(i: number) { setSizes((s) => s.filter((_, idx) => idx !== i)); }

  // ── Open modal ──
  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setColorRows([emptyColor()]);
    setSizes(['']);
    setModalOpen(true);
  }

  function openEdit(f: Frame) {
    setEditing(f);
    setForm({ name: f.name, description: f.description, categoryId: f.categoryId?._id ?? '', brandId: f.brandId?._id ?? '', framePrice: String(f.framePrice), material: f.material, gender: f.gender, featured: f.featured, active: f.active });

    // Pre-fill color rows from existing data
    const rows: ColorRow[] = f.colors?.length
      ? f.colors.map((color, i) => ({ color, file: null, existingUrl: f.images?.[i] ?? '' }))
      : [emptyColor()];
    setColorRows(rows);

    // Pre-fill sizes
    setSizes(f.sizes?.length ? f.sizes : ['']);
    setModalOpen(true);
  }

  // ── Submit ──
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();

    // Basic fields
    Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));

    // Colors as comma-separated
    const colorNames = colorRows.map((r) => r.color.trim()).filter(Boolean);
    fd.append('colors', colorNames.join(','));

    // Sizes as comma-separated
    const sizeList = sizes.map((s) => s.trim()).filter(Boolean);
    fd.append('sizes', sizeList.join(','));

    // Images — one per color row (in order); skip rows with no new file
    colorRows.forEach((row) => {
      if (row.file) fd.append('images', row.file);
    });

    const action = editing
      ? update.mutateAsync({ id: editing._id, form: fd })
      : create.mutateAsync(fd);

    action
      .then(() => { toast.success('Saved'); setModalOpen(false); })
      .catch((err) => toast.error(err?.response?.data?.message ?? 'Failed'));
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this frame?')) return;
    remove.mutate(id, { onSuccess: () => toast.success('Deleted'), onError: () => toast.error('Failed') });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Frames</h1>
        <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" />Add Frame</Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Image</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Name</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Brand</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Price</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Colors</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Status</th>
              <th className="px-4 py-3 text-right text-gray-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              <tr><td colSpan={7} className="text-center py-8 text-gray-400">Loading...</td></tr>
            ) : data?.data?.map((f) => (
              <tr key={f._id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  {f.images?.[0]
                    ? <Image src={f.images[0]} alt={f.name} width={48} height={40} className="object-cover rounded-lg w-12 h-10" />
                    : <div className="w-12 h-10 bg-gray-100 rounded-lg" />}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">{f.name}</td>
                <td className="px-4 py-3 text-gray-500">{f.brandId?.name}</td>
                <td className="px-4 py-3 font-medium text-blue-700">₹{f.framePrice.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1 flex-wrap">
                    {f.colors?.slice(0, 3).map((c) => (
                      <span key={c} className="text-xs bg-gray-100 rounded-full px-2 py-0.5 text-gray-600">{c}</span>
                    ))}
                    {(f.colors?.length ?? 0) > 3 && <span className="text-xs text-gray-400">+{f.colors.length - 3}</span>}
                  </div>
                </td>
                <td className="px-4 py-3"><Badge variant={f.active ? 'default' : 'secondary'}>{f.active ? 'Active' : 'Inactive'}</Badge></td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(f)}><Pencil className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(f._id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? 'Edit Frame' : 'New Frame'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Basic info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Name *</Label>
                <Input value={form.name} onChange={(e) => set('name', e.target.value)} required className="mt-1" />
              </div>

              <div>
                <Label>Category *</Label>
                <Select value={form.categoryId} onValueChange={(v) => set('categoryId', v)}>
                  <SelectTrigger className="mt-1">
                    <span className="text-sm">
                      {form.categoryId ? (categories.find((c) => c._id === form.categoryId)?.name ?? 'Select category') : 'Select category'}
                    </span>
                  </SelectTrigger>
                  <SelectContent>{categories.map((c) => <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>)}</SelectContent>
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
                <Input value={form.material} onChange={(e) => set('material', e.target.value)} className="mt-1" placeholder="Metal, Acetate…" />
              </div>

              <div>
                <Label>Gender</Label>
                <Select value={form.gender} onValueChange={(v) => set('gender', v)}>
                  <SelectTrigger className="mt-1">
                    <span className="text-sm capitalize">{form.gender || 'Select gender'}</span>
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
            </div>

            {/* ── Colors + Images ── */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-semibold">Colors & Images</Label>
                <Button type="button" variant="outline" size="sm" onClick={addColor}>
                  <Plus className="w-3 h-3 mr-1" /> Add Color
                </Button>
              </div>
              <div className="space-y-2">
                {colorRows.map((row, i) => (
                  <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-xl p-2">
                    {/* Color preview / existing image */}
                    <div className="w-12 h-12 rounded-lg overflow-hidden border bg-white shrink-0">
                      {row.file ? (
                        <img src={URL.createObjectURL(row.file)} alt="" className="w-full h-full object-cover" />
                      ) : row.existingUrl ? (
                        <img src={row.existingUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No img</div>
                      )}
                    </div>

                    {/* Color name */}
                    <Input
                      placeholder={`Color ${i + 1} e.g. Gold`}
                      value={row.color}
                      onChange={(e) => updateColor(i, 'color', e.target.value)}
                      className="flex-1 h-9"
                    />

                    {/* Image upload */}
                    <label className="cursor-pointer shrink-0">
                      <span className="text-xs bg-white border rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors whitespace-nowrap">
                        {row.file ? '✓ Changed' : row.existingUrl ? 'Replace' : 'Upload'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => updateColor(i, 'file', e.target.files?.[0] ?? null)}
                      />
                    </label>

                    {/* Remove */}
                    {colorRows.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => removeColor(i)}>
                        <X className="w-4 h-4 text-red-400" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* ── Sizes ── */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-semibold">Sizes</Label>
                <Button type="button" variant="outline" size="sm" onClick={addSize}>
                  <Plus className="w-3 h-3 mr-1" /> Add Size
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((sz, i) => (
                  <div key={i} className="flex items-center gap-1 bg-gray-50 rounded-lg border px-2 py-1">
                    <Input
                      placeholder="e.g. S, M, L, 52mm"
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
              <p className="text-xs text-gray-400 mt-1">e.g. S, M, L &nbsp;or&nbsp; 50mm, 52mm, 54mm</p>
            </div>

            {/* Featured / Active */}
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} />
                <Label htmlFor="featured">Featured</Label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="active" checked={form.active} onChange={(e) => set('active', e.target.checked)} />
                <Label htmlFor="active">Active</Label>
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="flex-1">Cancel</Button>
              <Button type="submit" className="flex-1">Save Frame</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
