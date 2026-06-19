'use client';
import { useState, useRef } from 'react';
import { useOffers, useCreateOffer, useUpdateOffer, useDeleteOffer } from '@/hooks/useOffers';
import { Offer } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';

const emptyForm = {
  title: '',
  description: '',
  occasionName: '',
  discountType: 'percentage',
  discountValue: '',
  bgColor: '#2563eb',
  startDate: '',
  endDate: '',
  active: true,
};

export default function AdminOffersPage() {
  const { data, isLoading } = useOffers();
  const offers: Offer[] = data?.data ?? [];
  const createOffer = useCreateOffer();
  const updateOffer = useUpdateOffer();
  const deleteOffer = useDeleteOffer();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Offer | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function openCreate() {
    setEditing(null);
    setForm({ ...emptyForm });
    setBannerFile(null);
    setOpen(true);
  }

  function openEdit(o: Offer) {
    setEditing(o);
    setForm({
      title: o.title,
      description: o.description,
      occasionName: o.occasionName,
      discountType: o.discountType,
      discountValue: String(o.discountValue),
      bgColor: o.bgColor || '#2563eb',
      startDate: o.startDate ? o.startDate.slice(0, 10) : '',
      endDate: o.endDate ? o.endDate.slice(0, 10) : '',
      active: o.active,
    });
    setBannerFile(null);
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
    if (bannerFile) fd.append('bannerImage', bannerFile);
    try {
      if (editing) {
        await updateOffer.mutateAsync({ id: editing._id, form: fd });
        toast.success('Offer updated');
      } else {
        await createOffer.mutateAsync(fd);
        toast.success('Offer created');
      }
      setOpen(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error saving offer';
      toast.error(message);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this offer?')) return;
    try {
      await deleteOffer.mutateAsync(id);
      toast.success('Offer deleted');
    } catch {
      toast.error('Error deleting offer');
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Offers</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage promotional offers</p>
        </div>
        <Button onClick={openCreate} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Offer
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-400">Loading...</div>
        ) : offers.length === 0 ? (
          <div className="p-8 text-center text-slate-400">No offers yet. Create your first offer.</div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Title</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Occasion</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Discount</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Dates</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Status</th>
                <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {offers.map((o) => (
                <tr key={o._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: o.bgColor || '#2563eb' }} />
                      <span className="font-medium text-slate-800">{o.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 text-sm">{o.occasionName || '—'}</td>
                  <td className="px-4 py-3">
                    <Badge className="bg-orange-100 text-orange-700 border-0 font-semibold">
                      {o.discountType === 'percentage' ? `${o.discountValue}% OFF` : `₹${o.discountValue} OFF`}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">
                    {o.startDate || o.endDate ? (
                      <span>
                        {o.startDate ? new Date(o.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}
                        {' → '}
                        {o.endDate ? new Date(o.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'No end'}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={o.active ? 'bg-green-100 text-green-700 border-0' : 'bg-slate-100 text-slate-500 border-0'}>
                      {o.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="ghost" onClick={() => openEdit(o)} className="h-8 w-8 p-0">
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(o._id)} className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Offer' : 'Create Offer'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label>Title *</Label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} />
            </div>
            <div className="space-y-1.5">
              <Label>Occasion Name</Label>
              <Input value={form.occasionName} onChange={e => setForm(f => ({ ...f, occasionName: e.target.value }))} placeholder="e.g. Diwali Sale" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Discount Type</Label>
                <Select value={form.discountType} onValueChange={v => setForm(f => ({ ...f, discountType: v ?? f.discountType }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="flat">Flat (₹)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Discount Value</Label>
                <Input type="number" min="0" value={form.discountValue} onChange={e => setForm(f => ({ ...f, discountValue: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Start Date</Label>
                <Input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>End Date</Label>
                <Input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Background Color</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={form.bgColor} onChange={e => setForm(f => ({ ...f, bgColor: e.target.value }))} className="h-9 w-14 rounded border border-slate-200 cursor-pointer" />
                <Input value={form.bgColor} onChange={e => setForm(f => ({ ...f, bgColor: e.target.value }))} className="flex-1" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Banner Image</Label>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => setBannerFile(e.target.files?.[0] ?? null)} />
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                  Choose File
                </Button>
                <span className="text-sm text-slate-500">{bannerFile ? bannerFile.name : editing?.bannerImage ? 'Current image set' : 'No file chosen'}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="active" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} className="rounded" />
              <Label htmlFor="active">Active</Label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createOffer.isPending || updateOffer.isPending}>
                {editing ? 'Update Offer' : 'Create Offer'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
