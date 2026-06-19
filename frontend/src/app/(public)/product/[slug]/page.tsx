'use client';
import { use, useState } from 'react';
import Image from 'next/image';
import { useFrame } from '@/hooks/useFrames';
import { useSettings } from '@/hooks/useSettings';
import { useOffers } from '@/hooks/useOffers';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import ProductCard from '@/components/products/ProductCard';
import LensWizard from '@/components/lens-wizard/LensWizard';
import { Check, MessageCircle, X, ZoomIn } from 'lucide-react';
import ImageZoom from '@/components/ui/ImageZoom';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Frame } from '@/types';

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

// ── Simple WhatsApp inquiry for non-lens products ──────────────────────────
function QuickInquiry({
  productName, selectedColor, selectedSize, onClose, whatsappNumber,
}: {
  productName: string; selectedColor: string; selectedSize: string;
  onClose: () => void; whatsappNumber: string;
}) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [sending, setSending] = useState(false);

  function buildUrl() {
    const lines = [
      'Hello,',
      `I am interested in: *${productName}*`,
      selectedColor ? `Color: ${selectedColor}` : null,
      selectedSize  ? `Size/Variant: ${selectedSize}` : null,
      '',
      `Name: ${name}`,
      `Phone: ${phone}`,
      note ? `Note: ${note}` : null,
      '',
      'Please share the price and availability. Thank you!',
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">
          <div>
            <h2 className="font-bold text-slate-800">Quick Inquiry</h2>
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
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number *</label>
            <input
              type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required
              placeholder="e.g. 9876543210"
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Additional Note <span className="text-slate-400 font-normal">(optional)</span></label>
            <textarea
              value={note} onChange={(e) => setNote(e.target.value)}
              placeholder="Any specific questions?"
              rows={2}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>

          <button
            type="submit" disabled={sending}
            className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-500/25"
          >
            <MessageCircle className="w-5 h-5" />
            {sending ? 'Opening WhatsApp…' : 'Send Inquiry on WhatsApp'}
          </button>
          <p className="text-center text-xs text-slate-400">You will be redirected to WhatsApp to complete your inquiry</p>
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

  const whatsappNumber = settingsData?.data?.whatsappNumber
    ?? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
    ?? '';

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

  const activeOffer = offersData?.data?.find((o: { productIds?: Array<{ _id?: string } | string>; discountType: string; discountValue: number; title: string; occasionName?: string }) =>
    !o.productIds?.length || o.productIds.some((p) => ((p as { _id?: string })._id ?? p) === frame._id)
  ) ?? null;

  const images = frame.images?.length ? frame.images : [];
  const colors = frame.colors ?? [];
  const needsLens = frame.requiresLens !== false; // default true for legacy products

  function handleColorClick(i: number) {
    setActiveColor(i);
    setActiveImg(images[i] !== undefined ? i : 0);
  }

  const displayImage = images[activeImg] ?? null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">

        {/* Images */}
        <div className="space-y-3">
          <div
            className="relative h-80 md:h-96 rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 cursor-zoom-in"
            onClick={() => displayImage && setZoomOpen(true)}
          >
            {displayImage ? (
              <Image src={displayImage} alt={frame.name} fill className="object-cover" priority />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">No image</div>
            )}
            {displayImage && (
              <div className="absolute bottom-2 right-2 bg-black/40 text-white text-xs px-2 py-1 rounded-lg flex items-center gap-1">
                <ZoomIn className="w-3 h-3" /> Zoom
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => { setActiveImg(i); setActiveColor(i); }}
                  className={`relative w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    i === activeImg ? 'border-blue-500 shadow-md' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <Image src={img} alt={`View ${i + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
          {zoomOpen && images.length > 0 && (
            <ImageZoom
              images={images}
              activeIndex={activeImg}
              onClose={() => setZoomOpen(false)}
              onPrev={() => setActiveImg((i) => (i - 1 + images.length) % images.length)}
              onNext={() => setActiveImg((i) => (i + 1) % images.length)}
            />
          )}
        </div>

        {/* Details */}
        <div className="space-y-5">
          <div>
            <p className="text-sm text-blue-600 font-medium uppercase tracking-wide mb-1">{frame.brandId?.name}</p>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">{localize(frame)}</h1>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-2xl md:text-3xl font-bold text-blue-700">₹{frame.framePrice.toLocaleString()}</span>
            <Badge variant="outline" className="capitalize text-sm">{frame.gender}</Badge>
            {frame.featured && <Badge className="bg-blue-600 text-white text-xs">Featured</Badge>}
            {!needsLens && (
              <Badge className="bg-green-100 text-green-700 text-xs border-0">No Prescription Needed</Badge>
            )}
            {frame.inStock === false && (
              <Badge className="bg-red-100 text-red-700 text-xs border-0">Out of Stock</Badge>
            )}
            {frame.inStock !== false && (
              <Badge className="bg-green-100 text-green-700 text-xs border-0">In Stock</Badge>
            )}
          </div>

          {activeOffer && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
              <span className="text-red-600 font-bold text-lg">
                {activeOffer.discountType === 'percentage' ? `${activeOffer.discountValue}% OFF` : `₹${activeOffer.discountValue} OFF`}
              </span>
              <div>
                <p className="font-semibold text-red-700 text-sm">{activeOffer.title}</p>
                {activeOffer.occasionName && <p className="text-red-500 text-xs">{activeOffer.occasionName}</p>}
              </div>
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
              </p>
              <div className="flex gap-2 flex-wrap">
                {colors.map((color, i) => (
                  <button
                    key={i}
                    onClick={() => handleColorClick(i)}
                    title={color}
                    className={`relative w-8 h-8 rounded-full transition-all hover:scale-110 ${getColorClass(color)} ${
                      i === activeColor ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : ''
                    }`}
                  >
                    {i === activeColor && (
                      <Check className="w-4 h-4 text-white absolute inset-0 m-auto drop-shadow" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size selector */}
          {frame.sizes?.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-2">
                {needsLens ? 'Size' : 'Variant'}: <span className="font-normal text-gray-600">{frame.sizes[activeSize]}</span>
              </p>
              <div className="flex gap-2 flex-wrap">
                {frame.sizes.map((size, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveSize(i)}
                    className={`px-4 py-1.5 rounded-lg border text-sm font-medium transition-all ${
                      i === activeSize
                        ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                        : 'border-gray-200 text-gray-700 hover:border-blue-400 hover:text-blue-600'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── CTA — conditional on requiresLens ── */}
          {needsLens ? (
            <button
              onClick={() => setWizardOpen(true)}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white text-base font-semibold py-3.5 rounded-2xl transition-all shadow-lg shadow-blue-700/25 flex items-center justify-center gap-2"
            >
              👓 Customize Lens &amp; Inquire
            </button>
          ) : (
            <div className="space-y-3">
              <button
                onClick={() => setQuickOpen(true)}
                className="w-full bg-green-500 hover:bg-green-600 text-white text-base font-semibold py-3.5 rounded-2xl transition-all shadow-lg shadow-green-500/25 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Inquire on WhatsApp
              </button>
              <p className="text-center text-xs text-gray-400">No prescription needed — direct inquiry</p>
            </div>
          )}
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {related.map((f) => <ProductCard key={f._id} frame={f} />)}
          </div>
        </div>
      )}

      {/* Lens Wizard — only for requiresLens products */}
      {needsLens && wizardOpen && (
        <LensWizard
          frameId={frame._id}
          frameName={frame.name}
          selectedColor={colors[activeColor] ?? ''}
          selectedSize={frame.sizes?.[activeSize] ?? ''}
          open={wizardOpen}
          onClose={() => setWizardOpen(false)}
        />
      )}

      {/* Quick Inquiry dialog — for non-lens products */}
      {!needsLens && quickOpen && (
        <QuickInquiry
          productName={frame.name}
          selectedColor={colors[activeColor] ?? ''}
          selectedSize={frame.sizes?.[activeSize] ?? ''}
          whatsappNumber={whatsappNumber}
          onClose={() => setQuickOpen(false)}
        />
      )}
    </div>
  );
}
