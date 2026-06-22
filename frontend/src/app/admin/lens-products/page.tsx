'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, ChevronDown, ChevronUp, PackageOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import api from '@/lib/api';

interface LensBrand   { _id: string; name: string; logo: string; }
interface LensType    { _id: string; name: string; }
interface PopBrandId  { _id: string; name: string; logo: string; }
interface PopTypeId   { _id: string; name: string; }
interface LensProduct {
  _id: string;
  brandId: PopBrandId | string;
  lensTypeId?: PopTypeId | string | null;
  name: string;
  description: string;
  price: number;
  active: boolean;
  sortOrder: number;
}

interface FormState {
  name: string;
  description: string;
  price: string;
  lensTypeId: string;
  active: boolean;
  sortOrder: string;
}

const EMPTY: FormState = { name: '', description: '', price: '', lensTypeId: '', active: true, sortOrder: '0' };

// brandId may be a populated object or a plain string
function getBrandId(p: LensProduct): string {
  return typeof p.brandId === 'object' ? p.brandId._id : p.brandId;
}
function getLensTypeName(p: LensProduct): string {
  if (!p.lensTypeId) return '';
  return typeof p.lensTypeId === 'object' ? p.lensTypeId.name : '';
}
function getLensTypeId(p: LensProduct): string {
  if (!p.lensTypeId) return '';
  return typeof p.lensTypeId === 'object' ? p.lensTypeId._id : p.lensTypeId;
}

