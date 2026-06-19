'use client';
import { useEffect } from 'react';
import { useSettings } from '@/hooks/useSettings';

/**
 * Updates document.title dynamically once settings are loaded.
 * Falls back to the static metadata title if settings aren't available.
 */
export default function DynamicTitle() {
  const { data } = useSettings();
  const storeName = data?.data?.storeName;

  useEffect(() => {
    if (storeName && storeName !== 'OptiVision') {
      document.title = `${storeName} — Premium Eyewear`;
    }
  }, [storeName]);

  return null;
}
