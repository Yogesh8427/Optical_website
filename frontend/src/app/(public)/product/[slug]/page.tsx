'use client';
import { use, useState } from 'react';
import Image from 'next/image';
import { useFrame } from '@/hooks/useFrames';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import ProductCard from '@/components/products/ProductCard';
import LensWizard from '@/components/lens-wizard/LensWizard';
import type { Frame } from '@/types';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data, isLoading } = useFrame(slug);
  const [activeImg, setActiveImg] = useState(0);
  const [wizardOpen, setWizardOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-96 rounded-xl" />
          <div className="space-y-4"><Skeleton className="h-8 w-3/4" /><Skeleton className="h-6 w-1/2" /><Skeleton className="h-32" /></div>
        </div>
      </div>
    );
  }

  const frame: Frame = data?.data;
  const related: Frame[] = data?.related ?? [];
  if (!frame) return <div className="text-center py-20 text-gray-500">Frame not found.</div>;

  const images = frame.images?.length ? frame.images : ['/placeholder.png'];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
        {/* Images */}
        <div>
          <div className="relative h-80 rounded-xl overflow-hidden bg-gray-100 mb-3">
            <Image src={images[activeImg]} alt={frame.name} fill className="object-cover" />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${i === activeImg ? 'border-blue-500' : 'border-transparent'}`}>
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-4">
          <p className="text-sm text-gray-500">{frame.brandId?.name}</p>
          <h1 className="text-3xl font-bold text-gray-900">{frame.name}</h1>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-blue-700">₹{frame.framePrice.toLocaleString()}</span>
            <Badge variant="outline" className="capitalize">{frame.gender}</Badge>
          </div>
          {frame.description && <p className="text-gray-600 text-sm leading-relaxed">{frame.description}</p>}

          <div className="text-sm text-gray-600 space-y-1">
            {frame.material && <p><span className="font-medium">Material:</span> {frame.material}</p>}
            {frame.colors?.length > 0 && <p><span className="font-medium">Colors:</span> {frame.colors.join(', ')}</p>}
            {frame.sizes?.length > 0 && <p><span className="font-medium">Sizes:</span> {frame.sizes.join(', ')}</p>}
          </div>

          <Button size="lg" className="w-full mt-2 bg-blue-700 hover:bg-blue-800 text-white" onClick={() => setWizardOpen(true)}>
            🔍 Customize Lens
          </Button>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {related.map((f) => <ProductCard key={f._id} frame={f} />)}
          </div>
        </div>
      )}

      {wizardOpen && (
        <LensWizard frameId={frame._id} frameName={frame.name} open={wizardOpen} onClose={() => setWizardOpen(false)} />
      )}
    </div>
  );
}
