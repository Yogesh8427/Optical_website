import Link from 'next/link';
import { MessageCircle, Phone, Mail, MapPin } from 'lucide-react';

export default function ContactSection() {
  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-blue-400 uppercase tracking-widest text-xs font-semibold mb-3">We&apos;re here for you</p>
        <h2 className="text-4xl font-bold mb-4">Get in Touch</h2>
        <p className="text-gray-400 mb-12 text-lg max-w-xl mx-auto">
          Have questions about frames or lenses? We&apos;d love to help you find the perfect eyewear.
        </p>

        {/* Contact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <div className="bg-gray-800 rounded-2xl p-6 flex flex-col items-center gap-3 hover:bg-gray-750 transition-colors">
            <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-green-400" />
            </div>
            <p className="font-semibold text-white">WhatsApp</p>
            <p className="text-gray-400 text-sm">Quick replies on chat</p>
          </div>
          <div className="bg-gray-800 rounded-2xl p-6 flex flex-col items-center gap-3 hover:bg-gray-750 transition-colors">
            <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center">
              <Phone className="w-6 h-6 text-blue-400" />
            </div>
            <p className="font-semibold text-white">Call Us</p>
            <p className="text-gray-400 text-sm">Mon – Sat, 10am – 7pm</p>
          </div>
          <div className="bg-gray-800 rounded-2xl p-6 flex flex-col items-center gap-3 hover:bg-gray-750 transition-colors">
            <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-purple-400" />
            </div>
            <p className="font-semibold text-white">Visit Store</p>
            <p className="text-gray-400 text-sm">Come see us in person</p>
          </div>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold px-7 py-3 rounded-xl transition-colors text-sm"
          >
            <MessageCircle className="w-5 h-5" />
            WhatsApp Us
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 border border-gray-600 hover:border-white text-gray-300 hover:text-white font-semibold px-7 py-3 rounded-xl transition-colors text-sm"
          >
            <Phone className="w-5 h-5" />
            Call Us
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 border border-gray-600 hover:border-white text-gray-300 hover:text-white font-semibold px-7 py-3 rounded-xl transition-colors text-sm"
          >
            <Mail className="w-5 h-5" />
            Email Us
          </Link>
        </div>
      </div>
    </section>
  );
}
