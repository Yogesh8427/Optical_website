import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Brand, ApiResponse } from '@/types';

export function useBrands() {
  return useQuery<ApiResponse<Brand[]>>({
    queryKey: ['brands'],
    queryFn: () => api.get('/brands').then((r) => r.data),
  });
}

export function useCreateBrand() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (form: FormData) => api.post('/brands', form).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['brands'] }),
  });
}

export function useUpdateBrand() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, form }: { id: string; form: FormData }) =>
      api.put(`/brands/${id}`, form).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['brands'] }),
  });
}

export function useDeleteBrand() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/brands/${id}`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['brands'] }),
  });
}
