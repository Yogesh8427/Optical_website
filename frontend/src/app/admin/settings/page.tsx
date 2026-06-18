'use client';
import { useEffect, useState } from 'react';
import { useSettings, useUpdateSettings } from '@/hooks/useSettings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { data } = useSettings();
  const update = useUpdateSettings();
  const settings = data?.data;

  const [form, setForm] = useState({ storeName: '', whatsappNumber: '', email: '', address: '', facebook: '', instagram: '', twitter: '', youtube: '', googleMapsUrl: '', seoTitle: '', seoDescription: '' });
  const [logoFile, setLogoFile] = useState<File | null>(null);

  useEffect(() => {
    if (settings) {
      setForm({
        storeName: settings.storeName ?? '',
        whatsappNumber: settings.whatsappNumber ?? '',
        email: settings.email ?? '',
        address: settings.address ?? '',
        facebook: settings.socialLinks?.facebook ?? '',
        instagram: settings.socialLinks?.instagram ?? '',
        twitter: settings.socialLinks?.twitter ?? '',
        youtube: settings.socialLinks?.youtube ?? '',
        googleMapsUrl: settings.googleMapsUrl ?? '',
        seoTitle: settings.seoDefaults?.title ?? '',
        seoDescription: settings.seoDefaults?.description ?? '',
      });
    }
  }, [settings]);

  function set(key: string, value: string) { setForm((f) => ({ ...f, [key]: value })); }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    fd.append('storeName', form.storeName);
    fd.append('whatsappNumber', form.whatsappNumber);
    fd.append('email', form.email);
    fd.append('address', form.address);
    fd.append('googleMapsUrl', form.googleMapsUrl);
    fd.append('socialLinks', JSON.stringify({ facebook: form.facebook, instagram: form.instagram, twitter: form.twitter, youtube: form.youtube }));
    fd.append('seoDefaults', JSON.stringify({ title: form.seoTitle, description: form.seoDescription }));
    if (logoFile) fd.append('logo', logoFile);

    update.mutate(fd, {
      onSuccess: () => toast.success('Settings saved'),
      onError: () => toast.error('Failed to save'),
    });
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-gray-800">Store Info</h2>
          <div><Label>Store Name</Label><Input value={form.storeName} onChange={(e) => set('storeName', e.target.value)} className="mt-1" /></div>
          <div><Label>Logo</Label><Input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)} className="mt-1" /></div>
          <div><Label>WhatsApp Number (with country code)</Label><Input value={form.whatsappNumber} onChange={(e) => set('whatsappNumber', e.target.value)} placeholder="e.g. 919876543210" className="mt-1" /></div>
          <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} className="mt-1" /></div>
          <div><Label>Address</Label><Textarea value={form.address} onChange={(e) => set('address', e.target.value)} className="mt-1" rows={2} /></div>
          <div><Label>Google Maps URL</Label><Input value={form.googleMapsUrl} onChange={(e) => set('googleMapsUrl', e.target.value)} className="mt-1" /></div>
        </div>

        <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-gray-800">Social Links</h2>
          {(['facebook', 'instagram', 'twitter', 'youtube'] as const).map((s) => (
            <div key={s}><Label className="capitalize">{s}</Label><Input value={form[s]} onChange={(e) => set(s, e.target.value)} className="mt-1" placeholder={`https://${s}.com/...`} /></div>
          ))}
        </div>

        <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-gray-800">SEO Defaults</h2>
          <div><Label>Default Title</Label><Input value={form.seoTitle} onChange={(e) => set('seoTitle', e.target.value)} className="mt-1" /></div>
          <div><Label>Default Description</Label><Textarea value={form.seoDescription} onChange={(e) => set('seoDescription', e.target.value)} className="mt-1" rows={3} /></div>
        </div>

        <Button type="submit" disabled={update.isPending} size="lg">
          {update.isPending ? 'Saving...' : 'Save Settings'}
        </Button>
      </form>
    </div>
  );
}
