import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Privacy Policy — OptiVision' };
export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
      <div className="prose text-gray-600 space-y-4">
        <p>At OptiVision, we are committed to protecting your personal information. This policy explains what data we collect and how we use it.</p>
        <h2 className="text-xl font-semibold text-gray-800">Information We Collect</h2>
        <p>We collect information you provide when submitting an inquiry: name, phone, email, city, and prescription details.</p>
        <h2 className="text-xl font-semibold text-gray-800">How We Use It</h2>
        <p>Your information is used solely to respond to your inquiry and provide you with a customized quotation. We do not sell or share your data with third parties.</p>
        <h2 className="text-xl font-semibold text-gray-800">Contact</h2>
        <p>For privacy concerns, contact us via the Contact page.</p>
      </div>
    </div>
  );
}
