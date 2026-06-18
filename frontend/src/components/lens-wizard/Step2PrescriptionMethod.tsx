import { Button } from '@/components/ui/button';
import type { WizardFormData } from '@/types';

interface Props { data: WizardFormData; onUpdate: (p: Partial<WizardFormData>) => void; onNext: () => void; onBack: () => void; }

export default function Step2PrescriptionMethod({ data, onUpdate, onNext, onBack }: Props) {
  // If no power needed skip straight to lens brand step
  if (!data.powerRequired) {
    onNext(); // step 3 → will go to step 4 handled by parent routing
    return null;
  }

  function choose(method: 'upload' | 'manual') {
    onUpdate({ prescriptionMethod: method });
    onNext();
  }

  return (
    <div className="space-y-4 py-2">
      <Button className="w-full h-16 text-base" variant="outline" onClick={() => choose('upload')}>
        📄 Upload Prescription (JPG / PNG / PDF)
      </Button>
      <Button className="w-full h-16 text-base" onClick={() => choose('manual')}>
        ✏️ Enter Power Manually
      </Button>
      <Button variant="ghost" className="w-full" onClick={onBack}>Back</Button>
    </div>
  );
}
