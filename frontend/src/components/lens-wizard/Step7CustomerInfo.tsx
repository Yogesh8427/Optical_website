'use client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
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
    data.lensTypes.forEach((t) => form.append('lensTypes[]', t));
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
        <span className="text-base">{data.powerRequired ? '👓' : '✅'}</span>
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
        <Button type="submit" disabled={isPending} className="flex-1 bg-green-600 hover:bg-green-700">
          {isPending ? 'Submitting...' : '📲 Submit & Open WhatsApp'}
        </Button>
      </div>
    </form>
  );
}
