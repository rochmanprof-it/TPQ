import React, { useState } from 'react';
import { Student, SetoranRecord, SetoranType, SetoranGrade, ProgressAction, User } from '../types';
import { JUZ_30_SURAHS, IQRO_LEVELS, DOA_HARIAN } from '../data/quranData';
import { X, BookCheck, Check, Sparkles } from 'lucide-react';

interface AddSetoranModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  currentUser: User;
  onSave: (record: Omit<SetoranRecord, 'id' | 'timestamp'>) => void;
  preselectedStudentId?: string;
}

export const AddSetoranModal: React.FC<AddSetoranModalProps> = ({
  isOpen,
  onClose,
  students,
  currentUser,
  onSave,
  preselectedStudentId
}) => {
  if (!isOpen) return null;

  const [studentId, setStudentId] = useState(preselectedStudentId || students[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [type, setType] = useState<SetoranType>('iqro');
  const [selectedPresetMateri, setSelectedPresetMateri] = useState('');
  const [customMateri, setCustomMateri] = useState('');
  const [halamanAyat, setHalamanAyat] = useState('');
  const [kelancaran, setKelancaran] = useState<SetoranGrade>('mumtaz');
  const [statusKelanjutan, setStatusKelanjutan] = useState<ProgressAction>('lanjut');
  const [tajwidMakhraj, setTajwidMakhraj] = useState('');
  const [komentarEvaluasi, setKomentarEvaluasi] = useState('');

  const selectedStudent = students.find(s => s.id === studentId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !selectedStudent) return;

    let materiFinal = customMateri.trim();
    if (!materiFinal) {
      if (type === 'hafalan_surat' && selectedPresetMateri) {
        materiFinal = `Surat ${selectedPresetMateri}`;
      } else if (type === 'iqro' && selectedPresetMateri) {
        materiFinal = selectedPresetMateri;
      } else if (type === 'doa_harian' && selectedPresetMateri) {
        materiFinal = selectedPresetMateri;
      } else {
        materiFinal = type === 'iqro' ? 'Iqro' : type === 'hafalan_surat' ? 'Hafalan Surat Pendek' : 'Tadarus Al-Qur\'an';
      }
    }

    onSave({
      studentId,
      studentName: selectedStudent.name,
      date,
      type,
      materi: materiFinal,
      halamanAyat: halamanAyat.trim() || 'Halaman 1',
      kelancaran,
      statusKelanjutan,
      tajwidMakhraj: tajwidMakhraj.trim() || 'Tajwid dan makhraj cukup baik.',
      komentarEvaluasi: komentarEvaluasi.trim() || 'Alhamdulillah bacaan lancar, pertahankan dan terus berlatih di rumah.',
      ustadzName: currentUser.name
    });

    onClose();
  };

  // Quick evaluation template inserters
  const applyTemplate = (note: string) => {
    setKomentarEvaluasi(prev => prev ? `${prev} ${note}` : note);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl border border-stone-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-xs px-6 py-4 border-b border-stone-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <BookCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-stone-900">
                Input Catatan Setoran & Evaluasi Mengaji
              </h3>
              <p className="text-xs text-stone-500">
                Dicatat oleh: <span className="text-stone-700 font-medium">{currentUser.name}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Row 1: Pilih Santri & Tanggal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Nama Murid / Santri *
              </label>
              <select
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
                className="w-full text-sm rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.nis} - {s.currentLevel})
                  </option>
                ))}
              </select>
              {selectedStudent && (
                <div className="text-[11px] text-stone-500 mt-1">
                  Posisi saat ini: <span className="font-medium text-emerald-800">{selectedStudent.currentLevel}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Tanggal Ngaji / Setoran *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full text-sm rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
              />
            </div>
          </div>

          {/* Row 2: Jenis Setoran */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Jenis Pembelajaran / Setoran *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'iqro', label: 'Buku Iqro' },
                { id: 'hafalan_surat', label: 'Hafalan Surat' },
                { id: 'tadarus_quran', label: 'Al-Qur\'an' },
                { id: 'doa_harian', label: 'Doa Harian' },
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setType(item.id as SetoranType);
                    setSelectedPresetMateri('');
                    setCustomMateri('');
                  }}
                  className={`py-2 px-3 text-xs font-medium rounded-lg border transition-all text-center cursor-pointer ${
                    type === item.id
                      ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Row 3: Materi & Halaman/Ayat */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                {type === 'hafalan_surat' ? 'Pilih Surat (Juz 30)' : type === 'iqro' ? 'Pilih Jilid' : 'Materi / Kitab'}
              </label>

              {type === 'hafalan_surat' ? (
                <select
                  value={selectedPresetMateri}
                  onChange={(e) => {
                    setSelectedPresetMateri(e.target.value);
                    setCustomMateri(`Surat ${e.target.value}`);
                  }}
                  className="w-full text-sm rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="">-- Pilih Surat dari Daftar Juz 30 --</option>
                  {JUZ_30_SURAHS.map((s) => (
                    <option key={s.number} value={s.name}>
                      {s.number}. {s.name} ({s.nameArabic}) - {s.totalAyat} ayat
                    </option>
                  ))}
                </select>
              ) : type === 'iqro' ? (
                <select
                  value={selectedPresetMateri}
                  onChange={(e) => {
                    setSelectedPresetMateri(e.target.value);
                    setCustomMateri(e.target.value);
                  }}
                  className="w-full text-sm rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="">-- Pilih Jilid Iqro --</option>
                  {IQRO_LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>{lvl}</option>
                  ))}
                </select>
              ) : type === 'doa_harian' ? (
                <select
                  value={selectedPresetMateri}
                  onChange={(e) => {
                    setSelectedPresetMateri(e.target.value);
                    setCustomMateri(e.target.value);
                  }}
                  className="w-full text-sm rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="">-- Pilih Doa Harian --</option>
                  {DOA_HARIAN.map((doa) => (
                    <option key={doa} value={doa}>{doa}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  placeholder="Misal: Surat Al-Baqarah, Surat Yasin"
                  value={customMateri}
                  onChange={(e) => setCustomMateri(e.target.value)}
                  className="w-full text-sm rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              )}

              {/* Optional custom text input override */}
              {(type === 'hafalan_surat' || type === 'iqro' || type === 'doa_harian') && (
                <input
                  type="text"
                  placeholder="Atau ketik nama materi manual jika tidak ada di pilihan"
                  value={customMateri}
                  onChange={(e) => setCustomMateri(e.target.value)}
                  className="mt-2 w-full text-xs rounded-md border border-stone-200 bg-stone-50 px-2.5 py-1.5 text-stone-800 placeholder:text-stone-400"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Halaman atau Rentang Ayat Disetorkan *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Halaman 15, atau Ayat 1 - 10"
                value={halamanAyat}
                onChange={(e) => setHalamanAyat(e.target.value)}
                className="w-full text-sm rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {['Halaman 1', 'Halaman 15', 'Full 1 Surat', 'Ayat 1-10', 'Ayat 11-20'].map(preset => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setHalamanAyat(preset)}
                    className="text-[11px] px-2 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Row 4: Predikat Kelancaran & Status Kelanjutan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Nilai / Predikat Kelancaran *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'mumtaz', label: 'Mumtaz (Sangat Lancar)', desc: 'Fasih, tanpa jeda' },
                  { id: 'jayyid_jiddan', label: 'Jayyid Jiddan (Lancar)', desc: '1-2 kali terhenti' },
                  { id: 'jayyid', label: 'Jayyid (Cukup)', desc: 'Perlu sedikit bimbingan' },
                  { id: 'maqbul', label: 'Maqbul (Mengulang)', desc: 'Banyak terbata-bata' },
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setKelancaran(item.id as SetoranGrade)}
                    className={`p-2 rounded-lg border text-left text-xs transition-colors cursor-pointer ${
                      kelancaran === item.id
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-medium ring-1 ring-emerald-600'
                        : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                    }`}
                  >
                    <div className="font-semibold">{item.label}</div>
                    <div className="text-[10px] text-stone-500">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Status Kelanjutan Santri *
              </label>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setStatusKelanjutan('lanjut')}
                  className={`w-full p-2.5 rounded-lg border text-left text-xs flex items-center justify-between cursor-pointer transition-colors ${
                    statusKelanjutan === 'lanjut'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-medium'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <div>
                    <span className="font-semibold block">Lanjut ke Halaman / Surat Berikutnya</span>
                    <span className="text-[11px] text-stone-500">Santri telah menguasai materi dengan baik</span>
                  </div>
                  {statusKelanjutan === 'lanjut' && <Check className="w-4 h-4 text-emerald-700" />}
                </button>

                <button
                  type="button"
                  onClick={() => setStatusKelanjutan('ulang')}
                  className={`w-full p-2.5 rounded-lg border text-left text-xs flex items-center justify-between cursor-pointer transition-colors ${
                    statusKelanjutan === 'ulang'
                      ? 'border-amber-600 bg-amber-50 text-amber-900 font-medium'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <div>
                    <span className="font-semibold block">Ulangi Materi Ini Pertemuan Depan</span>
                    <span className="text-[11px] text-stone-500">Perlu penguatan bacaan atau hafalan</span>
                  </div>
                  {statusKelanjutan === 'ulang' && <Check className="w-4 h-4 text-amber-700" />}
                </button>
              </div>
            </div>
          </div>

          {/* Row 5: Catatan Tajwid & Makhorijul Huruf */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Catatan Tajwid & Makhorijul Huruf
            </label>
            <input
              type="text"
              placeholder="Contoh: Makhraj huruf 'Ain dan Ha sudah bersih. Hati-hati panjang mad thobi'i 2 harakat."
              value={tajwidMakhraj}
              onChange={(e) => setTajwidMakhraj(e.target.value)}
              className="w-full text-sm rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          {/* Row 6: Komentar & Evaluasi Pengajar */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-stone-700">
                Komentar Evaluasi & Catatan Khusus Pengajar *
              </label>
              <span className="text-[11px] text-stone-500">
                (Akan tampil di buku raport & dilihat oleh wali murid)
              </span>
            </div>
            <textarea
              required
              rows={3}
              placeholder="Berikan apresiasi dan catatan perbaikan untuk santri dan orang tua..."
              value={komentarEvaluasi}
              onChange={(e) => setKomentarEvaluasi(e.target.value)}
              className="w-full text-sm rounded-lg border border-stone-300 bg-white p-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
            {/* Quick Suggestions */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[
                "Alhamdulillah bacaan tartil dan sangat merdu.",
                "Hafalan lancar tanpa ragu, pertahankan!",
                "Mohon di rumah sering diulang bersama orang tua.",
                "Perhatikan panjang 2 harakat pada huruf mad.",
                "Perlu ketenangan saat membaca ayat panjang."
              ].map((tpl) => (
                <button
                  key={tpl}
                  type="button"
                  onClick={() => applyTemplate(tpl)}
                  className="text-[11px] px-2 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                >
                  + {tpl}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Controls */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Simpan Setoran Santri
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
