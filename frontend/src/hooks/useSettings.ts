import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Settings, ApiResponse } from '@/types';

export function useSettings() {
  return useQuery<ApiResponse<Settings>>({
    queryKey: ['settings'],
    queryFn: () => api.get('/settings').then((r) => r.data),
  });
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (form: FormData) => api.put('/settings', form).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['settings'] }),
  });
}
