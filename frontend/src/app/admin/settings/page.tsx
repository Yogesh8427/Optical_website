'use client';
import { useEffect, useState } from 'react';
import { useSettings, useUpdateSettings } from '@/hooks/useSettings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Plus, X } from 'lucide-react';
import Image from 'next/image';

export default function SettingsPage() {
  const { data } = useSettings();
  const update = useUpdateSettings();
  const settings = data?.data;

  const [form, setForm] = useState({
    storeName: '', whatsappNumber: '', phone: '', email: '', address: '',
    businessHours: '', googleMapsUrl: '',
    facebook: '', instagram: '', twitter: '', youtube: '',
    seoTitle: '', seoDescription: '',
    aboutHeading: '', aboutSubheading: '', aboutBody: '', aboutMission: '', aboutVision: '',
  });
  const [highlights, setHighlights] = useState<string[]>(['']);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  useEffect(() => {
    if (!settings) return;
    setForm({
      storeName: settings.storeName ?? '',
      whatsappNumber: settings.whatsappNumber ?? '',
      phone: settings.phone ?? '',
      email: settings.email ?? '',
      address: settings.address ?? '',
      businessHours: settings.businessHours ?? '',
      googleMapsUrl: settings.googleMapsUrl ?? '',
      facebook: settings.socialLinks?.facebook ?? '',
      instagram: settings.socialLinks?.instagram ?? '',
      twitter: settings.socialLinks?.twitter ?? '',
      youtube: settings.socialLinks?.youtube ?? '',
      seoTitle: settings.seoDefaults?.title ?? '',
      seoDescription: settings.seoDefaults?.description ?? '',
      aboutHeading: settings.aboutContent?.heading ?? '',
      aboutSubheading: settings.aboutContent?.subheading ?? '',
      aboutBody: settings.aboutContent?.body ?? '',
      aboutMission: settings.aboutContent?.mission ?? '',
      aboutVision: settings.aboutContent?.vision ?? '',
    });
    setHighlights(settings.aboutContent?.highlights?.length ? settings.aboutContent.highlights : ['']);
  }, [settings]);

  function set(key: string, value: string) { setForm((f) => ({ ...f, [key]: value })); }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    fd.append('storeName', form.storeName);
    fd.append('whatsappNumber', form.whatsappNumber);
    fd.append('phone', form.phone);
    fd.append('email', form.email);
    fd.append('address', form.address);
    fd.append('businessHours', form.businessHours);
    fd.append('googleMapsUrl', form.googleMapsUrl);
    fd.append('socialLinks', JSON.stringify({ facebook: form.facebook, instagram: form.instagram, twitter: form.twitter, youtube: form.youtube }));
    fd.append('seoDefaults', JSON.stringify({ title: form.seoTitle, description: form.seoDescription }));
    fd.append('aboutContent', JSON.stringify({
      heading: form.aboutHeading,
      subheading: form.aboutSubheading,
      body: form.aboutBody,
      mission: form.aboutMission,
      vision: form.aboutVision,
      highlights: highlights.filter(Boolean),
    }));
    if (logoFile) fd.append('logo', logoFile);

    update.mutate(fd, {
      onSuccess: () => toast.success('Settings saved'),
      onError: () => toast.error('Failed to save'),
    });
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <h1 className="text-xl md:text-2xl font-bold text-slate-800">Settings</h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ── Row 1: Store Info + Contact ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Store Info */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-slate-800 text-base">🏪 Store Info</h2>
            <div><Label>Store Name</Label><Input value={form.storeName} onChange={(e) => set('storeName', e.target.value)} className="mt-1" /></div>
            <div>
              <Label>Logo</Label>
              {/* Current logo preview */}
              {settings?.logo && !logoFile && (
                <div className="mt-2 mb-2 flex items-center gap-3">
                  <div className="border border-slate-200 rounded-xl p-2 bg-slate-50">
                    <Image src={settings.logo} alt="Current logo" width={120} height={40} className="h-10 w-auto object-contain" />
                  </div>
                  <span className="text-xs text-slate-400">Current logo</span>
                </div>
              )}
              {/* New file selected preview */}
              {logoFile && (
                <div className="mt-2 mb-2 flex items-center gap-3">
                  <div className="border border-blue-200 rounded-xl p-2 bg-blue-50">
                    <img src={URL.createObjectURL(logoFile)} alt="New logo" className="h-10 w-auto object-contain max-w-[120px]" />
                  </div>
                  <div>
                    <span className="text-xs text-blue-600 font-medium">New logo selected</span>
                    <button type="button" onClick={() => setLogoFile(null)} className="block text-xs text-slate-400 hover:text-red-500 underline mt-0.5">Remove</button>
                  </div>
                </div>
              )}
              <Input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)} className="mt-1" />
              <p className="text-xs text-slate-400 mt-1">Recommended: PNG with transparent background, max 500×200px</p>
            </div>
            <div><Label>Address</Label><Textarea value={form.address} onChange={(e) => set('address', e.target.value)} className="mt-1" rows={2} /></div>
            <div><Label>Google Maps URL</Label><Input value={form.googleMapsUrl} onChange={(e) => set('googleMapsUrl', e.target.value)} className="mt-1" placeholder="https://maps.google.com/..." /></div>
          </div>

          {/* Contact Details */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-slate-800 text-base">📞 Contact Details</h2>
            <div><Label>WhatsApp Number (with country code)</Label><Input value={form.whatsappNumber} onChange={(e) => set('whatsappNumber', e.target.value)} placeholder="919876543210" className="mt-1" /></div>
            <div><Label>Phone Number</Label><Input value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+91 98765 43210" className="mt-1" /></div>
            <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} className="mt-1" /></div>
            <div><Label>Business Hours</Label><Input value={form.businessHours} onChange={(e) => set('businessHours', e.target.value)} placeholder="Mon – Sat: 10am – 8pm" className="mt-1" /></div>
          </div>
        </div>

        {/* ── Row 2: Social Links + SEO ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Social Links */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-slate-800 text-base">🔗 Social Links</h2>
            {(['facebook', 'instagram', 'twitter', 'youtube'] as const).map((s) => (
              <div key={s}>
                <Label className="capitalize">{s}</Label>
                <Input value={form[s]} onChange={(e) => set(s, e.target.value)} className="mt-1" placeholder={`https://${s}.com/...`} />
              </div>
            ))}
          </div>

          {/* SEO */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-slate-800 text-base">🔍 SEO Defaults</h2>
            <div><Label>Default Title</Label><Input value={form.seoTitle} onChange={(e) => set('seoTitle', e.target.value)} className="mt-1" /></div>
            <div><Label>Default Description</Label><Textarea value={form.seoDescription} onChange={(e) => set('seoDescription', e.target.value)} className="mt-1" rows={5} /></div>
          </div>
        </div>

        {/* ── Row 3: About Page (full width) ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-slate-800 text-base">📄 About Page Content</h2>
          <p className="text-xs text-slate-400">This content appears on the public About Us page.</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div><Label>Page Heading</Label><Input value={form.aboutHeading} onChange={(e) => set('aboutHeading', e.target.value)} placeholder="About Our Store" className="mt-1" /></div>
            <div><Label>Subheading / Tagline</Label><Input value={form.aboutSubheading} onChange={(e) => set('aboutSubheading', e.target.value)} placeholder="A short tagline" className="mt-1" /></div>
            <div><Label>Our Mission</Label><Textarea value={form.aboutMission} onChange={(e) => set('aboutMission', e.target.value)} className="mt-1" rows={3} placeholder="What drives your store..." /></div>
            <div><Label>Our Vision</Label><Textarea value={form.aboutVision} onChange={(e) => set('aboutVision', e.target.value)} className="mt-1" rows={3} placeholder="Where you want to be..." /></div>
          </div>

          <div>
            <Label>Main Content</Label>
            <Textarea value={form.aboutBody} onChange={(e) => set('aboutBody', e.target.value)} className="mt-1" rows={4} placeholder="Tell customers about your store, history, values..." />
          </div>

          {/* Highlights */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Why Choose Us (bullet points)</Label>
              <Button type="button" variant="outline" size="sm" onClick={() => setHighlights((h) => [...h, ''])}>
                <Plus className="w-3 h-3 mr-1" /> Add Point
              </Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              {highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input value={h} onChange={(e) => setHighlights((arr) => arr.map((v, idx) => idx === i ? e.target.value : v))} placeholder="e.g. Wide range of frames" />
                  {highlights.length > 1 && (
                    <button type="button" onClick={() => setHighlights((arr) => arr.filter((_, idx) => idx !== i))}>
                      <X className="w-4 h-4 text-red-400 hover:text-red-600" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <Button type="submit" disabled={update.isPending} size="lg" className="w-full">
          {update.isPending ? 'Saving...' : 'Save All Settings'}
        </Button>
      </form>
    </div>
  );
}
