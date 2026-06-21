'use client';
import { useState, useEffect, Fragment } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCoupons, useCreateCoupon, useUpdateCoupon, useDeleteCoupon } from '@/hooks/useCoupons';
import api from '@/lib/api';
import { Coupon } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Pencil, Trash2, Plus, RefreshCw, Users, UserPlus, ChevronDown, ChevronUp, ScanLine, XCircle, CheckCircle2, Camera, X } from 'lucide-react';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';
const QrScanner = dynamic(() => import('@/components/admin/QrScanner'), { ssr: false });

type CouponWithClaims = Coupon & {
  claims?: { claimId: string; name: string; phone: string; claimedAt: string; redeemed: boolean; redeemedAt?: string }[];
};

const emptyForm = {
  code: '', title: '', description: '', type: 'eye_checkup',
  discountType: 'free_service', discountValue: '0', validUntil: '', maxUses: '100', active: true,
  bgColor: '', bannerImage: '',
};

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

const typeConfig: Record<string, { label: string; className: string }> = {
  eye_checkup: { label: 'Eye Checkup', className: 'bg-blue-100 text-blue-700 border-0' },
  discount:    { label: 'Discount',    className: 'bg-green-100 text-green-700 border-0' },
  gift:        { label: 'Gift',        className: 'bg-purple-100 text-purple-700 border-0' },
};

