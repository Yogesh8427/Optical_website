'use client';
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { Gift, CheckCircle, Tag, Eye, Clock, Users, X, Ticket } from 'lucide-react';

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}
import { toast } from 'sonner';
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

const typeIcon = { eye_checkup: Eye, discount: Tag, gift: Gift };
const typeLabel = { eye_checkup: 'Free Eye Checkup', discount: 'Discount', gift: 'Gift Coupon' };

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

  /* ── Claimed success screen ── */
  if (claimed) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center">
            <div
              className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-5"
              style={{ background: 'linear-gradient(135deg, var(--theme-primary,#2563eb) 0%, color-mix(in srgb, var(--theme-primary,#2563eb) 60%,#000) 100%)' }}
            >
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-1">Coupon Claimed!</h2>
            <p className="text-slate-500 text-sm mb-6">Show this at our store to redeem your benefit</p>

            <div className="bg-slate-50 rounded-2xl p-5 mb-4">
              <p className="text-xs text-slate-400 mb-3">Scan this QR at the store — or show the code</p>
              <ClaimQrCode value={claimed.claimId} size={160} />
              <code className="block text-xl font-black text-slate-800 tracking-widest mt-3">{claimed.claimId}</code>
            </div>
            <p className="text-xs text-slate-400 mb-5">Coupon: {claimed.code} · {claimed.title}</p>

            <div className="flex flex-col gap-3">
              <a
                href={`https://wa.me/?text=I got a coupon: *${claimed.code}* - ${claimed.title}. Visit our store to claim yours!`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-3 rounded-xl transition-colors text-sm"
              >
                <WhatsAppIcon className="w-4 h-4" />
                Share on WhatsApp
              </a>
              <button onClick={() => setClaimed(null)} className="text-slate-400 text-sm hover:text-slate-600 transition-colors">
                Claim another coupon
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Main page ── */
  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero header — primary gradient */}
      <div
        className="relative overflow-hidden py-16 px-4 text-white text-center"
        style={{ background: 'linear-gradient(135deg, var(--theme-primary,#2563eb) 0%, color-mix(in srgb, var(--theme-primary,#2563eb) 60%,#000) 100%)' }}
      >
        {/* Floating orbs */}
        <div className="pointer-events-none select-none absolute inset-0">
          <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full bg-white/10 blur-3xl animate-breathe" />
          <div className="absolute -bottom-12 -right-12 w-80 h-80 rounded-full bg-white/8 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>
        {/* Watermark */}
        <span className="pointer-events-none select-none absolute inset-0 flex items-center justify-center text-[10rem] font-black text-white/5 leading-none">
          OFFERS
        </span>
        <div className="relative">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white/15 rounded-2xl mb-4">
            <Ticket className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">Exclusive Offers &amp; Coupons</h1>
          <p className="text-white/70 mt-2 text-base">Pick a coupon and claim it with your name and phone number</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-52 bg-white rounded-2xl animate-pulse border border-slate-100 shadow-sm" />
            ))}
          </div>
        )}

        {/* Empty */}
        {!isLoading && coupons.length === 0 && (
          <div className="text-center py-24 text-slate-400">
            <Gift className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No active coupons right now. Check back soon!</p>
          </div>
        )}

        {/* Coupon cards */}
        {!isLoading && coupons.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {coupons.map((c) => {
              const Icon = typeIcon[c.type] ?? Tag;
              const label = typeLabel[c.type] ?? 'Coupon';
              const isFull = c.remaining <= 0;
              return (
                <div
                  key={c._id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
                >
                  {/* Banner image */}
                  {c.bannerImage && (
                    <div className="relative h-40 w-full shrink-0">
                      <img src={c.bannerImage} alt={c.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                        <h3 className="font-black text-white text-lg leading-tight drop-shadow">{c.title}</h3>
                        <span
                          className="text-xl font-black px-3 py-1 rounded-xl shrink-0 ml-2"
                          style={{ background: 'var(--theme-primary,#2563eb)', color: '#fff' }}
                        >{benefitText(c)}</span>
                      </div>
                    </div>
                  )}

                  <div className="p-5 flex flex-col gap-4 flex-1">
                    {/* Top row — icon + title + benefit */}
                    {!c.bannerImage && (
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                            style={{ background: 'linear-gradient(135deg, var(--theme-primary,#2563eb) 0%, color-mix(in srgb, var(--theme-primary,#2563eb) 60%,#000) 100%)' }}
                          >
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{label}</p>
                            <h3 className="font-black text-slate-800 text-base leading-tight">{c.title}</h3>
                          </div>
                        </div>
                        <span
                          className="text-lg font-black px-3 py-1 rounded-xl shrink-0 text-white"
                          style={{ background: 'linear-gradient(135deg, var(--theme-primary,#2563eb) 0%, color-mix(in srgb, var(--theme-primary,#2563eb) 60%,#000) 100%)' }}
                        >{benefitText(c)}</span>
                      </div>
                    )}

                    {/* Coupon code chip */}
                    <div className="flex items-center gap-2">
                      <span className="border-2 border-dashed rounded-lg px-3 py-1 text-sm font-black tracking-widest text-slate-700 border-slate-200 bg-slate-50">
                        {c.code}
                      </span>
                    </div>

                    {c.description && (
                      <p className="text-slate-500 text-sm leading-relaxed">{c.description}</p>
                    )}

                    {/* Meta row */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
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

                    {/* CTA */}
                    <button
                      disabled={isFull}
                      onClick={() => setSelected(c)}
                      className={`mt-auto w-full text-white font-bold py-3 rounded-xl text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed ${!isFull ? 'btn-glow' : ''}`}
                      style={isFull ? { background: '#cbd5e1' } : { background: 'linear-gradient(135deg, var(--theme-primary,#2563eb) 0%, color-mix(in srgb, var(--theme-primary,#2563eb) 60%,#000) 100%)' }}
                    >
                      {isFull ? 'Fully Claimed' : 'Claim This Coupon'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Claim modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm" onClick={e => e.stopPropagation()}>

            {/* Modal header — primary gradient */}
            <div
              className="rounded-t-2xl p-5 flex items-start justify-between"
              style={{ background: 'linear-gradient(135deg, var(--theme-primary,#2563eb) 0%, color-mix(in srgb, var(--theme-primary,#2563eb) 60%,#000) 100%)' }}
            >
              <div>
                <h2 className="font-black text-white text-lg leading-tight">{selected.title}</h2>
                <p className="text-white/70 text-xs mt-0.5">One claim per phone number per coupon</p>
              </div>
              <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white hover:bg-white/30 shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleClaim} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Your Name *</label>
                <input
                  value={name} onChange={e => setName(e.target.value)} required
                  placeholder="Full name"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Phone Number *</label>
                <input
                  value={phone} onChange={e => setPhone(e.target.value)} required
                  placeholder="10-digit mobile number" type="tel"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2"
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="flex-1 border border-slate-200 text-slate-600 font-semibold py-2.5 rounded-xl text-sm hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={claimMutation.isPending}
                  className="flex-1 text-white font-bold py-2.5 rounded-xl text-sm transition-all disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, var(--theme-primary,#2563eb) 0%, color-mix(in srgb, var(--theme-primary,#2563eb) 60%,#000) 100%)' }}
                >
                  {claimMutation.isPending ? 'Claiming…' : 'Claim Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
