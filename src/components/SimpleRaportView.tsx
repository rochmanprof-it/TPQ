import React, { useState } from 'react';
import { Student, AttendanceRecord, SetoranRecord, TPQProfile, User } from '../types';
import { Printer, BookOpen, Award, Calendar, CheckCircle2, FileText } from 'lucide-react';

interface SimpleRaportViewProps {
  students: Student[];
  attendance: AttendanceRecord[];
  setoran: SetoranRecord[];
  profile: TPQProfile;
  currentUser: User;
}

export const SimpleRaportView: React.FC<SimpleRaportViewProps> = ({
  students,
  attendance,
  setoran,
  profile,
  currentUser
}) => {
  const isWali = currentUser.role === 'wali_murid';

  const [selectedStudentId, setSelectedStudentId] = useState<string>(() => {
    if (isWali && currentUser.studentId) {
      return currentUser.studentId;
    }
    return students[0]?.id || '';
  });

  const student = students.find(s => s.id === selectedStudentId) || students[0];
  if (!student) return null;

  const studentAttendance = attendance.filter(a => a.studentId === student.id);
  const studentSetoran = setoran.filter(s => s.studentId === student.id);

  const totalMeetings = studentAttendance.length;
  const hadirCount = studentAttendance.filter(a => a.status === 'hadir').length;
  const izinCount = studentAttendance.filter(a => a.status === 'izin').length;
  const sakitCount = studentAttendance.filter(a => a.status === 'sakit').length;
  const presenceRate = totalMeetings > 0 ? Math.round((hadirCount / totalMeetings) * 100) : 100;

  const completedHafalan = student.hafalanList.filter(
    h => h.status === 'hafal_lancar' || h.status === 'mutqin'
  );

  return (
    <div className="space-y-4">
      
      {/* Control Bar (No print) */}
      <div className="no-print bg-white p-4 rounded-xl border border-stone-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {!isWali && (
            <>
              <span className="text-xs font-semibold text-stone-600 whitespace-nowrap">Pilih Santri:</span>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="text-xs font-bold px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-stone-900 focus:ring-1 focus:ring-emerald-700"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.currentLevel})</option>
                ))}
              </select>
            </>
          )}
          {isWali && (
            <span className="text-xs font-bold text-stone-900">
              Raport Digital Ananda: {student.name}
            </span>
          )}
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak Raport (PDF / Print)</span>
        </button>
      </div>

      {/* Printable Sheet */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-10 shadow-sm max-w-4xl mx-auto">
        
        {/* Kop TPQ */}
        <div className="border-b-2 border-stone-800 pb-4 mb-6 text-center">
          <div className="flex items-center justify-center gap-4">
            <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-emerald-800">
              <img
                src="/images/tpq_logo.jpg"
                alt="Logo TPQ"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-stone-900 uppercase">
                {profile.name}
              </h1>
              <p className="text-xs text-stone-600">
                Laporan Hasil Belajar Mengaji & Capaian Hafalan Santri
              </p>
              <p className="text-[11px] text-stone-500">
                {profile.address} · Telp: {profile.phone}
              </p>
            </div>
          </div>
        </div>

        {/* Basmalah */}
        <div className="text-center mb-6">
          <div className="font-arabic text-xl text-stone-800 mb-1" dir="rtl">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>
        </div>

        {/* Data Santri */}
        <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 mb-6 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <span className="text-stone-500 w-28 inline-block">Nama Santri:</span>
              <strong className="text-stone-900">{student.name}</strong>
            </div>
            <div>
              <span className="text-stone-500 w-28 inline-block">Nomor Induk (NIS):</span>
              <strong className="font-mono text-stone-900">{student.nis}</strong>
            </div>
            <div>
              <span className="text-stone-500 w-28 inline-block">Wali Murid:</span>
              <span className="text-stone-800">{student.parentName}</span>
            </div>
            <div>
              <span className="text-stone-500 w-28 inline-block">Capaian Saat Ini:</span>
              <strong className="text-emerald-900">{student.currentLevel}</strong>
            </div>
          </div>
        </div>

        {/* Rekap Kehadiran */}
        <div className="mb-6">
          <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">
            1. Rekap Kehadiran Mengaji
          </h3>
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2 border rounded bg-stone-50">
              <div className="text-stone-500 text-[10px]">Total Pertemuan</div>
              <div className="font-bold text-stone-900 font-mono text-sm">{totalMeetings}</div>
            </div>
            <div className="p-2 border border-emerald-200 rounded bg-emerald-50">
              <div className="text-emerald-700 text-[10px]">Hadir</div>
              <div className="font-bold text-emerald-800 font-mono text-sm">{hadirCount}</div>
            </div>
            <div className="p-2 border border-blue-200 rounded bg-blue-50">
              <div className="text-blue-700 text-[10px]">Izin / Sakit</div>
              <div className="font-bold text-blue-800 font-mono text-sm">{izinCount + sakitCount}</div>
            </div>
            <div className="p-2 border rounded bg-stone-100">
              <div className="text-stone-700 text-[10px]">% Kehadiran</div>
              <div className="font-bold text-stone-900 font-mono text-sm">{presenceRate}%</div>
            </div>
          </div>
        </div>

        {/* Riwayat Setoran & Evaluasi */}
        <div className="mb-6">
          <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">
            2. Riwayat Setoran & Evaluasi Pengajar Terakhir
          </h3>
          <div className="border border-stone-200 rounded-lg overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-stone-100 font-semibold text-stone-700 border-b border-stone-200">
                <tr>
                  <th className="py-2 px-3 w-24">Tanggal</th>
                  <th className="py-2 px-3 w-40">Materi & Halaman</th>
                  <th className="py-2 px-3">Catatan & Komentar Evaluasi Pengajar</th>
                  <th className="py-2 px-3 w-28">Penyimak</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {studentSetoran.slice(0, 5).map(s => (
                  <tr key={s.id}>
                    <td className="py-2 px-3 font-mono text-stone-600 align-top">{s.date}</td>
                    <td className="py-2 px-3 font-medium text-stone-900 align-top">
                      <div>{s.materi}</div>
                      <div className="text-[11px] text-stone-500 font-mono">{s.halamanAyat}</div>
                    </td>
                    <td className="py-2 px-3 text-stone-800 align-top italic">
                      "{s.komentarEvaluasi}"
                    </td>
                    <td className="py-2 px-3 text-stone-600 text-[11px] align-top">{s.ustadzName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Daftar Surat yang Dihafal */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              3. Daftar Surat yang Berhasil Dihafalkan (Juz 30)
            </h3>
            <span className="text-xs font-bold text-emerald-800">
              Total: {completedHafalan.length} dari 37 Surat
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            {completedHafalan.map(h => (
              <div key={h.surahNumber} className="p-2 border border-stone-200 rounded bg-stone-50 flex items-center justify-between">
                <div>
                  <div className="font-bold text-stone-900">{h.surahName}</div>
                  <div className="text-[10px] text-stone-500">{h.totalAyat} ayat</div>
                </div>
                <span className="text-emerald-700 text-[11px] font-bold">✓ Lulus</span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Daftar Doa Harian yang Dihafal */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              4. Capaian Hafalan Doa-Doa Harian
            </h3>
            <span className="text-xs font-bold text-emerald-800">
              Total: {(student.doaList || []).filter(d => d.status === 'hafal_lancar' || d.status === 'mutqin').length} Doa Tuntas
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {(student.doaList || []).filter(d => d.status === 'hafal_lancar' || d.status === 'mutqin').map(d => (
              <div key={d.id} className="p-2 border border-stone-200 rounded bg-stone-50 flex items-center justify-between">
                <span className="font-semibold text-stone-900">{d.doaName}</span>
                <span className="text-emerald-700 text-[11px] font-bold">✓ Lulus Hafal</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tanda Tangan */}
        <div className="grid grid-cols-3 gap-4 text-center text-xs pt-6 border-t border-stone-200">
          <div>
            <p className="text-stone-500 mb-12">Orang Tua / Wali Santri</p>
            <p className="font-bold text-stone-900 border-t border-stone-300 pt-1 inline-block min-w-[120px]">
              {student.parentName}
            </p>
          </div>
          <div>
            <p className="text-stone-500 mb-12">Ustadz Pengajar</p>
            <p className="font-bold text-stone-900 border-t border-stone-300 pt-1 inline-block min-w-[120px]">
              Ustadz Ahmad Fauzi, S.Pd.I
            </p>
          </div>
          <div>
            <p className="text-stone-500 mb-12">Kepala TPQ</p>
            <p className="font-bold text-stone-900 border-t border-stone-300 pt-1 inline-block min-w-[120px]">
              {profile.kepalaName}
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
