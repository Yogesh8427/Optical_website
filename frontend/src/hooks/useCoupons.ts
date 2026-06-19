import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export function useCoupons() {
  return useQuery({
    queryKey: ['coupons'],
    queryFn: () => api.get('/coupons').then(r => r.data),
  });
}

export function useCheckCoupon() {
  return useMutation({
    mutationFn: (code: string) => api.get(`/coupons/${code}`).then(r => r.data),
  });
}

export function useClaimCoupon() {
  return useMutation({
    mutationFn: ({ code, name, phone }: { code: string; name: string; phone: string }) =>
      api.post(`/coupons/${code}/claim`, { name, phone }).then(r => r.data),
  });
}

export function useCreateCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => api.post('/coupons', data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['coupons'] }),
  });
}

export function useUpdateCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => api.put(`/coupons/${id}`, data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['coupons'] }),
  });
}

export function useDeleteCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/coupons/${id}`).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['coupons'] }),
  });
}
