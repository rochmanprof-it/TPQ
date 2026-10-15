import React, { useState } from 'react';
import { useAuth } from '../services/useAuth';
import {
  ShieldCheck, HeartHandshake, GraduationCap, Crown, Lock, User as UserIcon,
  ArrowRight, Eye, EyeOff, AlertCircle, Loader2, Mail
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email harus diisi.');
      return;
    }
    if (!password) {
      setError('Kata sandi harus diisi.');
      return;
    }

    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);

    if (!result.success) {
      setError(result.error || 'Login gagal.');
    }
  };

  const fillDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-center items-center py-10 px-4 sm:px-6">
      <div className="w-full max-w-xl bg-white rounded-3xl border border-stone-200/90 shadow-xl overflow-hidden">

        {/* Header: Logo & Identity */}
        <div className="bg-gradient-to-b from-emerald-900 to-emerald-950 p-6 sm:p-8 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 translate-x-8 -translate-y-8 w-40 h-40 bg-emerald-700/20 rounded-full blur-2xl pointer-events-none" />

          <div className="w-16 h-16 rounded-2xl mx-auto mb-3.5 bg-emerald-800 p-1 border-2 border-emerald-600/60 shadow-lg overflow-hidden flex items-center justify-center">
            <img
              src="/src/assets/images/tpq_emblem_logo_1791968423601.jpg"
              alt="Logo TPQ"
              className="w-full h-full object-cover rounded-xl"
              referrerPolicy="no-referrer"
            />
          </div>

          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-emerald-50">
            Sistem Informasi & Pelaporan TPQ
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200/80 mt-1 max-w-md mx-auto">
            TPQ Al-Ikhlas Nurul Iman · Pencatatan Kehadiran, Progres Hafalan & Buku Raport Santri
          </p>
        </div>

        {/* Login Form */}
        <div className="p-6 sm:p-8 space-y-5">
          <div>
            <h2 className="text-sm font-bold text-stone-900 mb-1">Masuk ke Akun Anda</h2>
            <p className="text-xs text-stone-500">
              Gunakan email dan kata sandi yang terdaftar untuk mengakses sistem.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-in fade-in slide-in-from-bottom-1 duration-150">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@tpq-alikhlas.sch.id"
                  className="w-full text-xs rounded-xl border border-stone-300 pl-9 pr-3 py-2.5 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  autoComplete="email"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi..."
                  className="w-full text-xs rounded-xl border border-stone-300 pl-9 pr-10 py-2.5 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-700 p-0.5 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sedang masuk...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Masuk ke Aplikasi</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="pt-3 border-t border-stone-100">
            <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2">
              Akun Demo (Klik untuk Isi Otomatis)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              <DemoAccountButton
                icon={<Crown className="w-3.5 h-3.5 text-rose-700" />}
                label="Administrator"
                desc="Akses penuh + kelola akun"
                onClick={() => fillDemo('admin@tpq-alikhlas.sch.id', 'admin123456')}
              />
              <DemoAccountButton
                icon={<ShieldCheck className="w-3.5 h-3.5 text-amber-700" />}
                label="Kepala TPQ"
                desc="Akses semua fitur"
                onClick={() => fillDemo('mansur.tpq@tpq-alikhlas.sch.id', 'kepala123456')}
              />
              <DemoAccountButton
                icon={<GraduationCap className="w-3.5 h-3.5 text-emerald-700" />}
                label="Pengajar (Ustadz)"
                desc="Input data ngaji"
                onClick={() => fillDemo('ahmad.fauzi@tpq-alikhlas.sch.id', 'ustadz123456')}
              />
              <DemoAccountButton
                icon={<HeartHandshake className="w-3.5 h-3.5 text-sky-700" />}
                label="Wali Murid"
                desc="Lihat laporan anak"
                onClick={() => fillDemo('hendra.w@gmail.com', 'wali123456')}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200/80 text-center text-xs text-stone-500">
          <p>Sistem Terlindungi RBAC · TPQ Al-Ikhlas Nurul Iman</p>
        </div>
      </div>
    </div>
  );
};

interface DemoAccountButtonProps {
  icon: React.ReactNode;
  label: string;
  desc: string;
  onClick: () => void;
}

const DemoAccountButton: React.FC<DemoAccountButtonProps> = ({ icon, label, desc, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-center gap-2.5 p-2.5 rounded-xl border border-stone-200 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all cursor-pointer text-left"
  >
    <div className="w-8 h-8 rounded-lg bg-stone-50 border border-stone-200 flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div className="min-w-0">
      <div className="text-xs font-bold text-stone-900">{label}</div>
      <div className="text-[10px] text-stone-500 truncate">{desc}</div>
    </div>
  </button>
);
