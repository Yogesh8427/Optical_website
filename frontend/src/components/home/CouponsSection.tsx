'use client';
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Gift, Eye, Tag, CheckCircle, Clock, Users, ArrowRight } from 'lucide-react';

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}
import ClaimQrCode from '@/components/ui/ClaimQrCode';

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
  bannerImage?: string;
  bgColor?: string;
}

const typeConfig = {
  eye_checkup: { icon: Eye,  label: 'Free Eye Checkup', color: 'bg-blue-100 text-blue-700',   iconBg: 'bg-blue-100',   iconColor: 'text-blue-600'   },
  discount:    { icon: Tag,  label: 'Discount',          color: 'bg-green-100 text-green-700',  iconBg: 'bg-green-100',  iconColor: 'text-green-600'  },
  gift:        { icon: Gift, label: 'Gift Coupon',        color: 'bg-purple-100 text-purple-700', iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
};

function benefitText(c: PublicCoupon) {
  if (c.discountType === 'free_service') return 'FREE';
  if (c.discountType === 'percentage') return `${c.discountValue}% OFF`;
  return `₹${c.discountValue} OFF`;
}

export default function CouponsSection() {
  const [selected, setSelected]   = useState<PublicCoupon | null>(null);
  const [name, setName]           = useState('');
  const [phone, setPhone]         = useState('');
  const [claimed, setClaimed]     = useState<{ claimId: string; code: string; title: string } | null>(null);

  const { data } = useQuery({
    queryKey: ['coupons-public'],
    queryFn: () => api.get('/coupons/public').then(r => r.data),
  });

  const claimMutation = useMutation({
    mutationFn: ({ id, name, phone }: { id: string; name: string; phone: string }) =>
      api.post(`/coupons/${id}/claim`, { name, phone }).then(r => r.data),
  });

  const coupons: PublicCoupon[] = (data?.data ?? []).slice(0, 4); // show max 4 on homepage
  if (!coupons.length) return null;

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
      // show inline error instead of toast so user doesn't lose context
      alert(msg);
    }
  }

  return (
    <section className="py-14 px-4 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--theme-primary, #2563eb)' }}>Exclusive Deals</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Coupons & Free Offers</h2>
            <p className="text-slate-500 mt-1 text-sm">Claim any offer below — just enter your name and phone number</p>
          </div>
          <a href="/coupons" className="hidden md:flex items-center gap-1 text-sm font-medium hover:underline" style={{ color: 'var(--theme-primary, #2563eb)' }}>
            View all <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Coupon cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {coupons.map((c) => {
            const tc = typeConfig[c.type] ?? typeConfig.discount;
            const Icon = tc.icon;
            const isFull = c.remaining <= 0;
            return (
              <motion.div
                key={c._id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.06 * coupons.indexOf(c), duration: 0.45, ease: [0.22,1,0.36,1] }}
                whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(0,0,0,0.12)' }}
                className="rounded-2xl overflow-hidden shadow-sm cursor-pointer flex flex-col border border-slate-200"
                style={{ background: c.bgColor || '#ffffff' }}
              >
                {/* Banner image */}
                {c.bannerImage && (
                  <div className="relative h-32 w-full shrink-0">
                    <img src={c.bannerImage} alt={c.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <Badge className={`absolute top-2 right-2 ${tc.color} border-0 text-xs`}>{tc.label}</Badge>
                  </div>
                )}

                <div className="p-5 flex flex-col gap-3 flex-1">
                  {/* Icon + badge (only when no banner) */}
                  {!c.bannerImage && (
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-xl ${tc.iconBg} flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${tc.iconColor}`} />
                      </div>
                      <Badge className={`${tc.color} border-0 text-xs`}>{tc.label}</Badge>
                    </div>
                  )}

                  {/* Benefit */}
                  <div>
                    <p className={`text-2xl font-black ${c.bannerImage ? 'text-slate-800' : 'text-slate-800'}`}>{benefitText(c)}</p>
                    <p className="font-semibold text-slate-700 text-sm mt-0.5">{c.title}</p>
                    {c.description && <p className="text-slate-400 text-xs mt-1 line-clamp-2">{c.description}</p>}
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-auto">
                    {c.validUntil && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Till {new Date(c.validUntil).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {isFull ? 'Full' : `${c.remaining} left`}
                    </span>
                  </div>

                  {/* CTA */}
                  <button
                    disabled={isFull}
                    onClick={() => { setSelected(c); setClaimed(null); }}
                    className={`w-full py-2 rounded-xl text-sm font-semibold transition-colors ${
                      isFull ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'text-white btn-glow'
                    }`}
                    style={isFull ? {} : { background: 'var(--theme-primary, #2563eb)' }}
                  >
                    {isFull ? 'Fully Claimed' : 'Claim Now'}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* View all on mobile */}
        <div className="mt-6 text-center md:hidden">
          <a href="/coupons" className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline" style={{ color: 'var(--theme-primary, #2563eb)' }}>
            View all coupons <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Claim modal */}
      {selected && !claimed && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4 pb-16 sm:pb-0" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl ${typeConfig[selected.type]?.iconBg ?? 'bg-blue-100'} flex items-center justify-center shrink-0`}>
                {(() => { const Icon = typeConfig[selected.type]?.icon ?? Gift; return <Icon className={`w-5 h-5 ${typeConfig[selected.type]?.iconColor ?? 'text-blue-600'}`} />; })()}
              </div>
              <div>
                <h2 className="font-bold text-slate-800">{selected.title}</h2>
                <p className="text-slate-500 text-xs">One claim per phone number</p>
              </div>
            </div>
            <form onSubmit={handleClaim} className="space-y-3">
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

      {/* Success modal */}
      {claimed && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4 pb-16 sm:pb-0" onClick={() => setClaimed(null)}>
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm text-center" onClick={e => e.stopPropagation()}>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-1">Coupon Claimed!</h2>
            <p className="text-slate-500 text-sm mb-5">Show this code at our store</p>
            <div className="bg-slate-50 rounded-xl p-4 mb-2">
              <p className="text-xs text-slate-400 mb-2">Scan this QR at the store — or show the code</p>
              <ClaimQrCode value={claimed.claimId} size={140} />
              <code className="block text-xl font-black text-slate-800 tracking-widest mt-2">{claimed.claimId}</code>
            </div>
            <p className="text-xs text-slate-400 mb-4">Coupon: {claimed.code} · {claimed.title}</p>
            <div className="flex flex-col gap-2">
              <a
                href={`https://wa.me/?text=I got a coupon: *${claimed.code}* - ${claimed.title}. Visit our store to claim yours!`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
              >
                <WhatsAppIcon className="w-4 h-4" />
                Share on WhatsApp
              </a>
              <button onClick={() => setClaimed(null)} className="text-slate-400 text-sm hover:text-slate-600">Close</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
