import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Terms & Conditions — OptiVision' };
export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms &amp; Conditions</h1>
      <div className="prose text-gray-600 space-y-4">
        <p>By using the OptiVision website, you agree to these terms. This is an inquiry platform — no financial transactions are processed on this website.</p>
        <h2 className="text-xl font-semibold text-gray-800">Use of the Website</h2>
        <p>You may browse products, submit inquiries, and contact us via WhatsApp. Any abuse of the platform will result in removal of access.</p>
        <h2 className="text-xl font-semibold text-gray-800">Pricing</h2>
        <p>All prices shown are indicative. Final pricing is confirmed via WhatsApp consultation.</p>
        <h2 className="text-xl font-semibold text-gray-800">Changes</h2>
        <p>We reserve the right to modify these terms at any time. Continued use of the website constitutes acceptance.</p>
      </div>
    </div>
  );
}
