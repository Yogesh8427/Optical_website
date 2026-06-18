import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { WizardFormData, EyePrescription } from '@/types';

interface Props { data: WizardFormData; onUpdate: (p: Partial<WizardFormData>) => void; onNext: () => void; onBack: () => void; }

function EyeFields({ label, value, onChange }: { label: string; value: EyePrescription; onChange: (v: EyePrescription) => void }) {
  return (
    <div>
      <p className="font-semibold text-sm text-gray-700 mb-2">{label}</p>
      <div className="grid grid-cols-3 gap-2">
        {(['sph', 'cyl', 'axis'] as const).map((field) => (
          <div key={field}>
            <Label className="text-xs uppercase text-gray-500">{field}</Label>
            <Input
              placeholder={field === 'axis' ? '0–180' : '±0.00'}
              value={value[field]}
              onChange={(e) => onChange({ ...value, [field]: e.target.value })}
              className="mt-1 h-8 text-sm"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Step3bManual({ data, onUpdate, onNext, onBack }: Props) {
  return (
    <div className="space-y-4 py-2">
      <EyeFields label="Right Eye (OD)" value={data.rightEye} onChange={(v) => onUpdate({ rightEye: v })} />
      <EyeFields label="Left Eye (OS)" value={data.leftEye} onChange={(v) => onUpdate({ leftEye: v })} />
      <div>
        <Label className="text-xs uppercase text-gray-500">ADD (optional)</Label>
        <Input placeholder="e.g. +1.50" value={data.add} onChange={(e) => onUpdate({ add: e.target.value })} className="mt-1 h-8 text-sm" />
      </div>

      <div className="flex gap-3">
        <Button variant="ghost" onClick={onBack} className="flex-1">Back</Button>
        <Button onClick={onNext} className="flex-1">Continue</Button>
      </div>
    </div>
  );
}
