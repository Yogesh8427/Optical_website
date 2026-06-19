'use client';
import { useRef, useState } from 'react';
import Papa from 'papaparse';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Upload, Download, CheckCircle2, XCircle, Loader2, FileSpreadsheet, FileUp } from 'lucide-react';

interface ImportError { row: string; reason: string; }

interface Props {
  label: string;
  templateColumns: string[];
  templateRows: string[][];
  onImport: (rows: Record<string, string>[]) => Promise<{ created: number; errors: ImportError[] }>;
  tip?: string;
}

function downloadCsv(columns: string[], rows: string[][], filename: string) {
  const csvContent = [columns, ...rows]
    .map((r) => r.map((cell) => (cell.includes(',') || cell.includes('"') ? `"${cell.replace(/"/g, '""')}"` : cell)).join(','))
    .join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

type Step = 'idle' | 'preview' | 'importing' | 'done';

export default function CsvImportButton({ label, templateColumns, templateRows, onImport, tip }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [open, setOpen]         = useState(false);
  const [step, setStep]         = useState<Step>('idle');
  const [rows, setRows]         = useState<Record<string, string>[]>([]);
  const [parseErr, setParseErr] = useState('');
  const [fileName, setFileName] = useState('');
  const [result, setResult]     = useState<{ created: number; errors: ImportError[] } | null>(null);

  function reset() {
    setStep('idle'); setRows([]); setParseErr(''); setResult(null); setFileName('');
    if (fileRef.current) fileRef.current.value = '';
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setParseErr('');
    setFileName(file.name);
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => {
        if (!res.data.length) { setParseErr('File is empty or has no data rows.'); return; }
        setRows(res.data);
        setStep('preview');
      },
      error: (err) => setParseErr(err.message),
    });
  }

  async function runImport() {
    setStep('importing');
    try {
      const res = await onImport(rows);
      setResult(res);
      setStep('done');
    } catch {
      setStep('preview');
      setParseErr('Import failed — please try again.');
    }
  }

  // Show only first 4 columns as "key" columns in the preview cards
  const previewCols = rows[0] ? Object.keys(rows[0]).slice(0, 4) : [];
  const extraCols   = rows[0] ? Math.max(0, Object.keys(rows[0]).length - 4) : 0;

  return (
    <>
      <Button variant="outline" size="sm" className="gap-1.5" onClick={() => { reset(); setOpen(true); }}>
        <Upload className="w-3.5 h-3.5" />
        <span>{label}</span>
      </Button>

      <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); setOpen(v); }}>
        <DialogContent className="max-w-lg w-full">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <FileSpreadsheet className="w-5 h-5 text-blue-600 shrink-0" />
              {label}
            </DialogTitle>
          </DialogHeader>

          {/* ── IDLE ────────────────────────────────────────── */}
          {step === 'idle' && (
            <div className="space-y-4 pt-1">

              {/* Step 1 */}
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold shrink-0">1</span>
                  <p className="text-sm font-semibold text-blue-800">Download the template</p>
                </div>
                <p className="text-xs text-blue-600 pl-7">Fill it in Excel or Google Sheets, then save as CSV.</p>
                <div className="pl-7">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-blue-200 text-blue-700 hover:bg-blue-100 gap-1.5 h-8"
                    onClick={() => downloadCsv(templateColumns, templateRows, `${label.toLowerCase().replace(/\s+/g, '-')}-template.csv`)}
                  >
                    <Download className="w-3.5 h-3.5" /> Download Template (.csv)
                  </Button>
                </div>
              </div>

              {/* Column chips */}
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Template columns</p>
                <div className="flex flex-wrap gap-1.5">
                  {templateColumns.map((col) => (
                    <span key={col} className="px-2 py-0.5 bg-white border border-slate-200 text-slate-600 rounded-md text-xs font-mono shadow-sm">{col}</span>
                  ))}
                </div>
                {tip && <p className="text-xs text-slate-400 leading-relaxed pt-1">{tip}</p>}
              </div>

              {/* Step 2 — upload */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-5 h-5 rounded-full bg-slate-700 text-white text-xs flex items-center justify-center font-bold shrink-0">2</span>
                  <p className="text-sm font-semibold text-slate-700">Upload your filled CSV</p>
                </div>
                <div
                  onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-6 text-center cursor-pointer transition-colors group"
                >
                  <FileUp className="w-7 h-7 mx-auto mb-2 text-slate-300 group-hover:text-blue-400 transition-colors" />
                  <p className="text-sm font-medium text-slate-600">Click to choose CSV file</p>
                  <p className="text-xs text-slate-400 mt-0.5">Only .csv files — max 5 MB</p>
                </div>
                <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />
                {parseErr && (
                  <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                    <XCircle className="w-3.5 h-3.5 shrink-0" /> {parseErr}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── PREVIEW ─────────────────────────────────────── */}
          {step === 'preview' && (
            <div className="space-y-4 pt-1">

              {/* Summary bar */}
              <div className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-green-800">{rows.length} rows ready to import</p>
                  <p className="text-xs text-green-600 truncate">{fileName}</p>
                </div>
              </div>

              {/* Row cards */}
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {rows.slice(0, 10).map((row, i) => (
                  <div key={i} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5 flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-500 text-xs flex items-center justify-center font-semibold shrink-0 mt-0.5">{i + 1}</span>
                    <div className="flex-1 min-w-0 space-y-1">
                      {/* First 4 cols as key-value pairs */}
                      <div className="flex flex-wrap gap-x-4 gap-y-0.5">
                        {previewCols.map((col) => (
                          <span key={col} className="text-xs">
                            <span className="text-slate-400">{col}: </span>
                            <span className="font-medium text-slate-700 truncate">{row[col] || '—'}</span>
                          </span>
                        ))}
                      </div>
                      {extraCols > 0 && (
                        <p className="text-xs text-slate-400">+{extraCols} more columns</p>
                      )}
                    </div>
                  </div>
                ))}
                {rows.length > 10 && (
                  <p className="text-xs text-slate-400 text-center py-1">… and {rows.length - 10} more rows</p>
                )}
              </div>

              {parseErr && (
                <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                  <XCircle className="w-3.5 h-3.5 shrink-0" /> {parseErr}
                </div>
              )}

              <div className="flex gap-2 pt-1">
                <Button variant="outline" className="flex-1" onClick={reset}>
                  Choose different file
                </Button>
                <Button className="flex-1 gap-1.5" onClick={runImport}>
                  <Upload className="w-3.5 h-3.5" />
                  Import {rows.length} rows
                </Button>
              </div>
            </div>
          )}

          {/* ── IMPORTING ───────────────────────────────────── */}
          {step === 'importing' && (
            <div className="py-14 flex flex-col items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
                <Loader2 className="w-7 h-7 animate-spin text-blue-500" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-700">Importing {rows.length} rows…</p>
                <p className="text-xs text-slate-400 mt-1">Please wait, this may take a moment</p>
              </div>
            </div>
          )}

          {/* ── DONE ────────────────────────────────────────── */}
          {step === 'done' && result && (
            <div className="space-y-4 pt-1">

              {/* Big success card */}
              <div className="rounded-xl bg-green-50 border border-green-100 p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-7 h-7 text-green-500" />
                </div>
                <div>
                  <p className="text-lg font-bold text-green-800">{result.created} items created!</p>
                  {result.errors.length > 0 ? (
                    <p className="text-xs text-amber-600 mt-0.5">{result.errors.length} rows had issues — see below</p>
                  ) : (
                    <p className="text-xs text-green-600 mt-0.5">All rows imported successfully</p>
                  )}
                </div>
              </div>

              {/* Errors */}
              {result.errors.length > 0 && (
                <div className="rounded-xl border border-red-100 overflow-hidden">
                  <div className="bg-red-50 px-4 py-2.5 flex items-center gap-2 border-b border-red-100">
                    <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <p className="text-xs font-semibold text-red-700">Skipped rows ({result.errors.length})</p>
                  </div>
                  <div className="divide-y divide-red-50 max-h-44 overflow-y-auto">
                    {result.errors.map((err, i) => (
                      <div key={i} className="px-4 py-2.5 flex items-start gap-2 text-xs">
                        <span className="font-semibold text-slate-700 shrink-0 min-w-0 truncate max-w-[120px]">{err.row}</span>
                        <span className="text-red-500 flex-1">{err.reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-1">
                <Button variant="outline" className="flex-1" onClick={reset}>Import more</Button>
                <Button className="flex-1" onClick={() => { reset(); setOpen(false); }}>Done</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
