import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { BookOpen, ShieldCheck, HeartHandshake, UserCheck, GraduationCap, LogOut, ArrowLeftRight, X, Check } from 'lucide-react';

interface SimpleHeaderProps {
  currentUser: User;
  users: User[];
  onSwitchUser: (user: User) => void;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const SimpleHeader: React.FC<SimpleHeaderProps> = ({
  currentUser,
  users,
  onSwitchUser,
  onLogout,
  activeTab,
  setActiveTab
}) => {
  const isWali = currentUser.role === 'wali_murid';
  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false);

  const isUstadzah = currentUser.username.includes('ustadzah');
  const userAvatar = isUstadzah ? '🧕' : currentUser.role === 'pengajar' ? '👨‍🏫' : currentUser.role === 'kepala' ? '👑' : '👨‍👩‍👦';

  const roleBadge = currentUser.role === 'pengajar'
    ? { text: 'Pengajar (Bisa Tulis)', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200' }
    : currentUser.role === 'kepala'
    ? { text: 'Kepala TPQ (Bisa Tulis)', bg: 'bg-amber-50 text-amber-800 border-amber-200' }
    : { text: 'Wali Murid (Hanya Baca)', bg: 'bg-sky-50 text-sky-800 border-sky-200' };

  return (
    <header className="bg-white border-b border-stone-200 no-print sticky top-0 z-30 shadow-2xs">
      
      {/* Baris 1: Logo, Judul & Informasi Akun Login Resmi */}
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Brand TPQ */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-emerald-800 flex items-center justify-center shrink-0 border border-emerald-700 shadow-xs">
              <img
                src="/src/assets/images/tpq_emblem_logo_1791968423601.jpg"
                alt="Logo TPQ"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
                  Laporan Mengaji TPQ Al-Ikhlas
                </h1>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold border ${roleBadge.bg}`}>
                  {roleBadge.text}
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Pencatatan Kehadiran, Progres Setoran Hafalan & Evaluasi Santri
              </p>
            </div>
          </div>

          {/* Profil Akun Aktif & Tombol Keluar / Ganti Akun */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            
            {/* Box Profil Pengguna Login */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 bg-stone-50 rounded-xl border border-stone-200">
              <div className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center text-sm shadow-2xs shrink-0">
                {userAvatar}
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-stone-900 leading-tight">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-stone-500 flex items-center gap-1">
                  <span className="font-mono text-stone-400">@{currentUser.username}</span>
                  {currentUser.studentName && (
                    <span className="text-sky-700 font-medium">· Wali: {currentUser.studentName}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Tombol Ganti Akun (Modal Ringkas) */}
            <button
              onClick={() => setIsSwitchModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-xl transition-colors cursor-pointer"
              title="Ganti ke akun peran lain"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-stone-500" />
              <span className="hidden sm:inline">Ganti Akun</span>
            </button>

            {/* Tombol Logout Resmi */}
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer"
              title="Keluar ke halaman login"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600" />
              <span>Keluar</span>
            </button>

          </div>

        </div>

        {/* Baris 2: Navigasi Tab Sederhana */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-stone-100 overflow-x-auto">
          {!isWali ? (
            <>
              <button
                onClick={() => setActiveTab('catatan')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'catatan'
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                📋 Buku Catatan Ngaji & Absensi
              </button>
              <button
                onClick={() => setActiveTab('santri')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'santri'
                    ? 'bg-emerald-800 text-white'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <span>👥 Kelola Santri</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                  activeTab === 'santri' ? 'bg-emerald-950 text-emerald-200' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  Tambah/Edit/Hapus
                </span>
              </button>
              <button
                onClick={() => setActiveTab('hafalan')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'hafalan'
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                📖 Progres Hafalan Surat (Juz 30)
              </button>
              <button
                onClick={() => setActiveTab('raport')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'raport'
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                🖨️ Cetak Raport Santri
              </button>
            </>
          ) : (
            <div className="text-xs text-stone-600 font-medium flex items-center gap-1.5">
              <span>Halaman Buku Mengaji Ananda:</span>
              <strong className="text-emerald-800 text-sm">{currentUser.studentName}</strong>
              <span className="text-stone-400">· (Data santri lain disembunyikan untuk privasi)</span>
            </div>
          )}
        </div>

      </div>

      {/* Modal Cepat Ganti Akun */}
      {isSwitchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-100">
          <div className="bg-white rounded-2xl shadow-xl border border-stone-200 w-full max-w-md overflow-hidden">
            <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50">
              <div>
                <h3 className="text-sm font-bold text-stone-900">
                  Ganti Akun Pengguna TPQ
                </h3>
                <p className="text-xs text-stone-500">
                  Pilih akun untuk beralih peran atau keluar ke halaman login
                </p>
              </div>
              <button
                onClick={() => setIsSwitchModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto">
              {users.map(u => {
                const isSelected = u.id === currentUser.id;
                const isUst = u.username.includes('ustadzah');
                const icon = isUst ? '🧕' : u.role === 'pengajar' ? '👨‍🏫' : u.role === 'kepala' ? '👑' : '👨‍👩‍👦';

                return (
                  <button
                    key={u.id}
                    onClick={() => {
                      onSwitchUser(u);
                      setIsSwitchModalOpen(false);
                    }}
                    className={`w-full text-left p-3 rounded-xl border flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50'
                        : 'border-stone-200 hover:border-emerald-300 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{icon}</span>
                      <div>
                        <div className="text-xs font-bold text-stone-900">
                          {u.name}
                        </div>
                        <div className="text-[11px] text-stone-500">
                          {u.role === 'pengajar' ? 'Pengajar TPQ' : u.role === 'kepala' ? 'Kepala TPQ' : `Wali dari ${u.studentName}`}
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Aktif
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="p-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => {
                  setIsSwitchModalOpen(false);
                  onLogout();
                }}
                className="text-rose-700 hover:text-rose-900 font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Ke Halaman Login Penuh</span>
              </button>
              <button
                type="button"
                onClick={() => setIsSwitchModalOpen(false)}
                className="px-3 py-1.5 text-stone-600 hover:text-stone-900 rounded-lg cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </header>
  );
};
