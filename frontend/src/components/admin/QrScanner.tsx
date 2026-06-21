'use client';
import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

interface Props {
  onScan: (result: string) => void;
  onClose: () => void;
}

export default function QrScanner({ onScan, onClose }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<unknown>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let html5QrCode: any = null;

    async function startScanner() {
      try {
        const { Html5Qrcode } = await import('html5-qrcode');
        html5QrCode = new Html5Qrcode('qr-scanner-container');
        scannerRef.current = html5QrCode;
        await html5QrCode.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (text: string) => {
            // Extract CLM- code if full URL scanned
            const match = text.match(/CLM-[A-Z0-9]+/);
            onScan(match ? match[0] : text);
          },
          () => {} // ignore scan errors
        );
      } catch (err) {
        const e = err as { name?: string };
        if (e?.name === 'NotFoundError') {
          setError('No camera found on this device. Use the Claim ID text box instead.');
        } else if (e?.name === 'NotAllowedError') {
          setError('Camera permission denied. Allow camera access in browser settings and try again.');
        } else {
          setError('Camera unavailable. Type the Claim ID manually instead.');
        }
      }
    }

    startScanner();

    return () => {
      if (html5QrCode) {
        html5QrCode.stop().catch(() => {});
      }
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-800">Scan Claim QR Code</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error ? (
          <div className="text-center py-8 text-red-500 text-sm">{error}</div>
        ) : (
          <div
            id="qr-scanner-container"
            ref={containerRef}
            className="w-full rounded-xl overflow-hidden bg-black"
            style={{ minHeight: 280 }}
          />
        )}

        <p className="text-slate-400 text-xs text-center mt-3">
          Point camera at the customer's QR code
        </p>
      </div>
    </div>
  );
}
