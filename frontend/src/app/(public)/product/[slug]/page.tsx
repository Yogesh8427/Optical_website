'use client';
import { use, useState } from 'react';
import Image from 'next/image';
import { useFrame } from '@/hooks/useFrames';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import ProductCard from '@/components/products/ProductCard';
import LensWizard from '@/components/lens-wizard/LensWizard';
import { Check } from 'lucide-react';
import type { Frame } from '@/types';

// Map common color names to Tailwind bg classes for the swatch dot
const COLOR_MAP: Record<string, string> = {
  gold: 'bg-yellow-400',
  silver: 'bg-gray-300',
  black: 'bg-gray-900',
  brown: 'bg-amber-800',
  blue: 'bg-blue-500',
  red: 'bg-red-500',
  green: 'bg-green-500',
  white: 'bg-white border border-gray-300',
  copper: 'bg-orange-400',
  gunmetal: 'bg-gray-600',
  pink: 'bg-pink-400',
  purple: 'bg-purple-500',
  tortoise: 'bg-amber-700',
  crystal: 'bg-sky-200',
  navy: 'bg-blue-900',
};

function getColorClass(color: string) {
  return COLOR_MAP[color.toLowerCase()] ?? 'bg-gray-400';
}

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data, isLoading } = useFrame(slug);
  const [activeImg, setActiveImg] = useState(0);
  const [activeColor, setActiveColor] = useState(0);
  const [activeSize, setActiveSize] = useState(0);
  const [wizardOpen, setWizardOpen] = useState(false);

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
  if (!frame) return <div className="text-center py-20 text-gray-500">Frame not found.</div>;

  const images = frame.images?.length ? frame.images : [];
  const colors = frame.colors ?? [];

  // Clicking a color shows images[colorIndex] if that image exists, else images[0]
  function handleColorClick(i: number) {
    setActiveColor(i);
    setActiveImg(images[i] !== undefined ? i : 0);
  }

  const displayImage = images[activeImg] ?? null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">

        {/* ── Images ── */}
        <div className="space-y-3">
          {/* Main image */}
          <div className="relative h-96 rounded-2xl overflow-hidden bg-gray-100 border border-gray-100">
            {displayImage ? (
              <Image src={displayImage} alt={frame.name} fill className="object-cover" priority />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">No image</div>
            )}
          </div>

          {/* Thumbnails — only when > 1 image */}
          {images.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => { setActiveImg(i); setActiveColor(i); }}
                  className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    i === activeImg ? 'border-blue-500 shadow-md' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <Image src={img} alt={`View ${i + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Details ── */}
        <div className="space-y-5">
          <div>
            <p className="text-sm text-blue-600 font-medium uppercase tracking-wide mb-1">{frame.brandId?.name}</p>
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">{frame.name}</h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-blue-700">₹{frame.framePrice.toLocaleString()}</span>
            <Badge variant="outline" className="capitalize text-sm">{frame.gender}</Badge>
            {frame.featured && <Badge className="bg-blue-600 text-white text-xs">Featured</Badge>}
          </div>

          {frame.description && (
            <p className="text-gray-600 leading-relaxed">{frame.description}</p>
          )}

          <div className="space-y-1 text-sm text-gray-600">
            {frame.material && (
              <p><span className="font-semibold text-gray-800">Material:</span> {frame.material}</p>
            )}
            {frame.sizes?.length > 0 && (
              <p><span className="font-semibold text-gray-800">Sizes:</span> {frame.sizes.join(', ')}</p>
            )}
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
              {images.length > 0 && colors.length > images.length && (
                <p className="text-xs text-gray-400 mt-2">
                  * Images available for {images.length} of {colors.length} colors
                </p>
              )}
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

          <Button
            size="lg"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white text-base font-semibold"
            onClick={() => setWizardOpen(true)}
          >
            🔍 Customize Lens & Inquire
          </Button>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {related.map((f) => <ProductCard key={f._id} frame={f} />)}
          </div>
        </div>
      )}

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
    </div>
  );
}
