'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/hooks/useCategories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Plus, ChevronRight, FolderOpen, Folder } from 'lucide-react';
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
  const [parentId, setParentId] = useState('');
  const [hiName, setHiName] = useState('');
  const [hiDesc, setHiDesc] = useState('');

  const allCats = data?.data ?? [];
  // Top-level = no parent
  const parents = allCats.filter((c) => !c.parentId);
  // Sub-categories grouped by parent._id
  const childrenOf = (pid: string) => allCats.filter((c) => {
    const p = c.parentId;
    if (!p) return false;
    return (typeof p === 'string' ? p : p._id) === pid;
  });

  function openCreate(defaultParentId = '') {
    setEditing(null); setName(''); setDescription(''); setActive(true); setImageFile(null); setHiName(''); setHiDesc('');
    setParentId(defaultParentId);
    setModalOpen(true);
  }

  function openEdit(cat: Category) {
    setEditing(cat); setName(cat.name); setDescription(cat.description); setActive(cat.active); setImageFile(null); setHiName(cat.translations?.hi?.name ?? ''); setHiDesc(cat.translations?.hi?.description ?? '');
    const p = cat.parentId;
    setParentId(p ? (typeof p === 'string' ? p : p._id) : '');
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = new FormData();
    form.append('name', name);
    form.append('description', description);
    form.append('active', String(active));
    if (parentId) form.append('parentId', parentId);
    if (imageFile) form.append('image', imageFile);
    form.append('hi_name', hiName);
    form.append('hi_description', hiDesc);

    const action = editing ? update.mutateAsync({ id: editing._id, form }) : create.mutateAsync(form);
    action
      .then(() => { toast.success(editing ? 'Updated' : 'Created'); setModalOpen(false); })
      .catch((err) => toast.error(err?.response?.data?.message ?? 'Something went wrong'));
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this category?')) return;
    remove.mutate(id, {
      onSuccess: () => toast.success('Deleted'),
      onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Failed'),
    });
  }

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold text-slate-800">Categories</h1>
        <Button onClick={() => openCreate()} size="sm">
          <Plus className="w-4 h-4 md:mr-2" /><span className="hidden md:inline">Add Category</span>
        </Button>
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-sm text-blue-700 flex items-start gap-2">
        <span className="mt-0.5">ℹ️</span>
        <span>
          <strong>Two-level hierarchy:</strong> Create top-level categories (Men, Women, Kids) first, then add sub-categories (Metal Eyewear, Goggles…) under them. Products are assigned to sub-categories.
        </span>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center text-slate-400">Loading...</div>
      ) : parents.length === 0 && allCats.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center text-slate-400">No categories yet. Add your first one above.</div>
      ) : (
        <div className="space-y-3">
          {/* ── Orphan sub-categories (parent was deleted) ── */}
          {allCats.filter((c) => c.parentId && !parents.find((p) => p._id === (typeof c.parentId === 'string' ? c.parentId : c.parentId?._id))).map((c) => (
            <div key={c._id} className="bg-white rounded-2xl border border-orange-100 shadow-sm p-4 flex items-center gap-3">
              <span className="text-orange-400 text-xs font-medium">⚠ Orphan</span>
              <p className="font-medium text-slate-700 text-sm flex-1">{c.name}</p>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(c)}><Pencil className="w-3.5 h-3.5" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(c._id)}><Trash2 className="w-3.5 h-3.5 text-red-500" /></Button>
            </div>
          ))}

          {/* ── Parent categories with their children ── */}
          {parents.map((parent) => {
            const children = childrenOf(parent._id);
            return (
              <div key={parent._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {/* Parent row */}
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border-b border-slate-100">
                  {parent.image
                    ? <Image src={parent.image} alt={parent.name} width={40} height={32} className="object-cover rounded-lg shrink-0 w-10 h-8" />
                    : <div className="w-10 h-8 bg-slate-200 rounded-lg shrink-0 flex items-center justify-center"><FolderOpen className="w-4 h-4 text-slate-400" /></div>}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-slate-800 text-sm">{parent.name}</p>
                      <Badge variant={parent.active ? 'default' : 'secondary'} className="text-xs">{parent.active ? 'Active' : 'Inactive'}</Badge>
                    </div>
                    <p className="text-xs text-slate-400">{children.length} sub-categor{children.length === 1 ? 'y' : 'ies'}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="outline" size="sm" className="h-7 text-xs hidden sm:flex" onClick={() => openCreate(parent._id)}>
                      <Plus className="w-3 h-3 mr-1" />Sub-category
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 sm:hidden" onClick={() => openCreate(parent._id)} title="Add sub-category">
                      <Plus className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(parent)}><Pencil className="w-3.5 h-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(parent._id)}><Trash2 className="w-3.5 h-3.5 text-red-500" /></Button>
                  </div>
                </div>

                {/* Children rows */}
                {children.length > 0 && (
                  <div className="divide-y divide-slate-50">
                    {children.map((child) => (
                      <div key={child._id} className="flex items-center gap-3 px-4 py-2.5 pl-8 hover:bg-slate-50/50">
                        <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
                        {child.image
                          ? <Image src={child.image} alt={child.name} width={32} height={24} className="object-cover rounded w-8 h-6 shrink-0" />
                          : <div className="w-8 h-6 bg-slate-100 rounded shrink-0 flex items-center justify-center"><Folder className="w-3 h-3 text-slate-300" /></div>}
                        <p className="text-sm text-slate-700 flex-1">{child.name}</p>
                        <Badge variant={child.active ? 'default' : 'secondary'} className="text-xs shrink-0">{child.active ? 'Active' : 'Inactive'}</Badge>
                        <div className="flex gap-1 shrink-0">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(child)}><Pencil className="w-3 h-3" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDelete(child._id)}><Trash2 className="w-3 h-3 text-red-500" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {children.length === 0 && (
                  <div className="px-8 py-3 text-xs text-slate-400 italic">No sub-categories yet — click "+ Sub-category" to add one</div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Category' : parentId ? 'New Sub-category' : 'New Top-level Category'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Parent selector */}
            <div>
              <Label>Type</Label>
              <div className="grid grid-cols-2 gap-2 mt-1.5">
                <button
                  type="button"
                  onClick={() => setParentId('')}
                  className={`py-2 px-3 rounded-xl border text-sm font-medium transition-all ${!parentId ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}
                >
                  🗂 Top-level
                </button>
                <button
                  type="button"
                  onClick={() => { if (!parentId && parents.length) setParentId(parents[0]._id); }}
                  className={`py-2 px-3 rounded-xl border text-sm font-medium transition-all ${parentId ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}
                >
                  📁 Sub-category
                </button>
              </div>
            </div>

            {/* Parent picker (shown only when sub-category selected) */}
            {(parentId || false) && (
              <div>
                <Label>Parent Category *</Label>
                <select
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                  className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select parent…</option>
                  {parents.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
              </div>
            )}

            <div><Label>Name *</Label><Input value={name} onChange={(e) => setName(e.target.value)} required className="mt-1" placeholder={parentId ? 'e.g. Metal Eyewear, Goggles…' : 'e.g. Men, Women, Kids…'} /></div>
            <div><Label>Description</Label><Input value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1" /></div>
            {/* Hindi Translation */}
            <div className="rounded-xl border border-orange-100 bg-orange-50 p-3 space-y-2">
              <p className="text-xs font-bold text-orange-700 flex items-center gap-1">🇮🇳 Hindi Translation <span className="font-normal text-orange-500">(optional)</span></p>
              <div><Label className="text-xs">नाम (Name in Hindi)</Label><Input value={hiName} onChange={(e) => setHiName(e.target.value)} className="mt-1 text-sm" placeholder="e.g. पुरुष, महिला…" /></div>
              <div><Label className="text-xs">विवरण (Description in Hindi)</Label><Input value={hiDesc} onChange={(e) => setHiDesc(e.target.value)} className="mt-1 text-sm" placeholder="Hindi description…" /></div>
            </div>
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
