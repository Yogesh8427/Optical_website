'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Banner, ApiResponse } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function BannersPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery<ApiResponse<Banner[]>>({ queryKey: ['banners'], queryFn: () => api.get('/banners').then((r) => r.data) });
  const create = useMutation({ mutationFn: (f: FormData) => api.post('/banners', f).then((r) => r.data), onSuccess: () => qc.invalidateQueries({ queryKey: ['banners'] }) });
  const update = useMutation({ mutationFn: ({ id, f }: { id: string; f: FormData }) => api.put(`/banners/${id}`, f).then((r) => r.data), onSuccess: () => qc.invalidateQueries({ queryKey: ['banners'] }) });
  const remove = useMutation({ mutationFn: (id: string) => api.delete(`/banners/${id}`).then((r) => r.data), onSuccess: () => qc.invalidateQueries({ queryKey: ['banners'] }) });

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [form, setForm] = useState({ title: '', subtitle: '', buttonText: '', buttonUrl: '', sortOrder: '0', active: true });
  const [imageFile, setImageFile] = useState<File | null>(null);

  function set(key: string, value: string | boolean) { setForm((f) => ({ ...f, [key]: value })); }
  function openCreate() { setEditing(null); setForm({ title: '', subtitle: '', buttonText: '', buttonUrl: '', sortOrder: '0', active: true }); setImageFile(null); setModalOpen(true); }
  function openEdit(b: Banner) { setEditing(b); setForm({ title: b.title, subtitle: b.subtitle, buttonText: b.buttonText, buttonUrl: b.buttonUrl, sortOrder: String(b.sortOrder), active: b.active }); setImageFile(null); setModalOpen(true); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
    if (imageFile) fd.append('image', imageFile);

    const action = editing ? update.mutateAsync({ id: editing._id, f: fd }) : create.mutateAsync(fd);
    action.then(() => { toast.success('Saved'); setModalOpen(false); }).catch((err) => toast.error(err?.response?.data?.message ?? 'Failed'));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Banners</h1>
        <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" />Add Banner</Button>
      </div>
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Image</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Title</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Order</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Status</th>
              <th className="px-4 py-3 text-right text-gray-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? <tr><td colSpan={5} className="text-center py-8 text-gray-400">Loading...</td></tr>
              : data?.data?.map((b) => (
                <tr key={b._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3"><Image src={b.image} alt={b.title} width={80} height={45} className="object-cover rounded" /></td>
                  <td className="px-4 py-3 font-medium text-gray-900">{b.title}</td>
                  <td className="px-4 py-3 text-gray-500">{b.sortOrder}</td>
                  <td className="px-4 py-3"><Badge variant={b.active ? 'default' : 'secondary'}>{b.active ? 'Active' : 'Inactive'}</Badge></td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(b)}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => { if (confirm('Delete?')) remove.mutate(b._id, { onSuccess: () => toast.success('Deleted') }); }}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? 'Edit Banner' : 'New Banner'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label>Title *</Label><Input value={form.title} onChange={(e) => set('title', e.target.value)} required className="mt-1" /></div>
            <div><Label>Subtitle</Label><Input value={form.subtitle} onChange={(e) => set('subtitle', e.target.value)} className="mt-1" /></div>
            <div><Label>Button Text</Label><Input value={form.buttonText} onChange={(e) => set('buttonText', e.target.value)} className="mt-1" /></div>
            <div><Label>Button URL</Label><Input value={form.buttonUrl} onChange={(e) => set('buttonUrl', e.target.value)} className="mt-1" /></div>
            <div><Label>Sort Order</Label><Input type="number" value={form.sortOrder} onChange={(e) => set('sortOrder', e.target.value)} className="mt-1" /></div>
            <div><Label>Image {!editing && '*'}</Label><Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} className="mt-1" /></div>
            <div className="flex items-center gap-2"><input type="checkbox" id="active" checked={form.active} onChange={(e) => set('active', e.target.checked)} /><Label htmlFor="active">Active</Label></div>
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
