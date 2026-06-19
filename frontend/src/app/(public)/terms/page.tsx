'use client';
import { useSettings } from '@/hooks/useSettings';

const FALLBACK = [
  { title: 'Acceptance of Terms', content: 'By accessing and using this website, you accept and agree to be bound by the terms and provisions of this agreement. This is an inquiry-based platform — no financial transactions are processed directly on this website.' },
  { title: 'Use of the Website', content: 'You may browse products, submit inquiries, and contact us via WhatsApp. You agree not to misuse this platform or submit false information. Any abuse will result in removal of access.' },
  { title: 'Product Information', content: 'All product descriptions, images, and specifications are provided for informational purposes. We strive to ensure accuracy, but we do not warrant that product descriptions or other content is accurate, complete, or error-free.' },
  { title: 'Pricing', content: 'All prices shown are indicative and subject to change without notice. Final pricing is confirmed during your WhatsApp consultation with our team.' },
  { title: 'Intellectual Property', content: 'All content on this website, including text, graphics, logos, and images, is the property of the store and protected by applicable intellectual property laws. Unauthorised use is prohibited.' },
  { title: 'Limitation of Liability', content: 'We shall not be liable for any indirect, incidental, or consequential damages arising from your use of this website or inability to access it.' },
  { title: 'Changes to Terms', content: 'We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Continued use of the website constitutes your acceptance of the revised terms.' },
  { title: 'Contact Us', content: 'If you have any questions about these Terms & Conditions, please contact us through the Contact page or via WhatsApp.' },
];

export default function TermsPage() {
  const { data, isLoading } = useSettings();
  const raw = data?.data?.termsContent;

  let sections = FALLBACK;
  try {
    const parsed = JSON.parse(raw || '[]');
    if (Array.isArray(parsed) && parsed.length) sections = parsed;
  } catch { /* use fallback */ }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms &amp; Conditions</h1>
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
