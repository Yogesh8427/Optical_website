import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useLensTypes } from '@/hooks/useLensTypes';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import type { WizardFormData } from '@/types';

interface Props { data: WizardFormData; onUpdate: (p: Partial<WizardFormData>) => void; onNext: () => void; onBack: () => void; }

export default function Step5LensType({ data, onUpdate, onNext, onBack }: Props) {
  const { data: res } = useLensTypes();
  const types = res?.data?.filter((t) => t.active) ?? [];

  function toggle(id: string) {
    const selected = data.lensTypes.includes(id)
      ? data.lensTypes.filter((t) => t !== id)
      : [...data.lensTypes, id];
    onUpdate({ lensTypes: selected });
  }

  return (
    <div className="space-y-4 py-2">
      <p className="text-sm text-gray-500">Select one or more lens types. You can choose multiple.</p>

      <div className="grid grid-cols-2 gap-3">
        {types.map((t) => {
          const selected = data.lensTypes.includes(t._id);
          return (
            <button
              key={t._id}
              type="button"
              onClick={() => toggle(t._id)}
              className={cn(
                'relative rounded-xl border-2 overflow-hidden text-left transition-all hover:shadow-md',
                selected ? 'border-blue-500 shadow-md' : 'border-gray-200 hover:border-gray-300'
              )}
            >
              {/* Image */}
              {t.image ? (
                <div className="relative w-full h-24 bg-gray-100">
                  <Image src={t.image} alt={t.name} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
              ) : (
                <div className="w-full h-24 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                  <span className="text-3xl">🔬</span>
                </div>
              )}

              {/* Selected checkmark */}
              {selected && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
              )}

              {/* Info */}
              <div className={cn('p-2.5', selected ? 'bg-blue-50' : 'bg-white')}>
                <p className="font-semibold text-gray-900 text-sm leading-tight">{t.name}</p>
                {t.description && <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{t.description}</p>}
                <p className={cn('text-xs font-semibold mt-1', t.extraPrice > 0 ? 'text-blue-600' : 'text-green-600')}>
                  {t.extraPrice > 0 ? `+₹${t.extraPrice.toLocaleString()}` : 'Free'}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {data.lensTypes.length > 0 && (
        <p className="text-xs text-blue-600 font-medium">{data.lensTypes.length} type(s) selected</p>
      )}

      <div className="flex gap-3 pt-1">
        <Button variant="ghost" onClick={onBack} className="flex-1">Back</Button>
        <Button onClick={onNext} disabled={data.lensTypes.length === 0} className="flex-1">
          Continue
        </Button>
      </div>
    </div>
  );
}
