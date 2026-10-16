import React, { useState } from 'react';
import { useAuth } from '../services/useAuth';
import { User } from '../types';
import {
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  Mail,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess?: (user: User) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const { signIn } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanId = identifier.trim();
    if (!cleanId) {
      setError('Username atau email harus diisi.');
      return;
    }
    if (!password) {
      setError('Kata sandi harus diisi.');
      return;
    }

    setLoading(true);
    try {
      const result = await signIn(cleanId, password);
      setLoading(false);

      if (result.success && result.user) {
        onLoginSuccess?.(result.user);
      } else {
        setError(result.error || 'Login gagal. Periksa kembali username dan kata sandi Anda.');
      }
    } catch (err) {
      setLoading(false);
      setError('Terjadi kendala saat proses masuk. Silakan coba lagi.');
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-center items-center py-10 px-4 sm:px-6 selection:bg-emerald-100 selection:text-emerald-900">
      <div className="w-full max-w-md bg-white rounded-3xl border border-stone-200/90 shadow-xl overflow-hidden">

        {/* Header: Logo & Branding */}
        <div className="bg-gradient-to-b from-emerald-900 to-emerald-950 p-6 sm:p-8 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 translate-x-8 -translate-y-8 w-40 h-40 bg-emerald-700/20 rounded-full blur-2xl pointer-events-none" />

          <div className="w-16 h-16 rounded-2xl mx-auto mb-3.5 bg-emerald-800 p-1 border-2 border-emerald-600/60 shadow-lg overflow-hidden flex items-center justify-center">
            <img
              src="favicon.jpg"
              alt="Logo TPQ"
              className="w-full h-full object-cover rounded-xl"
              referrerPolicy="no-referrer"
            />
          </div>

          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-emerald-50">
            Sistem Informasi TPQ
          </h1>
          <p className="text-xs text-emerald-200/90 mt-1 max-w-xs mx-auto">
            TPQ Qurrota A'yun · Pencatatan Mengaji, Hafalan & Raport Santri
          </p>
        </div>

        {/* Login Form */}
        <div className="p-6 sm:p-8 space-y-5">
          <div>
            <h2 className="text-base font-bold text-stone-900">Masuk ke Akun</h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Masukkan username atau email beserta kata sandi yang terdaftar.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-in fade-in slide-in-from-bottom-1 duration-150">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Username atau Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Contoh: admin atau email Anda"
                  className="w-full text-xs rounded-xl border border-stone-300 pl-9 pr-3 py-2.5 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition-all"
                  autoComplete="username"
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
                  className="w-full text-xs rounded-xl border border-stone-300 pl-9 pr-10 py-2.5 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition-all"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-700 p-1 rounded transition-colors cursor-pointer"
                  title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi akun...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Masuk ke Sistem</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </>
              )}
            </button>
          </form>

          {/* Discreet Information Note */}
          <div className="pt-4 border-t border-stone-100 space-y-2">
            <div className="flex items-start gap-2 p-3 bg-stone-50 rounded-xl border border-stone-200/80 text-[11px] text-stone-600">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-stone-800">Hak Akses Berdasarkan Peran (RBAC)</p>
                <p className="text-stone-500 mt-0.5">
                  Mendukung peran Administrator, Kepala TPQ, Pengajar (Ustadz/ah), dan Wali Murid.
                </p>
              </div>
            </div>
            
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-200/80 text-center text-[11px] text-stone-500">
          <p>TPQ Qurrota A'yun · Sistem Informasi Manajemen Santri</p>
        </div>
      </div>
    </div>
  );
};
