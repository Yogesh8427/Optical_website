'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useLensTypes, useCreateLensType, useUpdateLensType, useDeleteLensType } from '@/hooks/useLensTypes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import type { LensType } from '@/types';

export default function LensTypesPage() {
  const { data, isLoading } = useLensTypes();
  const create = useCreateLensType();
  const update = useUpdateLensType();
  const remove = useDeleteLensType();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<LensType | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [extraPrice, setExtraPrice] = useState('0');
  const [active, setActive] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');

  function openCreate() {
    setEditing(null); setName(''); setDescription(''); setExtraPrice('0');
    setActive(true); setImageFile(null); setImagePreview('');
    setModalOpen(true);
  }

  function openEdit(t: LensType) {
    setEditing(t); setName(t.name); setDescription(t.description);
    setExtraPrice(String(t.extraPrice)); setActive(t.active);
    setImageFile(null); setImagePreview(t.image ?? '');
    setModalOpen(true);
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = new FormData();
    form.append('name', name);
    form.append('description', description);
    form.append('extraPrice', extraPrice);
    form.append('active', String(active));
    if (imageFile) form.append('image', imageFile);

    const action = editing
      ? update.mutateAsync({ id: editing._id, form })
      : create.mutateAsync(form);

    action
      .then(() => { toast.success('Saved'); setModalOpen(false); })
      .catch(() => toast.error('Failed to save'));
  }

  const lensTypes = data?.data ?? [];

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold text-slate-800">Lens Types</h1>
        <Button onClick={openCreate} size="sm">
          <Plus className="w-4 h-4 md:mr-2" /><span className="hidden md:inline">Add Lens Type</span>
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Mobile cards */}
        <div className="divide-y divide-slate-50 md:hidden">
          {isLoading ? (
            <div className="py-10 text-center text-slate-400 text-sm">Loading...</div>
          ) : lensTypes.length === 0 ? (
            <div className="py-10 text-center text-slate-400 text-sm">No lens types yet</div>
          ) : lensTypes.map((t) => (
            <div key={t._id} className="flex items-center gap-3 px-4 py-3">
              {t.image
                ? <Image src={t.image} alt={t.name} width={56} height={40} className="object-cover rounded-lg shrink-0 w-14 h-10" />
                : <div className="w-14 h-10 bg-slate-100 rounded-lg shrink-0 flex items-center justify-center text-slate-300 text-xs">No img</div>}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800 text-sm truncate">{t.name}</p>
                <p className="text-xs text-slate-500 font-medium">
                  {t.extraPrice > 0 ? `+₹${t.extraPrice.toLocaleString()}` : <span className="text-green-600">Free</span>}
                </p>
              </div>
              <Badge variant={t.active ? 'default' : 'secondary'} className="shrink-0 text-xs">{t.active ? 'Active' : 'Inactive'}</Badge>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(t)}><Pencil className="w-3.5 h-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { if (confirm('Delete this lens type?')) remove.mutate(t._id, { onSuccess: () => toast.success('Deleted'), onError: () => toast.error('Failed') }); }}>
                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                </Button>
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
                <th className="px-4 py-3 text-left font-medium">Description</th>
                <th className="px-4 py-3 text-left font-medium">Extra Price</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr><td colSpan={6} className="text-center py-8 text-slate-400">Loading...</td></tr>
              ) : lensTypes.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-slate-400">No lens types yet</td></tr>
              ) : lensTypes.map((t) => (
                <tr key={t._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3">
                    {t.image ? (
                      <Image src={t.image} alt={t.name} width={56} height={40} className="object-cover rounded-lg w-14 h-10" />
                    ) : (
                      <div className="w-14 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-300 text-xs">No img</div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800">{t.name}</td>
                  <td className="px-4 py-3 text-slate-500 max-w-xs">
                    <p className="line-clamp-1">{t.description || '—'}</p>
                  </td>
                  <td className="px-4 py-3 font-medium text-blue-700">
                    {t.extraPrice > 0 ? `+₹${t.extraPrice.toLocaleString()}` : <span className="text-green-600">Free</span>}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={t.active ? 'default' : 'secondary'}>{t.active ? 'Active' : 'Inactive'}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(t)}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => { if (confirm('Delete this lens type?')) remove.mutate(t._id, { onSuccess: () => toast.success('Deleted'), onError: () => toast.error('Failed') }); }}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="w-[calc(100vw-1.5rem)] sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? 'Edit Lens Type' : 'New Lens Type'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label>Name *</Label><Input value={name} onChange={(e) => setName(e.target.value)} required className="mt-1" placeholder="e.g. Single Vision" /></div>
            <div>
              <Label>Description</Label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Brief description of this lens type..."
              />
            </div>
            <div><Label>Extra Price (₹)</Label><Input type="number" min="0" value={extraPrice} onChange={(e) => setExtraPrice(e.target.value)} className="mt-1" /></div>

            {/* Image upload */}
            <div>
              <Label>Image</Label>
              <div className="mt-1 flex items-center gap-3">
                <div className="w-20 h-16 rounded-xl overflow-hidden border bg-slate-50 shrink-0 flex items-center justify-center">
                  {imagePreview ? (
                    <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-slate-400">No image</span>
                  )}
                </div>
                <div className="flex-1">
                  <Input type="file" accept="image/*" onChange={handleImageChange} className="text-sm" />
                  <p className="text-xs text-slate-400 mt-1">Upload a photo that represents this lens type</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="active" checked={active} onChange={(e) => setActive(e.target.checked)} />
              <Label htmlFor="active">Active (show in lens wizard)</Label>
            </div>

            <div className="flex gap-3 pt-1">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="flex-1">Cancel</Button>
              <Button type="submit" className="flex-1">Save</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
