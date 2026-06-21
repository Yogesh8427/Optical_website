'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, Glasses, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useSettings } from '@/hooks/useSettings';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const { data: settingsData } = useSettings();
  const settings = settingsData?.data;
  const storeName = settings?.storeName || 'OptiVision';
  const logo = settings?.logo || '';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      setAuth(res.data.token, res.data.user);
      document.cookie = `admin_token=${res.data.token}; path=/; max-age=${7 * 24 * 3600}`;
      router.push('/admin');
    } catch {
      toast.error('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const LogoMark = ({ size }: { size: 'sm' | 'lg' }) => {
    const dim = size === 'lg' ? 'w-20 h-20' : 'w-12 h-12';
    const iconSize = size === 'lg' ? 'w-10 h-10' : 'w-6 h-6';
    return (
      <div className={`${dim} rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 overflow-hidden`}>
        {logo
          ? <img src={logo} alt={storeName} className="w-full h-full object-contain p-2" />
          : <Glasses className={`${iconSize} text-white`} />}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex bg-slate-50">

      {/* ── Left branding panel (desktop only) ── */}
      <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />

        {/* Top: logo + name */}
        <div className="relative flex items-center gap-3">
          <LogoMark size="sm" />
          <span className="text-white font-bold text-lg tracking-tight">{storeName}</span>
        </div>

        {/* Center: headline */}
        <div className="relative">
          <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-4">Admin Panel</p>
          <h1 className="text-5xl font-extrabold text-white leading-tight mb-6">
            Manage your<br />store with ease
          </h1>
          <div className="space-y-3">
            {[
              'Frames, brands & categories',
              'Customer inquiries',
              'Offers, coupons & banners',
              'Terms, privacy & settings',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: security badge */}
        <div className="relative flex items-center gap-2 text-slate-500 text-xs">
          <ShieldCheck className="w-4 h-4" />
          Secured with JWT authentication
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-12">
        <div className="w-full max-w-[400px]">

          {/* Mobile header */}
          <div className="flex flex-col items-center gap-3 mb-10 lg:hidden">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center overflow-hidden shadow-lg shadow-blue-500/30">
              {logo
                ? <img src={logo} alt={storeName} className="w-full h-full object-contain p-2" />
                : <Glasses className="w-8 h-8 text-white" />}
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-slate-800">{storeName}</p>
              <p className="text-slate-400 text-sm">Admin Portal</p>
            </div>
          </div>

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8">
            <div className="mb-7">
              <h2 className="text-2xl font-bold text-slate-900">Welcome back 👋</h2>
              <p className="text-slate-400 text-sm mt-1">Sign in to your admin account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="admin@example.com"
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-300"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-11 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-all text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in…
                  </>
                ) : 'Sign In to Dashboard'}
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            &copy; {new Date().getFullYear()} {storeName}. Admin access only.
          </p>
        </div>
      </div>
    </div>
  );
}
