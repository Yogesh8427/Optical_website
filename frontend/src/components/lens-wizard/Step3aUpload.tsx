import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, CheckCircle } from 'lucide-react';
import type { WizardFormData } from '@/types';

interface Props { data: WizardFormData; onUpdate: (p: Partial<WizardFormData>) => void; onNext: () => void; onBack: () => void; }

export default function Step3aUpload({ data, onUpdate, onNext, onBack }: Props) {
  const ref = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    onUpdate({ prescriptionFile: file });
  }

  return (
    <div className="space-y-4 py-2">
      <div
        onClick={() => ref.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
      >
        <Upload className="w-8 h-8 mx-auto mb-3 text-gray-400" />
        <p className="text-sm text-gray-600">Click to upload prescription</p>
        <p className="text-xs text-gray-400 mt-1">JPG, PNG, or PDF — max 5 MB</p>
        {data.prescriptionFile && (
          <p className="text-sm text-blue-600 mt-2 font-medium flex items-center gap-1"><CheckCircle className="w-4 h-4" /> {data.prescriptionFile.name}</p>
        )}
      </div>
      <input ref={ref} type="file" accept=".jpg,.jpeg,.png,.pdf" className="hidden" onChange={handleFile} />

      <div className="flex gap-3">
        <Button variant="ghost" onClick={onBack} className="flex-1">Back</Button>
        <Button onClick={onNext} disabled={!data.prescriptionFile} className="flex-1">Continue</Button>
      </div>
    </div>
  );
}
