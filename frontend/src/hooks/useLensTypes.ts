import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { LensType, ApiResponse } from '@/types';

const KEY = 'lens-types';

export function useLensTypes() {
  return useQuery<ApiResponse<LensType[]>>({
    queryKey: [KEY],
    queryFn: () => api.get('/lens-types').then((r) => r.data),
  });
}

export function useCreateLensType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (form: FormData) => api.post('/lens-types', form).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useUpdateLensType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, form }: { id: string; form: FormData }) =>
      api.put(`/lens-types/${id}`, form).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useDeleteLensType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/lens-types/${id}`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}
