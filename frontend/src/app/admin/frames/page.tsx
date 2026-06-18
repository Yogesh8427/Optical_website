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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import type { Frame } from '@/types';

const emptyForm = { name: '', description: '', categoryId: '', brandId: '', framePrice: '', material: '', gender: 'unisex', colors: '', sizes: '', featured: false, active: true };

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
  const [images, setImages] = useState<File[]>([]);

  const categories = catData?.data?.filter((c) => c.active) ?? [];
  const brands = brandData?.data?.filter((b) => b.active) ?? [];

  function set(key: string, value: string | boolean | null) { setForm((f) => ({ ...f, [key]: value ?? '' })); }

  function openCreate() { setEditing(null); setForm(emptyForm); setImages([]); setModalOpen(true); }
  function openEdit(f: Frame) {
    setEditing(f);
    setForm({ name: f.name, description: f.description, categoryId: f.categoryId?._id ?? '', brandId: f.brandId?._id ?? '', framePrice: String(f.framePrice), material: f.material, gender: f.gender, colors: f.colors.join(', '), sizes: f.sizes.join(', '), featured: f.featured, active: f.active });
    setImages([]);
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
    images.forEach((img) => fd.append('images', img));

    const action = editing ? update.mutateAsync({ id: editing._id, form: fd }) : create.mutateAsync(fd);
    action.then(() => { toast.success('Saved'); setModalOpen(false); }).catch((err) => toast.error(err?.response?.data?.message ?? 'Failed'));
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

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Image</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Name</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Brand</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Price</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Status</th>
              <th className="px-4 py-3 text-right text-gray-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400">Loading...</td></tr>
            ) : data?.data?.map((f) => (
              <tr key={f._id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  {f.images?.[0] ? <Image src={f.images[0]} alt={f.name} width={48} height={40} className="object-cover rounded" /> : <div className="w-12 h-10 bg-gray-100 rounded" />}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">{f.name}</td>
                <td className="px-4 py-3 text-gray-500">{f.brandId?.name}</td>
                <td className="px-4 py-3 font-medium text-blue-700">₹{f.framePrice.toLocaleString()}</td>
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

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? 'Edit Frame' : 'New Frame'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2"><Label>Name *</Label><Input value={form.name} onChange={(e) => set('name', e.target.value)} required className="mt-1" /></div>
              <div>
                <Label>Category *</Label>
                <Select value={form.categoryId} onValueChange={(v) => set('categoryId', v)}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>{categories.map((c) => <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Brand *</Label>
                <Select value={form.brandId} onValueChange={(v) => set('brandId', v)}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select brand" /></SelectTrigger>
                  <SelectContent>{brands.map((b) => <SelectItem key={b._id} value={b._id}>{b.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Price (₹) *</Label><Input type="number" value={form.framePrice} onChange={(e) => set('framePrice', e.target.value)} required className="mt-1" /></div>
              <div><Label>Material</Label><Input value={form.material} onChange={(e) => set('material', e.target.value)} className="mt-1" /></div>
              <div>
                <Label>Gender</Label>
                <Select value={form.gender} onValueChange={(v) => set('gender', v)}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="men">Men</SelectItem>
                    <SelectItem value="women">Women</SelectItem>
                    <SelectItem value="unisex">Unisex</SelectItem>
                    <SelectItem value="kids">Kids</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Colors (comma separated)</Label><Input value={form.colors} onChange={(e) => set('colors', e.target.value)} className="mt-1" placeholder="Black, Silver, Gold" /></div>
              <div><Label>Sizes (comma separated)</Label><Input value={form.sizes} onChange={(e) => set('sizes', e.target.value)} className="mt-1" placeholder="S, M, L" /></div>
              <div className="col-span-2"><Label>Description</Label><Textarea value={form.description} onChange={(e) => set('description', e.target.value)} className="mt-1" rows={3} /></div>
              <div className="col-span-2"><Label>Images (max 6)</Label><Input type="file" accept="image/*" multiple onChange={(e) => setImages(Array.from(e.target.files ?? []))} className="mt-1" /></div>
              <div className="flex items-center gap-2"><input type="checkbox" id="featured" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} /><Label htmlFor="featured">Featured</Label></div>
              <div className="flex items-center gap-2"><input type="checkbox" id="active" checked={form.active} onChange={(e) => set('active', e.target.checked)} /><Label htmlFor="active">Active</Label></div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="flex-1">Cancel</Button>
              <Button type="submit" className="flex-1">Save</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
