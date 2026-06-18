'use client';
import { useState } from 'react';
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

  function openCreate() { setEditing(null); setName(''); setDescription(''); setExtraPrice('0'); setActive(true); setModalOpen(true); }
  function openEdit(t: LensType) { setEditing(t); setName(t.name); setDescription(t.description); setExtraPrice(String(t.extraPrice)); setActive(t.active); setModalOpen(true); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { name, description, extraPrice: Number(extraPrice), active };
    const action = editing ? update.mutateAsync({ id: editing._id, data: payload }) : create.mutateAsync(payload);
    action.then(() => { toast.success('Saved'); setModalOpen(false); }).catch(() => toast.error('Failed'));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Lens Types</h1>
        <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" />Add Lens Type</Button>
      </div>
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Name</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Extra Price</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Status</th>
              <th className="px-4 py-3 text-right text-gray-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              <tr><td colSpan={4} className="text-center py-8 text-gray-400">Loading...</td></tr>
            ) : data?.data?.map((t) => (
              <tr key={t._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{t.name}</td>
                <td className="px-4 py-3 text-gray-600">{t.extraPrice > 0 ? `₹${t.extraPrice}` : 'Free'}</td>
                <td className="px-4 py-3"><Badge variant={t.active ? 'default' : 'secondary'}>{t.active ? 'Active' : 'Inactive'}</Badge></td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(t)}><Pencil className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => { if (confirm('Delete?')) remove.mutate(t._id, { onSuccess: () => toast.success('Deleted') }); }}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? 'Edit Lens Type' : 'New Lens Type'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label>Name *</Label><Input value={name} onChange={(e) => setName(e.target.value)} required className="mt-1" /></div>
            <div><Label>Description</Label><Input value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1" /></div>
            <div><Label>Extra Price (₹)</Label><Input type="number" value={extraPrice} onChange={(e) => setExtraPrice(e.target.value)} className="mt-1" /></div>
            <div className="flex items-center gap-2"><input type="checkbox" id="active" checked={active} onChange={(e) => setActive(e.target.checked)} /><Label htmlFor="active">Active</Label></div>
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
