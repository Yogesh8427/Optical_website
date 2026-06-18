'use client';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { DashboardStats } from '@/types';
import { Package, Tag, Award, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AdminDashboard() {
  const { data } = useQuery<{ success: boolean; data: DashboardStats }>({
    queryKey: ['dashboard'],
    queryFn: () => api.get('/dashboard/stats').then((r) => r.data),
  });

  const stats = data?.data;
  const counts = stats?.counts;

  const cards = [
    { label: 'Total Frames', value: counts?.totalFrames ?? 0, icon: Package, color: 'text-blue-600 bg-blue-50' },
    { label: 'Categories', value: counts?.totalCategories ?? 0, icon: Tag, color: 'text-purple-600 bg-purple-50' },
    { label: 'Brands', value: counts?.totalBrands ?? 0, icon: Award, color: 'text-green-600 bg-green-50' },
    { label: 'Inquiries', value: counts?.totalInquiries ?? 0, icon: MessageSquare, color: 'text-orange-600 bg-orange-50' },
  ];

  const statusColors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-700',
    contacted: 'bg-yellow-100 text-yellow-700',
    quoted: 'bg-purple-100 text-purple-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl p-5 shadow-sm border">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Inquiries</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Frame</th>
                <th className="pb-3 font-medium">Phone</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {stats?.recentInquiries?.map((inq) => (
                <tr key={inq._id} className="py-2">
                  <td className="py-3 font-medium text-gray-900">{inq.customerName}</td>
                  <td className="py-3 text-gray-600">{inq.frameId?.name ?? '—'}</td>
                  <td className="py-3 text-gray-600">{inq.phone}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColors[inq.status] ?? ''}`}>{inq.status}</span>
                  </td>
                  <td className="py-3 text-gray-500">{new Date(inq.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
