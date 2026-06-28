'use client';
import { use, useState, useEffect, useCallback, useRef } from 'react';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import Image from 'next/image';
import { useFrame } from '@/hooks/useFrames';
import { useSettings } from '@/hooks/useSettings';
import { useOffers } from '@/hooks/useOffers';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import ProductCard from '@/components/products/ProductCard';
import LensWizard from '@/components/lens-wizard/LensWizard';
import { Check, X, ZoomIn, Share2, Copy, CheckCheck } from 'lucide-react';

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}
import ImageZoom from '@/components/ui/ImageZoom';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Frame } from '@/types';

function ShareButton({ name, slug, image }: { name: string; slug: string; image?: string }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined' ? `${window.location.origin}/product/${slug}` : `/product/${slug}`;

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title: name, text: `Check out ${name}`, url });
      } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <button
      onClick={handleShare}
      title="Share this product"
      className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-slate-600 text-sm font-semibold shrink-0"
    >
      {copied ? <CheckCheck className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
      {copied ? 'Copied!' : 'Share'}
    </button>
  );
}

const COLOR_MAP: Record<string, string> = {
  gold: 'bg-yellow-400', silver: 'bg-gray-300', black: 'bg-gray-900',
  brown: 'bg-amber-800', blue: 'bg-blue-500', red: 'bg-red-500',
  green: 'bg-green-500', white: 'bg-white border border-gray-300',
  copper: 'bg-orange-400', gunmetal: 'bg-gray-600', pink: 'bg-pink-400',
  purple: 'bg-purple-500', tortoise: 'bg-amber-700', crystal: 'bg-sky-200',
  navy: 'bg-blue-900',
};

function getColorClass(color: string) {
  return COLOR_MAP[color.toLowerCase()] ?? 'bg-gray-400';
}

