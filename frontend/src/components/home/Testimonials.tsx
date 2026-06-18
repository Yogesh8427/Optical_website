'use client';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Testimonial, ApiResponse } from '@/types';
import { Star } from 'lucide-react';

export default function Testimonials() {
  const { data } = useQuery<ApiResponse<Testimonial[]>>({
    queryKey: ['testimonials'],
    queryFn: () => api.get('/testimonials').then((r) => r.data),
  });
  const testimonials = data?.data ?? [];
  if (!testimonials.length) return null;

  return (
    <section className="py-16 bg-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t._id} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 text-sm mb-4">"{t.text}"</p>
              <p className="font-semibold text-gray-900 text-sm">— {t.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
