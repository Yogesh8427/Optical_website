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
    { label: 'Total Frames',    value: counts?.totalFrames      ?? 0, icon: Package      },
    { label: 'Categories',      value: counts?.totalCategories  ?? 0, icon: Tag          },
    { label: 'Brands',          value: counts?.totalBrands      ?? 0, icon: Award        },
    { label: 'Total Inquiries', value: counts?.totalInquiries   ?? 0, icon: MessageSquare },
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
      <div
        className="rounded-2xl p-5 md:p-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, var(--theme-primary, #2563eb) 0%, color-mix(in srgb, var(--theme-primary, #2563eb) 60%, #000) 100%)' }}
      >
        {/* Decorative circles */}
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full opacity-20 bg-white" />
        <div className="absolute -right-4 bottom-0 w-24 h-24 rounded-full opacity-10 bg-white" />
        <div className="absolute left-1/2 -bottom-6 w-32 h-32 rounded-full opacity-10 bg-white" />

        <p className="text-xs font-black uppercase tracking-widest mb-2 text-white/70">
          Welcome back 👋
        </p>
        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white mb-1">
          Dashboard
        </h2>
        <p className="text-white/60 text-xs md:text-sm">Here&apos;s what&apos;s happening in your store today.</p>
        <div className="mt-4 flex justify-end">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-black uppercase tracking-widest text-white/80 hover:text-white transition-colors"
          >
            View Store →
          </a>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-md border-0 hover:shadow-lg transition-shadow">
            <div
              className="w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center mb-3 md:mb-4"
              style={{ background: 'color-mix(in srgb, var(--theme-primary, #2563eb) 12%, white)' }}
            >
              <Icon className="w-5 h-5" style={{ color: 'var(--theme-primary, #2563eb)' }} />
            </div>
            <p className="text-3xl font-black tracking-tight text-slate-900 mb-0.5">{value}</p>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent inquiries */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="px-4 md:px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2
              className="text-xs font-black uppercase tracking-widest"
              style={{ color: 'var(--theme-primary, #2563eb)' }}
            >
              Recent Inquiries
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Latest customer inquiries</p>
          </div>
          <a
            href="/admin/inquiries"
            className="text-xs font-black uppercase tracking-widest whitespace-nowrap"
            style={{ color: 'var(--theme-primary, #2563eb)' }}
          >
            View all →
          </a>
        </div>

        {/* Mobile cards view */}
        <div className="divide-y divide-slate-100 md:hidden bg-white">
          {stats?.recentInquiries?.length ? stats.recentInquiries.map((inq) => {
            const cfg = statusConfig[inq.status];
            const StatusIcon = cfg?.icon ?? AlertCircle;
            return (
              <div key={inq._id} className="px-4 py-3 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-black tracking-tight text-slate-800">{inq.customerName}</p>
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
              <tr className="bg-slate-50 text-left">
                <th className="px-6 py-3 font-black text-xs uppercase tracking-widest text-slate-400">Customer</th>
                <th className="px-6 py-3 font-black text-xs uppercase tracking-widest text-slate-400">Frame</th>
                <th className="px-6 py-3 font-black text-xs uppercase tracking-widest text-slate-400">Phone</th>
                <th className="px-6 py-3 font-black text-xs uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-6 py-3 font-black text-xs uppercase tracking-widest text-slate-400">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats?.recentInquiries?.length ? stats.recentInquiries.map((inq) => {
                const cfg = statusConfig[inq.status];
                const StatusIcon = cfg?.icon ?? AlertCircle;
                return (
                  <tr key={inq._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3.5 font-black tracking-tight text-slate-800">{inq.customerName}</td>
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
