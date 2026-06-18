'use client';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { DashboardStats } from '@/types';
import { Package, Tag, Award, MessageSquare, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
  const { data } = useQuery<{ success: boolean; data: DashboardStats }>({
    queryKey: ['dashboard'],
    queryFn: () => api.get('/dashboard/stats').then((r) => r.data),
  });

  const stats  = data?.data;
  const counts = stats?.counts;

  const cards = [
    { label: 'Total Frames',    value: counts?.totalFrames      ?? 0, icon: Package,     bg: 'bg-blue-50',    text: 'text-blue-600',    shadow: 'shadow-blue-500/20'   },
    { label: 'Categories',      value: counts?.totalCategories  ?? 0, icon: Tag,         bg: 'bg-violet-50',  text: 'text-violet-600',  shadow: 'shadow-violet-500/20' },
    { label: 'Brands',          value: counts?.totalBrands      ?? 0, icon: Award,       bg: 'bg-emerald-50', text: 'text-emerald-600', shadow: 'shadow-emerald-500/20'},
    { label: 'Total Inquiries', value: counts?.totalInquiries   ?? 0, icon: MessageSquare, bg: 'bg-orange-50', text: 'text-orange-600', shadow: 'shadow-orange-500/20' },
  ];

  const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
    new:       { label: 'New',       color: 'bg-blue-100 text-blue-700',    icon: AlertCircle  },
    contacted: { label: 'Contacted', color: 'bg-yellow-100 text-yellow-700', icon: Clock       },
    quoted:    { label: 'Quoted',    color: 'bg-purple-100 text-purple-700', icon: TrendingUp  },
    completed: { label: 'Completed', color: 'bg-green-100 text-green-700',  icon: CheckCircle  },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700',      icon: AlertCircle  },
  };

  return (
    <div className="space-y-4 md:space-y-6 max-w-7xl mx-auto">

      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-900 rounded-2xl p-5 md:p-6 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-40 md:w-64 h-full opacity-10">
          <div className="w-40 md:w-64 h-40 md:h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
        </div>
        <p className="text-blue-200 text-xs md:text-sm font-medium mb-1">Welcome back 👋</p>
        <h2 className="text-xl md:text-2xl font-bold mb-1">OptiVision Dashboard</h2>
        <p className="text-slate-400 text-xs md:text-sm">Here&apos;s what&apos;s happening in your store today.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {cards.map(({ label, value, icon: Icon, bg, text, shadow }) => (
          <div key={label} className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 md:w-11 md:h-11 rounded-xl ${bg} flex items-center justify-center mb-3 md:mb-4 shadow-lg ${shadow}`}>
              <Icon className={`w-5 h-5 ${text}`} />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-slate-800 mb-0.5">{value}</p>
            <p className="text-xs md:text-sm text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent inquiries */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-4 md:px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm md:text-base font-semibold text-slate-800">Recent Inquiries</h2>
            <p className="text-xs text-slate-400 mt-0.5">Latest customer inquiries</p>
          </div>
          <a href="/admin/inquiries" className="text-xs text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap">
            View all →
          </a>
        </div>

        {/* Mobile cards view */}
        <div className="divide-y divide-slate-50 md:hidden">
          {stats?.recentInquiries?.length ? stats.recentInquiries.map((inq) => {
            const cfg = statusConfig[inq.status];
            const StatusIcon = cfg?.icon ?? AlertCircle;
            return (
              <div key={inq._id} className="px-4 py-3 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-800">{inq.customerName}</p>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg?.color ?? ''}`}>
                    <StatusIcon className="w-3 h-3" />
                    {cfg?.label ?? inq.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{inq.frameId?.name ?? '—'} · {inq.phone}</p>
                <p className="text-xs text-slate-400">{new Date(inq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
            );
          }) : (
            <div className="px-4 py-8 text-center text-slate-400 text-sm">No inquiries yet</div>
          )}
        </div>

        {/* Desktop table view */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-xs text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Frame</th>
                <th className="px-6 py-3 font-medium">Phone</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {stats?.recentInquiries?.length ? stats.recentInquiries.map((inq) => {
                const cfg = statusConfig[inq.status];
                const StatusIcon = cfg?.icon ?? AlertCircle;
                return (
                  <tr key={inq._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3.5 font-medium text-slate-800">{inq.customerName}</td>
                    <td className="px-6 py-3.5 text-slate-500">{inq.frameId?.name ?? '—'}</td>
                    <td className="px-6 py-3.5 text-slate-500">{inq.phone}</td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg?.color ?? ''}`}>
                        <StatusIcon className="w-3 h-3" />
                        {cfg?.label ?? inq.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-slate-400 text-xs">
                      {new Date(inq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-400 text-sm">No inquiries yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
