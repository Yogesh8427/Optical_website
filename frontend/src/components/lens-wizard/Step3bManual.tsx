'use client';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ChevronDown } from 'lucide-react';
import type { WizardFormData, EyePrescription } from '@/types';

// Standard SPH / CYL values from -20.00 to +20.00 in 0.25 steps
const SPH_CYL_OPTIONS: string[] = [];
for (let v = 20; v >= -20; v -= 0.25) {
  SPH_CYL_OPTIONS.push((v >= 0 ? '+' : '') + v.toFixed(2));
}

// Axis: 0 to 180
const AXIS_OPTIONS: string[] = Array.from({ length: 181 }, (_, i) => String(180 - i));

// ADD values
const ADD_OPTIONS = ['', '+0.75', '+1.00', '+1.25', '+1.50', '+1.75', '+2.00', '+2.25', '+2.50', '+2.75', '+3.00', '+3.50', '+4.00'];

interface ComboProps {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
  label: string;
}

function PowerCombo({ value, onChange, options, placeholder, label }: ComboProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const ref = useRef<HTMLDivElement>(null);

  // Sync query when value changes externally
  useEffect(() => { setQuery(value); }, [value]);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = query
    ? options.filter(o => o.startsWith(query) || o.startsWith(query.replace('+', '')))
    : options;

  function select(opt: string) {
    onChange(opt);
    setQuery(opt);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <Label className="text-xs uppercase text-slate-500 font-bold tracking-wide">{label}</Label>
      <div className="relative mt-1">
        <input
          type="text"
          className="w-full h-9 pl-3 pr-8 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:border-transparent bg-white"
          style={{ '--tw-ring-color': 'var(--theme-primary, #2563eb)' } as React.CSSProperties}
          placeholder={placeholder}
          value={query}
          onChange={e => { setQuery(e.target.value); onChange(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          autoComplete="off"
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"
          onClick={() => setOpen(o => !o)}
          tabIndex={-1}
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {open && filtered.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
          <ul className="max-h-44 overflow-y-auto">
            {filtered.slice(0, 80).map(opt => (
              <li
                key={opt}
                className={`px-3 py-1.5 text-sm cursor-pointer hover:bg-slate-50 ${opt === value ? 'font-bold' : ''}`}
                style={opt === value ? { color: 'var(--theme-primary, #2563eb)' } : {}}
                onMouseDown={e => { e.preventDefault(); select(opt); }}
              >
                {opt || '—'}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

interface Props { data: WizardFormData; onUpdate: (p: Partial<WizardFormData>) => void; onNext: () => void; onBack: () => void; }

function EyeFields({ label, value, onChange }: { label: string; value: EyePrescription; onChange: (v: EyePrescription) => void }) {
  return (
    <div className="bg-slate-50 rounded-xl p-4 space-y-3">
      <p className="font-black text-sm text-slate-700">{label}</p>
      <div className="grid grid-cols-3 gap-3">
        <PowerCombo
          label="SPH"
          placeholder="e.g. -1.50"
          options={SPH_CYL_OPTIONS}
          value={value.sph}
          onChange={v => onChange({ ...value, sph: v })}
        />
        <PowerCombo
          label="CYL"
          placeholder="e.g. -0.75"
          options={SPH_CYL_OPTIONS}
          value={value.cyl}
          onChange={v => onChange({ ...value, cyl: v })}
        />
        <PowerCombo
          label="AXIS"
          placeholder="0–180"
          options={AXIS_OPTIONS}
          value={value.axis}
          onChange={v => onChange({ ...value, axis: v })}
        />
      </div>
    </div>
  );
}

export default function Step3bManual({ data, onUpdate, onNext, onBack }: Props) {
  return (
    <div className="space-y-4 py-2">
      <EyeFields label="Right Eye (OD)" value={data.rightEye} onChange={(v) => onUpdate({ rightEye: v })} />
      <EyeFields label="Left Eye (OS)"  value={data.leftEye}  onChange={(v) => onUpdate({ leftEye: v })} />

      <div>
        <PowerCombo
          label="ADD (optional — for reading / bifocal lenses)"
          placeholder="e.g. +1.50"
          options={ADD_OPTIONS}
          value={data.add ?? ''}
          onChange={v => onUpdate({ add: v })}
        />
      </div>

      <div className="flex gap-3 pt-1">
        <Button variant="ghost" onClick={onBack} className="flex-1">Back</Button>
        <Button
          onClick={onNext}
          className="flex-1 text-white btn-glow"
          style={{ background: 'var(--theme-primary, #2563eb)' }}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
