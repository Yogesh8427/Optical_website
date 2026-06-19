'use client';
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Gift, CheckCircle, Tag, Eye, Clock, Users } from 'lucide-react';
import { toast } from 'sonner';

interface PublicCoupon {
  _id: string;
  code: string;
  title: string;
  description: string;
  type: 'eye_checkup' | 'discount' | 'gift';
  discountType: string;
  discountValue: number;
  validUntil?: string;
  maxUses: number;
  usedCount: number;
  remaining: number;
}

const typeConfig = {
  eye_checkup: { icon: Eye,  label: 'Free Eye Checkup', color: 'bg-blue-100 text-blue-700',   bg: 'from-blue-50 to-blue-100',   border: 'border-blue-200',   btn: 'bg-blue-600 hover:bg-blue-700' },
  discount:    { icon: Tag,  label: 'Discount',          color: 'bg-green-100 text-green-700',  bg: 'from-green-50 to-green-100', border: 'border-green-200', btn: 'bg-green-600 hover:bg-green-700' },
  gift:        { icon: Gift, label: 'Gift Coupon',        color: 'bg-purple-100 text-purple-700', bg: 'from-purple-50 to-purple-100', border: 'border-purple-200', btn: 'bg-purple-600 hover:bg-purple-700' },
};

function benefitText(c: PublicCoupon) {
  if (c.discountType === 'free_service') return 'FREE';
  if (c.discountType === 'percentage') return `${c.discountValue}% OFF`;
  return `₹${c.discountValue} OFF`;
}

export default function CouponsPage() {
  const [selected, setSelected] = useState<PublicCoupon | null>(null);
  const [name, setName]   = useState('');
  const [phone, setPhone] = useState('');
  const [claimed, setClaimed] = useState<{ claimId: string; code: string; title: string; description: string } | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['coupons-public'],
    queryFn: () => api.get('/coupons/public').then(r => r.data),
  });

  const claimMutation = useMutation({
    mutationFn: ({ id, name, phone }: { id: string; name: string; phone: string }) =>
      api.post(`/coupons/${id}/claim`, { name, phone }).then(r => r.data),
  });

  const coupons: PublicCoupon[] = data?.data ?? [];

  async function handleClaim(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    try {
      const res = await claimMutation.mutateAsync({ id: selected._id, name, phone });
      setClaimed(res.data);
      setSelected(null);
      setName(''); setPhone('');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Failed to claim';
      toast.error(msg);
    }
  }

  if (claimed) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-1">Coupon Claimed!</h2>
            <p className="text-slate-500 mb-6">Show this at our store to redeem your benefit</p>
            <div className="bg-slate-50 rounded-xl p-4 mb-2">
              <p className="text-xs text-slate-400 mb-1">Your unique claim ID — show this at the store</p>
              <code className="text-2xl font-black text-slate-800 tracking-widest">{claimed.claimId}</code>
            </div>
            <p className="text-xs text-slate-400 mb-4">Coupon: {claimed.code} · {claimed.title}</p>
            <div className="flex flex-col gap-3">
              <a
                href={`https://wa.me/?text=I got a coupon: *${claimed.code}* - ${claimed.title}. Visit our store to claim yours!`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
              >
                Share on WhatsApp
              </a>
              <button onClick={() => setClaimed(null)} className="text-slate-400 text-sm hover:text-slate-600">
                Claim another coupon
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
            <Tag className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800">Exclusive Offers & Coupons</h1>
          <p className="text-slate-500 mt-2">Pick a coupon below and claim it with your name and phone number</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="h-48 bg-white rounded-2xl animate-pulse border border-slate-100" />)}
          </div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <Gift className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No active coupons right now. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coupons.map((c) => {
              const tc = typeConfig[c.type] ?? typeConfig.discount;
              const Icon = tc.icon;
              const isFull = c.remaining <= 0;
              return (
                <div key={c._id} className={`bg-gradient-to-br ${tc.bg} border ${tc.border} rounded-2xl p-6 flex flex-col gap-4`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-white rounded-xl shadow-sm">
                        <Icon className="w-5 h-5 text-slate-700" />
                      </div>
                      <div>
                        <Badge className={`${tc.color} border-0 text-xs mb-1`}>{tc.label}</Badge>
                        <h3 className="font-bold text-slate-800 text-base leading-tight">{c.title}</h3>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-2xl font-black text-slate-800">{benefitText(c)}</span>
                    </div>
                  </div>

                  {c.description && <p className="text-slate-600 text-sm">{c.description}</p>}

                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    {c.validUntil && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Valid till {new Date(c.validUntil).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {isFull ? 'Fully claimed' : `${c.remaining} left`}
                    </span>
                  </div>

                  <button
                    disabled={isFull}
                    onClick={() => setSelected(c)}
                    className={`w-full text-white font-semibold py-2.5 rounded-xl text-sm transition-colors ${isFull ? 'bg-slate-300 cursor-not-allowed' : `${tc.btn} cursor-pointer`}`}
                  >
                    {isFull ? 'Fully Claimed' : 'Claim This Coupon'}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Claim modal */}
        {selected && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4" onClick={() => setSelected(null)}>
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
              <h2 className="font-bold text-slate-800 text-lg mb-1">Claim: {selected.title}</h2>
              <p className="text-slate-500 text-sm mb-5">Enter your details — one claim per phone number per coupon.</p>
              <form onSubmit={handleClaim} className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Your Name *</Label>
                  <Input value={name} onChange={e => setName(e.target.value)} placeholder="Full name" required />
                </div>
                <div className="space-y-1.5">
                  <Label>Phone Number *</Label>
                  <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="10-digit mobile number" type="tel" required />
                </div>
                <div className="flex gap-2 pt-1">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setSelected(null)}>Cancel</Button>
                  <Button type="submit" className="flex-1" disabled={claimMutation.isPending}>
                    {claimMutation.isPending ? 'Claiming…' : 'Claim Now'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
