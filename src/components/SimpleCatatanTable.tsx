import React, { useState } from 'react';
import { SetoranRecord, Student, User } from '../types';
import { Plus, Search, Filter, Trash2, CheckCircle2, RotateCcw, Calendar, BookOpen, Clock, AlertTriangle, Edit3 } from 'lucide-react';

interface SimpleCatatanTableProps {
  records: SetoranRecord[];
  students: Student[];
  currentUser: User;
  onOpenAddModal: () => void;
  onEditRecord?: (record: SetoranRecord) => void;
  onDeleteRecord: (id: string) => void;
  onOpenRaport: (student: Student) => void;
}

export const SimpleCatatanTable: React.FC<SimpleCatatanTableProps> = ({
  records,
  students,
  currentUser,
  onOpenAddModal,
  onEditRecord,
  onDeleteRecord,
  onOpenRaport
}) => {
  const canWrite = currentUser.role === 'pengajar' || currentUser.role === 'kepala' || currentUser.role === 'admin';
  const isWali = currentUser.role === 'wali_murid';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudentFilter, setSelectedStudentFilter] = useState('all');
  const [recordToDelete, setRecordToDelete] = useState<SetoranRecord | null>(null);

  // Filter records
  const filtered = records.filter(item => {
    // If wali, strictly limited
    if (isWali && currentUser.studentId && item.studentId !== currentUser.studentId) {
      return false;
    }
    const matchSearch =
      item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.materi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.halamanAyat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.komentarEvaluasi.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStudent = selectedStudentFilter === 'all' || item.studentId === selectedStudentFilter;
    return matchSearch && matchStudent;
  });

  return (
    <div className="space-y-4">
      
      {/* Top Banner & Main Action Button */}
      <div className="bg-white p-5 rounded-xl border border-stone-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-stone-900 tracking-tight">
            {isWali ? 'Buku Catatan Mengaji Ananda' : 'Daftar Catatan Mengaji & Evaluasi Pengajar'}
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Mencakup riwayat tanggal mengaji, halaman/surat yang disetorkan, status kehadiran, dan evaluasi ustadz
          </p>
        </div>

        {canWrite && (
          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>+ Catat Ngaji & Kehadiran Baru</span>
          </button>
        )}
      </div>

      {/* Filter Sederhana */}
      {!isWali && (
        <div className="bg-white p-3 rounded-xl border border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-stone-400 shrink-0" />
            <input
              type="text"
              placeholder="Cari nama santri, jilid iqro, atau nama surat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-md px-2.5 py-1.5 text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-stone-500 whitespace-nowrap">Filter Santri:</span>
            <select
              value={selectedStudentFilter}
              onChange={(e) => setSelectedStudentFilter(e.target.value)}
              className="bg-white border border-stone-200 rounded-md px-2.5 py-1.5 text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
            >
              <option value="all">Semua Santri ({students.length})</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Tabel Utama yang Sangat Jelas */}
      <div className="bg-white rounded-xl border border-stone-200/90 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-800 font-bold border-b border-stone-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4 w-28">Tanggal</th>
                <th className="py-3 px-4 w-44">Nama Murid</th>
                <th className="py-3 px-4 w-28">Kehadiran</th>
                <th className="py-3 px-4 w-48">Halaman / Surat Disetorkan</th>
                <th className="py-3 px-4">Keterangan & Evaluasi Pengajar</th>
                <th className="py-3 px-4 w-28">Status</th>
                {canWrite && <th className="py-3 px-3 w-20 text-center">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={canWrite ? 7 : 6} className="py-10 text-center text-stone-500">
                    <BookOpen className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                    <p className="font-semibold text-stone-700">Belum ada catatan setoran</p>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      {canWrite ? 'Klik tombol "+ Catat Ngaji & Kehadiran Baru" di atas untuk menambahkan catatan.' : 'Belum ada data untuk santri ini.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const student = students.find(s => s.id === item.studentId);
                  const att = item.attendanceStatus || 'hadir';

                  return (
                    <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                      {/* 1. Tanggal */}
                      <td className="py-3 px-4 font-mono font-medium text-stone-600 align-top tabular-nums whitespace-nowrap">
                        {item.date}
                      </td>

                      {/* 2. Nama Murid */}
                      <td className="py-3 px-4 align-top">
                        <div className="font-bold text-stone-900 text-sm">
                          {item.studentName}
                        </div>
                        {student && (
                          <div className="text-[11px] text-stone-500 mt-0.5">
                            {student.nis} · <span className="text-emerald-800 font-medium">{student.currentLevel}</span>
                          </div>
                        )}
                      </td>

                      {/* 3. Kehadiran */}
                      <td className="py-3 px-4 align-top">
                        {att === 'hadir' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 whitespace-nowrap">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Hadir
                          </span>
                        ) : att === 'izin' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 whitespace-nowrap">
                            <Clock className="w-3 h-3 text-blue-600" />
                            Izin
                          </span>
                        ) : att === 'sakit' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 whitespace-nowrap">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            Sakit
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 whitespace-nowrap">
                            Alpa
                          </span>
                        )}
                      </td>

                      {/* 4. Halaman / Surat Disetorkan */}
                      <td className="py-3 px-4 align-top">
                        <div className="font-bold text-emerald-950">
                          {item.materi}
                        </div>
                        <div className="text-stone-700 font-semibold font-mono text-[11px] mt-0.5">
                          {item.halamanAyat}
                        </div>
                        <div className="text-[10px] text-stone-500 mt-0.5 capitalize">
                          Predikat: <strong className="text-stone-800">{item.kelancaran.replace('_', ' ')}</strong>
                        </div>
                      </td>

                      {/* 5. Keterangan / Komentar Evaluasi Pengajar */}
                      <td className="py-3 px-4 align-top leading-relaxed">
                        <div className="text-stone-800 font-medium bg-stone-50 p-2.5 rounded-lg border border-stone-200/60">
                          "{item.komentarEvaluasi}"
                        </div>
                        {item.tajwidMakhraj && (
                          <div className="text-[11px] text-stone-500 mt-1">
                            <span className="font-semibold text-stone-600">Catatan Tajwid: </span>
                            {item.tajwidMakhraj}
                          </div>
                        )}
                        <div className="text-[10px] text-stone-400 mt-1">
                          Pengajar: {item.ustadzName}
                        </div>
                      </td>

                      {/* 6. Status Lanjut / Ulang */}
                      <td className="py-3 px-4 align-top">
                        {item.statusKelanjutan === 'lanjut' ? (
                          <span className="inline-block text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            ✓ Lanjut Halaman
                          </span>
                        ) : (
                          <span className="inline-block text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            ↺ Ulangi
                          </span>
                        )}
                      </td>

                      {/* Aksi Edit & Hapus (Pengajar/Kepala only) */}
                      {canWrite && (
                        <td className="py-3 px-3 text-center align-top whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            {onEditRecord && (
                              <button
                                onClick={() => onEditRecord(item)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors cursor-pointer"
                                title="Edit Catatan Ini"
                              >
                                <Edit3 className="w-3 h-3 text-emerald-700" />
                                <span>Edit</span>
                              </button>
                            )}
                            <button
                              onClick={() => setRecordToDelete(item)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md transition-colors cursor-pointer"
                              title="Hapus Catatan"
                            >
                              <Trash2 className="w-3 h-3 text-rose-600" />
                              <span>Hapus</span>
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

      {/* Modal Konfirmasi Hapus Catatan Mengaji */}
      {recordToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-100">
          <div className="bg-white rounded-2xl shadow-xl border border-stone-200 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-700">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  Hapus Catatan Mengaji?
                </h3>
                <p className="text-xs text-stone-500">
                  Tindakan ini tidak dapat dibatalkan
                </p>
              </div>
            </div>

            <div className="text-xs text-stone-600 bg-stone-50 p-3 rounded-lg border border-stone-200 space-y-1">
              <div>Santri: <strong className="text-stone-900">{recordToDelete.studentName}</strong></div>
              <div>Tanggal: <span className="font-mono text-stone-700">{recordToDelete.date}</span></div>
              <div>Materi: <span className="font-semibold text-emerald-900">{recordToDelete.materi} ({recordToDelete.halamanAyat})</span></div>
              {recordToDelete.komentarEvaluasi && (
                <div className="text-[11px] text-stone-500 italic pt-1 border-t border-stone-200">
                  "{recordToDelete.komentarEvaluasi}"
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRecordToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteRecord(recordToDelete.id);
                  setRecordToDelete(null);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Ya, Hapus Catatan
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
