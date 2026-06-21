'use client';
import { useEffect } from 'react';
import { useSettings } from '@/hooks/useSettings';

/** Convert hex (#rrggbb) to { r, g, b } */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return null;
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

/** Darken a hex color by a factor (0–1) */
function darken(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const r = Math.max(0, Math.round(rgb.r * (1 - amount)));
  const g = Math.max(0, Math.round(rgb.g * (1 - amount)));
  const b = Math.max(0, Math.round(rgb.b * (1 - amount)));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/** Lighten a hex color toward white by amount (0–1) */
function lighten(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const r = Math.min(255, Math.round(rgb.r + (255 - rgb.r) * amount));
  const g = Math.min(255, Math.round(rgb.g + (255 - rgb.g) * amount));
  const b = Math.min(255, Math.round(rgb.b + (255 - rgb.b) * amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/** rgba string from hex + alpha */
function rgba(hex: string, alpha: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

function buildCSS(primary: string, secondary: string): string {
  const primaryDark   = darken(primary, 0.15);
  const primaryDarker = darken(primary, 0.25);
  const primaryLight  = lighten(primary, 0.92);
  const primaryLight2 = lighten(primary, 0.85);
  const primaryMid    = lighten(primary, 0.55);
  const primaryShadow = rgba(primary, 0.3);
  const primaryBorder = lighten(primary, 0.6);
  const primaryBorder2= lighten(primary, 0.75);

  const secondaryDark  = darken(secondary, 0.15);
  const secondaryLight = lighten(secondary, 0.88);

  return `
    /* ── Primary colour overrides ─────────────────────────── */
    .bg-blue-600  { background-color: ${primary}     !important; }
    .bg-blue-700  { background-color: ${primaryDark} !important; }
    .bg-blue-50   { background-color: ${primaryLight}  !important; }
    .bg-blue-100  { background-color: ${primaryLight2} !important; }
    .text-blue-600 { color: ${primary}     !important; }
    .text-blue-700 { color: ${primaryDark} !important; }
    .text-blue-400 { color: ${primaryMid}  !important; }
    .border-blue-600 { border-color: ${primary}       !important; }
    .border-blue-300 { border-color: ${primaryBorder}  !important; }
    .border-blue-200 { border-color: ${primaryBorder2} !important; }
    .ring-blue-500   { --tw-ring-color: ${primary}    !important; }
    .hover\\:bg-blue-600:hover  { background-color: ${primary}      !important; }
    .hover\\:bg-blue-700:hover  { background-color: ${primaryDark}  !important; }
    .hover\\:text-blue-600:hover{ color: ${primary}    !important; }
    .hover\\:border-blue-300:hover { border-color: ${primaryBorder} !important; }
    .focus\\:ring-blue-500:focus   { --tw-ring-color: ${primary}    !important; }
    .shadow-blue-600\\/30          { --tw-shadow-color: ${primaryShadow} !important; }
    .bg-blue-600\\/10 { background-color: ${rgba(primary, 0.1)} !important; }

    /* ── Secondary colour overrides ───────────────────────── */
    .bg-slate-600   { background-color: ${secondary}     !important; }
    .bg-slate-700   { background-color: ${secondaryDark} !important; }
    .text-slate-600 { color: ${secondary}               !important; }
    .bg-slate-50    { background-color: ${secondaryLight} !important; }
    .border-slate-600 { border-color: ${secondary}       !important; }

    /* ── CSS custom properties (for inline-style usage) ───── */
    :root {
      --theme-primary:         ${primary};
      --theme-primary-dark:    ${primaryDark};
      --theme-primary-darker:  ${primaryDarker};
      --theme-primary-light:   ${primaryLight};
      --theme-primary-shadow:  ${primaryShadow};
      --theme-secondary:       ${secondary};
      --theme-secondary-dark:  ${secondaryDark};
      --theme-secondary-light: ${secondaryLight};
    }
  `;
}

export default function ThemeProvider() {
  const { data } = useSettings();
  const primary   = data?.data?.primaryColor   || '#2563eb';
  const secondary = data?.data?.secondaryColor || '#64748b';
  const accent    = ((data?.data ?? {}) as Record<string, string>)['accentColor'] || '#f59e0b';

  useEffect(() => {
    // Remove old injected style
    const old = document.getElementById('__theme_override__');
    if (old) old.remove();

    // Blue default — no override needed
    if (primary === '#2563eb' && secondary === '#64748b') return;

    // Also set accent CSS var directly
    document.documentElement.style.setProperty('--theme-accent', accent);

    const style = document.createElement('style');
    style.id = '__theme_override__';
    style.textContent = buildCSS(primary, secondary);
    document.head.appendChild(style);

    return () => { document.getElementById('__theme_override__')?.remove(); };
  }, [primary, secondary, accent]);

  return null;
}
