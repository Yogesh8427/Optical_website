'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useLensBrands, useCreateLensBrand, useUpdateLensBrand, useDeleteLensBrand } from '@/hooks/useLensBrands';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import type { LensBrand } from '@/types';

export default function LensBrandsPage() {
  const { data, isLoading } = useLensBrands();
  const create = useCreateLensBrand();
  const update = useUpdateLensBrand();
  const remove = useDeleteLensBrand();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<LensBrand | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [active, setActive] = useState(true);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  function openCreate() { setEditing(null); setName(''); setDescription(''); setActive(true); setLogoFile(null); setModalOpen(true); }
  function openEdit(b: LensBrand) { setEditing(b); setName(b.name); setDescription(b.description); setActive(b.active); setLogoFile(null); setModalOpen(true); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = new FormData();
    form.append('name', name);
    form.append('description', description);
    form.append('active', String(active));
    if (logoFile) form.append('logo', logoFile);

    const action = editing ? update.mutateAsync({ id: editing._id, form }) : create.mutateAsync(form);
    action.then(() => { toast.success('Saved'); setModalOpen(false); }).catch(() => toast.error('Failed'));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Lens Brands</h1>
        <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" />Add Lens Brand</Button>
      </div>
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Logo</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Name</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Status</th>
              <th className="px-4 py-3 text-right text-gray-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              <tr><td colSpan={4} className="text-center py-8 text-gray-400">Loading...</td></tr>
            ) : data?.data?.map((b) => (
              <tr key={b._id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{b.logo ? <Image src={b.logo} alt={b.name} width={48} height={32} className="object-contain" /> : <div className="w-12 h-8 bg-gray-100 rounded" />}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{b.name}</td>
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
          <DialogHeader><DialogTitle>{editing ? 'Edit Lens Brand' : 'New Lens Brand'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label>Name *</Label><Input value={name} onChange={(e) => setName(e.target.value)} required className="mt-1" /></div>
            <div><Label>Description</Label><Input value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1" /></div>
            <div><Label>Logo</Label><Input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)} className="mt-1" /></div>
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
