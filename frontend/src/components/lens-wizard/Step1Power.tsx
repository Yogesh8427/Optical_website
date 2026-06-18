import { Button } from '@/components/ui/button';
import type { WizardFormData } from '@/types';

interface Props { data: WizardFormData; onUpdate: (p: Partial<WizardFormData>) => void; onNext: () => void; }

export default function Step1Power({ onUpdate, onNext }: Props) {
  function choose(powerRequired: boolean) {
    onUpdate({ powerRequired });
    onNext();
  }

  return (
    <div className="space-y-4 py-2">
      <Button className="w-full h-16 text-base" variant="outline" onClick={() => choose(false)}>
        No, I need plain lenses
      </Button>
      <Button className="w-full h-16 text-base" onClick={() => choose(true)}>
        Yes, I need powered lenses
      </Button>
    </div>
  );
}
