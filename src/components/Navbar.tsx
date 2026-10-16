import React from 'react';
import { User, UserRole } from '../types';
import { BookOpen, UserCheck, Shield, Users, LogOut, ArrowLeftRight } from 'lucide-react';

interface NavbarProps {
  currentUser: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenRoleSwitcher: () => void;
  onOpenRaportForStudent?: (studentId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onOpenRoleSwitcher
}) => {
  const isWali = currentUser.role === 'wali_murid';

  const roleLabel = ({
    admin: 'Administrator',
    pengajar: 'Ustadz / Pengajar',
    kepala: 'Kepala TPQ',
    wali_murid: 'Wali Murid'
  } as Record<UserRole, string>)[currentUser.role];

  const roleBadgeStyle = ({
    admin: 'bg-rose-50 text-rose-800 border-rose-200',
    pengajar: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    kepala: 'bg-amber-50 text-amber-800 border-amber-200',
    wali_murid: 'bg-sky-50 text-sky-800 border-sky-200'
  } as Record<UserRole, string>)[currentUser.role];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-stone-200 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          
          {/* Zone 1: Wordmark & Emblem */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-emerald-800 flex items-center justify-center border border-emerald-700/40 shadow-xs">
              <img
                src="/src/assets/images/tpq_emblem_logo_1791968423601.jpg"
                alt="Logo TPQ"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Fallback if image fails
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = '<span class="text-white font-bold text-sm">TPQ</span>';
                  }
                }}
              />
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold tracking-tight text-stone-900 block leading-tight whitespace-nowrap">
                TPQ Al-Ikhlas
              </span>
              <span className="text-xs text-stone-500 hidden sm:block whitespace-nowrap">
                Pelaporan Ngaji & Tahfidz Digital
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links (single line, functional) */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2 text-sm font-medium">
            {!isWali ? (
              <>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                    activeTab === 'dashboard'
                      ? 'bg-stone-900 text-white'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  Ringkasan TPQ
                </button>
                <button
                  onClick={() => setActiveTab('setoran')}
                  className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                    activeTab === 'setoran'
                      ? 'bg-stone-900 text-white'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  Setoran & Evaluasi
                </button>
                <button
                  onClick={() => setActiveTab('absensi')}
                  className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                    activeTab === 'absensi'
                      ? 'bg-stone-900 text-white'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  Absensi Santri
                </button>
                <button
                  onClick={() => setActiveTab('santri')}
                  className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                    activeTab === 'santri'
                      ? 'bg-stone-900 text-white'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  Data Santri & Raport
                </button>
                <button
                  onClick={() => setActiveTab('juz30')}
                  className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                    activeTab === 'juz30'
                      ? 'bg-stone-900 text-white'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  Target Juz 30
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setActiveTab('parent_portal')}
                  className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                    activeTab === 'parent_portal'
                      ? 'bg-stone-900 text-white'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  Buku Raport Santri
                </button>
                <button
                  onClick={() => setActiveTab('parent_setoran')}
                  className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                    activeTab === 'parent_setoran'
                      ? 'bg-stone-900 text-white'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  Riwayat Ngaji & Komentar
                </button>
                <button
                  onClick={() => setActiveTab('parent_absensi')}
                  className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                    activeTab === 'parent_absensi'
                      ? 'bg-stone-900 text-white'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  Kehadiran Anak
                </button>
              </>
            )}
          </nav>

          {/* Zone 3: Active User & Role Switcher */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-semibold text-stone-900 truncate max-w-[150px]">
                {currentUser.name}
              </div>
              <div className="flex items-center justify-end gap-1 text-[11px] text-stone-500">
                <span className={`px-1.5 py-0.2 rounded border font-medium ${roleBadgeStyle}`}>
                  {roleLabel}
                </span>
                {isWali && currentUser.studentName && (
                  <span className="truncate max-w-[90px] text-stone-600">
                    · {currentUser.studentName}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={onOpenRoleSwitcher}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-lg transition-colors cursor-pointer shadow-xs whitespace-nowrap"
              title="Ganti peran pengguna (Ustadz, Kepala, atau Wali Murid)"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-700" />
              <span>Ganti Peran</span>
            </button>
          </div>

        </div>

        {/* Mobile Tab Bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-stone-100 overflow-x-auto gap-2">
          {!isWali ? (
            <>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`text-xs px-2.5 py-1 rounded whitespace-nowrap ${
                  activeTab === 'dashboard' ? 'bg-stone-900 text-white font-medium' : 'text-stone-600'
                }`}
              >
                Ringkasan
              </button>
              <button
                onClick={() => setActiveTab('setoran')}
                className={`text-xs px-2.5 py-1 rounded whitespace-nowrap ${
                  activeTab === 'setoran' ? 'bg-stone-900 text-white font-medium' : 'text-stone-600'
                }`}
              >
                Setoran
              </button>
              <button
                onClick={() => setActiveTab('absensi')}
                className={`text-xs px-2.5 py-1 rounded whitespace-nowrap ${
                  activeTab === 'absensi' ? 'bg-stone-900 text-white font-medium' : 'text-stone-600'
                }`}
              >
                Absensi
              </button>
              <button
                onClick={() => setActiveTab('santri')}
                className={`text-xs px-2.5 py-1 rounded whitespace-nowrap ${
                  activeTab === 'santri' ? 'bg-stone-900 text-white font-medium' : 'text-stone-600'
                }`}
              >
                Santri & Raport
              </button>
              <button
                onClick={() => setActiveTab('juz30')}
                className={`text-xs px-2.5 py-1 rounded whitespace-nowrap ${
                  activeTab === 'juz30' ? 'bg-stone-900 text-white font-medium' : 'text-stone-600'
                }`}
              >
                Juz 30
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveTab('parent_portal')}
                className={`text-xs px-2.5 py-1 rounded whitespace-nowrap ${
                  activeTab === 'parent_portal' ? 'bg-stone-900 text-white font-medium' : 'text-stone-600'
                }`}
              >
                Raport Anak
              </button>
              <button
                onClick={() => setActiveTab('parent_setoran')}
                className={`text-xs px-2.5 py-1 rounded whitespace-nowrap ${
                  activeTab === 'parent_setoran' ? 'bg-stone-900 text-white font-medium' : 'text-stone-600'
                }`}
              >
                Riwayat Ngaji
              </button>
              <button
                onClick={() => setActiveTab('parent_absensi')}
                className={`text-xs px-2.5 py-1 rounded whitespace-nowrap ${
                  activeTab === 'parent_absensi' ? 'bg-stone-900 text-white font-medium' : 'text-stone-600'
                }`}
              >
                Kehadiran
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
