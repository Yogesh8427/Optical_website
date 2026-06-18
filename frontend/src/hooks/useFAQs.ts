import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { ApiResponse, FAQ } from '@/types';

const KEY = 'faqs';

export function useFAQs() {
  return useQuery<ApiResponse<FAQ[]>>({
    queryKey: [KEY],
    queryFn: () => api.get('/faqs').then((r) => r.data),
  });
}

export function useCreateFAQ() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<FAQ>) => api.post('/faqs', body).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useUpdateFAQ() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<FAQ> }) =>
      api.put(`/faqs/${id}`, body).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useDeleteFAQ() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/faqs/${id}`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}
