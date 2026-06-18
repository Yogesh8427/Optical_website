'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useTestimonials, useCreateTestimonial, useUpdateTestimonial, useDeleteTestimonial } from '@/hooks/useTestimonials';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Plus, Star } from 'lucide-react';
import { toast } from 'sonner';
import type { Testimonial } from '@/types';

export default function TestimonialsPage() {
  const { data, isLoading } = useTestimonials();
  const create = useCreateTestimonial();
  const update = useUpdateTestimonial();
  const remove = useDeleteTestimonial();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);
  const [active, setActive] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);

  function openCreate() {
    setEditing(null); setName(''); setText(''); setRating(5); setActive(true); setImageFile(null);
    setOpen(true);
  }
  function openEdit(t: Testimonial) {
    setEditing(t); setName(t.name); setText(t.text); setRating(t.rating); setActive(t.active); setImageFile(null);
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = new FormData();
    form.append('name', name);
    form.append('text', text);
    form.append('rating', String(rating));
    form.append('active', String(active));
    if (imageFile) form.append('image', imageFile);

    const action = editing
      ? update.mutateAsync({ id: editing._id, form })
      : create.mutateAsync(form);
    action
      .then(() => { toast.success('Saved'); setOpen(false); })
      .catch(() => toast.error('Failed to save'));
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this testimonial?')) return;
    remove.mutate(id, { onSuccess: () => toast.success('Deleted'), onError: () => toast.error('Failed') });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
        <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" />Add Testimonial</Button>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Photo</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Name</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Review</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Rating</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Status</th>
              <th className="px-4 py-3 text-right text-gray-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400">Loading...</td></tr>
            ) : data?.data?.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400">No testimonials yet</td></tr>
            ) : data?.data?.map((t) => (
              <tr key={t._id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  {t.image ? (
                    <Image src={t.image} alt={t.name} width={40} height={40} className="rounded-full object-cover w-10 h-10" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-sm">
                      {t.name[0]}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">{t.name}</td>
                <td className="px-4 py-3 text-gray-500 max-w-xs">
                  <p className="line-clamp-2">{t.text}</p>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < t.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={t.active ? 'default' : 'secondary'}>{t.active ? 'Active' : 'Inactive'}</Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(t)}><Pencil className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(t._id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? 'Edit Testimonial' : 'New Testimonial'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label>Customer Name *</Label><Input value={name} onChange={(e) => setName(e.target.value)} required className="mt-1" /></div>
            <div>
              <Label>Review *</Label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
                rows={3}
                className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="What did the customer say?"
              />
            </div>
            <div>
              <Label>Rating</Label>
              <div className="flex items-center gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" onClick={() => setRating(n)}>
                    <Star className={`w-6 h-6 ${n <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                  </button>
                ))}
                <span className="text-sm text-gray-500 ml-1">{rating}/5</span>
              </div>
            </div>
            <div><Label>Photo</Label><Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} className="mt-1" /></div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="active" checked={active} onChange={(e) => setActive(e.target.checked)} />
              <Label htmlFor="active">Active (show on website)</Label>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">Cancel</Button>
              <Button type="submit" className="flex-1">Save</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
