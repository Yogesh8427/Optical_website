'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useBrands, useCreateBrand, useUpdateBrand, useDeleteBrand } from '@/hooks/useBrands';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import type { Brand } from '@/types';

export default function BrandsPage() {
  const { data, isLoading } = useBrands();
  const create = useCreateBrand();
  const update = useUpdateBrand();
  const remove = useDeleteBrand();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Brand | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [active, setActive] = useState(true);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  function openCreate() { setEditing(null); setName(''); setDescription(''); setActive(true); setLogoFile(null); setModalOpen(true); }
  function openEdit(b: Brand) { setEditing(b); setName(b.name); setDescription(b.description); setActive(b.active); setLogoFile(null); setModalOpen(true); }

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

  function handleDelete(id: string) {
    if (!confirm('Delete this brand?')) return;
    remove.mutate(id, { onSuccess: () => toast.success('Deleted'), onError: () => toast.error('Failed') });
  }

  const brands = data?.data ?? [];

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold text-slate-800">Brands</h1>
        <Button onClick={openCreate} size="sm">
          <Plus className="w-4 h-4 md:mr-2" /><span className="hidden md:inline">Add Brand</span>
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Mobile cards */}
        <div className="divide-y divide-slate-50 md:hidden">
          {isLoading ? (
            <div className="py-10 text-center text-slate-400 text-sm">Loading...</div>
          ) : brands.length === 0 ? (
            <div className="py-10 text-center text-slate-400 text-sm">No brands yet</div>
          ) : brands.map((b) => (
            <div key={b._id} className="flex items-center gap-3 px-4 py-3">
              {b.logo
                ? <Image src={b.logo} alt={b.name} width={48} height={32} className="object-contain shrink-0 w-12 h-8" />
                : <div className="w-12 h-8 bg-slate-100 rounded-lg shrink-0" />}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800 text-sm truncate">{b.name}</p>
              </div>
              <Badge variant={b.active ? 'default' : 'secondary'} className="shrink-0 text-xs">{b.active ? 'Active' : 'Inactive'}</Badge>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(b)}><Pencil className="w-3.5 h-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(b._id)}><Trash2 className="w-3.5 h-3.5 text-red-500" /></Button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b text-xs text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Logo</th>
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr><td colSpan={4} className="text-center py-8 text-slate-400">Loading...</td></tr>
              ) : brands.map((b) => (
                <tr key={b._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3">
                    {b.logo ? <Image src={b.logo} alt={b.name} width={48} height={32} className="object-contain" /> : <div className="w-12 h-8 bg-slate-100 rounded-lg" />}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800">{b.name}</td>
                  <td className="px-4 py-3"><Badge variant={b.active ? 'default' : 'secondary'}>{b.active ? 'Active' : 'Inactive'}</Badge></td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(b)}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(b._id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="w-[calc(100vw-1.5rem)] sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? 'Edit Brand' : 'New Brand'}</DialogTitle></DialogHeader>
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
