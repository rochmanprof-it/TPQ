import React, { useState } from 'react';
import { Student, User, SetoranGrade } from '../types';
import { JUZ_30_SURAHS } from '../data/quranData';
import { CheckCircle2, Award, Clock, BookOpen, Sparkles, Filter, ChevronRight } from 'lucide-react';

interface JuzAmmaTrackerProps {
  students: Student[];
  currentUser: User;
  onUpdateHafalan: (
    studentId: string,
    surahNumber: number,
    status: 'belum' | 'sedang_menghafal' | 'hafal_lancar' | 'mutqin',
    grade?: SetoranGrade,
    notes?: string
  ) => void;
}

export const JuzAmmaTracker: React.FC<JuzAmmaTrackerProps> = ({
  students,
  currentUser,
  onUpdateHafalan
}) => {
  const canWrite = currentUser.role === 'pengajar' || currentUser.role === 'kepala';
  const isWali = currentUser.role === 'wali_murid';

  // If wali murid, default and lock to their child
  const [selectedStudentId, setSelectedStudentId] = useState<string>(() => {
    if (isWali && currentUser.studentId) {
      return currentUser.studentId;
    }
    return students[0]?.id || '';
  });

  const [statusFilter, setStatusFilter] = useState<'all' | 'hafal' | 'sedang' | 'belum'>('all');
  const [editingSurahNumber, setEditingSurahNumber] = useState<number | null>(null);

  // Edit form state
  const [editStatus, setEditStatus] = useState<'belum' | 'sedang_menghafal' | 'hafal_lancar' | 'mutqin'>('hafal_lancar');
  const [editGrade, setEditGrade] = useState<SetoranGrade>('mumtaz');
  const [editNotes, setEditNotes] = useState('');

  const currentStudent = students.find(s => s.id === selectedStudentId);

  // Compute stats
  const totalSurahs = 37;
  const studentHafalanMap = new Map(currentStudent?.hafalanList.map(h => [h.surahNumber, h]));

  const hafalCount = currentStudent?.hafalanList.filter(
    h => h.status === 'hafal_lancar' || h.status === 'mutqin'
  ).length || 0;

  const percentHafal = Math.round((hafalCount / totalSurahs) * 100);

  const startEdit = (surahNumber: number) => {
    if (!canWrite) return;
    const current = studentHafalanMap.get(surahNumber);
    setEditingSurahNumber(surahNumber);
    setEditStatus(current?.status || 'hafal_lancar');
    setEditGrade(current?.grade || 'mumtaz');
    setEditNotes(current?.notes || '');
  };

  const handleSaveEdit = (surahNumber: number) => {
    if (!currentStudent) return;
    onUpdateHafalan(currentStudent.id, surahNumber, editStatus, editGrade, editNotes);
    setEditingSurahNumber(null);
  };

  // Surahs to display (reverse order: An-Nas 114 to An-Naba 78, traditional TPQ order)
  const surahsOrdered = [...JUZ_30_SURAHS].reverse().filter(s => {
    const item = studentHafalanMap.get(s.number);
    const status = item?.status || 'belum';

    if (statusFilter === 'all') return true;
    if (statusFilter === 'hafal') return status === 'hafal_lancar' || status === 'mutqin';
    if (statusFilter === 'sedang') return status === 'sedang_menghafal';
    if (statusFilter === 'belum') return status === 'belum';
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-stone-900">
            {isWali ? 'Progres Hafalan Juz 30 Ananda' : 'Target & Matriks Hafalan Juz 30'}
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Daftar 37 Surat Juz 'Amma (An-Nas s/d An-Naba') dengan status kelulusan munaqosah
          </p>
        </div>

        {/* Student Selector (for teachers/head) */}
        {!isWali && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs text-stone-500 whitespace-nowrap">Pilih Santri:</span>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="text-xs font-semibold px-3 py-2 rounded-lg border border-stone-300 bg-white text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.nickname})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Progress Bar Card */}
      {currentStudent && (
        <div className="bg-white p-5 rounded-xl border border-stone-200/90 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <span>{currentStudent.name}</span>
                <span className="text-xs font-normal text-stone-500 font-mono">({currentStudent.nis})</span>
              </div>
              <div className="text-xs text-stone-500">
                Tingkatan: <strong className="text-emerald-800">{currentStudent.currentLevel}</strong>
              </div>
            </div>

            <div className="text-right">
              <span className="text-2xl font-bold font-mono text-stone-900 tabular-nums">
                {hafalCount}
              </span>
              <span className="text-xs text-stone-500"> / {totalSurahs} Surat ({percentHafal}%)</span>
            </div>
          </div>

          {/* Progress Track */}
          <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden border border-stone-200/60">
            <div
              className="bg-emerald-700 h-full rounded-full transition-all duration-300"
              style={{ width: `${percentHafal}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
            <span>Mulai: Surat An-Nas (114)</span>
            <span>Target Akhir: Surat An-Naba' (78)</span>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-lg max-w-fit">
        {[
          { key: 'all', label: 'Semua Surat (37)' },
          { key: 'hafal', label: `Tuntas Hafal (${hafalCount})` },
          { key: 'sedang', label: 'Sedang Berjalan' },
          { key: 'belum', label: 'Belum Disetorkan' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key as any)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              statusFilter === tab.key
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Surah Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {surahsOrdered.map((surah) => {
          const item = studentHafalanMap.get(surah.number);
          const status = item?.status || 'belum';
          const isEditing = editingSurahNumber === surah.number;

          return (
            <div
              key={surah.number}
              className={`rounded-xl border p-4 transition-all ${
                status === 'mutqin'
                  ? 'bg-emerald-50/40 border-emerald-300/80 shadow-2xs'
                  : status === 'hafal_lancar'
                  ? 'bg-white border-emerald-200 shadow-2xs'
                  : status === 'sedang_menghafal'
                  ? 'bg-amber-50/30 border-amber-200'
                  : 'bg-white border-stone-200 opacity-90'
              }`}
            >
              {/* Surah Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-stone-100 text-stone-700 font-mono text-xs flex items-center justify-center font-semibold">
                    {surah.number}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">
                      {surah.name}
                    </h3>
                    <p className="text-[11px] text-stone-500">
                      {surah.translation} · {surah.totalAyat} ayat
                    </p>
                  </div>
                </div>

                <span className="font-arabic text-lg text-emerald-900 font-semibold" dir="rtl">
                  {surah.nameArabic}
                </span>
              </div>

              {/* Status Indicator */}
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                <div>
                  {status === 'mutqin' ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-900">
                      <Award className="w-3.5 h-3.5 text-emerald-700" />
                      Mutqin (Kuat & Tartil)
                    </span>
                  ) : status === 'hafal_lancar' ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Hafal Lancar
                    </span>
                  ) : status === 'sedang_menghafal' ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-800">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      Sedang Menghafal
                    </span>
                  ) : (
                    <span className="text-[11px] text-stone-400">
                      Belum Disetorkan
                    </span>
                  )}
                </div>

                {item?.completedDate && (
                  <span className="text-[10px] font-mono text-stone-400">
                    {item.completedDate}
                  </span>
                )}
              </div>

              {item?.notes && (
                <div className="text-[11px] italic text-stone-600 mt-1.5 bg-stone-50/70 p-1.5 rounded">
                  Catatan: {item.notes}
                </div>
              )}

              {/* Edit Trigger (Pengajar & Kepala only) */}
              {canWrite && !isEditing && (
                <div className="mt-3 pt-2 border-t border-stone-100 text-right">
                  <button
                    onClick={() => startEdit(surah.number)}
                    className="text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 cursor-pointer"
                  >
                    Ubah Status Hafalan
                  </button>
                </div>
              )}

              {/* Quick Inline Editor */}
              {isEditing && (
                <div className="mt-3 pt-3 border-t border-stone-200 space-y-2 bg-stone-50 p-2.5 rounded-lg">
                  <div>
                    <label className="block text-[10px] font-semibold text-stone-700 mb-1">Status:</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as any)}
                      className="w-full text-xs rounded border border-stone-300 p-1 bg-white text-stone-900"
                    >
                      <option value="belum">Belum Disetorkan</option>
                      <option value="sedang_menghafal">Sedang Menghafal</option>
                      <option value="hafal_lancar">Hafal Lancar</option>
                      <option value="mutqin">Mutqin (Kuat & Sangat Lancar)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-stone-700 mb-1">Catatan Evaluasi:</label>
                    <input
                      type="text"
                      placeholder="Contoh: Sangat tartil, makhraj fasih"
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      className="w-full text-xs rounded border border-stone-300 p-1 bg-white text-stone-900"
                    />
                  </div>

                  <div className="flex justify-end gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setEditingSurahNumber(null)}
                      className="px-2 py-1 text-[11px] text-stone-600 hover:text-stone-900"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveEdit(surah.number)}
                      className="px-3 py-1 text-[11px] font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded"
                    >
                      Simpan
                    </button>
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};
