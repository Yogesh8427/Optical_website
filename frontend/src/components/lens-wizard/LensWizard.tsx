'use client';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Step1Power from './Step1Power';
import Step2PrescriptionMethod from './Step2PrescriptionMethod';
import Step3aUpload from './Step3aUpload';
import Step3bManual from './Step3bManual';
import Step4LensBrand from './Step4LensBrand';
import Step5LensType from './Step5LensType';
import Step6Notes from './Step6Notes';
import Step7CustomerInfo from './Step7CustomerInfo';
import type { WizardFormData } from '@/types';

const EMPTY_EYE = { sph: '', cyl: '', axis: '' };

const defaultData: WizardFormData = {
  frameId: '',
  frameName: '',
  powerRequired: false,
  prescriptionMethod: null,
  prescriptionFile: null,
  rightEye: { ...EMPTY_EYE },
  leftEye: { ...EMPTY_EYE },
  add: '',
  lensBrandId: '',
  lensTypes: [],
  notes: '',
  customerName: '',
  phone: '',
  email: '',
  city: '',
};

interface Props {
  frameId: string;
  frameName: string;
  open: boolean;
  onClose: () => void;
}

export default function LensWizard({ frameId, frameName, open, onClose }: Props) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardFormData>({ ...defaultData, frameId, frameName });

  function update(partial: Partial<WizardFormData>) {
    setData((d) => ({ ...d, ...partial }));
  }

  function next() { setStep((s) => s + 1); }
  function back() { setStep((s) => s - 1); }

  function getStepTitle() {
    const titles: Record<number, string> = {
      1: 'Do you need powered lenses?',
      2: 'Provide your prescription',
      3: 'Prescription details',
      4: 'Select Lens Brand',
      5: 'Select Lens Type(s)',
      6: 'Additional Notes',
      7: 'Your Contact Information',
    };
    return titles[step] ?? 'Customize Lens';
  }

  function handleClose() {
    setStep(1);
    setData({ ...defaultData, frameId, frameName });
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">{getStepTitle()}</DialogTitle>
          <p className="text-sm text-gray-500">Step {step} of 7</p>
          <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
            <div className="bg-blue-600 h-1.5 rounded-full transition-all" style={{ width: `${(step / 7) * 100}%` }} />
          </div>
        </DialogHeader>

        {step === 1 && <Step1Power data={data} onUpdate={update} onNext={next} />}
        {step === 2 && <Step2PrescriptionMethod data={data} onUpdate={update} onNext={next} onBack={back} />}
        {step === 3 && data.prescriptionMethod === 'upload' && <Step3aUpload data={data} onUpdate={update} onNext={next} onBack={back} />}
        {step === 3 && data.prescriptionMethod === 'manual' && <Step3bManual data={data} onUpdate={update} onNext={next} onBack={back} />}
        {step === 4 && <Step4LensBrand data={data} onUpdate={update} onNext={next} onBack={back} />}
        {step === 5 && <Step5LensType data={data} onUpdate={update} onNext={next} onBack={back} />}
        {step === 6 && <Step6Notes data={data} onUpdate={update} onNext={next} onBack={back} />}
        {step === 7 && <Step7CustomerInfo data={data} onUpdate={update} onBack={back} onClose={handleClose} />}
      </DialogContent>
    </Dialog>
  );
}
