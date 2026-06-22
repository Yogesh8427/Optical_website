import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface LensProduct {
  _id: string;
  brandId: { _id: string; name: string; logo: string };
  lensTypeId?: { _id: string; name: string } | null;
  name: string;
  description: string;
  price: number;
  active: boolean;
  sortOrder: number;
}

export function useLensProducts(brandId?: string) {
  return useQuery({
    queryKey: ['lens-products', brandId],
    queryFn: () =>
      api.get('/lens-products', { params: brandId ? { brandId } : {} }).then(r => r.data),
    enabled: true,
  });
}

export function useLensProductsAdmin(brandId?: string) {
  return useQuery({
    queryKey: ['lens-products-admin', brandId],
    queryFn: () =>
      api.get('/lens-products/admin', { params: brandId ? { brandId } : {} }).then(r => r.data),
  });
}
