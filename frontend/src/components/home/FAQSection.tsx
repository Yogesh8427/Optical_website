'use client';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { FAQ, ApiResponse } from '@/types';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQSection() {
  const { data } = useQuery<ApiResponse<FAQ[]>>({
    queryKey: ['faqs'],
    queryFn: () => api.get('/faqs').then((r) => r.data),
  });
  const faqs = data?.data ?? [];
  const [open, setOpen] = useState<string | null>(null);

  if (!faqs.length) return null;

  return (
    <section className="py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((faq) => (
            <div key={faq._id} className="border rounded-xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-5 py-4 text-left font-medium text-gray-800 hover:bg-gray-50 transition-colors"
                onClick={() => setOpen(open === faq._id ? null : faq._id)}
              >
                {faq.question}
                {open === faq._id ? <ChevronUp className="w-5 h-5 text-gray-500 shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-500 shrink-0" />}
              </button>
              {open === faq._id && (
                <div className="px-5 pb-4 text-gray-600 text-sm">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
