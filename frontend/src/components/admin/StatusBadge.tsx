import { Badge } from '@/components/ui/badge';

const colors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700 border-blue-200',
  contacted: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  quoted: 'bg-purple-100 text-purple-700 border-purple-200',
  completed: 'bg-green-100 text-green-700 border-green-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <Badge className={`capitalize ${colors[status] ?? 'bg-gray-100 text-gray-700'}`}>{status}</Badge>
  );
}
