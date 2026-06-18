import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'About Us — OptiVision', description: 'Learn about OptiVision and our commitment to premium eyewear.' };

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">About OptiVision</h1>
      <div className="prose prose-lg text-gray-600 space-y-4">
        <p>OptiVision is a trusted optical store dedicated to bringing you the finest eyewear from top global brands. We believe that eyewear should be both a vision solution and a fashion statement.</p>
        <p>Our team of trained opticians will help you select the perfect frame and customize the right lenses to match your prescription and lifestyle.</p>
        <h2 className="text-2xl font-semibold text-gray-900 mt-8">Why Choose Us?</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Wide range of frames for men, women, and kids</li>
          <li>Premium lens brands: Zeiss, Crizal, Hoya, Essilor</li>
          <li>Custom lens options including Blue Cut, Progressive, and Photochromic</li>
          <li>Easy WhatsApp consultation and inquiry</li>
          <li>Expert guidance from trained opticians</li>
        </ul>
      </div>
    </div>
  );
}
