import React, { useState } from 'react';
import { Student, User, SetoranGrade } from '../types';
import { JUZ_30_SURAHS, DOA_LIST_DATA } from '../data/quranData';
import { Award, CheckCircle2, Clock, BookOpen, HeartHandshake } from 'lucide-react';

interface SimpleHafalanViewProps {
  students: Student[];
  currentUser: User;
  onUpdateHafalan: (
    studentId: string,
    surahNumber: number,
    status: 'belum' | 'sedang_menghafal' | 'hafal_lancar' | 'mutqin',
    grade?: SetoranGrade,
    notes?: string
  ) => void;
  onUpdateDoa?: (
    studentId: string,
    doaId: string,
    status: 'belum' | 'sedang_menghafal' | 'hafal_lancar' | 'mutqin',
    notes?: string
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

  const [selectedStudentId, setSelectedStudentId] = useState<string>(() => {
    if (isWali && currentUser.studentId) {
      return currentUser.studentId;
    }
    return students[0]?.id || '';
  });

  const currentStudent = students.find(s => s.id === selectedStudentId) || students[0];
  const studentHafalanMap = new Map((currentStudent?.hafalanList || []).map(h => [h.surahNumber, h]));
  const studentDoaMap = new Map((currentStudent?.doaList || []).map(d => [d.id, d]));

  const completedSurahCount = currentStudent?.hafalanList.filter(
    h => h.status === 'hafal_lancar' || h.status === 'mutqin'
  ).length || 0;

  const completedDoaCount = (currentStudent?.doaList || []).filter(
    d => d.status === 'hafal_lancar' || d.status === 'mutqin'
  ).length || 0;

  // Traditional reverse order: An-Nas (114) backwards to An-Naba' (78)
  const surahsOrdered = [...JUZ_30_SURAHS].reverse();

  const toggleSurahHafal = (surahNumber: number, currentStatus: string) => {
    if (!canWrite || !currentStudent) return;
    const newStatus = currentStatus === 'hafal_lancar' || currentStatus === 'mutqin' ? 'belum' : 'hafal_lancar';
    onUpdateHafalan(
      currentStudent.id,
      surahNumber,
      newStatus,
      newStatus === 'hafal_lancar' ? 'mumtaz' : undefined,
      newStatus === 'hafal_lancar' ? 'Lulus hafalan lancar' : undefined
    );
  };

  const toggleDoaHafal = (doaId: string, currentStatus: string) => {
    if (!canWrite || !currentStudent || !onUpdateDoa) return;
    const newStatus = currentStatus === 'hafal_lancar' || currentStatus === 'mutqin' ? 'belum' : 'hafal_lancar';
    onUpdateDoa(
      currentStudent.id,
      doaId,
      newStatus,
      newStatus === 'hafal_lancar' ? 'Hafal lancar beserta artinya' : undefined
    );
  };

  return (
    <div className="space-y-4">
      
      {/* Header & Student Picker */}
      <div className="bg-white p-5 rounded-xl border border-stone-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-stone-900 tracking-tight">
            {isWali ? 'Daftar Hafalan Surat & Doa Ananda' : 'Target Hafalan Surat Juz 30 & Doa Harian'}
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Pantau perkembangan hafalan surat pendek Juz 'Amma dan doa harian santri
          </p>
        </div>

        {!isWali && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-semibold text-stone-600 whitespace-nowrap">Pilih Santri:</span>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="text-xs font-bold px-3 py-2 rounded-lg border border-stone-300 bg-white text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.currentLevel})</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Sub Tabs: Surat vs Doa */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveSubTab('surat')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
            activeSubTab === 'surat'
              ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Surat Pendek Juz 30 ({completedSurahCount}/37)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('doa')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
            activeSubTab === 'doa'
              ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Doa-Doa Harian ({completedDoaCount}/{DOA_LIST_DATA.length})</span>
        </button>
      </div>

      {/* Progress Strip */}
      {currentStudent && (
        <div className="bg-emerald-900 text-white p-4 sm:p-5 rounded-xl shadow-xs space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="text-xs font-semibold text-emerald-200">
                Santri: <span className="text-white text-sm font-bold">{currentStudent.name}</span> ({currentStudent.nis})
              </div>
              <div className="text-xs text-emerald-300">
                Posisi Mengaji: {currentStudent.currentLevel}
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
              className="bg-emerald-300 h-full rounded-full transition-all"
              style={{
                width: activeSubTab === 'surat'
                  ? `${Math.round((completedSurahCount / 37) * 100)}%`
                  : `${Math.round((completedDoaCount / DOA_LIST_DATA.length) * 100)}%`
              }}
            />
          </div>
        </div>
      )}

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
                  <th className="py-2.5 px-4 w-36">Status Kelulusan</th>
                  <th className="py-2.5 px-4 w-32">Tanggal Lulus</th>
                  <th className="py-2.5 px-4">Catatan Ustadz</th>
                  {canWrite && <th className="py-2.5 px-3 w-28 text-center">Aksi Cepat</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {surahsOrdered.map((surah, idx) => {
                  const item = studentHafalanMap.get(surah.number);
                  const isHafal = item?.status === 'hafal_lancar' || item?.status === 'mutqin';
                  const isSedang = item?.status === 'sedang_menghafal';

                  return (
                    <tr key={surah.number} className={isHafal ? 'bg-emerald-50/20 hover:bg-emerald-50/40' : 'hover:bg-stone-50/50'}>
                      <td className="py-2.5 px-4 text-center font-mono font-medium text-stone-500 tabular-nums">
                        {idx + 1}
                      </td>

                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900 text-sm">
                            Surat {surah.name}
                          </span>
                          <span className="font-arabic text-emerald-900 text-base" dir="rtl">
                            ({surah.nameArabic})
                          </span>
                        </div>
                        <div className="text-[11px] text-stone-500">
                          {surah.translation} · Nomor Al-Qur'an: {surah.number}
                        </div>
                      </td>

                      <td className="py-2.5 px-4 text-center font-mono tabular-nums text-stone-600">
                        {surah.totalAyat} ayat
                      </td>

                      <td className="py-2.5 px-4">
                        {isHafal ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Lulus Hafal
                          </span>
                        ) : isSedang ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            Sedang Bimbingan
                          </span>
                        ) : (
                          <span className="text-stone-400 text-[11px]">
                            Belum Dihafal
                          </span>
                        )}
                      </td>

                      <td className="py-2.5 px-4 font-mono text-stone-600 tabular-nums">
                        {item?.completedDate || '-'}
                      </td>

                      <td className="py-2.5 px-4 text-stone-700">
                        {item?.notes || (isHafal ? 'Tajwid dan makhraj baik' : '-')}
                      </td>

                      {canWrite && (
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => toggleSurahHafal(surah.number, item?.status || 'belum')}
                            className={`text-xs px-2.5 py-1 rounded font-semibold cursor-pointer transition-colors ${
                              isHafal
                                ? 'bg-stone-100 hover:bg-rose-50 text-stone-600 hover:text-rose-700'
                                : 'bg-emerald-800 hover:bg-emerald-900 text-white'
                            }`}
                          >
                            {isHafal ? 'Batalkan' : 'Tandai Lulus'}
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* KONTEN 2: DOA-DOA HARIAN (FITUR BARU) */}
      {activeSubTab === 'doa' && (
        <div className="bg-white rounded-xl border border-stone-200/90 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-800 font-bold border-b border-stone-200 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-4 w-12 text-center">No</th>
                  <th className="py-2.5 px-4 w-52">Nama Doa</th>
                  <th className="py-2.5 px-4">Lafadz Doa & Artinya</th>
                  <th className="py-2.5 px-4 w-32">Status Hafalan</th>
                  <th className="py-2.5 px-4 w-28">Tanggal Lulus</th>
                  {canWrite && <th className="py-2.5 px-3 w-28 text-center">Aksi Cepat</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {DOA_LIST_DATA.map((doa, idx) => {
                  const item = studentDoaMap.get(doa.id);
                  const isHafal = item?.status === 'hafal_lancar' || item?.status === 'mutqin';

                  return (
                    <tr key={doa.id} className={isHafal ? 'bg-emerald-50/20 hover:bg-emerald-50/40' : 'hover:bg-stone-50/50'}>
                      <td className="py-3 px-4 text-center font-mono font-medium text-stone-500 tabular-nums align-top">
                        {idx + 1}
                      </td>

                      <td className="py-3 px-4 align-top">
                        <div className="font-bold text-stone-900 text-sm">
                          {doa.name}
                        </div>
                        {item?.notes && (
                          <div className="text-[11px] text-stone-500 mt-1 italic">
                            Catatan: {item.notes}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4 align-top space-y-1">
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

                      <td className="py-3 px-4 align-top">
                        {isHafal ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Lulus Hafal
                          </span>
                        ) : (
                          <span className="text-stone-400 text-[11px]">
                            Belum Dihafal
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 font-mono text-stone-600 tabular-nums align-top">
                        {item?.completedDate || '-'}
                      </td>

                      {canWrite && (
                        <td className="py-3 px-3 text-center align-top">
                          <button
                            onClick={() => toggleDoaHafal(doa.id, item?.status || 'belum')}
                            className={`text-xs px-2.5 py-1 rounded font-semibold cursor-pointer transition-colors ${
                              isHafal
                                ? 'bg-stone-100 hover:bg-rose-50 text-stone-600 hover:text-rose-700'
                                : 'bg-emerald-800 hover:bg-emerald-900 text-white'
                            }`}
                          >
                            {isHafal ? 'Batalkan' : 'Tandai Lulus'}
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
