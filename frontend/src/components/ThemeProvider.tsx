'use client';
import { useEffect } from 'react';
import { useSettings } from '@/hooks/useSettings';

export default function ThemeProvider() {
  const { data } = useSettings();
  const themeColor = data?.data?.themeColor || 'blue';

  useEffect(() => {
    const html = document.documentElement;
    // Remove any existing theme
    html.removeAttribute('data-theme');
    // Apply new theme (blue = default, no attribute needed)
    if (themeColor && themeColor !== 'blue') {
      html.setAttribute('data-theme', themeColor);
    }
  }, [themeColor]);

  return null; // renders nothing, just applies the attribute
}
