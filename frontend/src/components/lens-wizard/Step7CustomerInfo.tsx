'use client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Glasses, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateInquiry } from '@/hooks/useInquiries';
import { toast } from 'sonner';
import type { WizardFormData } from '@/types';

const schema = z.object({
  customerName: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, 'Valid phone number required'),
  email: z.string().email('Valid email required').or(z.literal('')),
  city: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props { data: WizardFormData; onUpdate: (p: Partial<WizardFormData>) => void; onBack: () => void; onClose: () => void; }

export default function Step7CustomerInfo({ data, onBack, onClose }: Props) {
  const { mutate, isPending } = useCreateInquiry();
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { customerName: data.customerName, phone: data.phone, email: data.email, city: data.city },
  });

  function onSubmit(values: FormValues) {
    const form = new FormData();
    form.append('frameId', data.frameId);
    if (data.selectedColor) form.append('selectedColor', data.selectedColor);
    if (data.selectedSize)  form.append('selectedSize',  data.selectedSize);
    form.append('powerRequired', String(data.powerRequired));
    if (data.prescriptionFile) form.append('prescriptionFile', data.prescriptionFile);
    if (data.powerRequired) {
      form.append('rightEye', JSON.stringify(data.rightEye));
      form.append('leftEye', JSON.stringify(data.leftEye));
      if (data.add) form.append('add', data.add);
    }
    if (data.lensBrandId) form.append('lensBrandId', data.lensBrandId);
    data.lensTypes.forEach((t) => form.append('lensTypes', t));
    if (data.notes) form.append('notes', data.notes);
    form.append('customerName', values.customerName);
    form.append('phone', values.phone);
    if (values.email) form.append('email', values.email);
    if (values.city) form.append('city', values.city);

    mutate(form, {
      onSuccess: (res) => {
        toast.success('Inquiry submitted! Redirecting to WhatsApp...');
        if (res.whatsappUrl) {
          window.open(res.whatsappUrl, '_blank');
        }
        onClose();
      },
      onError: () => toast.error('Failed to submit inquiry. Please try again.'),
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">

      {/* Summary pill — shows what they chose */}
      <div className={`rounded-xl px-4 py-3 text-sm flex items-center gap-2 ${
        data.powerRequired
          ? 'bg-blue-50 text-blue-700'
          : 'bg-green-50 text-green-700'
      }`}>
        {data.powerRequired ? <Glasses className="w-4 h-4 shrink-0" /> : <CheckCircle className="w-4 h-4 shrink-0" />}
        <span>
          {data.powerRequired
            ? 'With powered lenses — prescription included'
            : 'Plain lenses (zero power) — no prescription needed'}
        </span>
      </div>

      <div>
        <Label>Full Name *</Label>
        <Input {...register('customerName')} className="mt-1" />
        {errors.customerName && <p className="text-xs text-red-500 mt-1">{errors.customerName.message}</p>}
      </div>
      <div>
        <Label>Phone Number *</Label>
        <Input {...register('phone')} type="tel" className="mt-1" />
        {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
      </div>
      <div>
        <Label>Email (optional)</Label>
        <Input {...register('email')} type="email" className="mt-1" />
        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <Label>City (optional)</Label>
        <Input {...register('city')} className="mt-1" />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onBack} className="flex-1">Back</Button>
        <Button type="submit" disabled={isPending} className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700">
          {isPending ? 'Submitting…' : (
            <>
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Submit &amp; Open WhatsApp
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
