import React from 'react';
import { Student, AttendanceRecord, SetoranRecord, User } from '../types';
import { Award, BookOpen, Calendar, CheckCircle2, FileText, HeartHandshake, Sparkles, UserCheck } from 'lucide-react';

interface ParentPortalViewProps {
  currentUser: User;
  student: Student;
  attendance: AttendanceRecord[];
  setoran: SetoranRecord[];
  onOpenRaport: (student: Student) => void;
  onNavigateToSetoran: () => void;
  onNavigateToAbsensi: () => void;
}

export const ParentPortalView: React.FC<ParentPortalViewProps> = ({
  currentUser,
  student,
  attendance,
  setoran,
  onOpenRaport,
  onNavigateToSetoran,
  onNavigateToAbsensi
}) => {
  const studentAttendance = attendance.filter(a => a.studentId === student.id);
  const studentSetoran = setoran
    .filter(s => s.studentId === student.id)
    .sort((a, b) => b.timestamp - a.timestamp);

  const totalMeetings = studentAttendance.length;
  const hadirCount = studentAttendance.filter(a => a.status === 'hadir').length;
  const presenceRate = totalMeetings > 0 ? Math.round((hadirCount / totalMeetings) * 100) : 100;

  const completedHafalan = student.hafalanList.filter(
    h => h.status === 'hafal_lancar' || h.status === 'mutqin'
  );
  const percentHafalan = Math.round((completedHafalan.length / 37) * 100);

  const latestSetoran = studentSetoran[0];

  return (
    <div className="space-y-6">
      
      {/* Welcome Hero Banner */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-8 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-emerald-900 bg-emerald-50 border border-emerald-200">
              <HeartHandshake className="w-3.5 h-3.5 text-emerald-700" />
              Portal Khusus Orang Tua / Wali Santri
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
              Assalamu'alaikum, {currentUser.name}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 max-w-xl leading-relaxed">
              Berikut adalah rekaman digital progres mengaji, hafalan surat, dan kehadiran ananda{' '}
              <strong className="text-stone-900">{student.name}</strong> di TPQ Qurrata A'yun.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:items-end gap-2">
            <button
              onClick={() => onOpenRaport(student)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 text-emerald-200" />
              <span>Buka & Cetak Raport Digital</span>
            </button>
            <span className="text-[11px] text-stone-500">
              Format buku penghubung resmi santri
            </span>
          </div>
        </div>
      </div>

      {/* Highlights KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Capaian Mengaji Saat Ini */}
        <div className="bg-white rounded-xl border border-stone-200/90 p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-stone-500">Tingkat Mengaji Saat Ini</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-bold text-emerald-900 mb-1">
            {student.currentLevel}
          </div>
          <div className="text-xs text-stone-500">
            Kelompok: {student.classGroup}
          </div>
        </div>

        {/* Progres Hafalan Juz 30 */}
        <div className="bg-white rounded-xl border border-stone-200/90 p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-stone-500">Target Hafalan Juz 30</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-bold font-mono text-stone-900 tabular-nums">
              {completedHafalan.length}
            </span>
            <span className="text-xs text-stone-500">dari 37 Surat ({percentHafalan}%)</span>
          </div>
          <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden border border-stone-200/60">
            <div
              className="bg-amber-600 h-full rounded-full transition-all"
              style={{ width: `${percentHafalan}%` }}
            />
          </div>
        </div>

        {/* Tingkat Kehadiran */}
        <div className="bg-white rounded-xl border border-stone-200/90 p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-stone-500">Kedisiplinan Kehadiran</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-800 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-bold font-mono text-stone-900 tabular-nums">
              {presenceRate}%
            </span>
            <span className="text-xs text-stone-500">({hadirCount} dari {totalMeetings} pertemuan)</span>
          </div>
          <div className="text-xs text-stone-500">
            Status aktif & teratur mengikuti halaqah
          </div>
        </div>

      </div>

      {/* Latest Evaluation Callout from Teacher */}
      {latestSetoran && (
        <div className="bg-emerald-900 text-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-emerald-300" />
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs font-semibold text-emerald-200 uppercase tracking-wider">
                  Komentar Evaluasi Terakhir Ustadz Pembimbing
                </div>
                <div className="text-xs text-emerald-300 font-mono">
                  {latestSetoran.date} · {latestSetoran.ustadzName}
                </div>
              </div>

              <blockquote className="text-base sm:text-lg font-medium leading-relaxed italic text-white/95">
                "{latestSetoran.komentarEvaluasi}"
              </blockquote>

              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-emerald-200 border-t border-emerald-800">
                <span>Materi: <strong>{latestSetoran.materi}</strong></span>
                <span>·</span>
                <span>Halaman/Ayat: <strong>{latestSetoran.halamanAyat}</strong></span>
                <span>·</span>
                <span>Predikat: <strong className="capitalize">{latestSetoran.kelancaran.replace('_', ' ')}</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2-Column Split: Recent Recitation Logs vs Memorized Surahs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Riwayat Setoran Terakhir */}
        <div className="bg-white rounded-xl border border-stone-200/90 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-700" />
              Riwayat Setoran Mengaji Terbaru
            </h3>
            <button
              onClick={onNavigateToSetoran}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 cursor-pointer"
            >
              Lihat Semua →
            </button>
          </div>

          <div className="space-y-3">
            {studentSetoran.slice(0, 4).map((rec) => (
              <div
                key={rec.id}
                className="p-3 rounded-lg border border-stone-200/70 bg-stone-50/60 hover:bg-stone-50 transition-colors"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-stone-900">{rec.materi}</span>
                  <span className="font-mono text-stone-500 text-[11px]">{rec.date}</span>
                </div>
                <div className="text-xs text-stone-600 mb-1.5 flex items-center gap-2">
                  <span>Halaman/Ayat: <strong className="text-stone-800">{rec.halamanAyat}</strong></span>
                  <span>·</span>
                  <span className="capitalize text-emerald-800 font-semibold">{rec.kelancaran.replace('_', ' ')}</span>
                </div>
                <p className="text-xs italic text-stone-700 bg-white p-2 rounded border border-stone-200/50">
                  "{rec.komentarEvaluasi}"
                </p>
                <div className="text-[10px] text-stone-400 mt-1 text-right">
                  Penyimak: {rec.ustadzName}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Daftar Surat yang Sudah Dihafal */}
        <div className="bg-white rounded-xl border border-stone-200/90 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-600" />
              Surat Juz 30 yang Telah Tuntas ({completedHafalan.length})
            </h3>
            <button
              onClick={() => onOpenRaport(student)}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 cursor-pointer"
            >
              Raport Lengkap →
            </button>
          </div>

          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {completedHafalan.length === 0 ? (
              <div className="text-xs text-stone-500 py-6 text-center">
                Belum ada surat yang disetorkan tuntas. Ananda sedang dalam proses bimbingan.
              </div>
            ) : (
              completedHafalan.map((h, i) => (
                <div
                  key={h.surahNumber}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-stone-100 bg-stone-50/70"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 text-xs text-stone-400 font-mono text-center">{i + 1}.</span>
                    <div>
                      <div className="text-xs font-semibold text-stone-900">
                        {h.surahName}
                      </div>
                      <div className="text-[11px] text-stone-500">
                        {h.totalAyat} ayat {h.completedDate ? `· Lulus: ${h.completedDate}` : ''}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-arabic text-sm text-stone-700 font-semibold" dir="rtl">
                      {h.surahArabic}
                    </span>
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Lulus
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
