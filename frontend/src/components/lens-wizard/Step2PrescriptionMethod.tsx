import { useEffect } from 'react';
import { Upload, PenLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { WizardFormData } from '@/types';

interface Props { data: WizardFormData; onUpdate: (p: Partial<WizardFormData>) => void; onNext: () => void; onBack: () => void; }

export default function Step2PrescriptionMethod({ data, onUpdate, onNext, onBack }: Props) {
  // If no power needed, skip straight to lens brand step after render
  useEffect(() => {
    if (!data.powerRequired) onNext();
  }, [data.powerRequired, onNext]);

  if (!data.powerRequired) return null;

  function choose(method: 'upload' | 'manual') {
    onUpdate({ prescriptionMethod: method });
    onNext();
  }

  return (
    <div className="space-y-4 py-2">
      <Button className="w-full h-16 text-base flex items-center gap-3" variant="outline" onClick={() => choose('upload')}>
        <Upload className="w-5 h-5 shrink-0" /> Upload Prescription (JPG / PNG / PDF)
      </Button>
      <Button className="w-full h-16 text-base flex items-center gap-3" onClick={() => choose('manual')}>
        <PenLine className="w-5 h-5 shrink-0" /> Enter Power Manually
      </Button>
      <Button variant="ghost" className="w-full" onClick={onBack}>Back</Button>
    </div>
  );
}
