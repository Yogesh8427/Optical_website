'use client';
import { useEffect, useRef } from 'react';

interface Props {
  value: string;
  size?: number;
}

export default function ClaimQrCode({ value, size = 180 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    async function generate() {
      try {
        const QRCode = (await import('qrcode')).default;
        if (canvasRef.current) {
          await QRCode.toCanvas(canvasRef.current, value, {
            width: size,
            margin: 2,
            color: { dark: '#1e293b', light: '#ffffff' },
          });
        }
      } catch (err) {
        console.error('QR generation failed', err);
      }
    }
    generate();
  }, [value, size]);

  return (
    <canvas
      ref={canvasRef}
      className="rounded-xl mx-auto"
      style={{ width: size, height: size }}
    />
  );
}
