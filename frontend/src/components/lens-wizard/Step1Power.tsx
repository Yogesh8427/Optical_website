import type { WizardFormData } from '@/types';
import { Glasses, Eye } from 'lucide-react';

interface Props {
  data: WizardFormData;
  onUpdate: (p: Partial<WizardFormData>) => void;
  onNext: () => void;
  onSkipToContact: () => void;
}

export default function Step1Power({ onUpdate, onNext, onSkipToContact }: Props) {
  function chooseYes() {
    onUpdate({ powerRequired: true });
    onNext(); // → step 2 (prescription method)
  }

  function chooseNo() {
    onUpdate({ powerRequired: false });
    onSkipToContact(); // → step 7 (contact info) → WhatsApp directly
  }

  return (
    <div className="space-y-3 py-2">
      <p className="text-sm text-gray-500 text-center mb-4">Choose one of the options below to continue with your inquiry.</p>

      {/* No lens option */}
      <button
        type="button"
        onClick={chooseNo}
        className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-200 hover:border-green-400 hover:bg-green-50 transition-all text-left group"
      >
        <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-green-100 flex items-center justify-center shrink-0 transition-colors">
          <Eye className="w-6 h-6 text-slate-500 group-hover:text-green-600" />
        </div>
        <div>
          <p className="font-semibold text-slate-800 text-sm">No, I need plain lenses (zero power)</p>
          <p className="text-xs text-slate-400 mt-0.5">Skip lens steps → go directly to WhatsApp inquiry</p>
        </div>
      </button>

      {/* Yes lens option */}
      <button
        type="button"
        onClick={chooseYes}
        className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-left group"
      >
        <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center shrink-0 transition-colors">
          <Glasses className="w-6 h-6 text-slate-500 group-hover:text-blue-600" />
        </div>
        <div>
          <p className="font-semibold text-slate-800 text-sm">Yes, I need powered lenses</p>
          <p className="text-xs text-slate-400 mt-0.5">Choose lens brand, type and provide prescription</p>
        </div>
      </button>
    </div>
  );
}
