import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Glasses } from 'lucide-react';
import type { Frame } from '@/types';

export default function ProductCard({ frame }: { frame: Frame }) {
  const img = frame.images?.[0];

  return (
    <Link href={`/product/${frame.slug}`} className="group block rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 bg-white">
      <div className="relative h-52 bg-gray-50">
        {img ? (
          <Image src={img} alt={frame.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-300">
            <Glasses className="w-12 h-12" />
            <span className="text-xs">No image</span>
          </div>
        )}
        {frame.featured && (
          <Badge className="absolute top-2 left-2 bg-blue-600 text-white text-xs">Featured</Badge>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">{frame.brandId?.name}</p>
        <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-3 line-clamp-2">{frame.name}</h3>
        <div className="flex items-center justify-between">
          <span className="font-bold text-blue-700 text-base">₹{frame.framePrice.toLocaleString()}</span>
          <Badge variant="outline" className="text-xs capitalize text-gray-500">{frame.gender}</Badge>
        </div>
      </div>
    </Link>
  );
}
