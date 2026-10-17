import React, { useState, useEffect } from 'react';
import { Student, User, SetoranGrade, StudentHafalanProgress } from '../types';
import { JUZ_30_SURAHS, DOA_LIST_DATA, SurahMeta } from '../data/quranData';
import {
  Award,
  CheckCircle2,
  Clock,
  BookOpen,
  Search,
  SlidersHorizontal,
  X,
  Calendar,
  Sparkles,
  ChevronRight,
  Filter
} from 'lucide-react';

interface SimpleHafalanViewProps {
  students: Student[];
  currentUser: User;
  onUpdateHafalan: (
    studentId: string,
    surahNumber: number,
    status: 'belum' | 'sedang_menghafal' | 'hafal_lancar' | 'mutqin',
    grade?: SetoranGrade,
    notes?: string,
    completedDate?: string
  ) => void;
  onUpdateDoa?: (
    studentId: string,
    doaId: string,
    status: 'belum' | 'sedang_menghafal' | 'hafal_lancar' | 'mutqin',
    notes?: string,
    completedDate?: string
  ) => void;
}

export const SimpleHafalanView: React.FC<SimpleHafalanViewProps> = ({
  students,
  currentUser,
  onUpdateHafalan,
  onUpdateDoa
}) => {
  const canWrite = currentUser.role === 'pengajar' || currentUser.role === 'kepala' || currentUser.role === 'admin';
  const isWali = currentUser.role === 'wali_murid';

  const [activeSubTab, setActiveSubTab] = useState<'surat' | 'doa'>('surat');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'hafal' | 'sedang' | 'belum'>('all');

  const [selectedStudentId, setSelectedStudentId] = useState<string>(() => {
    if (isWali && currentUser.studentId) {
      return currentUser.studentId;
    }
    return students[0]?.id || '';
  });

  // Ensure selected student id stays in sync if students list changes
  useEffect(() => {
    if ((!selectedStudentId || !students.some(s => s.id === selectedStudentId)) && students.length > 0) {
      if (isWali && currentUser.studentId && students.some(s => s.id === currentUser.studentId)) {
        setSelectedStudentId(currentUser.studentId);
      } else {
        setSelectedStudentId(students[0].id);
      }
    }
  }, [students, selectedStudentId, isWali, currentUser.studentId]);

  const currentStudent = students.find(s => s.id === selectedStudentId) || students[0];

  // Map hafalan with normalized numeric keys
  const studentHafalanMap = new Map<number, StudentHafalanProgress>(
    (currentStudent?.hafalanList || []).map(h => [Number(h.surahNumber), h])
  );

  // Map doa with normalized string keys
  const studentDoaMap = new Map(
    (currentStudent?.doaList || []).map(d => [String(d.id), d])
  );

  const completedSurahCount = (currentStudent?.hafalanList || []).filter(
    h => h.status === 'hafal_lancar' || h.status === 'mutqin'
  ).length;

  const completedDoaCount = (currentStudent?.doaList || []).filter(
    d => d.status === 'hafal_lancar' || d.status === 'mutqin'
  ).length;

  // Traditional reverse order: An-Nas (114) backwards to An-Naba' (78)
  const surahsOrdered = [...JUZ_30_SURAHS].reverse();

  // Quick 1-click toggle lulus
  const toggleSurahHafal = (surahNumber: number, currentStatus: string) => {
    if (!canWrite || !currentStudent) return;
    const isCurrentlyHafal = currentStatus === 'hafal_lancar' || currentStatus === 'mutqin';
    const newStatus = isCurrentlyHafal ? 'belum' : 'hafal_lancar';
    const targetSurah = Number(surahNumber);
    const today = new Date().toISOString().slice(0, 10);

    onUpdateHafalan(
      currentStudent.id,
      targetSurah,
      newStatus,
      newStatus === 'hafal_lancar' ? 'mumtaz' : undefined,
      newStatus === 'hafal_lancar' ? 'Lulus hafalan lancar' : undefined,
      newStatus === 'hafal_lancar' ? today : undefined
    );
  };

  const toggleDoaHafal = (doaId: string, currentStatus: string) => {
    if (!canWrite || !currentStudent || !onUpdateDoa) return;
    const isCurrentlyHafal = currentStatus === 'hafal_lancar' || currentStatus === 'mutqin';
    const newStatus = isCurrentlyHafal ? 'belum' : 'hafal_lancar';
    const today = new Date().toISOString().slice(0, 10);

    onUpdateDoa(
      currentStudent.id,
      doaId,
      newStatus,
      newStatus === 'hafal_lancar' ? 'Hafal lancar beserta artinya' : undefined,
      newStatus === 'hafal_lancar' ? today : undefined
    );
  };

  // State for detailed evaluation modal (Beri Nilai & Catatan)
  const [editingSurah, setEditingSurah] = useState<{
    surahNumber: number;
    surahName: string;
    surahArabic: string;
    totalAyat: number;
    status: 'belum' | 'sedang_menghafal' | 'hafal_lancar' | 'mutqin';
    grade: SetoranGrade;
    notes: string;
    completedDate: string;
  } | null>(null);

  const [editingDoa, setEditingDoa] = useState<{
    doaId: string;
    doaName: string;
    doaArabic: string;
    status: 'belum' | 'sedang_menghafal' | 'hafal_lancar' | 'mutqin';
    notes: string;
    completedDate: string;
  } | null>(null);

  const openSurahEditModal = (surah: SurahMeta, item?: StudentHafalanProgress) => {
    if (!canWrite || !currentStudent) return;
    const today = new Date().toISOString().slice(0, 10);
    setEditingSurah({
      surahNumber: surah.number,
      surahName: surah.name,
      surahArabic: surah.nameArabic,
      totalAyat: surah.totalAyat,
      status: item?.status || 'hafal_lancar',
      grade: item?.grade || 'mumtaz',
      notes: item?.notes || (item?.status === 'mutqin' ? 'Sangat tartil & mutqin' : 'Tajwid dan makhraj lancar'),
      completedDate: item?.completedDate || today
    });
  };

  const handleSaveSurahEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSurah || !currentStudent) return;
    onUpdateHafalan(
      currentStudent.id,
      Number(editingSurah.surahNumber),
      editingSurah.status,
      editingSurah.grade,
      editingSurah.notes.trim() || undefined,
      editingSurah.status === 'hafal_lancar' || editingSurah.status === 'mutqin'
        ? (editingSurah.completedDate || new Date().toISOString().slice(0, 10))
        : undefined
    );
    setEditingSurah(null);
  };

  const openDoaEditModal = (doa: typeof DOA_LIST_DATA[0], item?: { status?: string; notes?: string; completedDate?: string }) => {
    if (!canWrite || !currentStudent) return;
    const today = new Date().toISOString().slice(0, 10);
    setEditingDoa({
      doaId: doa.id,
      doaName: doa.name,
      doaArabic: doa.arabic,
      status: (item?.status as any) || 'hafal_lancar',
      notes: item?.notes || 'Hafal lancar beserta artinya',
      completedDate: item?.completedDate || today
    });
  };

  const handleSaveDoaEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoa || !currentStudent || !onUpdateDoa) return;
    onUpdateDoa(
      currentStudent.id,
      editingDoa.doaId,
      editingDoa.status,
      editingDoa.notes.trim() || undefined,
      editingDoa.status === 'hafal_lancar' || editingDoa.status === 'mutqin'
        ? (editingDoa.completedDate || new Date().toISOString().slice(0, 10))
        : undefined
    );
    setEditingDoa(null);
  };

  // Filter surahs
  const filteredSurahs = surahsOrdered.filter(surah => {
    const item = studentHafalanMap.get(surah.number);
    const status = item?.status || 'belum';
    const isHafal = status === 'hafal_lancar' || status === 'mutqin';

    if (statusFilter === 'hafal' && !isHafal) return false;
    if (statusFilter === 'sedang' && status !== 'sedang_menghafal') return false;
    if (statusFilter === 'belum' && (isHafal || status === 'sedang_menghafal')) return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = surah.name.toLowerCase().includes(q);
      const matchTrans = surah.translation.toLowerCase().includes(q);
      const matchNum = String(surah.number).includes(q);
      if (!matchName && !matchTrans && !matchNum) return false;
    }

    return true;
  });

  // Filter doa
  const filteredDoas = DOA_LIST_DATA.filter(doa => {
    const item = studentDoaMap.get(doa.id);
    const status = item?.status || 'belum';
    const isHafal = status === 'hafal_lancar' || status === 'mutqin';

    if (statusFilter === 'hafal' && !isHafal) return false;
    if (statusFilter === 'sedang' && status !== 'sedang_menghafal') return false;
    if (statusFilter === 'belum' && (isHafal || status === 'sedang_menghafal')) return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = doa.name.toLowerCase().includes(q);
      const matchMeaning = doa.meaning.toLowerCase().includes(q);
      if (!matchName && !matchMeaning) return false;
    }

    return true;
  });

  return (
    <div className="space-y-4">
      
      {/* Header & Student Picker */}
      <div className="bg-white p-5 rounded-xl border border-stone-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-800" />
            <span>{isWali ? 'Daftar Hafalan Surat & Doa Ananda' : 'Target Hafalan Surat Juz 30 & Doa Harian'}</span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Pantau capaian kelulusan hafalan 37 surat pendek Juz 'Amma dan doa harian santri
          </p>
        </div>

        {!isWali && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-semibold text-stone-600 whitespace-nowrap">Pilih Santri:</span>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="text-xs font-bold px-3 py-2 rounded-lg border border-stone-300 bg-white text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-700 shadow-2xs"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.currentLevel})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Sub Tabs: Surat vs Doa */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => { setActiveSubTab('surat'); setSearchTerm(''); setStatusFilter('all'); }}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
            activeSubTab === 'surat'
              ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Surat Pendek Juz 30 ({completedSurahCount}/37)</span>
        </button>

        <button
          onClick={() => { setActiveSubTab('doa'); setSearchTerm(''); setStatusFilter('all'); }}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
            activeSubTab === 'doa'
              ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Doa-Doa Harian ({completedDoaCount}/{DOA_LIST_DATA.length})</span>
        </button>
      </div>

      {/* Progress Strip Banner */}
      {currentStudent && (
        <div className="bg-emerald-900 text-white p-4 sm:p-5 rounded-xl shadow-xs space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="text-xs font-semibold text-emerald-200">
                Santri: <span className="text-white text-sm font-bold">{currentStudent.name}</span> ({currentStudent.nis})
              </div>
              <div className="text-xs text-emerald-300">
                Halaqah: {currentStudent.classGroup} · Posisi Saat Ini: {currentStudent.currentLevel}
              </div>
            </div>

            <div className="text-right">
              {activeSubTab === 'surat' ? (
                <>
                  <span className="text-2xl font-bold font-mono text-white tabular-nums">
                    {completedSurahCount}
                  </span>
                  <span className="text-xs text-emerald-200"> / 37 Surat Hafal ({Math.round((completedSurahCount / 37) * 100)}%)</span>
                </>
              ) : (
                <>
                  <span className="text-2xl font-bold font-mono text-white tabular-nums">
                    {completedDoaCount}
                  </span>
                  <span className="text-xs text-emerald-200"> / {DOA_LIST_DATA.length} Doa Hafal ({Math.round((completedDoaCount / DOA_LIST_DATA.length) * 100)}%)</span>
                </>
              )}
            </div>
          </div>

          <div className="w-full bg-emerald-950/60 rounded-full h-2.5 overflow-hidden border border-emerald-700/50">
            <div
              className="bg-emerald-300 h-full rounded-full transition-all duration-300"
              style={{
                width: activeSubTab === 'surat'
                  ? `${Math.round((completedSurahCount / 37) * 100)}%`
                  : `${Math.round((completedDoaCount / DOA_LIST_DATA.length) * 100)}%`
              }}
            />
          </div>
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="bg-white p-3.5 rounded-xl border border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 shrink-0" />
          <input
            type="text"
            placeholder={activeSubTab === 'surat' ? "Cari nama surat (misal: An-Nas, Al-Ikhlas)..." : "Cari doa harian..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700 text-xs"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="text-stone-400 hover:text-stone-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-stone-500 font-medium mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-2.5 py-1 rounded-md font-semibold text-[11px] transition-colors cursor-pointer border ${
              statusFilter === 'all'
                ? 'bg-stone-900 text-white border-stone-900'
                : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setStatusFilter('hafal')}
            className={`px-2.5 py-1 rounded-md font-semibold text-[11px] transition-colors cursor-pointer border ${
              statusFilter === 'hafal'
                ? 'bg-emerald-800 text-white border-emerald-800'
                : 'bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-50'
            }`}
          >
            ✓ Lulus Hafal
          </button>
          <button
            onClick={() => setStatusFilter('sedang')}
            className={`px-2.5 py-1 rounded-md font-semibold text-[11px] transition-colors cursor-pointer border ${
              statusFilter === 'sedang'
                ? 'bg-amber-700 text-white border-amber-700'
                : 'bg-white text-amber-800 border-amber-200 hover:bg-amber-50'
            }`}
          >
            Sedang Bimbingan
          </button>
          <button
            onClick={() => setStatusFilter('belum')}
            className={`px-2.5 py-1 rounded-md font-semibold text-[11px] transition-colors cursor-pointer border ${
              statusFilter === 'belum'
                ? 'bg-stone-700 text-white border-stone-700'
                : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
            }`}
          >
            Belum Dihafal
          </button>
        </div>
      </div>

      {/* KONTEN 1: SURAT JUZ 30 */}
      {activeSubTab === 'surat' && (
        <div className="bg-white rounded-xl border border-stone-200/90 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-800 font-bold border-b border-stone-200 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-4 w-12 text-center">No</th>
                  <th className="py-2.5 px-4">Nama Surat</th>
                  <th className="py-2.5 px-4 w-28 text-center">Ayat</th>
                  <th className="py-2.5 px-4 w-44">Status Kelulusan</th>
                  <th className="py-2.5 px-4 w-32">Tanggal Lulus</th>
                  <th className="py-2.5 px-4">Catatan Ustadz</th>
                  {canWrite && <th className="py-2.5 px-3 w-48 text-center">Aksi Cepat</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredSurahs.length === 0 ? (
                  <tr>
                    <td colSpan={canWrite ? 7 : 6} className="py-8 text-center text-stone-400">
                      Tidak ada surat yang sesuai dengan pencarian atau filter.
                    </td>
                  </tr>
                ) : (
                  filteredSurahs.map((surah, idx) => {
                    const item = studentHafalanMap.get(surah.number);
                    const status = item?.status || 'belum';
                    const isMutqin = status === 'mutqin';
                    const isLancar = status === 'hafal_lancar';
                    const isHafal = isMutqin || isLancar;
                    const isSedang = status === 'sedang_menghafal';

                    const gradeLabel = item?.grade === 'mumtaz'
                      ? 'Mumtaz (Istimewa)'
                      : item?.grade === 'jayyid_jiddan'
                      ? 'Jayyid Jiddan (Sangat Baik)'
                      : item?.grade === 'jayyid'
                      ? 'Jayyid (Baik)'
                      : item?.grade === 'maqbul'
                      ? 'Maqbul'
                      : null;

                    return (
                      <tr
                        key={surah.number}
                        className={`transition-colors ${isHafal ? 'bg-emerald-50/25 hover:bg-emerald-50/50' : 'hover:bg-stone-50/60'}`}
                      >
                        <td className="py-3 px-4 text-center font-mono font-medium text-stone-500 tabular-nums">
                          {idx + 1}
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-stone-900 text-sm">
                              Surat {surah.name}
                            </span>
                            <span className="font-arabic text-emerald-900 text-base" dir="rtl">
                              ({surah.nameArabic})
                            </span>
                          </div>
                          <div className="text-[11px] text-stone-500 mt-0.5">
                            {surah.translation} · Nomor Al-Qur'an: {surah.number}
                          </div>
                        </td>

                        <td className="py-3 px-4 text-center font-mono tabular-nums text-stone-600">
                          {surah.totalAyat} ayat
                        </td>

                        <td className="py-3 px-4">
                          {isMutqin ? (
                            <div className="space-y-0.5">
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300 shadow-2xs">
                                <Award className="w-3.5 h-3.5 text-emerald-700" />
                                Mutqin (Kuat & Lancar)
                              </span>
                              {gradeLabel && (
                                <div className="text-[10px] text-emerald-700 font-medium ml-1">
                                  Predikat: {gradeLabel}
                                </div>
                              )}
                            </div>
                          ) : isLancar ? (
                            <div className="space-y-0.5">
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                Lulus Hafal
                              </span>
                              {gradeLabel && (
                                <div className="text-[10px] text-emerald-700 font-medium ml-1">
                                  Predikat: {gradeLabel}
                                </div>
                              )}
                            </div>
                          ) : isSedang ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                              <Clock className="w-3.5 h-3.5 text-amber-600" />
                              Sedang Bimbingan
                            </span>
                          ) : (
                            <span className="text-stone-400 text-[11px] font-medium">
                              Belum Dihafal
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 font-mono text-stone-600 tabular-nums">
                          {item?.completedDate ? (
                            <span className="font-semibold text-stone-800">{item.completedDate}</span>
                          ) : (
                            '-'
                          )}
                        </td>

                        <td className="py-3 px-4 text-stone-700">
                          {item?.notes ? (
                            <span className="text-stone-800">{item.notes}</span>
                          ) : isHafal ? (
                            <span className="text-stone-500 italic">Tajwid dan makhraj baik</span>
                          ) : (
                            <span className="text-stone-400">-</span>
                          )}
                        </td>

                        {canWrite && (
                          <td className="py-3 px-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              {/* Main Toggle Button */}
                              <button
                                type="button"
                                onClick={() => toggleSurahHafal(surah.number, item?.status || 'belum')}
                                className={`text-xs px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-all flex items-center gap-1.5 shadow-2xs ${
                                  isHafal
                                    ? 'bg-stone-100 hover:bg-rose-50 text-stone-700 hover:text-rose-700 border border-stone-200 hover:border-rose-300'
                                    : 'bg-emerald-800 hover:bg-emerald-900 text-white border border-emerald-700 active:scale-95'
                                }`}
                              >
                                {isHafal ? (
                                  <>
                                    <span>Batalkan</span>
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Tandai Lulus</span>
                                  </>
                                )}
                              </button>

                              {/* Detail / Evaluasi Button */}
                              <button
                                type="button"
                                onClick={() => openSurahEditModal(surah, item)}
                                title="Beri nilai dan catatan ustadz"
                                className="p-1.5 text-stone-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg border border-stone-200 hover:border-emerald-200 transition-colors cursor-pointer"
                              >
                                <SlidersHorizontal className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* KONTEN 2: DOA-DOA HARIAN */}
      {activeSubTab === 'doa' && (
        <div className="bg-white rounded-xl border border-stone-200/90 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-800 font-bold border-b border-stone-200 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-4 w-12 text-center">No</th>
                  <th className="py-2.5 px-4 w-52">Nama Doa</th>
                  <th className="py-2.5 px-4">Lafadz Doa & Artinya</th>
                  <th className="py-2.5 px-4 w-36">Status Hafalan</th>
                  <th className="py-2.5 px-4 w-28">Tanggal Lulus</th>
                  {canWrite && <th className="py-2.5 px-3 w-48 text-center">Aksi Cepat</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredDoas.length === 0 ? (
                  <tr>
                    <td colSpan={canWrite ? 6 : 5} className="py-8 text-center text-stone-400">
                      Tidak ada doa yang sesuai dengan pencarian atau filter.
                    </td>
                  </tr>
                ) : (
                  filteredDoas.map((doa, idx) => {
                    const item = studentDoaMap.get(doa.id);
                    const status = item?.status || 'belum';
                    const isHafal = status === 'hafal_lancar' || status === 'mutqin';
                    const isSedang = status === 'sedang_menghafal';

                    return (
                      <tr
                        key={doa.id}
                        className={`transition-colors ${isHafal ? 'bg-emerald-50/25 hover:bg-emerald-50/50' : 'hover:bg-stone-50/60'}`}
                      >
                        <td className="py-3.5 px-4 text-center font-mono font-medium text-stone-500 tabular-nums align-top">
                          {idx + 1}
                        </td>

                        <td className="py-3.5 px-4 align-top">
                          <div className="font-bold text-stone-900 text-sm">
                            {doa.name}
                          </div>
                          {item?.notes && (
                            <div className="text-[11px] text-stone-500 mt-1 italic">
                              Catatan: {item.notes}
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-4 align-top space-y-1">
                          <div className="font-arabic text-base sm:text-lg text-emerald-950 font-semibold" dir="rtl">
                            {doa.arabic}
                          </div>
                          <div className="text-[11px] text-stone-600 italic">
                            "{doa.latin}"
                          </div>
                          <div className="text-[11px] text-stone-500">
                            Artinya: {doa.meaning}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 align-top">
                          {isHafal ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Lulus Hafal
                            </span>
                          ) : isSedang ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                              <Clock className="w-3.5 h-3.5 text-amber-600" />
                              Sedang Bimbingan
                            </span>
                          ) : (
                            <span className="text-stone-400 text-[11px]">
                              Belum Dihafal
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 font-mono text-stone-600 tabular-nums align-top">
                          {item?.completedDate ? (
                            <span className="font-semibold text-stone-800">{item.completedDate}</span>
                          ) : (
                            '-'
                          )}
                        </td>

                        {canWrite && (
                          <td className="py-3.5 px-3 text-center align-top">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => toggleDoaHafal(doa.id, item?.status || 'belum')}
                                className={`text-xs px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-all flex items-center gap-1.5 shadow-2xs ${
                                  isHafal
                                    ? 'bg-stone-100 hover:bg-rose-50 text-stone-700 hover:text-rose-700 border border-stone-200 hover:border-rose-300'
                                    : 'bg-emerald-800 hover:bg-emerald-900 text-white border border-emerald-700 active:scale-95'
                                }`}
                              >
                                {isHafal ? (
                                  <>
                                    <span>Batalkan</span>
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Tandai Lulus</span>
                                  </>
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={() => openDoaEditModal(doa, item)}
                                title="Beri catatan & ubah status doa"
                                className="p-1.5 text-stone-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg border border-stone-200 hover:border-emerald-200 transition-colors cursor-pointer"
                              >
                                <SlidersHorizontal className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: DETAIL & BERI NILAI SURAT */}
      {editingSurah && currentStudent && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden">
            <div className="bg-emerald-900 text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-emerald-200 uppercase tracking-wider">
                  Evaluasi Hafalan Surat Juz 30
                </span>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <span>Surat {editingSurah.surahName}</span>
                  <span className="font-arabic text-emerald-300 text-base">({editingSurah.surahArabic})</span>
                </h3>
                <p className="text-xs text-emerald-300 mt-0.5">
                  Santri: <strong>{currentStudent.name}</strong> ({currentStudent.nis})
                </p>
              </div>
              <button
                onClick={() => setEditingSurah(null)}
                className="text-emerald-300 hover:text-white p-1 rounded-lg hover:bg-emerald-800/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSurahEdit} className="p-5 space-y-4">
              {/* Status Hafalan */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Status Kelulusan Hafalan:
                </label>
                <select
                  value={editingSurah.status}
                  onChange={(e) => setEditingSurah({ ...editingSurah, status: e.target.value as any })}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-stone-300 bg-white text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                >
                  <option value="hafal_lancar">✓ Lulus Hafal (Lancar)</option>
                  <option value="mutqin">★ Mutqin (Sangat Lancar, Kuat & Tartil)</option>
                  <option value="sedang_menghafal">⏳ Sedang Dalam Bimbingan Menghafal</option>
                  <option value="belum">Belum Dihafal</option>
                </select>
              </div>

              {/* Predikat / Nilai */}
              {(editingSurah.status === 'hafal_lancar' || editingSurah.status === 'mutqin') && (
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Predikat / Kualitas Hafalan:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'mumtaz', label: 'Mumtaz (Istimewa)' },
                      { id: 'jayyid_jiddan', label: 'Jayyid Jiddan (Amat Baik)' },
                      { id: 'jayyid', label: 'Jayyid (Baik)' },
                      { id: 'maqbul', label: 'Maqbul (Cukup)' },
                    ].map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setEditingSurah({ ...editingSurah, grade: g.id as any })}
                        className={`text-xs font-semibold py-2 px-3 rounded-lg border text-left transition-colors cursor-pointer ${
                          editingSurah.grade === g.id
                            ? 'bg-emerald-50 border-emerald-600 text-emerald-900 font-bold'
                            : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tanggal Kelulusan */}
              {(editingSurah.status === 'hafal_lancar' || editingSurah.status === 'mutqin') && (
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Tanggal Lulus Setoran:
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      type="date"
                      value={editingSurah.completedDate}
                      onChange={(e) => setEditingSurah({ ...editingSurah, completedDate: e.target.value })}
                      className="w-full text-xs font-mono pl-9 pr-3 py-2 rounded-lg border border-stone-300 bg-white text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                    />
                  </div>
                </div>
              )}

              {/* Catatan Ustadz */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Catatan & Evaluasi Ustadz/Ustadzah:
                </label>
                <textarea
                  rows={3}
                  value={editingSurah.notes}
                  onChange={(e) => setEditingSurah({ ...editingSurah, notes: e.target.value })}
                  placeholder="Contoh: Makhraj dan tajwid sangat baik, waqaf sempurna..."
                  className="w-full text-xs p-3 rounded-lg border border-stone-300 bg-white text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />

                {/* Quick notes pills */}
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {[
                    'Tajwid & makhraj fasih',
                    'Lancar tanpa jeda',
                    'Perlu penguatan waqaf',
                    'Alhamdulillah mutqin',
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setEditingSurah({ ...editingSurah, notes: preset })}
                      className="text-[10px] bg-stone-100 hover:bg-emerald-50 text-stone-600 hover:text-emerald-800 px-2 py-0.5 rounded cursor-pointer border border-stone-200"
                    >
                      + {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setEditingSurah(null)}
                  className="px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  Simpan Evaluasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DETAIL & EVALUASI DOA */}
      {editingDoa && currentStudent && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden">
            <div className="bg-emerald-900 text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-emerald-200 uppercase tracking-wider">
                  Evaluasi Hafalan Doa Harian
                </span>
                <h3 className="text-lg font-bold">
                  {editingDoa.doaName}
                </h3>
                <p className="text-xs text-emerald-300 mt-0.5">
                  Santri: <strong>{currentStudent.name}</strong> ({currentStudent.nis})
                </p>
              </div>
              <button
                onClick={() => setEditingDoa(null)}
                className="text-emerald-300 hover:text-white p-1 rounded-lg hover:bg-emerald-800/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDoaEdit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Status Kelulusan Doa:
                </label>
                <select
                  value={editingDoa.status}
                  onChange={(e) => setEditingDoa({ ...editingDoa, status: e.target.value as any })}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-stone-300 bg-white text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                >
                  <option value="hafal_lancar">✓ Lulus Hafal Lancar</option>
                  <option value="mutqin">★ Mutqin (Hafal Lancar + Artinya)</option>
                  <option value="sedang_menghafal">⏳ Sedang Dalam Bimbingan</option>
                  <option value="belum">Belum Dihafal</option>
                </select>
              </div>

              {(editingDoa.status === 'hafal_lancar' || editingDoa.status === 'mutqin') && (
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Tanggal Lulus:
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      type="date"
                      value={editingDoa.completedDate}
                      onChange={(e) => setEditingDoa({ ...editingDoa, completedDate: e.target.value })}
                      className="w-full text-xs font-mono pl-9 pr-3 py-2 rounded-lg border border-stone-300 bg-white text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Catatan Tambahan:
                </label>
                <textarea
                  rows={3}
                  value={editingDoa.notes}
                  onChange={(e) => setEditingDoa({ ...editingDoa, notes: e.target.value })}
                  placeholder="Contoh: Lafadz jelas dan hafal artinya..."
                  className="w-full text-xs p-3 rounded-lg border border-stone-300 bg-white text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setEditingDoa(null)}
                  className="px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  Simpan Evaluasi Doa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
