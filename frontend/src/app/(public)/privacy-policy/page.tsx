'use client';
import { useSettings } from '@/hooks/useSettings';

const FALLBACK = [
  { title: 'Introduction', content: 'We are committed to protecting your personal information. This Privacy Policy explains what data we collect, how we use it, and your rights regarding your information.' },
  { title: 'Information We Collect', content: 'We collect information you provide when submitting an inquiry: your name, phone number, email address, city, and eye prescription details (if applicable). We may also collect basic usage data such as pages visited.' },
  { title: 'How We Use Your Information', content: 'Your information is used solely to respond to your inquiry and provide you with a customised quotation. We may contact you via phone or WhatsApp to follow up on your inquiry.' },
  { title: 'Data Sharing', content: 'We do not sell, trade, or transfer your personal information to third parties. Your data is only accessible to our staff who need it to process your inquiry.' },
  { title: 'Data Security', content: 'We implement industry-standard security measures to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.' },
  { title: 'Cookies', content: 'Our website may use cookies to enhance your browsing experience. You can choose to disable cookies through your browser settings, though this may affect some functionality.' },
  { title: 'Your Rights', content: 'You have the right to request access to, correction of, or deletion of your personal data. To exercise these rights, please contact us through the Contact page.' },
  { title: 'Contact Us', content: 'If you have any questions about this Privacy Policy or how we handle your data, please contact us via the Contact page or WhatsApp.' },
];

export default function PrivacyPage() {
  const { data, isLoading } = useSettings();
  const raw = data?.data?.privacyContent;

  let sections = FALLBACK;
  try {
    const parsed = JSON.parse(raw || '[]');
    if (Array.isArray(parsed) && parsed.length) sections = parsed;
  } catch { /* use fallback */ }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
      {isLoading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-6 text-gray-600">
          {sections.map((sec, i) => (
            <div key={i}>
              {sec.title && <h2 className="text-xl font-semibold text-gray-800 mb-2">{sec.title}</h2>}
              <p className="leading-relaxed">{sec.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
