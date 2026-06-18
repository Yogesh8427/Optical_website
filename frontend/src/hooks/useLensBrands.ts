import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { LensBrand, ApiResponse } from '@/types';

export function useLensBrands() {
  return useQuery<ApiResponse<LensBrand[]>>({
    queryKey: ['lens-brands'],
    queryFn: () => api.get('/lens-brands').then((r) => r.data),
  });
}

export function useCreateLensBrand() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (form: FormData) => api.post('/lens-brands', form).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['lens-brands'] }),
  });
}

export function useUpdateLensBrand() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, form }: { id: string; form: FormData }) =>
      api.put(`/lens-brands/${id}`, form).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['lens-brands'] }),
  });
}

export function useDeleteLensBrand() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/lens-brands/${id}`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['lens-brands'] }),
  });
}
