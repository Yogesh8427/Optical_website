'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/hooks/useCategories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import type { Category } from '@/types';

export default function CategoriesPage() {
  const { data, isLoading } = useCategories();
  const create = useCreateCategory();
  const update = useUpdateCategory();
  const remove = useDeleteCategory();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [active, setActive] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);

  function openCreate() { setEditing(null); setName(''); setDescription(''); setActive(true); setImageFile(null); setModalOpen(true); }
  function openEdit(cat: Category) { setEditing(cat); setName(cat.name); setDescription(cat.description); setActive(cat.active); setImageFile(null); setModalOpen(true); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = new FormData();
    form.append('name', name);
    form.append('description', description);
    form.append('active', String(active));
    if (imageFile) form.append('image', imageFile);

    const action = editing ? update.mutateAsync({ id: editing._id, form }) : create.mutateAsync(form);
    action.then(() => { toast.success(editing ? 'Category updated' : 'Category created'); setModalOpen(false); })
          .catch(() => toast.error('Something went wrong'));
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this category?')) return;
    remove.mutate(id, { onSuccess: () => toast.success('Deleted'), onError: () => toast.error('Failed') });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" />Add Category</Button>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Image</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Name</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Slug</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Status</th>
              <th className="px-4 py-3 text-right text-gray-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              <tr><td colSpan={5} className="text-center py-8 text-gray-400">Loading...</td></tr>
            ) : data?.data?.map((cat) => (
              <tr key={cat._id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  {cat.image ? <Image src={cat.image} alt={cat.name} width={48} height={32} className="object-cover rounded" /> : <div className="w-12 h-8 bg-gray-100 rounded" />}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">{cat.name}</td>
                <td className="px-4 py-3 text-gray-500 font-mono text-xs">{cat.slug}</td>
                <td className="px-4 py-3"><Badge variant={cat.active ? 'default' : 'secondary'}>{cat.active ? 'Active' : 'Inactive'}</Badge></td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(cat)}><Pencil className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(cat._id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? 'Edit Category' : 'New Category'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label>Name *</Label><Input value={name} onChange={(e) => setName(e.target.value)} required className="mt-1" /></div>
            <div><Label>Description</Label><Input value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1" /></div>
            <div><Label>Image</Label><Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} className="mt-1" /></div>
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