export default function LensProductsPage() {
  const qc = useQueryClient();
  const [expandedBrand, setExpandedBrand] = useState<string | null>(null);
  const [editing, setEditing] = useState<LensProduct | null>(null);
  const [adding, setAdding]   = useState<string | null>(null);
  const [form, setForm]       = useState<FormState>(EMPTY);

  const { data: brandsRes } = useQuery({
    queryKey: ['lens-brands'],
    queryFn: () => api.get('/lens-brands').then(r => r.data),
  });
  const brands: LensBrand[] = brandsRes?.data ?? [];

  const { data: typesRes } = useQuery({
    queryKey: ['lens-types'],
    queryFn: () => api.get('/lens-types').then(r => r.data),
  });
  const lensTypes: LensType[] = typesRes?.data ?? [];

  const { data: productsRes } = useQuery({
    queryKey: ['lens-products-admin'],
    queryFn: () => api.get('/lens-products/admin').then(r => r.data),
  });
  const allProducts: LensProduct[] = productsRes?.data ?? [];

  const invalidate = () => qc.invalidateQueries({ queryKey: ['lens-products-admin'] });

  const createMutation = useMutation({
    mutationFn: (body: object) => api.post('/lens-products', body).then(r => r.data),
    onSuccess: () => { toast.success('Product added'); invalidate(); setAdding(null); setForm(EMPTY); },
    onError: (e: unknown) => {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Failed to add product';
      toast.error(msg);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: object }) => api.put(`/lens-products/${id}`, body).then(r => r.data),
    onSuccess: () => { toast.success('Product updated'); invalidate(); setEditing(null); setForm(EMPTY); },
    onError: () => toast.error('Failed to update product'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/lens-products/${id}`).then(r => r.data),
    onSuccess: () => { toast.success('Product deleted'); invalidate(); },
    onError: () => toast.error('Failed to delete product'),
  });

  function openAdd(brandId: string) {
    setEditing(null);
    setForm(EMPTY);
    setAdding(brandId);
    setExpandedBrand(brandId);
  }

  function openEdit(p: LensProduct) {
    setAdding(null);
    setEditing(p);
    setForm({
      name: p.name,
      description: p.description,
      price: String(p.price),
      lensTypeId: getLensTypeId(p),
      active: p.active,
      sortOrder: String(p.sortOrder),
    });
    setExpandedBrand(getBrandId(p));
  }

  function buildBody(extra: object) {
    return {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      lensTypeId: form.lensTypeId || null,
      active: form.active,
      sortOrder: Number(form.sortOrder),
      ...extra,
    };
  }

  function submitAdd(brandId: string) {
    if (!form.name.trim()) return toast.error('Product name is required');
    if (!form.price) return toast.error('Price is required');
    createMutation.mutate(buildBody({ brandId }));
  }

  function submitEdit() {
    if (!editing) return;
    if (!form.name.trim()) return toast.error('Product name is required');
    if (!form.price) return toast.error('Price is required');
    updateMutation.mutate({ id: editing._id, body: buildBody({}) });
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Lens Products</h1>
        <p className="text-slate-500 mt-1">Manage lens products and prices per brand</p>
      </div>

      {brands.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <PackageOpen className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="font-bold">No lens brands yet.</p>
          <p className="text-sm">Add brands first in <strong>Lens Brands</strong>.</p>
        </div>
      )}

      {brands.map(brand => {
        const products = allProducts.filter(p => getBrandId(p) === brand._id);
        const isOpen = expandedBrand === brand._id;

        return (
          <div key={brand._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {/* Brand header row */}
            <div
              className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-slate-50 transition-colors"
              onClick={() => setExpandedBrand(isOpen ? null : brand._id)}
            >
              <div className="flex items-center gap-3">
                {brand.logo && <img src={brand.logo} alt={brand.name} className="w-10 h-10 object-contain rounded-lg border border-slate-100" />}
                <div>
                  <p className="font-black text-slate-800">{brand.name}</p>
                  <p className="text-xs text-slate-400">{products.length} product{products.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={e => { e.stopPropagation(); openAdd(brand._id); }}
                  className="text-white text-xs"
                  style={{ background: 'var(--theme-primary, #2563eb)' }}
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Product
                </Button>
                {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </div>
            </div>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-slate-100 divide-y divide-slate-50">

                    {/* Product rows */}
                    {products.map(p => (
                      <div key={p._id} className="px-5 py-3">
                        {editing?._id === p._id ? (
                          <ProductForm
                            form={form}
                            setForm={setForm}
                            lensTypes={lensTypes}
                            onSave={submitEdit}
                            onCancel={() => { setEditing(null); setForm(EMPTY); }}
                            saving={updateMutation.isPending}
                            label="Save Changes"
                          />
                        ) : (
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-bold text-slate-800 text-sm">{p.name}</p>
                                {getLensTypeName(p) && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold border"
                                    style={{ color: 'var(--theme-primary,#2563eb)', borderColor: 'var(--theme-primary,#2563eb)', background: 'color-mix(in srgb,var(--theme-primary,#2563eb) 8%,white)' }}>
                                    {getLensTypeName(p)}
                                  </span>
                                )}
                                {!p.active && (
                                  <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold">Inactive</span>
                                )}
                              </div>
                              {p.description && <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{p.description}</p>}
                            </div>
                            <p className="font-black text-base shrink-0" style={{ color: 'var(--theme-primary, #2563eb)' }}>
                              ₹{p.price.toLocaleString()}
                            </p>
                            <div className="flex items-center gap-1 shrink-0">
                              <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => { if (confirm(`Delete "${p.name}"?`)) deleteMutation.mutate(p._id); }}
                                className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {products.length === 0 && adding !== brand._id && (
                      <p className="px-5 py-4 text-sm text-slate-400 italic">No products yet — click Add Product.</p>
                    )}

                    {/* Add form */}
                    {adding === brand._id && !editing && (
                      <div className="px-5 py-4 bg-slate-50">
                        <p className="text-xs font-black text-slate-500 uppercase tracking-wide mb-3">New Product</p>
                        <ProductForm
                          form={form}
                          setForm={setForm}
                          lensTypes={lensTypes}
                          onSave={() => submitAdd(brand._id)}
                          onCancel={() => { setAdding(null); setForm(EMPTY); }}
                          saving={createMutation.isPending}
                          label="Add Product"
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

function ProductForm({ form, setForm, lensTypes, onSave, onCancel, saving, label }: {
  form: FormState;
  setForm: (f: FormState) => void;
  lensTypes: LensType[];
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
  label: string;
}) {
  return (
    <div className="space-y-3">
      {/* Name + Price */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 space-y-1">
          <Label className="text-xs font-bold">Product Name *</Label>
          <Input
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Single Vision Basic"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-bold">Price (₹) *</Label>
          <Input
            type="number"
            value={form.price}
            onChange={e => setForm({ ...form, price: e.target.value })}
            placeholder="e.g. 2500"
            min={0}
          />
        </div>
      </div>

      {/* Lens Type dropdown */}
      <div className="space-y-1">
        <Label className="text-xs font-bold">Lens Type</Label>
        <select
          value={form.lensTypeId}
          onChange={e => setForm({ ...form, lensTypeId: e.target.value })}
          className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2"
          style={{ '--tw-ring-color': 'var(--theme-primary,#2563eb)' } as React.CSSProperties}
        >
          <option value="">— Select type (optional) —</option>
          {lensTypes.map(t => (
            <option key={t._id} value={t._id}>{t.name}</option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div className="space-y-1">
        <Label className="text-xs font-bold">Description</Label>
        <Input
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          placeholder="Short description (optional)"
        />
      </div>

      <div className="flex items-center justify-between pt-1">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.active}
            onChange={e => setForm({ ...form, active: e.target.checked })}
            className="w-4 h-4 rounded"
          />
          <span className="text-xs text-slate-600">{form.active ? 'Active' : 'Inactive'}</span>
        </label>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
          <Button
            size="sm"
            onClick={onSave}
            disabled={saving}
            className="text-white"
            style={{ background: 'var(--theme-primary, #2563eb)' }}
          >
            {saving ? 'Saving…' : label}
          </Button>
        </div>
      </div>
    </div>
  );
}
