import React, { useState } from 'react';
import { SetoranRecord, Student, User } from '../types';
import { Plus, Search, Filter, BookOpen, Trash2, Award, Calendar, CheckCircle2, RotateCcw } from 'lucide-react';

interface SetoranListProps {
  setoran: SetoranRecord[];
  students: Student[];
  currentUser: User;
  onOpenAddModal: (studentId?: string) => void;
  onDeleteRecord: (id: string) => void;
  onOpenRaport: (student: Student) => void;
}

export const SetoranList: React.FC<SetoranListProps> = ({
  setoran,
  students,
  currentUser,
  onOpenAddModal,
  onDeleteRecord,
  onOpenRaport
}) => {
  const canWrite = currentUser.role === 'pengajar' || currentUser.role === 'kepala';
  const isWali = currentUser.role === 'wali_murid';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudentFilter, setSelectedStudentFilter] = useState<string>('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>('all');

  // If wali murid, strictly restrict to their child's records
  const baseSetoran = isWali && currentUser.studentId
    ? setoran.filter(s => s.studentId === currentUser.studentId)
    : setoran;

  const filteredSetoran = baseSetoran.filter(item => {
    // Search
    const matchSearch =
      item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.materi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.komentarEvaluasi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.halamanAyat.toLowerCase().includes(searchTerm.toLowerCase());

    // Student filter
    const matchStudent = selectedStudentFilter === 'all' || item.studentId === selectedStudentFilter;

    // Type filter
    const matchType = selectedTypeFilter === 'all' || item.type === selectedTypeFilter;

    // Grade filter
    const matchGrade = selectedGradeFilter === 'all' || item.kelancaran === selectedGradeFilter;

    return matchSearch && matchStudent && matchType && matchGrade;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-stone-900">
            {isWali ? 'Riwayat Setoran & Evaluasi Ananda' : 'Catatan Setoran & Evaluasi Mengaji'}
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            {isWali
              ? 'Pantau progres hafalan, halaman mengaji, dan catatan pembimbing'
              : 'Pencatatan perkembangan mengaji santri (Iqro, Al-Qur\'an, Hafalan Surat & Doa)'}
          </p>
        </div>

        {canWrite && (
          <button
            onClick={() => onOpenAddModal()}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Catat Setoran Baru</span>
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200/90 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari santri, surat, atau materi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-stone-200 bg-stone-50/70 text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700"
            />
          </div>

          {/* Student Filter (Disabled for Wali Murid) */}
          {!isWali && (
            <div>
              <select
                value={selectedStudentFilter}
                onChange={(e) => setSelectedStudentFilter(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-stone-200 bg-stone-50/70 text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700"
              >
                <option value="all">Semua Santri ({students.length})</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.nickname})</option>
                ))}
              </select>
            </div>
          )}

          {/* Type Filter */}
          <div>
            <select
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-lg border border-stone-200 bg-stone-50/70 text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700"
            >
              <option value="all">Semua Jenis Materi</option>
              <option value="iqro">Buku Iqro</option>
              <option value="hafalan_surat">Hafalan Surat Pendek</option>
              <option value="tadarus_quran">Al-Qur'an (Tadarus)</option>
              <option value="doa_harian">Doa Harian</option>
            </select>
          </div>

          {/* Grade Filter */}
          <div>
            <select
              value={selectedGradeFilter}
              onChange={(e) => setSelectedGradeFilter(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-lg border border-stone-200 bg-stone-50/70 text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700"
            >
              <option value="all">Semua Predikat</option>
              <option value="mumtaz">Mumtaz (Sangat Lancar)</option>
              <option value="jayyid_jiddan">Jayyid Jiddan (Lancar)</option>
              <option value="jayyid">Jayyid (Cukup)</option>
              <option value="maqbul">Maqbul (Mengulang)</option>
            </select>
          </div>

        </div>

        {/* Active Filters count */}
        <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
          <div>
            Menampilkan <span className="font-semibold text-stone-900 tabular-nums">{filteredSetoran.length}</span> catatan setoran
          </div>
          {(searchTerm || selectedStudentFilter !== 'all' || selectedTypeFilter !== 'all' || selectedGradeFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedStudentFilter('all');
                setSelectedTypeFilter('all');
                setSelectedGradeFilter('all');
              }}
              className="text-emerald-700 hover:text-emerald-800 font-medium cursor-pointer"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Setoran Cards / Feed */}
      {filteredSetoran.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-stone-200">
          <BookOpen className="w-10 h-10 text-stone-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-stone-900">Belum ada catatan setoran</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            {canWrite
              ? 'Klik tombol "Catat Setoran Baru" untuk menambahkan riwayat mengaji santri hari ini.'
              : 'Belum ada catatan yang sesuai dengan filter yang dipilih.'}
          </p>
          {canWrite && (
            <button
              onClick={() => onOpenAddModal()}
              className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Input Setoran Pertama</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSetoran.map((rec) => {
            const student = students.find(s => s.id === rec.studentId);

            return (
              <div
                key={rec.id}
                className="bg-white rounded-xl border border-stone-200/90 p-4 sm:p-5 hover:border-stone-300 transition-all shadow-2xs flex flex-col justify-between"
              >
                <div>
                  
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-stone-900">
                          {rec.studentName}
                        </span>
                        {student && (
                          <span className="text-[11px] text-stone-400 font-mono">
                            {student.nis}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-stone-500 flex items-center gap-1.5 mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        <span className="font-mono tabular-nums">{rec.date}</span>
                        <span>·</span>
                        <span className="capitalize">{rec.type.replace('_', ' ')}</span>
                      </div>
                    </div>

                    {/* Status Kelanjutan Badge */}
                    <div className="text-right shrink-0">
                      {rec.statusKelanjutan === 'lanjut' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Lanjut Halaman
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                          <RotateCcw className="w-3 h-3 text-amber-600" />
                          Perlu Ulang
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Recitation Highlight Box */}
                  <div className="bg-stone-50 rounded-lg p-3 border border-stone-200/60 mb-3 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-stone-900">
                        {rec.materi}
                      </span>
                      <span className="font-mono text-stone-600 font-medium">
                        {rec.halamanAyat}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-stone-500">Predikat:</span>
                      <span className={`font-semibold capitalize ${
                        rec.kelancaran === 'mumtaz' ? 'text-emerald-800' :
                        rec.kelancaran === 'jayyid_jiddan' ? 'text-teal-800' :
                        rec.kelancaran === 'jayyid' ? 'text-amber-800' : 'text-rose-800'
                      }`}>
                        {rec.kelancaran.replace('_', ' ')}
                      </span>
                    </div>

                    {rec.tajwidMakhraj && (
                      <div className="text-[11px] text-stone-600 pt-1 border-t border-stone-200/60">
                        <span className="text-stone-500">Tajwid & Makhraj: </span>
                        {rec.tajwidMakhraj}
                      </div>
                    )}
                  </div>

                  {/* Teacher's Evaluation Comment */}
                  <div className="text-xs text-stone-700 bg-emerald-50/30 rounded-lg p-3 border border-emerald-100/60 mb-3">
                    <div className="text-[11px] font-semibold text-emerald-950 mb-0.5">
                      Komentar Evaluasi Ustadz:
                    </div>
                    <p className="italic text-stone-800 leading-relaxed">
                      "{rec.komentarEvaluasi}"
                    </p>
                  </div>

                </div>

                {/* Card Footer */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <div className="text-[11px]">
                    Disimak oleh: <strong className="text-stone-700">{rec.ustadzName}</strong>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {student && (
                      <button
                        onClick={() => onOpenRaport(student)}
                        className="text-xs text-emerald-800 hover:text-emerald-950 font-medium px-2 py-1 rounded hover:bg-stone-100 transition-colors cursor-pointer"
                        title="Buka Raport Digital"
                      >
                        Buku Raport
                      </button>
                    )}
                    {canWrite && (
                      <button
                        onClick={() => {
                          if (confirm(`Hapus catatan setoran untuk ${rec.studentName}?`)) {
                            onDeleteRecord(rec.id);
                          }
                        }}
                        className="text-stone-400 hover:text-rose-600 p-1 rounded hover:bg-stone-100 transition-colors cursor-pointer"
                        title="Hapus Catatan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
