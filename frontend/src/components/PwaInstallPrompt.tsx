'use client';
import { useEffect, useState } from 'react';
import { X, Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Don't show if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) return;
    // Don't show if dismissed before
    if (sessionStorage.getItem('pwa-dismissed')) return;

    function handler(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    }

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  async function install() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setVisible(false);
    setDeferredPrompt(null);
  }

  function dismiss() {
    sessionStorage.setItem('pwa-dismissed', '1');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-20 left-3 right-3 md:left-auto md:right-6 md:bottom-6 md:w-80 z-50 animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0"
          style={{ background: 'color-mix(in srgb, var(--theme-primary, #2563eb) 12%, white)' }}>
          <Download className="w-5 h-5" style={{ color: 'var(--theme-primary, #2563eb)' }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-slate-800 text-sm">Add to Home Screen</p>
          <p className="text-xs text-slate-500 mt-0.5">Install our app for quick access anytime</p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={install}
              className="flex-1 text-white text-xs font-semibold py-2 rounded-xl transition-all"
              style={{ background: 'var(--theme-primary, #2563eb)' }}
            >
              Install
            </button>
            <button
              onClick={dismiss}
              className="px-3 text-xs font-semibold text-slate-500 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-all"
            >
              Not now
            </button>
          </div>
        </div>
        <button onClick={dismiss} className="text-slate-400 hover:text-slate-600 shrink-0">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
