'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { X, Gift, Eye, Tag, Clock, Users, ArrowRight, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ClaimQrCode from '@/components/ui/ClaimQrCode';

interface PublicCoupon {
  _id: string; code: string; title: string; description: string;
  type: 'eye_checkup' | 'discount' | 'gift';
  discountType: string; discountValue: number;
  validUntil?: string; maxUses: number; usedCount: number; remaining: number;
  bannerImage?: string; bgColor?: string;
}

const typeConfig = {
  eye_checkup: { icon: Eye,  label: 'Free Eye Checkup', gradient: 'from-blue-500 to-cyan-500',   light: 'bg-blue-50 text-blue-700' },
  discount:    { icon: Tag,  label: 'Discount',          gradient: 'from-emerald-500 to-green-500', light: 'bg-emerald-50 text-emerald-700' },
  gift:        { icon: Gift, label: 'Gift Coupon',        gradient: 'from-purple-500 to-pink-500',  light: 'bg-purple-50 text-purple-700' },
};

function benefitText(c: PublicCoupon) {
  if (c.discountType === 'free_service') return 'FREE';
  if (c.discountType === 'percentage') return `${c.discountValue}% OFF`;
  return `₹${c.discountValue} OFF`;
}

export default function WelcomePopup() {
  const [visible, setVisible]   = useState(false);
  const [step, setStep]         = useState<'offers' | 'claim' | 'success'>('offers');
  const [selected, setSelected] = useState<PublicCoupon | null>(null);
  const [name, setName]         = useState('');
  const [phone, setPhone]       = useState('');
  const [claimed, setClaimed]   = useState<{ claimId: string; code: string; title: string } | null>(null);

  const { data } = useQuery({
    queryKey: ['coupons-public'],
    queryFn: () => api.get('/coupons/public').then(r => r.data),
  });

  const claimMutation = useMutation({
    mutationFn: ({ id, name, phone }: { id: string; name: string; phone: string }) =>
      api.post(`/coupons/${id}/claim`, { name, phone }).then(r => r.data),
  });

  const coupons: PublicCoupon[] = (data?.data ?? []).filter((c: PublicCoupon) => c.remaining > 0).slice(0, 3);

  // Wait for coupons to load, then show popup (avoids firing before API response)
  useEffect(() => {
    if (!coupons.length) return;
    const seen = sessionStorage.getItem('welcome_popup_seen');
    if (seen) return;
    const t = setTimeout(() => setVisible(true), 1000);
    return () => clearTimeout(t);
  }, [coupons.length]);

  function dismiss() {
    sessionStorage.setItem('welcome_popup_seen', '1');
    setVisible(false);
  }

  async function handleClaim(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    try {
      const res = await claimMutation.mutateAsync({ id: selected._id, name, phone });
      setClaimed(res.data);
      setStep('success');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Failed to claim';
      alert(msg);
    }
  }

  if (!coupons.length) return null;

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            onClick={dismiss}
          />

          {/* Sheet — slides up from bottom on mobile, centered on desktop */}
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[101] md:inset-0 md:flex md:items-center md:justify-center md:pointer-events-none"
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-white md:rounded-3xl md:shadow-2xl md:max-w-lg md:w-full md:pointer-events-auto rounded-t-3xl shadow-2xl max-h-[92vh] overflow-y-auto">

              {/* Header gradient */}
              <div className={`relative bg-gradient-to-r ${step === 'success' ? 'from-green-500 to-emerald-600' : 'from-blue-600 to-indigo-600'} p-6 rounded-t-3xl`}>
                <button onClick={dismiss} className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                  <span className="text-white/80 text-sm font-medium uppercase tracking-wider">
                    {step === 'success' ? 'Claimed!' : 'Exclusive Offers'}
                  </span>
                </div>
                <h2 className="text-white text-2xl font-bold leading-tight">
                  {step === 'success'
                    ? 'Your coupon is ready 🎉'
                    : step === 'claim'
                    ? `Claim: ${selected?.title}`
                    : 'Deals just for you'}
                </h2>
                {step === 'offers' && (
                  <p className="text-white/70 text-sm mt-1">Grab a free offer before visiting our store</p>
                )}
              </div>

              <div className="p-5">
                {/* Step: offers list */}
                {step === 'offers' && (
                  <div className="space-y-3">
                    {coupons.map((c, i) => {
                      const tc = typeConfig[c.type] ?? typeConfig.discount;
                      const Icon = tc.icon;
                      return (
                        <motion.button
                          key={c._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.08 }}
                          onClick={() => { setSelected(c); setStep('claim'); }}
                          className="w-full text-left rounded-2xl border border-slate-100 hover:border-blue-200 active:scale-[0.98] transition-all group overflow-hidden"
                          style={{ background: c.bgColor || undefined }}
                        >
                          {/* Banner image row */}
                          {c.bannerImage && (
                            <div className="relative h-28 w-full">
                              <img src={c.bannerImage} alt={c.title} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                              <span className="absolute bottom-2 left-3 text-white font-black text-lg drop-shadow">{benefitText(c)}</span>
                              <span className="absolute bottom-2 right-3 text-white/80 text-xs">{c.title}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-4 p-4">
                            {!c.bannerImage && (
                              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tc.gradient} flex items-center justify-center shrink-0 shadow-md`}>
                                <Icon className="w-6 h-6 text-white" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              {!c.bannerImage && <p className="font-bold text-slate-800 text-base leading-tight">{benefitText(c)}</p>}
                              <p className={`text-slate-600 text-sm truncate ${c.bannerImage ? 'font-semibold' : ''}`}>{c.title}</p>
                              <div className="flex items-center gap-3 mt-1">
                                {c.validUntil && (
                                  <span className="flex items-center gap-1 text-xs text-slate-400">
                                    <Clock className="w-3 h-3" />
                                    Till {new Date(c.validUntil).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                  </span>
                                )}
                                <span className="flex items-center gap-1 text-xs text-slate-400">
                                  <Users className="w-3 h-3" /> {c.remaining} left
                                </span>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all shrink-0" />
                          </div>
                        </motion.button>
                      );
                    })}

                    <button onClick={dismiss} className="w-full text-slate-400 text-sm py-2 hover:text-slate-600 transition-colors">
                      No thanks, skip
                    </button>
                  </div>
                )}

                {/* Step: claim form */}
                {step === 'claim' && selected && (
                  <motion.form
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    onSubmit={handleClaim}
                    className="space-y-4"
                  >
                    <p className="text-slate-500 text-sm">Enter your details — one claim per phone number.</p>
                    <div className="space-y-1.5">
                      <Label>Your Name *</Label>
                      <Input value={name} onChange={e => setName(e.target.value)} placeholder="Full name" required className="h-12 text-base" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Phone Number *</Label>
                      <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="10-digit mobile" type="tel" required className="h-12 text-base" />
                    </div>
                    <button
                      type="submit"
                      disabled={claimMutation.isPending}
                      className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-base active:scale-[0.98] transition-transform disabled:opacity-60"
                    >
                      {claimMutation.isPending ? 'Claiming…' : 'Claim Now →'}
                    </button>
                    <button type="button" onClick={() => setStep('offers')} className="w-full text-slate-400 text-sm py-1 hover:text-slate-600">
                      ← Back to offers
                    </button>
                  </motion.form>
                )}

                {/* Step: success */}
                {step === 'success' && claimed && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                  >
                    <p className="text-slate-500 text-sm mb-4">Show this at our store to redeem</p>
                    <div className="bg-slate-50 rounded-2xl p-4 mb-4">
                      <ClaimQrCode value={claimed.claimId} size={160} />
                      <code className="block text-2xl font-black text-slate-800 tracking-widest mt-3">{claimed.claimId}</code>
                    </div>
                    <p className="text-xs text-slate-400 mb-4">Coupon: {claimed.code} · {claimed.title}</p>
                    <button
                      onClick={dismiss}
                      className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-base active:scale-[0.98] transition-transform"
                    >
                      Done, continue browsing
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
