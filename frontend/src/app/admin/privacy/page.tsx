'use client';
import { useEffect, useState } from 'react';
import { useSettings, useUpdateSettings } from '@/hooks/useSettings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type Section = { title: string; content: string };

const DUMMY_SECTIONS: Section[] = [
  { title: 'Introduction', content: 'We are committed to protecting your personal information. This Privacy Policy explains what data we collect, how we use it, and your rights regarding your information.' },
  { title: 'Information We Collect', content: 'We collect information you provide when submitting an inquiry: your name, phone number, email address, city, and eye prescription details (if applicable). We may also collect basic usage data such as pages visited.' },
  { title: 'How We Use Your Information', content: 'Your information is used solely to respond to your inquiry and provide you with a customised quotation. We may contact you via phone or WhatsApp to follow up on your inquiry.' },
  { title: 'Data Sharing', content: 'We do not sell, trade, or transfer your personal information to third parties. Your data is only accessible to our staff who need it to process your inquiry.' },
  { title: 'Data Security', content: 'We implement industry-standard security measures to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.' },
  { title: 'Cookies', content: 'Our website may use cookies to enhance your browsing experience. You can choose to disable cookies through your browser settings, though this may affect some functionality.' },
  { title: 'Your Rights', content: 'You have the right to request access to, correction of, or deletion of your personal data. To exercise these rights, please contact us through the Contact page.' },
  { title: 'Contact Us', content: 'If you have any questions about this Privacy Policy or how we handle your data, please contact us via the Contact page or WhatsApp.' },
];

export default function PrivacyAdminPage() {
  const { data, isLoading } = useSettings();
  const update = useUpdateSettings();
  const [sections, setSections] = useState<Section[]>(DUMMY_SECTIONS);
  const [saving, setSaving] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!data || hydrated) return;
    const raw = data?.data?.privacyContent;
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
    fd.append('privacyContent', JSON.stringify(sections));
    update.mutate(fd, {
      onSuccess: () => { toast.success('Privacy Policy saved'); setSaving(false); },
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
          <h1 className="text-xl md:text-2xl font-bold text-slate-800">Privacy Policy</h1>
          <p className="text-sm text-slate-400 mt-1">Edit what appears on the public Privacy Policy page</p>
        </div>
        <a href="/privacy-policy" target="_blank" className="text-xs text-blue-600 hover:underline">Preview page ↗</a>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {sections.map((sec, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider w-20 shrink-0">Section {i + 1}</span>
              <Input
                placeholder="Section title (e.g. Information We Collect)"
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
            {saving ? 'Saving…' : 'Save Privacy Policy'}
          </Button>
        </div>
      </form>
    </div>
  );
}
