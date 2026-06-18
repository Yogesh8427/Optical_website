import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLensTypes } from '@/hooks/useLensTypes';
import { cn } from '@/lib/utils';
import type { WizardFormData } from '@/types';

interface Props { data: WizardFormData; onUpdate: (p: Partial<WizardFormData>) => void; onNext: () => void; onBack: () => void; }

export default function Step5LensType({ data, onUpdate, onNext, onBack }: Props) {
  const { data: res } = useLensTypes();
  const types = res?.data ?? [];

  function toggle(id: string) {
    const selected = data.lensTypes.includes(id)
      ? data.lensTypes.filter((t) => t !== id)
      : [...data.lensTypes, id];
    onUpdate({ lensTypes: selected });
  }

  return (
    <div className="space-y-4 py-2">
      <p className="text-sm text-gray-500">You can select multiple types.</p>
      <div className="grid grid-cols-2 gap-2">
        {types.map((t) => {
          const selected = data.lensTypes.includes(t._id);
          return (
            <button
              key={t._id}
              onClick={() => toggle(t._id)}
              className={cn(
                'p-3 rounded-xl border text-left text-sm transition-all',
                selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-400'
              )}
            >
              <span className="font-medium text-gray-800">{t.name}</span>
              {t.extraPrice > 0 && (
                <Badge variant="outline" className="ml-2 text-xs">+₹{t.extraPrice}</Badge>
              )}
              {t.description && <p className="text-xs text-gray-500 mt-1">{t.description}</p>}
            </button>
          );
        })}
      </div>

      <div className="flex gap-3">
        <Button variant="ghost" onClick={onBack} className="flex-1">Back</Button>
        <Button onClick={onNext} disabled={data.lensTypes.length === 0} className="flex-1">Continue</Button>
      </div>
    </div>
  );
}
