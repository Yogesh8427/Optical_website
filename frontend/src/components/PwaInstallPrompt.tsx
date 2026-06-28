'use client';
import { useEffect, useState } from 'react';
import { X, Download, Share } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function isIosSafari() {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  const isIos = /iphone|ipad|ipod/i.test(ua);
  const isSafari = /safari/i.test(ua) && !/chrome|crios|fxios/i.test(ua);
  return isIos && isSafari;
}

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [mode, setMode] = useState<'android' | 'ios' | null>(null);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) return;
    if (sessionStorage.getItem('pwa-dismissed')) return;

    if (isIosSafari()) {
      setTimeout(() => setMode('ios'), 3000);
      return;
    }

    function handler(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setMode('android');
    }
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  function dismiss() {
    sessionStorage.setItem('pwa-dismissed', '1');
    setMode(null);
  }

  async function install() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setMode(null);
    setDeferredPrompt(null);
  }

  if (!mode) return null;

  return (
    <div className="fixed bottom-20 left-3 right-3 md:left-auto md:right-6 md:bottom-6 md:w-80 z-50 animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'color-mix(in srgb, var(--theme-primary, #2563eb) 12%, white)' }}
        >
          {mode === 'ios'
            ? <Share className="w-5 h-5" style={{ color: 'var(--theme-primary, #2563eb)' }} />
            : <Download className="w-5 h-5" style={{ color: 'var(--theme-primary, #2563eb)' }} />
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-slate-800 text-sm">Add to Home Screen</p>
          {mode === 'ios' ? (
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              Tap <strong>Share</strong> <span>⬆</span> then <strong>&ldquo;Add to Home Screen&rdquo;</strong> to install the app.
            </p>
          ) : (
            <p className="text-xs text-slate-500 mt-0.5">Install for quick access anytime</p>
          )}
          {mode === 'android' && (
            <div className="flex gap-2 mt-3">
              <button
                onClick={install}
                className="flex-1 text-white text-xs font-semibold py-2 rounded-xl"
                style={{ background: 'var(--theme-primary, #2563eb)' }}
              >
                Install
              </button>
              <button
                onClick={dismiss}
                className="px-3 text-xs font-semibold text-slate-500 py-2 rounded-xl bg-slate-100 hover:bg-slate-200"
              >
                Not now
              </button>
            </div>
          )}
          {mode === 'ios' && (
            <button onClick={dismiss} className="mt-3 text-xs font-semibold text-slate-400 hover:text-slate-600">
              Got it
            </button>
          )}
        </div>
        <button onClick={dismiss} className="text-slate-400 hover:text-slate-600 shrink-0">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
