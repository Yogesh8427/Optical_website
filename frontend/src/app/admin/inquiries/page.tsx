'use client';
import { useState } from 'react';
import { useInquiries, useUpdateInquiryStatus } from '@/hooks/useInquiries';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import StatusBadge from '@/components/admin/StatusBadge';
import { Eye, FileText, ExternalLink } from 'lucide-react';
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

  const inquiries = data?.data ?? [];

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl md:text-2xl font-bold text-slate-800">Inquiries</h1>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v === 'all' ? '' : (v ?? '')); setPage(1); }}>
          <SelectTrigger className="w-40"><SelectValue placeholder="All Statuses" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Mobile cards */}
        <div className="divide-y divide-slate-50 md:hidden">
          {isLoading ? (
            <div className="py-10 text-center text-slate-400 text-sm">Loading...</div>
          ) : inquiries.length === 0 ? (
            <div className="py-10 text-center text-slate-400 text-sm">No inquiries yet</div>
          ) : inquiries.map((inq) => (
            <div key={inq._id} className="px-4 py-3 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-slate-800 text-sm">{inq.customerName}</p>
                  <p className="text-xs text-slate-400">{inq.phone}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Select value={inq.status} onValueChange={(v) => v && handleStatusChange(inq._id, v)}>
                    <SelectTrigger className="h-7 text-xs w-28"><SelectValue /></SelectTrigger>
                    <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize text-xs">{s}</SelectItem>)}</SelectContent>
                  </Select>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelected(inq)}><Eye className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                {inq.frameId?.name ?? '—'}{inq.selectedColor && ` · ${inq.selectedColor}`}{inq.selectedSize && ` · ${inq.selectedSize}`}
              </p>
              <p className="text-xs text-slate-400">{new Date(inq.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b text-xs text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Customer</th>
                <th className="px-4 py-3 text-left font-medium">Frame</th>
                <th className="px-4 py-3 text-left font-medium">Color / Size</th>
                <th className="px-4 py-3 text-left font-medium">Phone</th>
                <th className="px-4 py-3 text-left font-medium">Power?</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Date</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr><td colSpan={7} className="text-center py-8 text-slate-400">Loading...</td></tr>
              ) : inquiries.map((inq) => (
                <tr key={inq._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-800">{inq.customerName}</td>
                  <td className="px-4 py-3 text-slate-600 max-w-[140px] truncate">{inq.frameId?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-slate-600 text-xs">
                    {inq.selectedColor && <span className="block">🎨 {inq.selectedColor}</span>}
                    {inq.selectedSize  && <span className="block">📐 {inq.selectedSize}</span>}
                    {!inq.selectedColor && !inq.selectedSize && <span className="text-slate-300">—</span>}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{inq.phone}</td>
                  <td className="px-4 py-3 text-slate-600">{inq.powerRequired ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-3">
                    <Select value={inq.status} onValueChange={(v) => v && handleStatusChange(inq._id, v)}>
                      <SelectTrigger className="h-7 text-xs w-28"><SelectValue /></SelectTrigger>
                      <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize text-xs">{s}</SelectItem>)}</SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{new Date(inq.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="icon" onClick={() => setSelected(inq)}><Eye className="w-4 h-4" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {data?.pagination && data.pagination.pages > 1 && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
          <span className="flex items-center px-4 text-sm text-slate-600">Page {page} of {data.pagination.pages}</span>
          <Button variant="outline" disabled={page >= data.pagination.pages} onClick={() => setPage(page + 1)}>Next</Button>
        </div>
      )}

      {/* Detail modal */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Inquiry Detail</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">

              {/* ── Row helper ── */}
              <div className="rounded-xl border border-slate-100 overflow-hidden divide-y divide-slate-50">

                {/* Customer + Phone */}
                <div className="grid grid-cols-2">
                  <div className="px-4 py-3 min-w-0">
                    <p className="text-xs text-slate-400 mb-0.5">Customer</p>
                    <p className="font-medium text-slate-800 truncate">{selected.customerName}</p>
                  </div>
                  <div className="px-4 py-3 border-l border-slate-50 min-w-0">
                    <p className="text-xs text-slate-400 mb-0.5">Phone</p>
                    <p className="font-medium text-slate-800 truncate">{selected.phone}</p>
                  </div>
                </div>

                {/* Email — full width so long addresses don't overflow */}
                <div className="px-4 py-3 min-w-0">
                  <p className="text-xs text-slate-400 mb-0.5">Email</p>
                  <p className="font-medium text-slate-800 break-all">{selected.email || '—'}</p>
                </div>

                {/* City + Status */}
                <div className="grid grid-cols-2">
                  <div className="px-4 py-3 min-w-0">
                    <p className="text-xs text-slate-400 mb-0.5">City</p>
                    <p className="font-medium text-slate-800 truncate">{selected.city || '—'}</p>
                  </div>
                  <div className="px-4 py-3 border-l border-slate-50 min-w-0">
                    <p className="text-xs text-slate-400 mb-0.5">Status</p>
                    <StatusBadge status={selected.status} />
                  </div>
                </div>

                {/* Frame — full width */}
                <div className="px-4 py-3 min-w-0">
                  <p className="text-xs text-slate-400 mb-0.5">Frame</p>
                  <p className="font-medium text-slate-800">{selected.frameId?.name ?? '—'}</p>
                </div>

                {/* Color + Size */}
                {(selected.selectedColor || selected.selectedSize) && (
                  <div className="grid grid-cols-2">
                    {selected.selectedColor && (
                      <div className="px-4 py-3 min-w-0">
                        <p className="text-xs text-slate-400 mb-0.5">Color</p>
                        <p className="font-medium text-slate-800 truncate">{selected.selectedColor}</p>
                      </div>
                    )}
                    {selected.selectedSize && (
                      <div className={`px-4 py-3 min-w-0 ${selected.selectedColor ? 'border-l border-slate-50' : ''}`}>
                        <p className="text-xs text-slate-400 mb-0.5">Size</p>
                        <p className="font-medium text-slate-800 truncate">{selected.selectedSize}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Power Required + Lens Brand */}
                <div className="grid grid-cols-2">
                  <div className="px-4 py-3 min-w-0">
                    <p className="text-xs text-slate-400 mb-0.5">Power Required</p>
                    <p className="font-medium text-slate-800">{selected.powerRequired ? 'Yes' : 'No'}</p>
                  </div>
                  {selected.lensBrandId && (
                    <div className="px-4 py-3 border-l border-slate-50 min-w-0">
                      <p className="text-xs text-slate-400 mb-0.5">Lens Brand</p>
                      <p className="font-medium text-slate-800 truncate">{selected.lensBrandId.name}</p>
                    </div>
                  )}
                </div>

                {/* Lens Types */}
                {selected.lensTypes?.length > 0 && (
                  <div className="px-4 py-3 min-w-0">
                    <p className="text-xs text-slate-400 mb-0.5">Lens Types</p>
                    <p className="font-medium text-slate-800">{selected.lensTypes.map((t) => t.name).join(', ')}</p>
                  </div>
                )}

                {/* Prescription — Right + Left eye */}
                {selected.powerRequired && (
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-3 min-w-0">
                      <p className="text-xs text-slate-400 mb-0.5">Right Eye</p>
                      <p className="font-medium text-slate-800 text-xs leading-relaxed">
                        SPH {selected.rightEye.sph || '—'}<br />
                        CYL {selected.rightEye.cyl || '—'}<br />
                        AXIS {selected.rightEye.axis || '—'}
                      </p>
                    </div>
                    <div className="px-4 py-3 border-l border-slate-50 min-w-0">
                      <p className="text-xs text-slate-400 mb-0.5">Left Eye</p>
                      <p className="font-medium text-slate-800 text-xs leading-relaxed">
                        SPH {selected.leftEye.sph || '—'}<br />
                        CYL {selected.leftEye.cyl || '—'}<br />
                        AXIS {selected.leftEye.axis || '—'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {selected.notes && (
                  <div className="px-4 py-3 min-w-0">
                    <p className="text-xs text-slate-400 mb-0.5">Notes</p>
                    <p className="font-medium text-slate-800">{selected.notes}</p>
                  </div>
                )}
              </div>

              {/* Prescription File */}
              {selected.prescriptionFile && (
                <div className="border border-slate-100 rounded-xl p-3 space-y-2">
                  <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide">Prescription File</p>
                  {selected.prescriptionFile.match(/\.(jpg|jpeg|png|webp)($|\?)/i) ? (
                    /* image — show inline preview */
                    <div className="space-y-2">
                      <img
                        src={selected.prescriptionFile}
                        alt="Prescription"
                        className="w-full max-h-72 object-contain rounded-lg border border-slate-100 bg-slate-50"
                      />
                      <a
                        href={selected.prescriptionFile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" /> Open full size
                      </a>
                    </div>
                  ) : (
                    /* PDF — show link */
                    <a
                      href={selected.prescriptionFile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm text-slate-700 transition-colors"
                    >
                      <FileText className="w-4 h-4 text-red-500 shrink-0" />
                      <span className="flex-1 truncate">View Prescription PDF</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    </a>
                  )}
                </div>
              )}

            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
