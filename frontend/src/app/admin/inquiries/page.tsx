'use client';
import { useState } from 'react';
import { useInquiries, useUpdateInquiryStatus } from '@/hooks/useInquiries';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import StatusBadge from '@/components/admin/StatusBadge';
import { Eye } from 'lucide-react';
import { toast } from 'sonner';
import type { Inquiry } from '@/types';

const STATUSES = ['new', 'contacted', 'quoted', 'completed', 'cancelled'];

export default function InquiriesPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const { data, isLoading } = useInquiries({ status: statusFilter || undefined, page });
  const updateStatus = useUpdateInquiryStatus();
  const [selected, setSelected] = useState<Inquiry | null>(null);

  function handleStatusChange(id: string, status: string) {
    updateStatus.mutate({ id, status }, {
      onSuccess: () => toast.success('Status updated'),
      onError: () => toast.error('Failed'),
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Inquiries</h1>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v === 'all' ? '' : (v ?? '')); setPage(1); }}>
          <SelectTrigger className="w-40"><SelectValue placeholder="All Statuses" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Customer</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Frame</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Color / Size</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Phone</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Power?</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Status</th>
              <th className="px-4 py-3 text-left text-gray-600 font-medium">Date</th>
              <th className="px-4 py-3 text-right text-gray-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              <tr><td colSpan={7} className="text-center py-8 text-gray-400">Loading...</td></tr>
            ) : data?.data?.map((inq) => (
              <tr key={inq._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{inq.customerName}</td>
                <td className="px-4 py-3 text-gray-600 max-w-[140px] truncate">{inq.frameId?.name ?? '—'}</td>
                <td className="px-4 py-3 text-gray-600 text-xs">
                  {inq.selectedColor && <span className="block">🎨 {inq.selectedColor}</span>}
                  {inq.selectedSize  && <span className="block">📐 {inq.selectedSize}</span>}
                  {!inq.selectedColor && !inq.selectedSize && <span className="text-gray-300">—</span>}
                </td>
                <td className="px-4 py-3 text-gray-600">{inq.phone}</td>
                <td className="px-4 py-3 text-gray-600">{inq.powerRequired ? 'Yes' : 'No'}</td>
                <td className="px-4 py-3">
                  <Select value={inq.status} onValueChange={(v) => v && handleStatusChange(inq._id, v)}>
                    <SelectTrigger className="h-7 text-xs w-28"><SelectValue /></SelectTrigger>
                    <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize text-xs">{s}</SelectItem>)}</SelectContent>
                  </Select>
                </td>
                <td className="px-4 py-3 text-gray-500">{new Date(inq.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="icon" onClick={() => setSelected(inq)}><Eye className="w-4 h-4" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data?.pagination && data.pagination.pages > 1 && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
          <span className="flex items-center px-4 text-sm text-gray-600">Page {page} of {data.pagination.pages}</span>
          <Button variant="outline" disabled={page >= data.pagination.pages} onClick={() => setPage(page + 1)}>Next</Button>
        </div>
      )}

      {/* Detail modal */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Inquiry Detail</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div><p className="text-gray-500">Customer</p><p className="font-medium">{selected.customerName}</p></div>
                <div><p className="text-gray-500">Phone</p><p className="font-medium">{selected.phone}</p></div>
                <div><p className="text-gray-500">Email</p><p className="font-medium">{selected.email || '—'}</p></div>
                <div><p className="text-gray-500">City</p><p className="font-medium">{selected.city || '—'}</p></div>
                <div><p className="text-gray-500">Frame</p><p className="font-medium">{selected.frameId?.name ?? '—'}</p></div>
                {selected.selectedColor && <div><p className="text-gray-500">Color</p><p className="font-medium">{selected.selectedColor}</p></div>}
                {selected.selectedSize  && <div><p className="text-gray-500">Size</p><p className="font-medium">{selected.selectedSize}</p></div>}
                <div><p className="text-gray-500">Power Required</p><p className="font-medium">{selected.powerRequired ? 'Yes' : 'No'}</p></div>
                {selected.lensBrandId && <div><p className="text-gray-500">Lens Brand</p><p className="font-medium">{selected.lensBrandId.name}</p></div>}
                {selected.lensTypes?.length > 0 && <div className="col-span-2"><p className="text-gray-500">Lens Types</p><p className="font-medium">{selected.lensTypes.map((t) => t.name).join(', ')}</p></div>}
                {selected.powerRequired && (
                  <>
                    <div><p className="text-gray-500">Right Eye</p><p className="font-medium">SPH {selected.rightEye.sph} / CYL {selected.rightEye.cyl} / AXIS {selected.rightEye.axis}</p></div>
                    <div><p className="text-gray-500">Left Eye</p><p className="font-medium">SPH {selected.leftEye.sph} / CYL {selected.leftEye.cyl} / AXIS {selected.leftEye.axis}</p></div>
                  </>
                )}
                {selected.notes && <div className="col-span-2"><p className="text-gray-500">Notes</p><p className="font-medium">{selected.notes}</p></div>}
                <div><p className="text-gray-500">Status</p><StatusBadge status={selected.status} /></div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
