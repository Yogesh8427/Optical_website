'use client';
import { useEffect, useState } from 'react';
import { useSettings, useUpdateSettings } from '@/hooks/useSettings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Plus, X, Save, Loader2 } from 'lucide-react';
import Image from 'next/image';

/* ─── tiny save-button component ─────────────────────────────────── */
function SaveBtn({ pending, label = 'Save' }: { pending: boolean; label?: string }) {
  return (
    <div className="pt-2 flex justify-end">
      <Button type="submit" disabled={pending} size="sm" className="gap-1.5">
        {pending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
        {pending ? 'Saving…' : label}
      </Button>
    </div>
  );
}

export default function SettingsPage() {
  const { data } = useSettings();
  const update = useUpdateSettings();
  const settings = data?.data;

  /* ── per-section state ─────────────────────────────────────────── */
  const [store, setStore] = useState({
    storeName: '', address: '', googleMapsUrl: '',
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const [theme, setTheme] = useState({
    primaryColor: '#2563eb', secondaryColor: '#64748b',
  });

  const [contact, setContact] = useState({
    whatsappNumber: '', phone: '', email: '', businessHours: '',
  });

  const [social, setSocial] = useState({
    facebook: '', instagram: '', twitter: '', youtube: '',
  });

  const [seo, setSeo] = useState({ seoTitle: '', seoDescription: '' });

  const [about, setAbout] = useState({
    aboutHeading: '', aboutSubheading: '', aboutBody: '',
    aboutMission: '', aboutVision: '',
  });
  const [highlights, setHighlights] = useState<string[]>(['']);

  /* ── saving state per section ──────────────────────────────────── */
  const [saving, setSaving] = useState({
    store: false, theme: false, contact: false,
    social: false, seo: false, about: false,
  });

  /* ── hydrate from API ─────────────────────────────────────────── */
  useEffect(() => {
    if (!settings) return;
    setStore({
      storeName: settings.storeName ?? '',
      address: settings.address ?? '',
      googleMapsUrl: settings.googleMapsUrl ?? '',
    });
    setTheme({
      primaryColor: settings.primaryColor ?? '#2563eb',
      secondaryColor: settings.secondaryColor ?? '#64748b',
    });
    setContact({
      whatsappNumber: settings.whatsappNumber ?? '',
      phone: settings.phone ?? '',
      email: settings.email ?? '',
      businessHours: settings.businessHours ?? '',
    });
    setSocial({
      facebook: settings.socialLinks?.facebook ?? '',
      instagram: settings.socialLinks?.instagram ?? '',
      twitter: settings.socialLinks?.twitter ?? '',
      youtube: settings.socialLinks?.youtube ?? '',
    });
    setSeo({
      seoTitle: settings.seoDefaults?.title ?? '',
      seoDescription: settings.seoDefaults?.description ?? '',
    });
    setAbout({
      aboutHeading: settings.aboutContent?.heading ?? '',
      aboutSubheading: settings.aboutContent?.subheading ?? '',
      aboutBody: settings.aboutContent?.body ?? '',
      aboutMission: settings.aboutContent?.mission ?? '',
      aboutVision: settings.aboutContent?.vision ?? '',
    });
    setHighlights(
      settings.aboutContent?.highlights?.length
        ? settings.aboutContent.highlights
        : [''],
    );
  }, [settings]);

  /* ── helpers ───────────────────────────────────────────────────── */
  function setSec<T>(setter: React.Dispatch<React.SetStateAction<T>>) {
    return (key: keyof T, value: string) =>
      setter((prev) => ({ ...prev, [key]: value }));
  }

  function mutate(section: keyof typeof saving, fd: FormData) {
    setSaving((s) => ({ ...s, [section]: true }));
    update.mutate(fd, {
      onSuccess: () => {
        toast.success('Saved!');
        setSaving((s) => ({ ...s, [section]: false }));
      },
      onError: () => {
        toast.error('Failed to save');
        setSaving((s) => ({ ...s, [section]: false }));
      },
    });
  }

  /* ── section save handlers ────────────────────────────────────── */
  function saveStore(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    fd.append('storeName', store.storeName);
    fd.append('address', store.address);
    fd.append('googleMapsUrl', store.googleMapsUrl);
    if (logoFile) fd.append('logo', logoFile);
    mutate('store', fd);
  }

  function saveTheme(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    fd.append('primaryColor', theme.primaryColor);
    fd.append('secondaryColor', theme.secondaryColor);
    mutate('theme', fd);
  }

  function saveContact(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    fd.append('whatsappNumber', contact.whatsappNumber);
    fd.append('phone', contact.phone);
    fd.append('email', contact.email);
    fd.append('businessHours', contact.businessHours);
    mutate('contact', fd);
  }

  function saveSocial(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    fd.append('socialLinks', JSON.stringify({
      facebook: social.facebook, instagram: social.instagram,
      twitter: social.twitter, youtube: social.youtube,
    }));
    mutate('social', fd);
  }

  function saveSEO(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    fd.append('seoDefaults', JSON.stringify({
      title: seo.seoTitle, description: seo.seoDescription,
    }));
    mutate('seo', fd);
  }

  function saveAbout(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    fd.append('aboutContent', JSON.stringify({
      heading: about.aboutHeading,
      subheading: about.aboutSubheading,
      body: about.aboutBody,
      mission: about.aboutMission,
      vision: about.aboutVision,
      highlights: highlights.filter(Boolean),
    }));
    mutate('about', fd);
  }

  const setS = setSec(setStore);
  const setT = setSec(setTheme);
  const setC = setSec(setContact);
  const setSo = setSec(setSocial);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <h1 className="text-xl md:text-2xl font-bold text-slate-800">Settings</h1>

      {/* ── Row 1: Store Info + Contact ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Store Info */}
        <form onSubmit={saveStore} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-slate-800 text-base">🏪 Store Info</h2>

          <div>
            <Label>Store Name</Label>
            <Input value={store.storeName} onChange={(e) => setS('storeName', e.target.value)} className="mt-1" />
          </div>

          <div>
            <Label>Logo</Label>
            {settings?.logo && !logoFile && (
              <div className="mt-2 mb-2 flex items-center gap-3">
                <div className="border border-slate-200 rounded-xl p-2 bg-slate-50">
                  <Image src={settings.logo} alt="Current logo" width={120} height={40} className="h-10 w-auto object-contain" />
                </div>
                <span className="text-xs text-slate-400">Current logo</span>
              </div>
            )}
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

          <div>
            <Label>Address</Label>
            <Textarea value={store.address} onChange={(e) => setS('address', e.target.value)} className="mt-1" rows={2} />
          </div>

          <div>
            <Label>Google Maps URL</Label>
            <Input value={store.googleMapsUrl} onChange={(e) => setS('googleMapsUrl', e.target.value)} className="mt-1" placeholder="https://maps.google.com/..." />
          </div>

          <SaveBtn pending={saving.store} label="Save Store Info" />
        </form>

        {/* Contact Details */}
        <form onSubmit={saveContact} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-slate-800 text-base">📞 Contact Details</h2>

          <div>
            <Label>WhatsApp Number (with country code)</Label>
            <Input value={contact.whatsappNumber} onChange={(e) => setC('whatsappNumber', e.target.value)} placeholder="919876543210" className="mt-1" />
          </div>
          <div>
            <Label>Phone Number</Label>
            <Input value={contact.phone} onChange={(e) => setC('phone', e.target.value)} placeholder="+91 98765 43210" className="mt-1" />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" value={contact.email} onChange={(e) => setC('email', e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>Business Hours</Label>
            <Input value={contact.businessHours} onChange={(e) => setC('businessHours', e.target.value)} placeholder="Mon – Sat: 10am – 8pm" className="mt-1" />
          </div>

          <SaveBtn pending={saving.contact} label="Save Contact" />
        </form>
      </div>

      {/* ── Theme Colours (full width) ───────────────────────── */}
      <form onSubmit={saveTheme} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
        <div className="flex items-start justify-between flex-wrap gap-2">
          <div>
            <h2 className="font-semibold text-slate-800 text-base">🎨 Theme Colours</h2>
            <p className="text-xs text-slate-400 mt-0.5">Pick any colour — the entire website updates after saving</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Primary */}
          <div className="rounded-xl border border-slate-200 p-4 space-y-2">
            <p className="text-xs font-semibold text-slate-600">Primary Colour</p>
            <p className="text-xs text-slate-400">Buttons, links, active states</p>
            <div className="flex items-center gap-3 mt-2">
              <div className="relative w-12 h-10 rounded-lg overflow-hidden border border-slate-200 shrink-0 cursor-pointer">
                <input
                  type="color"
                  value={theme.primaryColor}
                  onChange={(e) => setT('primaryColor', e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="w-full h-full rounded-lg" style={{ backgroundColor: theme.primaryColor }} />
              </div>
              <input
                type="text"
                value={theme.primaryColor}
                onChange={(e) => { if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) setT('primaryColor', e.target.value); }}
                className="flex-1 border border-slate-200 rounded-lg px-2 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={7}
                placeholder="#2563eb"
              />
            </div>
            <div className="flex gap-1.5 flex-wrap mt-1">
              {['#2563eb','#9333ea','#16a34a','#ea580c','#e11d48','#0d9488','#dc2626','#d97706'].map((c) => (
                <button key={c} type="button" onClick={() => setT('primaryColor', c)}
                  className="w-6 h-6 rounded-full border-2 transition-all hover:scale-110"
                  style={{ backgroundColor: c, borderColor: theme.primaryColor === c ? '#1e293b' : 'transparent' }}
                  title={c}
                />
              ))}
            </div>
          </div>

          {/* Secondary */}
          <div className="rounded-xl border border-slate-200 p-4 space-y-2">
            <p className="text-xs font-semibold text-slate-600">Secondary Colour</p>
            <p className="text-xs text-slate-400">Accents, badges, subtle elements</p>
            <div className="flex items-center gap-3 mt-2">
              <div className="relative w-12 h-10 rounded-lg overflow-hidden border border-slate-200 shrink-0 cursor-pointer">
                <input
                  type="color"
                  value={theme.secondaryColor}
                  onChange={(e) => setT('secondaryColor', e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="w-full h-full rounded-lg" style={{ backgroundColor: theme.secondaryColor }} />
              </div>
              <input
                type="text"
                value={theme.secondaryColor}
                onChange={(e) => { if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) setT('secondaryColor', e.target.value); }}
                className="flex-1 border border-slate-200 rounded-lg px-2 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={7}
                placeholder="#64748b"
              />
            </div>
            <div className="flex gap-1.5 flex-wrap mt-1">
              {['#64748b','#6b7280','#78716c','#854d0e','#166534','#1e3a5f','#7c3aed','#be185d'].map((c) => (
                <button key={c} type="button" onClick={() => setT('secondaryColor', c)}
                  className="w-6 h-6 rounded-full border-2 transition-all hover:scale-110"
                  style={{ backgroundColor: c, borderColor: theme.secondaryColor === c ? '#1e293b' : 'transparent' }}
                  title={c}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Live preview bar */}
        <div className="rounded-xl overflow-hidden border border-slate-100 flex h-10">
          <div className="flex-1 flex items-center justify-center text-white text-xs font-semibold" style={{ backgroundColor: theme.primaryColor }}>Primary</div>
          <div className="flex-1 flex items-center justify-center text-white text-xs font-semibold" style={{ backgroundColor: theme.secondaryColor }}>Secondary</div>
          <div className="flex-1 flex items-center justify-center text-xs font-semibold" style={{ backgroundColor: theme.primaryColor + '18', color: theme.primaryColor }}>Light BG</div>
        </div>

        <SaveBtn pending={saving.theme} label="Save Theme" />
      </form>

      {/* ── Row 2: Social Links + SEO ───────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Social Links */}
        <form onSubmit={saveSocial} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-slate-800 text-base">🔗 Social Links</h2>
          {(['facebook', 'instagram', 'twitter', 'youtube'] as const).map((s) => (
            <div key={s}>
              <Label className="capitalize">{s}</Label>
              <Input value={social[s]} onChange={(e) => setSo(s, e.target.value)} className="mt-1" placeholder={`https://${s}.com/...`} />
            </div>
          ))}
          <SaveBtn pending={saving.social} label="Save Social Links" />
        </form>

        {/* SEO */}
        <form onSubmit={saveSEO} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-slate-800 text-base">🔍 SEO Defaults</h2>
          <div>
            <Label>Default Title</Label>
            <Input value={seo.seoTitle} onChange={(e) => setSeo((p) => ({ ...p, seoTitle: e.target.value }))} className="mt-1" />
          </div>
          <div>
            <Label>Default Description</Label>
            <Textarea value={seo.seoDescription} onChange={(e) => setSeo((p) => ({ ...p, seoDescription: e.target.value }))} className="mt-1" rows={5} />
          </div>
          <SaveBtn pending={saving.seo} label="Save SEO" />
        </form>
      </div>

      {/* ── About Page Content (full width) ─────────────────── */}
      <form onSubmit={saveAbout} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-slate-800 text-base">📄 About Page Content</h2>
        <p className="text-xs text-slate-400">This content appears on the public About Us page.</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <Label>Page Heading</Label>
            <Input value={about.aboutHeading} onChange={(e) => setAbout((p) => ({ ...p, aboutHeading: e.target.value }))} placeholder="About Our Store" className="mt-1" />
          </div>
          <div>
            <Label>Subheading / Tagline</Label>
            <Input value={about.aboutSubheading} onChange={(e) => setAbout((p) => ({ ...p, aboutSubheading: e.target.value }))} placeholder="A short tagline" className="mt-1" />
          </div>
          <div>
            <Label>Our Mission</Label>
            <Textarea value={about.aboutMission} onChange={(e) => setAbout((p) => ({ ...p, aboutMission: e.target.value }))} className="mt-1" rows={3} placeholder="What drives your store..." />
          </div>
          <div>
            <Label>Our Vision</Label>
            <Textarea value={about.aboutVision} onChange={(e) => setAbout((p) => ({ ...p, aboutVision: e.target.value }))} className="mt-1" rows={3} placeholder="Where you want to be..." />
          </div>
        </div>

        <div>
          <Label>Main Content</Label>
          <Textarea value={about.aboutBody} onChange={(e) => setAbout((p) => ({ ...p, aboutBody: e.target.value }))} className="mt-1" rows={4} placeholder="Tell customers about your store, history, values..." />
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
                <Input
                  value={h}
                  onChange={(e) => setHighlights((arr) => arr.map((v, idx) => idx === i ? e.target.value : v))}
                  placeholder="e.g. Wide range of frames"
                />
                {highlights.length > 1 && (
                  <button type="button" onClick={() => setHighlights((arr) => arr.filter((_, idx) => idx !== i))}>
                    <X className="w-4 h-4 text-red-400 hover:text-red-600" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <SaveBtn pending={saving.about} label="Save About Content" />
      </form>

    </div>
  );
}
