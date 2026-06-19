import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export function useOffers(active?: boolean) {
  return useQuery({
    queryKey: ['offers', active],
    queryFn: () => api.get('/offers', { params: active ? { active: 'true' } : {} }).then(r => r.data),
  });
}

export function useCreateOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (fd: FormData) => api.post('/offers', fd).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['offers'] }),
  });
}

export function useUpdateOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, form }: { id: string; form: FormData }) => api.put(`/offers/${id}`, form).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['offers'] }),
  });
}

export function useDeleteOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/offers/${id}`).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['offers'] }),
  });
}
