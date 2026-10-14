import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { BookOpen, ShieldCheck, HeartHandshake, GraduationCap, Lock, UserCheck, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';

interface LoginViewProps {
  users: User[];
  onLogin: (user: User) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ users, onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('pengajar');
  const [loginMode, setLoginMode] = useState<'quick' | 'form'>('quick');

  // Form states
  const [usernameInput, setUsernameInput] = useState('ustadzah.fatimah');
  const [passwordInput, setPasswordInput] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Filter users by selected role
  const roleUsers = users.filter(u => u.role === selectedRole);

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMessage('');
    const firstInRole = users.find(u => u.role === role);
    if (firstInRole) {
      setUsernameInput(firstInRole.username);
      setPasswordInput('123456');
    }
  };

  const handleQuickSelect = (user: User) => {
    onLogin(user);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!usernameInput.trim()) {
      setErrorMessage('Silakan masukkan username atau pilih akun.');
      return;
    }

    const matchedUser = users.find(
      u => u.username.toLowerCase() === usernameInput.trim().toLowerCase()
    );

    if (matchedUser) {
      onLogin(matchedUser);
    } else {
      setErrorMessage(`Username "${usernameInput}" tidak ditemukan. Silakan pilih akun dari daftar di bawah.`);
    }
  };

  const setDemoCredentials = (u: User) => {
    setUsernameInput(u.username);
    setPasswordInput('123456');
    setSelectedRole(u.role);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-center items-center py-10 px-4 sm:px-6">
      
      {/* Container Kartu Login */}
      <div className="w-full max-w-xl bg-white rounded-3xl border border-stone-200/90 shadow-xl overflow-hidden">
        
        {/* Header Kartu: Logo & Identitas TPQ */}
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

        {/* Tab Pemilihan Peran */}
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
              Langkah 1: Pilih Peran Masuk
            </label>
            <div className="grid grid-cols-3 gap-2 p-1.5 bg-stone-100 rounded-2xl border border-stone-200">
              
              {/* Tab Pengajar */}
              <button
                type="button"
                onClick={() => handleRoleChange('pengajar')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all cursor-pointer text-center ${
                  selectedRole === 'pengajar'
                    ? 'bg-white text-emerald-900 shadow-sm font-bold border border-emerald-200 ring-2 ring-emerald-700/20'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                }`}
              >
                <GraduationCap className={`w-5 h-5 mb-1 ${selectedRole === 'pengajar' ? 'text-emerald-700' : 'text-stone-400'}`} />
                <span className="text-xs font-semibold">Pengajar</span>
                <span className="text-[10px] text-stone-500 font-normal">Ustadz/ah</span>
              </button>

              {/* Tab Kepala TPQ */}
              <button
                type="button"
                onClick={() => handleRoleChange('kepala')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all cursor-pointer text-center ${
                  selectedRole === 'kepala'
                    ? 'bg-white text-amber-900 shadow-sm font-bold border border-amber-200 ring-2 ring-amber-700/20'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                }`}
              >
                <ShieldCheck className={`w-5 h-5 mb-1 ${selectedRole === 'kepala' ? 'text-amber-700' : 'text-stone-400'}`} />
                <span className="text-xs font-semibold">Kepala TPQ</span>
                <span className="text-[10px] text-stone-500 font-normal">Pimpinan</span>
              </button>

              {/* Tab Wali Murid */}
              <button
                type="button"
                onClick={() => handleRoleChange('wali_murid')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all cursor-pointer text-center ${
                  selectedRole === 'wali_murid'
                    ? 'bg-white text-sky-900 shadow-sm font-bold border border-sky-200 ring-2 ring-sky-700/20'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                }`}
              >
                <HeartHandshake className={`w-5 h-5 mb-1 ${selectedRole === 'wali_murid' ? 'text-sky-700' : 'text-stone-400'}`} />
                <span className="text-xs font-semibold">Wali Murid</span>
                <span className="text-[10px] text-stone-500 font-normal">Orang Tua</span>
              </button>

            </div>
          </div>

          {/* Banner Hak Akses Peran Terpilih */}
          <div className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
            selectedRole === 'pengajar'
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
              : selectedRole === 'kepala'
              ? 'bg-amber-50/80 border-amber-200 text-amber-950'
              : 'bg-sky-50/80 border-sky-200 text-sky-950'
          }`}>
            <div className="shrink-0 mt-0.5">
              {selectedRole === 'pengajar' ? (
                <UserCheck className="w-4 h-4 text-emerald-700" />
              ) : selectedRole === 'kepala' ? (
                <ShieldCheck className="w-4 h-4 text-amber-700" />
              ) : (
                <Lock className="w-4 h-4 text-sky-700" />
              )}
            </div>
            <div>
              <div className="font-bold">
                {selectedRole === 'pengajar' && 'Hak Akses: Pengajar (Bisa Baca & Tulis)'}
                {selectedRole === 'kepala' && 'Hak Akses: Kepala TPQ (Bisa Baca & Tulis Penuh)'}
                {selectedRole === 'wali_murid' && 'Hak Akses: Wali Santri (Hanya Baca - Data Anak Pribadi)'}
              </div>
              <p className="text-[11px] text-stone-600 mt-0.5 leading-relaxed">
                {selectedRole === 'pengajar' && 'Dapat mencatat kehadiran harian, menginput setoran ayat & iqro, memberi komentar tajwid, serta mengelola data santri.'}
                {selectedRole === 'kepala' && 'Dapat memonitor seluruh halaqah, memeriksa rekap absensi, melihat capaian tahfidz, dan menerbitkan raport resmi.'}
                {selectedRole === 'wali_murid' && 'Hanya dapat memantau rekaman mengaji, absensi, capaian hafalan surat, dan mencetak lembar raport untuk anandanya sendiri.'}
              </p>
            </div>
          </div>

          {/* Pilihan Metode: Pilih Akun Cepat vs Form Username/Password */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Langkah 2: Pilih Akun {selectedRole === 'pengajar' ? 'Pengajar' : selectedRole === 'kepala' ? 'Pimpinan' : 'Orang Tua Santri'}
              </label>

              <div className="flex items-center gap-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => setLoginMode('quick')}
                  className={`px-2 py-0.5 rounded cursor-pointer ${
                    loginMode === 'quick' ? 'font-bold text-emerald-800 bg-emerald-50' : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Pilih Cepat
                </button>
                <span className="text-stone-300">|</span>
                <button
                  type="button"
                  onClick={() => setLoginMode('form')}
                  className={`px-2 py-0.5 rounded cursor-pointer ${
                    loginMode === 'form' ? 'font-bold text-emerald-800 bg-emerald-50' : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Form Sandi
                </button>
              </div>
            </div>

            {/* Mode 1: Pilih Cepat Akun */}
            {loginMode === 'quick' && (
              <div className="space-y-2.5">
                {roleUsers.map(u => {
                  const isUstadzah = u.username.includes('ustadzah');
                  return (
                    <div
                      key={u.id}
                      className="p-3.5 rounded-xl border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center font-bold text-stone-700 shrink-0 text-base">
                          {isUstadzah ? '🧕' : u.role === 'pengajar' ? '👨‍🏫' : u.role === 'kepala' ? '👑' : '👨‍👩‍👦'}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-stone-900 group-hover:text-emerald-900 truncate">
                            {u.name}
                          </h3>
                          <div className="text-xs text-stone-500 truncate flex items-center gap-1.5">
                            <span className="font-mono text-[11px] text-stone-400">@{u.username}</span>
                            {u.studentName && (
                              <span className="text-sky-700 font-medium">· Santri: {u.studentName}</span>
                            )}
                            {u.title && !u.studentName && (
                              <span className="text-stone-500">· {u.title}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleQuickSelect(u)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs transition-colors cursor-pointer shrink-0"
                      >
                        <span>Masuk</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Mode 2: Form Login Tradisional */}
            {loginMode === 'form' && (
              <form onSubmit={handleFormSubmit} className="space-y-3.5">
                {errorMessage && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Username / ID Pengguna
                  </label>
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="Contoh: ustadzah.fatimah atau ustadz.ahmad"
                    className="w-full text-xs rounded-xl border border-stone-300 p-2.5 font-mono bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Kata Sandi / PIN
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="Masukkan kata sandi..."
                      className="w-full text-xs rounded-xl border border-stone-300 p-2.5 pr-10 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-700 p-0.5"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <span className="text-[10px] text-stone-400 mt-1 block">
                    *Untuk kemudahan demo, kata sandi bawaan adalah: <span className="font-mono font-bold text-stone-600">123456</span>
                  </span>
                </div>

                {/* Tombol Demo Autofill */}
                <div className="pt-1">
                  <span className="text-[11px] text-stone-500 block mb-1.5">Isi Cepat Berdasarkan Akun:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {roleUsers.map(u => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => setDemoCredentials(u)}
                        className="px-2 py-1 text-[11px] rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 cursor-pointer"
                      >
                        {u.name.split(' ')[0]} ({u.username})
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-xs transition-colors cursor-pointer mt-2 flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Masuk ke Aplikasi</span>
                </button>
              </form>
            )}

          </div>

        </div>

        {/* Footer Card */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200/80 text-center text-xs text-stone-500">
          <p>
            Hak Akses Terlindungi · TPQ Al-Ikhlas Nurul Iman
          </p>
        </div>

      </div>

    </div>
  );
};
