import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import { Toaster } from '@/components/ui/sonner';
import { LanguageProvider } from '@/contexts/LanguageContext';
import ThemeProvider from '@/components/ThemeProvider';
import DynamicTitle from '@/components/DynamicTitle';
import PwaInstallPrompt from '@/components/PwaInstallPrompt';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'OptiVision — Premium Eyewear',
  description: 'Browse our collection of premium eyewear frames. Customize lenses and get a personalized quote.',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico',  sizes: 'any' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'OptiVision',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    viewportFit: 'cover',
  },
  themeColor: '#2563eb',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} antialiased`}>
      <body className="min-h-screen flex flex-col bg-slate-950" suppressHydrationWarning>
        <LanguageProvider>
          <Providers>
            <ThemeProvider />
            <DynamicTitle />
            {children}
            <Toaster richColors position="top-right" />
            <PwaInstallPrompt />
          </Providers>
        </LanguageProvider>
      </body>
    </html>
  );
}