export default function AdminCouponsPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useCoupons();
  const coupons: CouponWithClaims[] = data?.data ?? [];
  const createCoupon = useCreateCoupon();
  const updateCoupon = useUpdateCoupon();
  const deleteCoupon = useDeleteCoupon();

  const [verifyId, setVerifyId] = useState('');
  const [verifyResult, setVerifyResult] = useState<null | { alreadyRedeemed: boolean; data: { claimId: string; name: string; phone: string; redeemedAt?: string; couponTitle: string; couponCode: string } }>(null);
  const [verifying, setVerifying] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [hasCamera, setHasCamera] = useState(false);

  useEffect(() => {
    navigator.mediaDevices?.enumerateDevices().then(devices => {
      setHasCamera(devices.some(d => d.kind === 'videoinput'));
    }).catch(() => {});
  }, []);

  const [open, setOpen]         = useState(false);
  const [editing, setEditing]   = useState<Coupon | null>(null);
  const [form, setForm]         = useState({ ...emptyForm });
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null); // expanded claims row
  const [giveOpen, setGiveOpen] = useState<CouponWithClaims | null>(null);
  const [giveName, setGiveName] = useState('');
  const [givePhone, setGivePhone] = useState('');

  const forceClaim = useMutation({
    mutationFn: ({ id, name, phone }: { id: string; name: string; phone: string }) =>
      api.post(`/coupons/${id}/force-claim`, { name, phone }).then(r => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['coupons'] }); },
  });

  function openCreate() { setEditing(null); setForm({ ...emptyForm, code: generateCode() }); setBannerFile(null); setOpen(true); }
  function openEdit(c: Coupon) {
    setEditing(c);
    setForm({ code: c.code, title: c.title, description: c.description, type: c.type,
      discountType: c.discountType, discountValue: String(c.discountValue),
      validUntil: c.validUntil ? c.validUntil.slice(0, 10) : '', maxUses: String(c.maxUses), active: c.active,
      bgColor: (c as Coupon & { bgColor?: string }).bgColor ?? '', bannerImage: (c as Coupon & { bannerImage?: string }).bannerImage ?? '' });
    setBannerFile(null);
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    const fields = { ...form, discountValue: Number(form.discountValue), maxUses: Number(form.maxUses) };
    Object.entries(fields).forEach(([k, v]) => { if (k !== 'bannerImage') fd.append(k, String(v)); });
    if (bannerFile) fd.append('bannerImage', bannerFile);
    try {
      if (editing) {
        fd.delete('code');
        await updateCoupon.mutateAsync({ id: editing._id, data: fd });
        toast.success('Coupon updated');
      } else {
        await createCoupon.mutateAsync(fd as unknown as Record<string, unknown>);
        toast.success('Coupon created');
      }
      setOpen(false);
    } catch { toast.error('Error saving coupon'); }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this coupon?')) return;
    try { await deleteCoupon.mutateAsync(id); toast.success('Deleted'); }
    catch { toast.error('Error deleting'); }
  }

  async function doVerify(id: string) {
    setVerifying(true);
    setVerifyResult(null);
    try {
      const res = await api.post('/coupons/verify', { claimId: id.trim().toUpperCase() });
      setVerifyResult(res.data);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Not found';
      toast.error(msg);
    } finally { setVerifying(false); }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    doVerify(verifyId);
  }

  function handleScan(scanned: string) {
    setScannerOpen(false);
    setVerifyId(scanned);
    doVerify(scanned);
  }

  async function handleForceGive(e: React.FormEvent) {
    e.preventDefault();
    if (!giveOpen) return;
    try {
      await forceClaim.mutateAsync({ id: giveOpen._id, name: giveName, phone: givePhone });
      toast.success(`Coupon given to ${giveName}`);
      setGiveOpen(null); setGiveName(''); setGivePhone('');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Failed';
      toast.error(msg);
    }
  }

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800">Coupons</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage coupon codes — click a row to see who claimed it</p>
        </div>
        <Button onClick={openCreate} size="sm" className="gap-1.5">
          <Plus className="w-4 h-4" /> New Coupon
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <h2 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
          <ScanLine className="w-4 h-4 text-blue-600" /> Verify Coupon at Store
        </h2>
        <form onSubmit={handleVerify} className="flex gap-2">
          <Input
            value={verifyId}
            onChange={e => setVerifyId(e.target.value.toUpperCase())}
            placeholder="Enter claim ID (e.g. CLM-A1B2C3D4)"
            className="font-mono flex-1"
          />
          {hasCamera && (
            <Button type="button" variant="outline" onClick={() => setScannerOpen(true)} title="Scan QR code with camera">
              <Camera className="w-4 h-4" />
            </Button>
          )}
          <Button type="submit" disabled={verifying || !verifyId.trim()}>
            {verifying ? 'Checking…' : 'Verify'}
          </Button>
        </form>
        <p className="text-xs text-slate-400 mt-2">
          {hasCamera ? 'Type the Claim ID manually — or click 📷 to scan the customer\'s QR code' : 'Type the Claim ID from the customer\'s screen (e.g. CLM-A1B2C3D4)'}
        </p>
        {verifyResult && (
          <div className={`mt-3 rounded-xl p-4 ${verifyResult.alreadyRedeemed ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
            {verifyResult.alreadyRedeemed ? (
              <div className="flex items-start gap-2">
                <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-700">Already Redeemed</p>
                  <p className="text-red-600 text-sm">This coupon was already used by <strong>{verifyResult.data.name}</strong> ({verifyResult.data.phone}) on {new Date(verifyResult.data.redeemedAt!).toLocaleString('en-IN')}.</p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-700">Valid — Marked as Redeemed ✓</p>
                  <p className="text-green-600 text-sm">Coupon: <strong>{verifyResult.data.couponTitle}</strong> ({verifyResult.data.couponCode})</p>
                  <p className="text-green-600 text-sm">Customer: <strong>{verifyResult.data.name}</strong> · {verifyResult.data.phone}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="py-10 text-center text-slate-400 text-sm">Loading...</div>
        ) : coupons.length === 0 ? (
          <div className="py-10 text-center text-slate-400 text-sm">No coupons yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b text-xs text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Code</th>
                <th className="px-4 py-3 text-left font-medium">Title</th>
                <th className="px-4 py-3 text-left font-medium">Type</th>
                <th className="px-4 py-3 text-left font-medium">Usage</th>
                <th className="px-4 py-3 text-left font-medium">Valid Until</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => {
                const tc = typeConfig[c.type] ?? typeConfig.discount;
                const isExpanded = expanded === c._id;
                const claims = c.claims ?? [];
                return (
                  <Fragment key={c._id}>
                    <tr className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <code className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-sm font-mono font-semibold">{c.code}</code>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-800">{c.title}</td>
                      <td className="px-4 py-3"><Badge className={tc.className}>{tc.label}</Badge></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-slate-600">{c.usedCount}/{c.maxUses}</span>
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(100, (c.usedCount / c.maxUses) * 100)}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {c.validUntil ? new Date(c.validUntil).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={c.active ? 'bg-green-100 text-green-700 border-0' : 'bg-slate-100 text-slate-500 border-0'}>
                          {c.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button size="sm" variant="ghost" title="Give to customer" onClick={() => { setGiveOpen(c); setGiveName(''); setGivePhone(''); }} className="h-8 w-8 p-0 text-blue-500 hover:text-blue-700 hover:bg-blue-50">
                            <UserPlus className="w-3.5 h-3.5" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setExpanded(isExpanded ? null : c._id)} className="h-8 w-8 p-0 text-slate-500" title="View claims">
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => openEdit(c)} className="h-8 w-8 p-0">
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(c._id)} className="h-8 w-8 p-0 text-red-400 hover:text-red-600 hover:bg-red-50">
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${c._id}-claims`} className="bg-slate-50/80 border-b border-slate-100">
                        <td colSpan={7} className="px-6 py-4">
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                            Claims ({claims.length})
                          </p>
                          {claims.length === 0 ? (
                            <p className="text-slate-400 text-sm">No one has claimed this coupon yet.</p>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                              {claims.map((cl, i) => (
                                <div key={i} className="bg-white rounded-lg border border-slate-200 px-3 py-2 text-sm">
                                  <div className="flex items-center justify-between mb-0.5">
                                    <p className="font-medium text-slate-800">{cl.name}</p>
                                    {cl.redeemed && <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium">Redeemed</span>}
                                  </div>
                                  <p className="text-slate-500">{cl.phone}</p>
                                  <p className="text-slate-400 text-xs mt-0.5 font-mono">{cl.claimId}</p>
                                  <p className="text-slate-400 text-xs mt-0.5">
                                    {new Date(cl.claimedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Create / Edit dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? 'Edit Coupon' : 'Create Coupon'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            {!editing && (
              <div className="space-y-1.5">
                <Label>Coupon Code *</Label>
                <div className="flex gap-2">
                  <Input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} required className="font-mono uppercase" />
                  <Button type="button" variant="outline" size="icon" onClick={() => setForm(f => ({ ...f, code: generateCode() }))}>
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
            <div className="space-y-1.5">
              <Label>Title *</Label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} />
            </div>
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v ?? f.type }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="eye_checkup">Eye Checkup</SelectItem>
                  <SelectItem value="discount">Discount</SelectItem>
                  <SelectItem value="gift">Gift</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Valid Until</Label>
                <Input type="date" value={form.validUntil} onChange={e => setForm(f => ({ ...f, validUntil: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Max Uses</Label>
                <Input type="number" min="1" value={form.maxUses} onChange={e => setForm(f => ({ ...f, maxUses: e.target.value }))} />
              </div>
            </div>
            {/* Banner image */}
            <div className="space-y-1.5">
              <Label>Banner Image <span className="text-slate-400 font-normal">(optional — shown on coupon card &amp; popup)</span></Label>
              <div className="flex items-center gap-3">
                <label className="flex-1 cursor-pointer">
                  <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-4 text-center transition-colors">
                    {bannerFile ? (
                      <p className="text-sm text-blue-600 font-medium truncate">{bannerFile.name}</p>
                    ) : form.bannerImage ? (
                      <img src={form.bannerImage} alt="banner" className="h-16 object-cover rounded-lg mx-auto" />
                    ) : (
                      <p className="text-slate-400 text-sm">Click to upload image</p>
                    )}
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={e => setBannerFile(e.target.files?.[0] ?? null)} />
                </label>
                {(bannerFile || form.bannerImage) && (
                  <Button type="button" variant="outline" size="icon" onClick={() => { setBannerFile(null); setForm(f => ({ ...f, bannerImage: '' })); }}>
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Background color */}
            <div className="space-y-1.5">
              <Label>Card Background Color <span className="text-slate-400 font-normal">(optional — used when no banner image)</span></Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={form.bgColor || '#f1f5f9'}
                  onChange={e => setForm(f => ({ ...f, bgColor: e.target.value }))}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200 p-0.5"
                />
                <div className="flex gap-1.5 flex-wrap">
                  {['#dbeafe','#d1fae5','#ede9fe','#fee2e2','#fef3c7','#f1f5f9'].map(c => (
                    <button key={c} type="button" onClick={() => setForm(f => ({ ...f, bgColor: c }))}
                      className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110"
                      style={{ background: c, borderColor: form.bgColor === c ? '#3b82f6' : 'transparent' }}
                    />
                  ))}
                </div>
                {form.bgColor && <Button type="button" variant="ghost" size="sm" className="text-slate-400 text-xs" onClick={() => setForm(f => ({ ...f, bgColor: '' }))}>Clear</Button>}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="couponActive" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} className="rounded" />
              <Label htmlFor="couponActive">Active</Label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createCoupon.isPending || updateCoupon.isPending}>
                {editing ? 'Update' : 'Create Coupon'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Force-give dialog */}
      <Dialog open={!!giveOpen} onOpenChange={() => setGiveOpen(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Give Coupon to Customer</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-500 -mt-1">
            This bypasses the one-per-phone limit. Use to manually give <span className="font-semibold text-slate-700">{giveOpen?.code}</span> to a specific customer.
          </p>
          <form onSubmit={handleForceGive} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label>Customer Name *</Label>
              <Input value={giveName} onChange={e => setGiveName(e.target.value)} placeholder="Full name" required />
            </div>
            <div className="space-y-1.5">
              <Label>Phone Number *</Label>
              <Input value={givePhone} onChange={e => setGivePhone(e.target.value)} placeholder="Phone number" type="tel" required />
            </div>
            <div className="flex gap-2 pt-1">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setGiveOpen(null)}>Cancel</Button>
              <Button type="submit" className="flex-1" disabled={forceClaim.isPending}>
                {forceClaim.isPending ? 'Giving…' : 'Give Coupon'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {scannerOpen && <QrScanner onScan={handleScan} onClose={() => setScannerOpen(false)} />}
    </div>
  );
}
