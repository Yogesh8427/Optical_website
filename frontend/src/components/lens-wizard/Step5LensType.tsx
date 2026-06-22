'use client';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLensProducts, type LensProduct } from '@/hooks/useLensProducts';
import type { WizardFormData } from '@/types';

interface Props { data: WizardFormData; onUpdate: (p: Partial<WizardFormData>) => void; onNext: () => void; onBack: () => void; }

export default function Step5LensType({ data, onUpdate, onNext, onBack }: Props) {
  const { data: res, isLoading } = useLensProducts(data.lensBrandId || undefined);
  const products = res?.data ?? [];

  const selectedId = data.lensTypes[0] ?? '';

  function select(id: string) {
    onUpdate({ lensTypes: [id] });
  }

  if (isLoading) {
    return <div className="py-10 text-center text-slate-400 text-sm">Loading lens options…</div>;
  }

  if (products.length === 0) {
    return (
      <div className="py-8 text-center space-y-3">
        <p className="text-slate-500 text-sm">No lens products found for this brand.</p>
        <p className="text-slate-400 text-xs">Ask the store owner to add products for this brand.</p>
        <div className="flex gap-3 pt-2">
          <Button variant="ghost" onClick={onBack} className="flex-1">Back</Button>
          <Button onClick={onNext} className="flex-1">Skip &amp; Continue</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 py-2">
      <p className="text-sm text-slate-500">Choose a lens option for your frame.</p>

      <div className="space-y-2">
        {products.map((p: LensProduct) => {
          const active = selectedId === p._id;
          return (
            <button
              key={p._id}
              type="button"
              onClick={() => select(p._id)}
              className={cn(
                'w-full flex items-center justify-between gap-4 px-4 py-3 rounded-xl border-2 text-left transition-all',
                active ? 'shadow-sm' : 'border-slate-200 hover:border-slate-300 bg-white'
              )}
              style={active ? {
                borderColor: 'var(--theme-primary, #2563eb)',
                background: 'color-mix(in srgb, var(--theme-primary, #2563eb) 8%, white)',
              } : {}}
            >
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm" style={active ? { color: 'var(--theme-primary, #2563eb)' } : { color: '#1e293b' }}>
                  {p.name}
                </p>
                {p.description && (
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{p.description}</p>
                )}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <p className="font-black text-base" style={{ color: 'var(--theme-primary, #2563eb)' }}>
                  ₹{p.price.toLocaleString()}
                </p>
                <div
                  className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                  style={active
                    ? { background: 'var(--theme-primary, #2563eb)', borderColor: 'var(--theme-primary, #2563eb)' }
                    : { borderColor: '#cbd5e1', background: 'white' }}
                >
                  {active && <Check className="w-3 h-3 text-white" />}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex gap-3 pt-1">
        <Button variant="ghost" onClick={onBack} className="flex-1">Back</Button>
        <Button
          onClick={onNext}
          disabled={!selectedId}
          className="flex-1 text-white btn-glow"
          style={{ background: 'var(--theme-primary, #2563eb)' }}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
