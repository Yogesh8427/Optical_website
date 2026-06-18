import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Frame, ApiResponse } from '@/types';

interface FrameFilters {
  search?: string;
  category?: string;
  brand?: string;
  gender?: string;
  material?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  page?: number;
  limit?: number;
}

export function useFrames(filters: FrameFilters = {}) {
  return useQuery<ApiResponse<Frame[]>>({
    queryKey: ['frames', filters],
    queryFn: () => api.get('/frames', { params: filters }).then((r) => r.data),
  });
}

export function useFrame(slug: string) {
  return useQuery({
    queryKey: ['frame', slug],
    queryFn: () => api.get(`/frames/${slug}`).then((r) => r.data),
    enabled: !!slug,
  });
}

export function useCreateFrame() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (form: FormData) => api.post('/frames', form).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['frames'] }),
  });
}

export function useUpdateFrame() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, form }: { id: string; form: FormData }) =>
      api.put(`/frames/${id}`, form).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['frames'] }),
  });
}

export function useDeleteFrame() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/frames/${id}`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['frames'] }),
  });
}
