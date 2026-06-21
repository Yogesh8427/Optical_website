'use client';
import { useState } from 'react';
import { useFAQs, useCreateFAQ, useUpdateFAQ, useDeleteFAQ } from '@/hooks/useFAQs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import type { FAQ } from '@/types';

export default function FAQsPage() {
  const { data, isLoading } = useFAQs();
  const create = useCreateFAQ();
  const update = useUpdateFAQ();
  const remove = useDeleteFAQ();

  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editing, setEditing] = useState<FAQ | null>(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [active, setActive] = useState(true);

  function openCreate() {
    setEditing(null); setQuestion(''); setAnswer(''); setSortOrder(0); setActive(true);
    setOpen(true);
  }
  function openEdit(f: FAQ) {
    setEditing(f); setQuestion(f.question); setAnswer(f.answer); setSortOrder(f.sortOrder); setActive(f.active);
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const body = { question, answer, sortOrder, active };
    const action = editing
      ? update.mutateAsync({ id: editing._id, body })
      : create.mutateAsync(body);
    action
      .then(() => { toast.success('Saved'); setOpen(false); })
      .catch(() => toast.error('Failed to save'));
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this FAQ?')) return;
    remove.mutate(id, { onSuccess: () => toast.success('Deleted'), onError: () => toast.error('Failed') });
  }

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold text-slate-800">FAQs</h1>
        <Button onClick={openCreate} size="sm">
          <Plus className="w-4 h-4 md:mr-2" /><span className="hidden md:inline">Add FAQ</span>
        </Button>
      </div>

      <div className="space-y-2">
        {isLoading ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center text-slate-400">Loading...</div>
        ) : data?.data?.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center text-slate-400">No FAQs yet</div>
        ) : data?.data?.map((f) => (
          <div key={f._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div
              className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-slate-50"
              onClick={() => setExpanded(expanded === f._id ? null : f._id)}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-xs text-slate-400 font-mono w-6 shrink-0">#{f.sortOrder}</span>
                <p className="font-medium text-slate-800 text-sm line-clamp-2">{f.question}</p>
                <Badge variant={f.active ? 'default' : 'secondary'} className="shrink-0 text-xs">
                  {f.active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div className="flex items-center gap-1 ml-3 shrink-0">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); openEdit(f); }}>
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); handleDelete(f._id); }}>
                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                </Button>
                {expanded === f._id ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </div>
            </div>
            {expanded === f._id && (
              <div className="px-4 pb-4 pt-1 border-t bg-slate-50">
                <p className="text-sm text-slate-600 leading-relaxed">{f.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[calc(100vw-1.5rem)] sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? 'Edit FAQ' : 'New FAQ'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Question *</Label>
              <Input value={question} onChange={(e) => setQuestion(e.target.value)} required className="mt-1" placeholder="e.g. How long does delivery take?" />
            </div>
            <div>
              <Label>Answer *</Label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                required
                rows={4}
                className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Provide a clear, helpful answer..."
              />
            </div>
            <div>
              <Label>Sort Order</Label>
              <Input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} className="mt-1 w-24" min={0} />
              <p className="text-xs text-slate-400 mt-1">Lower number = shown first</p>
            </div>
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
