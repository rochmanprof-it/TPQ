import React from 'react';
import { Student, AttendanceRecord, SetoranRecord, TPQProfile } from '../types';
import { X, Printer, CheckCircle, Award, Calendar, BookOpen, Clock } from 'lucide-react';

interface StudentRaportModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  attendance: AttendanceRecord[];
  setoran: SetoranRecord[];
  profile: TPQProfile;
}

export const StudentRaportModal: React.FC<StudentRaportModalProps> = ({
  isOpen,
  onClose,
  student,
  attendance,
  setoran,
  profile
}) => {
  if (!isOpen) return null;

  // Filter records specifically for this student
  const studentAttendance = attendance.filter(a => a.studentId === student.id);
  const studentSetoran = setoran
    .filter(s => s.studentId === student.id)
    .sort((a, b) => b.timestamp - a.timestamp);

  // Compute attendance stats
  const totalMeetings = studentAttendance.length;
  const hadirCount = studentAttendance.filter(a => a.status === 'hadir').length;
  const izinCount = studentAttendance.filter(a => a.status === 'izin').length;
  const sakitCount = studentAttendance.filter(a => a.status === 'sakit').length;
  const alpaCount = studentAttendance.filter(a => a.status === 'alpa').length;
  const presenceRate = totalMeetings > 0 ? Math.round((hadirCount / totalMeetings) * 100) : 100;

  // Hafalan progress count
  const completedHafalan = student.hafalanList.filter(h => h.status === 'hafal_lancar' || h.status === 'mutqin');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-stone-200 w-full max-w-4xl my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Top Control Bar (Hidden when printing) */}
        <div className="no-print px-6 py-3.5 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-semibold tracking-tight">
              Buku Raport & Kartu Evaluasi Mengaji Santri
            </span>
            <span className="text-xs text-stone-400">· {student.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Raport (PDF / Print)</span>
            </button>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Canvas */}
        <div className="p-6 sm:p-10 text-stone-900 bg-white max-h-[85vh] overflow-y-auto">
          
          {/* Official TPQ Letterhead */}
          <div className="border-b-2 border-stone-800 pb-4 mb-6 text-center relative">
            <div className="flex items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border border-emerald-800">
                <img
                  src="/src/assets/images/tpq_emblem_logo_1791968423601.jpg"
                  alt="TPQ Emblem"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 uppercase">
                  {profile.name}
                </h1>
                <p className="text-xs text-stone-600 mt-0.5">
                  SK Kemenag: {profile.skKemenag || 'Nomor: KD.11.02/5/PP.00.7/2021'}
                </p>
                <p className="text-xs text-stone-500">
                  {profile.address} · Kontak: {profile.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Bismillah & Title */}
          <div className="text-center mb-6">
            <div className="font-arabic text-xl sm:text-2xl text-stone-800 mb-1" dir="rtl">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900 uppercase tracking-wide">
              Laporan Evaluasi Pembelajaran & Capaian Mengaji
            </h2>
            <div className="text-xs text-stone-500">
              Semester Berjalan · Tahun Ajaran 1447 - 1448 H / 2026 M
            </div>
          </div>

          {/* Student Biodata Summary Grid */}
          <div className="bg-stone-50 rounded-lg p-4 border border-stone-200 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs">
              <div className="flex">
                <span className="w-32 text-stone-500">Nama Santri</span>
                <span className="font-semibold text-stone-900">: {student.name}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-stone-500">Nomor Induk (NIS)</span>
                <span className="font-mono text-stone-900">: {student.nis}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-stone-500">Kelompok / Kelas</span>
                <span className="text-stone-900">: {student.classGroup}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-stone-500">Nama Orang Tua / Wali</span>
                <span className="text-stone-900">: {student.parentName}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-stone-500">Capaian Saat Ini</span>
                <span className="font-bold text-emerald-800">: {student.currentLevel}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-stone-500">Tanggal Bergabung</span>
                <span className="text-stone-900">: {student.joinDate}</span>
              </div>
            </div>
          </div>

          {/* Section 1: Rekapitulasi Kehadiran */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-stone-600" />
              1. Rekapitulasi Kehadiran Santri
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
              <div className="p-2.5 rounded border border-stone-200 bg-stone-50">
                <div className="text-stone-500 text-[11px]">Total Pertemuan</div>
                <div className="text-base font-bold text-stone-900 font-mono tabular-nums">{totalMeetings}</div>
              </div>
              <div className="p-2.5 rounded border border-emerald-200 bg-emerald-50/50">
                <div className="text-emerald-700 text-[11px]">Hadir</div>
                <div className="text-base font-bold text-emerald-800 font-mono tabular-nums">{hadirCount}</div>
              </div>
              <div className="p-2.5 rounded border border-blue-200 bg-blue-50/50">
                <div className="text-blue-700 text-[11px]">Izin</div>
                <div className="text-base font-bold text-blue-800 font-mono tabular-nums">{izinCount}</div>
              </div>
              <div className="p-2.5 rounded border border-amber-200 bg-amber-50/50">
                <div className="text-amber-700 text-[11px]">Sakit</div>
                <div className="text-base font-bold text-amber-800 font-mono tabular-nums">{sakitCount}</div>
              </div>
              <div className="p-2.5 rounded border border-stone-200 bg-stone-100">
                <div className="text-stone-700 text-[11px]">Tingkat Kehadiran</div>
                <div className="text-base font-bold text-stone-900 font-mono tabular-nums">{presenceRate}%</div>
              </div>
            </div>
          </div>

          {/* Section 2: Progres Hafalan Surat (Juz 30) */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-stone-600" />
                2. Daftar Surat Yang Dihafalkan (Juz 30)
              </h3>
              <span className="text-xs text-emerald-800 font-medium">
                Tuntas: {completedHafalan.length} dari {student.hafalanList.length} Surat
              </span>
            </div>

            <div className="border border-stone-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-100 text-stone-700 font-semibold border-b border-stone-200">
                  <tr>
                    <th className="py-2 px-3 w-10 text-center">No</th>
                    <th className="py-2 px-3">Nama Surat</th>
                    <th className="py-2 px-3 text-center">Jumlah Ayat</th>
                    <th className="py-2 px-3">Status Hafalan</th>
                    <th className="py-2 px-3">Tanggal Lulus</th>
                    <th className="py-2 px-3">Catatan / Keterangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {student.hafalanList.slice(0, 15).map((h, idx) => (
                    <tr key={h.surahNumber} className={h.status === 'hafal_lancar' || h.status === 'mutqin' ? 'bg-emerald-50/20' : ''}>
                      <td className="py-1.5 px-3 text-center font-mono tabular-nums text-stone-500">{idx + 1}</td>
                      <td className="py-1.5 px-3 font-medium text-stone-900">
                        {h.surahName} <span className="font-arabic text-stone-600 mr-1 font-normal">({h.surahArabic})</span>
                      </td>
                      <td className="py-1.5 px-3 text-center font-mono tabular-nums text-stone-600">{h.totalAyat} ayat</td>
                      <td className="py-1.5 px-3">
                        {h.status === 'mutqin' ? (
                          <span className="text-emerald-800 font-semibold">Mutqin (Kuat & Fasih)</span>
                        ) : h.status === 'hafal_lancar' ? (
                          <span className="text-emerald-700 font-medium">Hafal Lancar</span>
                        ) : h.status === 'sedang_menghafal' ? (
                          <span className="text-amber-700 font-medium">Sedang Berjalan</span>
                        ) : (
                          <span className="text-stone-400">Belum Disetorkan</span>
                        )}
                      </td>
                      <td className="py-1.5 px-3 font-mono text-stone-600">
                        {h.completedDate || '-'}
                      </td>
                      <td className="py-1.5 px-3 text-stone-600">
                        {h.notes || (h.status === 'mutqin' ? 'Mumtaz, tajwid sempurna' : '-')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {student.hafalanList.length > 15 && (
              <div className="text-[11px] text-stone-500 mt-1 italic text-right">
                * Menampilkan ringkasan target hafalan utama santri.
              </div>
            )}
          </div>

          {/* Section 3: Riwayat Setoran & Evaluasi Mengaji Terbaru */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-stone-600" />
              3. Riwayat Setoran Ngaji & Evaluasi Pengajar
            </h3>
            
            <div className="border border-stone-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-100 text-stone-700 font-semibold border-b border-stone-200">
                  <tr>
                    <th className="py-2 px-3 w-24">Tanggal</th>
                    <th className="py-2 px-3 w-36">Materi & Halaman</th>
                    <th className="py-2 px-3 w-24">Kelancaran</th>
                    <th className="py-2 px-3">Catatan Tajwid & Makhorijul Huruf</th>
                    <th className="py-2 px-3">Komentar / Evaluasi Ustadz</th>
                    <th className="py-2 px-3 w-28">Penyimak</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {studentSetoran.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-4 text-center text-stone-500">
                        Belum ada catatan setoran untuk santri ini.
                      </td>
                    </tr>
                  ) : (
                    studentSetoran.slice(0, 8).map((rec) => (
                      <tr key={rec.id}>
                        <td className="py-2 px-3 font-mono tabular-nums text-stone-600 align-top">
                          {rec.date}
                        </td>
                        <td className="py-2 px-3 font-medium text-stone-900 align-top">
                          <div>{rec.materi}</div>
                          <div className="text-[11px] text-stone-500 font-mono">{rec.halamanAyat}</div>
                        </td>
                        <td className="py-2 px-3 align-top">
                          <span className={`capitalize font-semibold ${
                            rec.kelancaran === 'mumtaz' ? 'text-emerald-800' :
                            rec.kelancaran === 'jayyid_jiddan' ? 'text-teal-800' :
                            rec.kelancaran === 'jayyid' ? 'text-amber-800' : 'text-rose-800'
                          }`}>
                            {rec.kelancaran.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-stone-700 align-top text-[11px]">
                          {rec.tajwidMakhraj || '-'}
                        </td>
                        <td className="py-2 px-3 text-stone-800 align-top text-[11px] font-normal leading-relaxed">
                          "{rec.komentarEvaluasi}"
                        </td>
                        <td className="py-2 px-3 text-stone-600 text-[11px] align-top">
                          {rec.ustadzName}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: Catatan Umum & Rekomendasi */}
          <div className="p-3.5 rounded-lg border border-stone-200 bg-stone-50/60 mb-8 text-xs space-y-1">
            <span className="font-semibold text-stone-900 block">Catatan Umum Pembimbing:</span>
            <p className="text-stone-700 leading-relaxed">
              Ananda {student.name} menunjukkan semangat yang baik dalam mengikuti halaqah mengaji. Diharapkan kerja sama orang tua/wali untuk senantiasa membimbing dan mendengarkan muroja'ah hafalan ananda di rumah minimal 15 menit setelah shalat Maghrib.
            </p>
          </div>

          {/* Section 5: Signature Blocks */}
          <div className="grid grid-cols-3 gap-6 text-center text-xs pt-4 border-t border-stone-200">
            <div>
              <p className="text-stone-500 mb-14">Orang Tua / Wali Santri</p>
              <p className="font-semibold text-stone-900 border-t border-stone-300 pt-1 inline-block min-w-[140px]">
                {student.parentName}
              </p>
            </div>
            <div>
              <p className="text-stone-500 mb-14">Ustadz Pembimbing</p>
              <p className="font-semibold text-stone-900 border-t border-stone-300 pt-1 inline-block min-w-[140px]">
                {studentSetoran[0]?.ustadzName || 'Ustadz Ahmad Fauzi, S.Pd.I'}
              </p>
            </div>
            <div>
              <p className="text-stone-500 mb-14">Kepala TPQ</p>
              <p className="font-semibold text-stone-900 border-t border-stone-300 pt-1 inline-block min-w-[140px]">
                {profile.kepalaName}
              </p>
            </div>
          </div>

        </div>

        {/* Modal Footer (No print) */}
        <div className="no-print px-6 py-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <div className="text-xs text-stone-500">
            Format laporan sesuai standar buku penghubung santri TPQ
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
