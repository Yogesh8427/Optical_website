'use client';
import { useEffect, useState } from 'react';
import { useSettings, useUpdateSettings } from '@/hooks/useSettings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type Section = { title: string; content: string };

const DUMMY_SECTIONS: Section[] = [
  { title: 'Acceptance of Terms', content: 'By accessing and using this website, you accept and agree to be bound by the terms and provisions of this agreement. This is an inquiry-based platform — no financial transactions are processed directly on this website.' },
  { title: 'Use of the Website', content: 'You may browse products, submit inquiries, and contact us via WhatsApp. You agree not to misuse this platform or submit false information. Any abuse will result in removal of access.' },
  { title: 'Product Information', content: 'All product descriptions, images, and specifications are provided for informational purposes. We strive to ensure accuracy, but we do not warrant that product descriptions or other content is accurate, complete, or error-free.' },
  { title: 'Pricing', content: 'All prices shown are indicative and subject to change without notice. Final pricing is confirmed during your WhatsApp consultation with our team.' },
  { title: 'Intellectual Property', content: 'All content on this website, including text, graphics, logos, and images, is the property of the store and protected by applicable intellectual property laws. Unauthorised use is prohibited.' },
  { title: 'Limitation of Liability', content: 'We shall not be liable for any indirect, incidental, or consequential damages arising from your use of this website or inability to access it.' },
  { title: 'Changes to Terms', content: 'We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Continued use of the website constitutes your acceptance of the revised terms.' },
  { title: 'Contact Us', content: 'If you have any questions about these Terms & Conditions, please contact us through the Contact page or via WhatsApp.' },
];

export default function TermsAdminPage() {
  const { data, isLoading } = useSettings();
  const update = useUpdateSettings();
  const [sections, setSections] = useState<Section[]>(DUMMY_SECTIONS);
  const [saving, setSaving] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!data || hydrated) return;
    const raw = data?.data?.termsContent;
    try {
      const parsed = JSON.parse(raw || '[]');
      if (Array.isArray(parsed) && parsed.length) setSections(parsed);
      else setSections(DUMMY_SECTIONS);
    } catch { setSections(DUMMY_SECTIONS); }
    setHydrated(true);
  }, [data, hydrated]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData();
    fd.append('termsContent', JSON.stringify(sections));
    update.mutate(fd, {
      onSuccess: () => { toast.success('Terms & Conditions saved'); setSaving(false); },
      onError: () => { toast.error('Failed to save'); setSaving(false); },
    });
  }

  function updateSection(i: number, field: keyof Section, value: string) {
    setSections(s => s.map((r, idx) => idx === i ? { ...r, [field]: value } : r));
  }

  if (isLoading) return <div className="py-20 text-center text-slate-400 text-sm">Loading…</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800">Terms &amp; Conditions</h1>
          <p className="text-sm text-slate-400 mt-1">Edit what appears on the public Terms page</p>
        </div>
        <a href="/terms" target="_blank" className="text-xs text-blue-600 hover:underline">Preview page ↗</a>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {sections.map((sec, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider w-20 shrink-0">Section {i + 1}</span>
              <Input
                placeholder="Section title (e.g. Use of Website)"
                value={sec.title}
                onChange={(e) => updateSection(i, 'title', e.target.value)}
                className="flex-1"
              />
              {sections.length > 1 && (
                <button type="button" onClick={() => setSections(s => s.filter((_, idx) => idx !== i))}
                  className="text-slate-300 hover:text-red-500 transition-colors shrink-0">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="pl-[88px]">
              <Textarea
                rows={4}
                placeholder="Section content..."
                value={sec.content}
                onChange={(e) => updateSection(i, 'content', e.target.value)}
              />
            </div>
          </div>
        ))}

        <Button type="button" variant="outline" className="w-full gap-2"
          onClick={() => setSections(s => [...s, { title: '', content: '' }])}>
          <Plus className="w-4 h-4" /> Add Section
        </Button>

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={saving} className="gap-1.5">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving…' : 'Save Terms'}
          </Button>
        </div>
      </form>
    </div>
  );
}
