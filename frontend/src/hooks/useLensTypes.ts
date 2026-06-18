import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { LensType, ApiResponse } from '@/types';

export function useLensTypes() {
  return useQuery<ApiResponse<LensType[]>>({
    queryKey: ['lens-types'],
    queryFn: () => api.get('/lens-types').then((r) => r.data),
  });
}

export function useCreateLensType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<LensType>) => api.post('/lens-types', data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['lens-types'] }),
  });
}

export function useUpdateLensType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<LensType> }) =>
      api.put(`/lens-types/${id}`, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['lens-types'] }),
  });
}

export function useDeleteLensType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/lens-types/${id}`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['lens-types'] }),
  });
}
