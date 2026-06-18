import type { Metadata } from 'next';
import { MessageCircle, Phone, Mail, MapPin } from 'lucide-react';

export const metadata: Metadata = { title: 'Contact Us — OptiVision' };

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Contact Us</h1>
      <p className="text-gray-600 mb-10 text-lg">We&apos;d love to hear from you. Reach us via WhatsApp, phone, or email.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-start gap-4 p-6 border rounded-xl">
          <MessageCircle className="w-6 h-6 text-green-600 shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-900">WhatsApp</h3>
            <p className="text-gray-500 text-sm mb-3">Chat with us instantly</p>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors"
            >
              Open WhatsApp
            </a>
          </div>
        </div>
        <div className="flex items-start gap-4 p-6 border rounded-xl">
          <Phone className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-900">Phone</h3>
            <p className="text-gray-500 text-sm">Call us during business hours</p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-6 border rounded-xl">
          <Mail className="w-6 h-6 text-purple-600 shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-900">Email</h3>
            <p className="text-gray-500 text-sm">We reply within 24 hours</p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-6 border rounded-xl">
          <MapPin className="w-6 h-6 text-red-500 shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-900">Visit Us</h3>
            <p className="text-gray-500 text-sm">Come see our collection in person</p>
          </div>
        </div>
      </div>
    </div>
  );
}
