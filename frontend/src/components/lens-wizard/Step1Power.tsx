import type { WizardFormData } from '@/types';
import { Glasses, Eye } from 'lucide-react';

interface Props {
  data: WizardFormData;
  onUpdate: (p: Partial<WizardFormData>) => void;
  onNext: () => void;
  onSkipToContact: () => void;
  onSkipToLensBrand: () => void;
}

export default function Step1Power({ onUpdate, onNext, onSkipToContact: _onSkipToContact, onSkipToLensBrand }: Props) {
  function chooseZero() {
    onUpdate({ powerRequired: false, prescriptionMethod: null });
    onSkipToLensBrand(); // → step 4 (lens brand) directly
  }

  function chooseWithNumber() {
    onUpdate({ powerRequired: true });
    onNext(); // → step 2 (choose prescription method)
  }

  return (
    <div className="space-y-3 py-2">
      <p className="text-sm text-slate-500 text-center mb-4">
        What type of lenses do you need with this frame?
      </p>

      {/* Zero Number */}
      <button
        type="button"
        onClick={chooseZero}
        className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-left group"
      >
        <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center shrink-0 transition-colors">
          <Eye className="w-6 h-6 text-slate-500 group-hover:text-blue-600" />
        </div>
        <div>
          <p className="font-bold text-slate-800 text-sm">Zero Number (0.00)</p>
          <p className="text-xs text-slate-400 mt-0.5">No prescription needed — choose your lens brand &amp; type</p>
        </div>
      </button>

      {/* With Number */}
      <button
        type="button"
        onClick={chooseWithNumber}
        className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-200 hover:border-purple-400 hover:bg-purple-50 transition-all text-left group"
      >
        <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-purple-100 flex items-center justify-center shrink-0 transition-colors">
          <Glasses className="w-6 h-6 text-slate-500 group-hover:text-purple-600" />
        </div>
        <div>
          <p className="font-bold text-slate-800 text-sm">With Number (Powered)</p>
          <p className="text-xs text-slate-400 mt-0.5">Add your prescription, pick lens brand &amp; type</p>
        </div>
      </button>
    </div>
  );
}
