import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { WizardFormData } from '@/types';

interface Props { data: WizardFormData; onUpdate: (p: Partial<WizardFormData>) => void; onNext: () => void; onBack: () => void; }

export default function Step6Notes({ data, onUpdate, onNext, onBack }: Props) {
  return (
    <div className="space-y-4 py-2">
      <Textarea
        rows={5}
        placeholder="Any special requests or notes for the optician... (optional)"
        value={data.notes}
        onChange={(e) => onUpdate({ notes: e.target.value })}
      />
      <div className="flex gap-3">
        <Button variant="ghost" onClick={onBack} className="flex-1">Back</Button>
        <Button onClick={onNext} className="flex-1">Continue</Button>
      </div>
    </div>
  );
}
