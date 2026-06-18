import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { MessageCircle, Phone, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ContactSection() {
  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
        <p className="text-gray-300 mb-8 text-lg">Have questions? We&apos;re here to help you find the perfect eyewear.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/contact" className={cn(buttonVariants({ size: 'lg' }), 'bg-green-600 hover:bg-green-700 border-0')}>
            <MessageCircle className="w-5 h-5 mr-2" />WhatsApp Us
          </Link>
          <Link href="/contact" className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'border-white text-white hover:bg-white hover:text-gray-900')}>
            <Phone className="w-5 h-5 mr-2" />Call Us
          </Link>
          <Link href="/contact" className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'border-white text-white hover:bg-white hover:text-gray-900')}>
            <Mail className="w-5 h-5 mr-2" />Email Us
          </Link>
        </div>
      </div>
    </section>
  );
}
