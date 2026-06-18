import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useLensBrands } from '@/hooks/useLensBrands';
import { cn } from '@/lib/utils';
import type { WizardFormData } from '@/types';

interface Props { data: WizardFormData; onUpdate: (p: Partial<WizardFormData>) => void; onNext: () => void; onBack: () => void; }

export default function Step4LensBrand({ data, onUpdate, onNext, onBack }: Props) {
  const { data: res } = useLensBrands();
  const brands = res?.data ?? [];

  return (
    <div className="space-y-4 py-2">
      <div className="grid grid-cols-2 gap-3">
        {brands.map((b) => (
          <button
            key={b._id}
            onClick={() => onUpdate({ lensBrandId: b._id })}
            className={cn(
              'flex flex-col items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all',
              data.lensBrandId === b._id ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-400'
            )}
          >
            {b.logo && <Image src={b.logo} alt={b.name} width={48} height={32} className="object-contain" />}
            {b.name}
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <Button variant="ghost" onClick={onBack} className="flex-1">Back</Button>
        <Button onClick={onNext} disabled={!data.lensBrandId} className="flex-1">Continue</Button>
      </div>
    </div>
  );
}
