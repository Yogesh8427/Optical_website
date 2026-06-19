import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Inquiry, ApiResponse } from '@/types';

export function useInquiries(
  filters: { status?: string; page?: number; limit?: number } = {},
  options: { refetchInterval?: number } = {},
) {
  return useQuery<ApiResponse<Inquiry[]>>({
    queryKey: ['inquiries', filters],
    queryFn: () => api.get('/inquiries', { params: filters }).then((r) => r.data),
    ...options,
  });
}

export function useInquiry(id: string) {
  return useQuery<ApiResponse<Inquiry>>({
    queryKey: ['inquiry', id],
    queryFn: () => api.get(`/inquiries/${id}`).then((r) => r.data),
    enabled: !!id,
  });
}

export function useCreateInquiry() {
  return useMutation({
    mutationFn: (form: FormData) => api.post('/inquiries', form).then((r) => r.data),
  });
}

export function useUpdateInquiryStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.put(`/inquiries/${id}/status`, { status }).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['inquiries'] }),
  });
}
