import React from 'react';
import { User } from '../types';
import { LogOut, Crown, ShieldCheck, GraduationCap, HeartHandshake } from 'lucide-react';

interface SimpleHeaderProps {
  currentUser: User;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const SimpleHeader: React.FC<SimpleHeaderProps> = ({
  currentUser,
  onLogout,
  activeTab,
  setActiveTab
}) => {
  const isAdmin = currentUser.role === 'admin';
  const isWali = currentUser.role === 'wali_murid';
  const isKepala = currentUser.role === 'kepala';

  const roleBadge = isAdmin
    ? { text: 'Administrator', bg: 'bg-rose-50 text-rose-800 border-rose-200', icon: <Crown className="w-3 h-3" /> }
    : isKepala
    ? { text: 'Kepala TPQ', bg: 'bg-amber-50 text-amber-800 border-amber-200', icon: <ShieldCheck className="w-3 h-3" /> }
    : isWali
    ? { text: 'Wali Murid (Hanya Baca)', bg: 'bg-sky-50 text-sky-800 border-sky-200', icon: <HeartHandshake className="w-3 h-3" /> }
    : { text: 'Pengajar (Bisa Tulis)', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', icon: <GraduationCap className="w-3 h-3" /> };

  const userAvatar = isWali ? '👨‍👩‍👦' : isKepala ? '👑' : isAdmin ? '🔐' : '👨‍🏫';

  // Admin sees all tabs including user management
  const adminTabs = [
    { key: 'kelola_akun', label: '👑 Kelola Akun Pengguna' },
    { key: 'catatan', label: '📋 Buku Catatan Ngaji & Absensi' },
    { key: 'santri', label: '👥 Kelola Santri' },
    { key: 'hafalan', label: '📖 Progres Hafalan Surat (Juz 30)' },
    { key: 'raport', label: '🖨️ Cetak Raport Santri' },
  ];

  // Kepala & Pengajar see all data tabs (no user management)
  const staffTabs = [
    { key: 'catatan', label: '📋 Buku Catatan Ngaji & Absensi' },
    { key: 'santri', label: '👥 Kelola Santri' },
    { key: 'hafalan', label: '📖 Progres Hafalan Surat (Juz 30)' },
    { key: 'raport', label: '🖨️ Cetak Raport Santri' },
  ];

  const tabs = isAdmin ? adminTabs : isWali ? [] : staffTabs;

  return (
    <header className="bg-white border-b border-stone-200 no-print sticky top-0 z-30 shadow-2xs">

      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">

          {/* Brand TPQ */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-emerald-800 flex items-center justify-center shrink-0 border border-emerald-700 shadow-xs">
              <img
                src="/images/tpq_logo.jpg"
                alt="Logo TPQ"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
                  Laporan Mengaji TPQ Qurrota A'yun
                </h1>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold border ${roleBadge.bg} flex items-center gap-1`}>
                  {roleBadge.icon}
                  {roleBadge.text}
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Pencatatan Kehadiran, Progres Setoran Hafalan & Evaluasi Santri
              </p>
            </div>
          </div>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-2 self-start md:self-auto">
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

            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer"
              title="Keluar dari akun"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600" />
              <span>Keluar</span>
            </button>
          </div>

        </div>

        {/* Navigation Tabs */}
        {tabs.length > 0 && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-stone-100 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {isWali && (
          <div className="text-xs text-stone-600 font-medium flex items-center gap-1.5 mt-3 pt-3 border-t border-stone-100">
            <span>Halaman Buku Mengaji Ananda:</span>
            <strong className="text-emerald-800 text-sm">{currentUser.studentName}</strong>
            <span className="text-stone-400">· </span>
          </div>
        )}
      </div>
    </header>
  );
};