// ── WhatsApp inquiry form ────────────────────────────────────────────────────
function QuickInquiry({
  productName, productSlug, productImage, selectedColor, selectedSize, onClose, whatsappNumber,
}: {
  productName: string; productSlug: string; productImage: string;
  selectedColor: string; selectedSize: string;
  onClose: () => void; whatsappNumber: string;
}) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [checkup, setCheckup] = useState(false);
  const [sending, setSending] = useState(false);

  function buildUrl() {
    const productUrl = productSlug ? `${window.location.origin}/product/${productSlug}` : '';
    const divider = '─────────────────';
    const lines = [
      '*New Frame Inquiry*',
      divider,
      `*Frame:* ${productName}`,
      selectedColor ? `*Colour:* ${selectedColor}` : null,
      selectedSize  ? `*Size:* ${selectedSize}`    : null,
      productUrl    ? `*Product Page:* ${productUrl}`  : null,
      productImage  ? `*Product Image:* ${productImage}` : null,
      divider,
      `*Name:* ${name}`,
      `*Phone:* ${phone}`,
      checkup ? '*Needs eye check-up at store*' : null,
      note    ? `*Note:* ${note}`                : null,
      divider,
      'Please share price and availability.',
    ].filter((l) => l !== null).join('\n');

    const num = whatsappNumber.replace(/\D/g, '');
    return `https://wa.me/${num}?text=${encodeURIComponent(lines)}`;
  }

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    window.open(buildUrl(), '_blank');
    setTimeout(() => { setSending(false); onClose(); }, 800);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm pb-16 sm:pb-0">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md shadow-2xl overflow-y-auto" style={{ maxHeight: 'calc(85dvh - env(safe-area-inset-bottom, 0px))' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">
          <div>
            <h2 className="font-bold text-slate-800">Inquire on WhatsApp</h2>
            <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[260px]">{productName}{selectedColor ? ` · ${selectedColor}` : ''}{selectedSize ? ` · ${selectedSize}` : ''}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSend} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Your Name *</label>
            <input
              type="text" value={name} onChange={(e) => setName(e.target.value)} required
              placeholder="e.g. Rahul Sharma"
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': 'var(--theme-primary, #2563eb)' } as React.CSSProperties}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number *</label>
            <input
              type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required
              placeholder="e.g. 9876543210"
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2"
            />
          </div>

          {/* Store check-up option */}
          <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
            <input
              type="checkbox"
              checked={checkup}
              onChange={(e) => setCheckup(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-[var(--theme-primary,#2563eb)] shrink-0"
            />
            <div>
              <p className="text-sm font-semibold text-slate-700">I need an eye check-up at the store</p>
              <p className="text-xs text-slate-400 mt-0.5">We will schedule a visit for your eye examination</p>
            </div>
          </label>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Additional Note <span className="text-slate-400 font-normal">(optional)</span></label>
            <textarea
              value={note} onChange={(e) => setNote(e.target.value)}
              placeholder="Any specific questions?"
              rows={2}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 resize-none"
            />
          </div>

          <button
            type="submit" disabled={sending}
            className="w-full disabled:opacity-60 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg"
            style={{ background: 'var(--theme-primary, #2563eb)' }}
          >
            <WhatsAppIcon className="w-5 h-5" />
            {sending ? 'Opening WhatsApp…' : 'Send Inquiry on WhatsApp'}
          </button>
          <p className="text-center text-xs text-slate-400">You will be redirected to WhatsApp to send your inquiry</p>
        </form>
      </div>
    </div>
  );
}

// ── Main product detail page ───────────────────────────────────────────────
export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data, isLoading } = useFrame(slug);
  const { localize } = useLanguage();
  const { data: settingsData } = useSettings();
  const { data: offersData } = useOffers(true);
  const [activeImg, setActiveImg] = useState(0);
  const [activeColor, setActiveColor] = useState(0);
  const [activeSize, setActiveSize] = useState(0);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
  useBodyScrollLock(quickOpen || zoomOpen);
  const [paused, setPaused] = useState(false);
  const [prevImg, setPrevImg] = useState<number | null>(null);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef<number | null>(null);

  const whatsappNumber = settingsData?.data?.whatsappNumber
    ?? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
    ?? '';

  // Compute activeColorImages before early returns so hooks stay unconditional
  const _frameImages: string[] = data?.data?.images ?? [];
  const _colorImages: string[][] = _frameImages.map((entry) =>
    entry ? entry.split(',').map((u) => u.trim()).filter(Boolean) : []
  );
  const _allImages = _colorImages.flat();
  const activeColorImages: string[] = _colorImages[activeColor]?.length
    ? _colorImages[activeColor]
    : _allImages;

  const goToImg = useCallback((next: number, dir: 'left' | 'right', _total: number) => {
    if (animating) return;
    setDirection(dir);
    setPrevImg(activeImg);
    setAnimating(true);
    setActiveImg(next);
    setTimeout(() => { setPrevImg(null); setAnimating(false); }, 500);
  }, [animating, activeImg]);

  const advanceImg = useCallback(() => {
    const total = activeColorImages.length || 1;
    setActiveImg((i) => {
      const next = (i + 1) % total;
      setDirection('right');
      setPrevImg(i);
      setAnimating(true);
      setTimeout(() => { setPrevImg(null); setAnimating(false); }, 500);
      return next;
    });
  }, [activeColorImages.length]);

  useEffect(() => {
    if (activeColorImages.length <= 1 || paused || zoomOpen) return;
    timerRef.current = setInterval(advanceImg, 4000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [activeColorImages.length, paused, zoomOpen, advanceImg, activeColor]);

  // Early returns AFTER all hooks
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-96 rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </div>
    );
  }

  const frame: Frame = data?.data;
  const related: Frame[] = data?.related ?? [];
  if (!frame) return <div className="text-center py-20 text-gray-500">Product not found.</div>;

  type OfferEntry = { productIds?: unknown[]; brandIds?: unknown[]; categoryIds?: unknown[]; discountType: string; discountValue: number; title: string; occasionName?: string; couponCode?: string };
  const sid = (x: unknown): string => {
    if (!x) return '';
    if (typeof x === 'string') return x;
    const o = x as Record<string, unknown>;
    return String(o._id ?? o.id ?? '');
  };
  const activeOffers: OfferEntry[] = (offersData?.data ?? []).filter((o: OfferEntry) => {
    const byProduct  = o.productIds?.some((p) => sid(p) === frame._id);
    const byBrand    = o.brandIds?.some((b) => sid(b) === sid(frame.brandId));
    const byCategory = o.categoryIds?.some((c) => sid(c) === sid(frame.categoryId));
    const isGlobal   = !o.productIds?.length && !o.brandIds?.length && !o.categoryIds?.length;
    return byProduct || byBrand || byCategory || isGlobal;
  });

  const colors = frame.colors ?? [];
  const colorImages = _colorImages;
  const displayImage = activeColorImages[activeImg] ?? null;

  function handleColorClick(i: number) {
    setActiveColor(i);
    setActiveImg(0);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 pb-32 md:pb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-8 md:mb-16">

        {/* Images */}
        <div className="space-y-3">
          {/* Slider animations */}
          <style>{`
            @keyframes prodSlideInRight  { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
            @keyframes prodSlideOutLeft  { from { transform: translateX(0); opacity: 1; } to { transform: translateX(-100%); opacity: 0; } }
            @keyframes prodSlideInLeft   { from { transform: translateX(-100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
            @keyframes prodSlideOutRight { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
            @keyframes imgProgress       { from { width: 0% } to { width: 100% } }
            .prod-enter-right { animation: prodSlideInRight  0.5s cubic-bezier(.4,0,.2,1) forwards; }
            .prod-exit-left   { animation: prodSlideOutLeft  0.5s cubic-bezier(.4,0,.2,1) forwards; }
            .prod-enter-left  { animation: prodSlideInLeft   0.5s cubic-bezier(.4,0,.2,1) forwards; }
            .prod-exit-right  { animation: prodSlideOutRight 0.5s cubic-bezier(.4,0,.2,1) forwards; }
          `}</style>

          {/* Main image carousel */}
          <div
            className="relative h-64 md:h-[420px] rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 cursor-zoom-in select-none"
            onClick={() => displayImage && setZoomOpen(true)}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
            onTouchEnd={(e) => {
              if (touchStartX.current === null) return;
              const delta = e.changedTouches[0].clientX - touchStartX.current;
              touchStartX.current = null;
              if (Math.abs(delta) < 40) return;
              const total = activeColorImages.length;
              if (total <= 1) return;
              if (delta < 0) goToImg((activeImg + 1) % total, 'right', total);
              else goToImg((activeImg - 1 + total) % total, 'left', total);
            }}
          >
            {/* Exiting slide */}
            {prevImg !== null && activeColorImages[prevImg] && (
              <div className={`absolute inset-0 z-10 ${direction === 'right' ? 'prod-exit-left' : 'prod-exit-right'}`}>
                <Image src={activeColorImages[prevImg]} alt={frame.name} fill className="object-cover" />
              </div>
            )}

            {/* Current / entering slide */}
            <div className={`absolute inset-0 z-20 ${animating ? (direction === 'right' ? 'prod-enter-right' : 'prod-enter-left') : ''}`}>
              {displayImage ? (
                <Image src={displayImage} alt={frame.name} fill className="object-cover" priority />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">No image</div>
              )}
            </div>

            {/* Counter badge */}
            {activeColorImages.length > 1 && (
              <div className="absolute top-3 left-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full font-medium z-30">
                {activeImg + 1} / {activeColorImages.length}
              </div>
            )}

            {/* Zoom hint */}
            {displayImage && (
              <div className="absolute bottom-8 right-3 bg-black/40 text-white text-xs px-2 py-1 rounded-lg flex items-center gap-1 z-30">
                <ZoomIn className="w-3 h-3" /> Zoom
              </div>
            )}

            {/* Arrows */}
            {activeColorImages.length > 1 && (
              <>
                <button
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors z-30"
                  onClick={(e) => { e.stopPropagation(); const total = activeColorImages.length; const next = (activeImg - 1 + total) % total; goToImg(next, 'left', total); }}
                >
                  ‹
                </button>
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors z-30"
                  onClick={(e) => { e.stopPropagation(); const total = activeColorImages.length; const next = (activeImg + 1) % total; goToImg(next, 'right', total); }}
                >
                  ›
                </button>
              </>
            )}

            {/* Auto-advance progress bar */}
            {activeColorImages.length > 1 && !paused && (
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/20 z-30">
                <div
                  key={`${activeColor}-${activeImg}`}
                  className="h-full bg-white"
                  style={{ animation: 'imgProgress 4s linear forwards' }}
                />
              </div>
            )}
          </div>

          {/* Thumbnail strip — only for active color images */}
          {activeColorImages.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {activeColorImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => { goToImg(i, i > activeImg ? 'right' : 'left', activeColorImages.length); if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; } }}
                  className="relative w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden border-2 transition-all bg-slate-50 shrink-0"
                  style={i === activeImg ? { borderColor: 'var(--theme-primary)' } : { borderColor: 'transparent' }}
                >
                  <Image src={img} alt={`View ${i + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}

          {zoomOpen && activeColorImages.length > 0 && (
            <ImageZoom
              images={activeColorImages}
              activeIndex={activeImg}
              onClose={() => setZoomOpen(false)}
              onPrev={() => setActiveImg((i) => (i - 1 + activeColorImages.length) % activeColorImages.length)}
              onNext={() => setActiveImg((i) => (i + 1) % activeColorImages.length)}
            />
          )}
        </div>

        {/* Details */}
        <div className="space-y-5">
          <div>
            <p
              className="text-sm font-medium uppercase tracking-wide mb-1"
              style={{ color: 'var(--theme-primary)' }}
            >
              {frame.brandId?.name}
            </p>
            <h1 className="text-xl md:text-4xl font-black tracking-tight text-gray-900 leading-tight">{localize(frame)}</h1>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <span
              className="text-xl md:text-3xl font-black"
              style={{ color: 'var(--theme-primary)' }}
            >
              ₹{frame.framePrice.toLocaleString()}
            </span>
            <Badge variant="outline" className="capitalize text-sm">{frame.gender}</Badge>
            {frame.featured && (
              <Badge className="text-white text-xs" style={{ background: 'var(--theme-primary, #2563eb)' }}>Featured</Badge>
            )}

            {frame.inStock === false && (
              <Badge className="bg-red-100 text-red-700 text-xs border-0">Out of Stock</Badge>
            )}
            {frame.inStock !== false && (
              <Badge className="bg-green-100 text-green-700 text-xs border-0">In Stock</Badge>
            )}
          </div>

          {activeOffers.length > 0 && (
            <div className="space-y-2">
              {activeOffers.length > 1 && (
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--theme-primary)' }}>
                  🎁 Multiple offers available — claim one
                </p>
              )}
              {activeOffers.map((offer, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-xl px-4 py-2.5 border"
                  style={{
                    background: 'color-mix(in srgb, var(--theme-primary) 10%, white)',
                    borderColor: 'color-mix(in srgb, var(--theme-primary) 20%, white)',
                  }}
                >
                  <span className="font-black text-lg" style={{ color: 'var(--theme-primary)' }}>
                    {offer.discountType === 'percentage' ? `${offer.discountValue}% OFF` : `₹${offer.discountValue} OFF`}
                  </span>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: 'var(--theme-primary)' }}>{offer.title}</p>
                    {offer.occasionName && (
                      <p className="text-xs opacity-75" style={{ color: 'var(--theme-primary)' }}>{offer.occasionName}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {frame.description && (
            <p className="text-gray-600 leading-relaxed">{localize(frame, 'description')}</p>
          )}

          <div className="space-y-1 text-sm text-gray-600">
            {frame.material && <p><span className="font-semibold text-gray-800">Material:</span> {frame.material}</p>}
          </div>

          {/* Color swatches */}
          {colors.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-2">
                Color: <span className="font-normal text-gray-600">{colors[activeColor]}</span>
                {activeColorImages.length > 1 && (
                  <span className="ml-2 text-xs text-slate-400 font-normal">({activeColorImages.length} photos)</span>
                )}
              </p>
              <div className="flex gap-2 flex-wrap">
                {colors.map((color, i) => {
                  const imgs = colorImages[i] ?? [];
                  return (
                    <button
                      key={i}
                      onClick={() => handleColorClick(i)}
                      title={`${color}${imgs.length > 1 ? ` · ${imgs.length} photos` : ''}`}
                      className={`relative w-9 h-9 rounded-full transition-all hover:scale-110 ${getColorClass(color)} ${
                        i === activeColor ? 'ring-2 ring-offset-2 scale-110' : ''
                      }`}
                      style={i === activeColor ? { '--tw-ring-color': 'var(--theme-primary)' } as React.CSSProperties : {}}
                    >
                      {i === activeColor && (
                        <Check className="w-4 h-4 text-white absolute inset-0 m-auto drop-shadow" />
                      )}
                      {imgs.length > 1 && i !== activeColor && (
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-slate-700 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                          {imgs.length}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Size selector */}
          {frame.sizes?.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-2">
                Size: <span className="font-normal text-gray-600">{frame.sizes[activeSize]}</span>
              </p>
              <div className="flex gap-2 flex-wrap">
                {frame.sizes.map((size, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveSize(i)}
                    className={`px-4 py-1.5 rounded-xl border text-sm font-bold transition-all ${
                      i === activeSize
                        ? 'text-white shadow-sm'
                        : 'border-gray-200 text-gray-700 hover:border-gray-400'
                    }`}
                    style={i === activeSize
                      ? { background: 'var(--theme-primary, #2563eb)', borderColor: 'var(--theme-primary)' }
                      : {}}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── CTA — desktop only (mobile gets sticky bar) ── */}
          <div className="hidden md:block space-y-3">
            <button
              onClick={() => setQuickOpen(true)}
              className="btn-glow w-full text-white text-base font-bold py-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2"
              style={{ background: 'var(--theme-primary, #2563eb)' }}
            >
              <WhatsAppIcon className="w-5 h-5" />
              Inquire on WhatsApp
            </button>
            <div className="flex gap-3">
              {frame.requiresLens !== false && (
                <button
                  onClick={() => setWizardOpen(true)}
                  className="flex-1 border-2 text-sm font-semibold py-3 rounded-2xl transition-all flex items-center justify-center gap-2 hover:bg-gray-50"
                  style={{ borderColor: 'var(--theme-primary, #2563eb)', color: 'var(--theme-primary, #2563eb)' }}
                >
                  Add Lenses
                </button>
              )}
              <ShareButton name={frame.name} slug={frame.slug} image={displayImage ?? frame.images?.[0]?.split(',')[0]?.trim()} />
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div>
          <p className="text-xs font-black tracking-widest uppercase mb-1" style={{ color: 'var(--theme-primary)' }}>RELATED</p>
          <h2 className="text-lg md:text-2xl font-black tracking-tight text-gray-900 mb-4">Related Products</h2>
          <div className="flex overflow-x-auto gap-4 pb-3 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-4 md:overflow-visible md:pb-0">
            {related.map((f) => (
              <div key={f._id} className="flex-shrink-0 w-[140px] md:w-auto snap-start">
                <ProductCard frame={f} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Sticky CTA bar — mobile only ── */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 z-40 px-4 pb-2 pt-3 bg-white/90 backdrop-blur-md border-t border-slate-100 shadow-2xl">
        <div className="flex gap-2">
          <button
            onClick={() => setQuickOpen(true)}
            className="btn-glow flex-1 text-white text-sm font-bold py-3 rounded-xl flex items-center justify-center gap-2"
            style={{ background: 'var(--theme-primary, #2563eb)' }}
          >
            <WhatsAppIcon className="w-4 h-4" />
            Inquire
          </button>
          {frame.requiresLens !== false && (
            <button
              onClick={() => setWizardOpen(true)}
              className="flex-1 border-2 text-sm font-bold py-3 rounded-xl flex items-center justify-center gap-2"
              style={{ borderColor: 'var(--theme-primary)', color: 'var(--theme-primary)' }}
            >
              Add Lenses
            </button>
          )}
          <ShareButton name={frame.name} slug={frame.slug} image={displayImage ?? frame.images?.[0]?.split(',')[0]?.trim()} />
        </div>
      </div>

      {/* Lens Wizard — optional prescription */}
      {wizardOpen && (
        <LensWizard
          frameId={frame._id}
          frameName={frame.name}
          selectedColor={colors[activeColor] ?? ''}
          selectedSize={frame.sizes?.[activeSize] ?? ''}
          open={wizardOpen}
          onClose={() => setWizardOpen(false)}
        />
      )}

      {/* Quick Inquiry — frame only, no prescription */}
      {quickOpen && (
        <QuickInquiry
          productName={frame.name}
          productSlug={frame.slug ?? slug}
          productImage={activeColorImages[0] ?? ''}
          selectedColor={colors[activeColor] ?? ''}
          selectedSize={frame.sizes?.[activeSize] ?? ''}
          whatsappNumber={whatsappNumber}
          onClose={() => setQuickOpen(false)}
        />
      )}
    </div>
  );
}
