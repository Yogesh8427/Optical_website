import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { ApiResponse, Testimonial } from '@/types';

const KEY = 'testimonials';

export function useTestimonials() {
  return useQuery<ApiResponse<Testimonial[]>>({
    queryKey: [KEY],
    queryFn: () => api.get('/testimonials').then((r) => r.data),
  });
}

export function useCreateTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (form: FormData) => api.post('/testimonials', form).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useUpdateTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, form }: { id: string; form: FormData }) =>
      api.put(`/testimonials/${id}`, form).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useDeleteTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/testimonials/${id}`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}
