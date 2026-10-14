import React from 'react';
import { Student, AttendanceRecord, SetoranRecord, User } from '../types';
import { Users, BookOpen, UserCheck, Award, Plus, ArrowRight, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';

interface DashboardViewProps {
  students: Student[];
  attendance: AttendanceRecord[];
  setoran: SetoranRecord[];
  currentUser: User;
  onNavigateTab: (tab: string) => void;
  onOpenAddSetoran: () => void;
  onOpenBatchAbsensi: () => void;
  onOpenRaport: (student: Student) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  students,
  attendance,
  setoran,
  currentUser,
  onNavigateTab,
  onOpenAddSetoran,
  onOpenBatchAbsensi,
  onOpenRaport
}) => {
  const canWrite = currentUser.role === 'pengajar' || currentUser.role === 'kepala';

  // Stats
  const totalStudents = students.length;
  const totalSetoran = setoran.length;
  
  // Today's attendance
  const today = new Date().toISOString().slice(0, 10);
  const todayAttendance = attendance.filter(a => a.date === today);
  const todayHadir = todayAttendance.filter(a => a.status === 'hadir').length;

  // Global attendance rate
  const totalAtt = attendance.length;
  const hadirAtt = attendance.filter(a => a.status === 'hadir').length;
  const overallPresenceRate = totalAtt > 0 ? Math.round((hadirAtt / totalAtt) * 100) : 100;

  // Total memorized surahs across all students
  const totalSurahsCompleted = students.reduce((acc, s) => {
    return acc + s.hafalanList.filter(h => h.status === 'hafal_lancar' || h.status === 'mutqin').length;
  }, 0);

  // Recent setoran
  const recentSetoran = [...setoran].sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);

  return (
    <div className="space-y-6">
      
      {/* Top Welcome & Quick Actions */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
              {currentUser.role === 'kepala' ? 'Panel Kepala TPQ' : 'Panel Ustadz / Ustadzah'}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
              Ahlan wa Sahlan, {currentUser.name}
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Sistem Pelaporan Mengaji, Presensi Kehadiran, & Progres Hafalan Santri
            </p>
          </div>

          {canWrite && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={onOpenAddSetoran}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Input Setoran</span>
              </button>
              <button
                onClick={onOpenBatchAbsensi}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-lg transition-colors cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5 text-stone-700" />
                <span>Absensi Hari Ini</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        
        <div className="bg-white p-4 rounded-xl border border-stone-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-medium">Total Santri Aktif</span>
            <Users className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-bold text-stone-900 font-mono tabular-nums">
            {totalStudents}
          </div>
          <div className="text-[11px] text-stone-500 mt-0.5">
            Ikhwan & Akhwat terdaftar
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-medium">Kehadiran Rata-rata</span>
            <UserCheck className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-bold text-stone-900 font-mono tabular-nums">
            {overallPresenceRate}%
          </div>
          <div className="text-[11px] text-stone-500 mt-0.5">
            Tingkat disiplin mengaji
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-medium">Catatan Setoran</span>
            <BookOpen className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-bold text-stone-900 font-mono tabular-nums">
            {totalSetoran}
          </div>
          <div className="text-[11px] text-stone-500 mt-0.5">
            Iqro & Al-Qur'an tercatat
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-medium">Surat Lulus Dihafal</span>
            <Award className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-bold text-stone-900 font-mono tabular-nums">
            {totalSurahsCompleted}
          </div>
          <div className="text-[11px] text-stone-500 mt-0.5">
            Total hafalan mutqin santri
          </div>
        </div>

      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Aktivitas Setoran & Evaluasi Terbaru */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-stone-200/90 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-700" />
                Aktivitas Setoran & Evaluasi Terakhir
              </h3>
              <p className="text-xs text-stone-500">
                Laporan mengaji yang baru saja disetorkan oleh santri
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('setoran')}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
            >
              Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-stone-100">
            {recentSetoran.map((rec) => (
              <div key={rec.id} className="py-3.5 first:pt-0 last:pb-0 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-stone-900">
                        {rec.studentName}
                      </span>
                      <span className="text-[11px] text-stone-400 font-mono">
                        · {rec.date}
                      </span>
                    </div>
                    <div className="text-xs text-stone-600 mt-0.5 flex items-center gap-1.5">
                      <span className="font-semibold text-emerald-900">{rec.materi}</span>
                      <span>·</span>
                      <span className="font-mono">{rec.halamanAyat}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    {rec.statusKelanjutan === 'lanjut' ? (
                      <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Lanjut
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-flex items-center gap-1">
                        <RotateCcw className="w-3 h-3 text-amber-600" />
                        Ulang
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-xs text-stone-700 bg-stone-50 p-2.5 rounded-lg border border-stone-100 italic">
                  "{rec.komentarEvaluasi}"
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Quick Roster & Raport Access */}
        <div className="bg-white rounded-xl border border-stone-200/90 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-700" />
              Daftar Cepat Santri
            </h3>
            <button
              onClick={() => onNavigateTab('santri')}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 cursor-pointer"
            >
              Semua Santri →
            </button>
          </div>

          <div className="space-y-2.5">
            {students.slice(0, 6).map((s) => (
              <div
                key={s.id}
                className="p-2.5 rounded-lg border border-stone-100 bg-stone-50/60 hover:bg-stone-50 flex items-center justify-between transition-colors"
              >
                <div>
                  <div className="text-xs font-bold text-stone-900">
                    {s.name}
                  </div>
                  <div className="text-[11px] text-stone-500">
                    {s.currentLevel}
                  </div>
                </div>

                <button
                  onClick={() => onOpenRaport(s)}
                  className="text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 px-2 py-1 bg-white border border-stone-200 rounded hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  Raport
                </button>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-stone-100">
            <button
              onClick={() => onNavigateTab('juz30')}
              className="w-full py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg text-center transition-colors cursor-pointer"
            >
              Cek Matriks Hafalan Juz 30 →
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
