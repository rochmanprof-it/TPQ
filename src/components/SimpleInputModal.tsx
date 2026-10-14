import React, { useState, useEffect } from 'react';
import { Student, SetoranRecord, SetoranType, SetoranGrade, ProgressAction, AttendanceStatus, User } from '../types';
import { JUZ_30_SURAHS, IQRO_LEVELS, DOA_HARIAN } from '../data/quranData';
import { X, Check, BookOpen } from 'lucide-react';

interface SimpleInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  currentUser: User;
  onSave: (record: Omit<SetoranRecord, 'id' | 'timestamp'>) => void;
  editingRecord?: SetoranRecord | null;
  onUpdate?: (record: SetoranRecord) => void;
}

export const SimpleInputModal: React.FC<SimpleInputModalProps> = ({
  isOpen,
  onClose,
  students,
  currentUser,
  onSave,
  editingRecord,
  onUpdate
}) => {
  const [studentId, setStudentId] = useState(students[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus>('hadir');
  
  // Recitation
  const [category, setCategory] = useState<'iqro' | 'surat' | 'doa' | 'quran'>('iqro');
  const [selectedPreset, setSelectedPreset] = useState('Iqro Jilid 4');
  const [halamanAyat, setHalamanAyat] = useState('Halaman 15');
  const [statusKelanjutan, setStatusKelanjutan] = useState<ProgressAction>('lanjut');
  const [kelancaran, setKelancaran] = useState<SetoranGrade>('mumtaz');
  const [komentarEvaluasi, setKomentarEvaluasi] = useState('Alhamdulillah bacaan lancar dan tartil. Pertahankan semangatnya.');

  // Pre-fill fields when modal opens or editingRecord changes
  useEffect(() => {
    if (editingRecord) {
      setStudentId(editingRecord.studentId);
      setDate(editingRecord.date);
      setAttendanceStatus(editingRecord.attendanceStatus || 'hadir');
      setHalamanAyat(editingRecord.halamanAyat);
      setStatusKelanjutan(editingRecord.statusKelanjutan);
      setKelancaran(editingRecord.kelancaran);
      setKomentarEvaluasi(editingRecord.komentarEvaluasi);

      if (editingRecord.type === 'hafalan_surat') {
        setCategory('surat');
        setSelectedPreset(editingRecord.materi.replace(/^Surat\s+/i, ''));
      } else if (editingRecord.type === 'doa_harian') {
        setCategory('doa');
        setSelectedPreset(editingRecord.materi);
      } else if (editingRecord.type === 'tadarus_quran') {
        setCategory('quran');
        setSelectedPreset(editingRecord.materi);
      } else {
        setCategory('iqro');
        setSelectedPreset(editingRecord.materi);
      }
    } else {
      setStudentId(students[0]?.id || '');
      setDate(new Date().toISOString().slice(0, 10));
      setAttendanceStatus('hadir');
      setCategory('iqro');
      setSelectedPreset('Iqro Jilid 4');
      setHalamanAyat('Halaman 15');
      setStatusKelanjutan('lanjut');
      setKelancaran('mumtaz');
      setKomentarEvaluasi('Alhamdulillah bacaan lancar dan tartil. Pertahankan semangatnya.');
    }
  }, [editingRecord, isOpen, students]);

  if (!isOpen) return null;

  const selectedStudent = students.find(s => s.id === studentId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    let materiName = selectedPreset;
    let setoranType: SetoranType = 'iqro';

    if (category === 'surat') {
      materiName = selectedPreset.startsWith('Surat') ? selectedPreset : `Surat ${selectedPreset}`;
      setoranType = 'hafalan_surat';
    } else if (category === 'doa') {
      materiName = selectedPreset;
      setoranType = 'doa_harian';
    } else if (category === 'quran') {
      materiName = selectedPreset;
      setoranType = 'tadarus_quran';
    }

    if (editingRecord && onUpdate) {
      onUpdate({
        ...editingRecord,
        studentId: selectedStudent.id,
        studentName: selectedStudent.name,
        date,
        type: setoranType,
        materi: materiName,
        halamanAyat: halamanAyat.trim() || 'Halaman 1',
        attendanceStatus,
        kelancaran,
        statusKelanjutan,
        komentarEvaluasi: komentarEvaluasi.trim() || 'Bacaan baik dan lancar.',
        ustadzName: currentUser.name
      });
    } else {
      onSave({
        studentId: selectedStudent.id,
        studentName: selectedStudent.name,
        date,
        type: setoranType,
        materi: materiName,
        halamanAyat: halamanAyat.trim() || 'Halaman 1',
        attendanceStatus,
        kelancaran,
        statusKelanjutan,
        komentarEvaluasi: komentarEvaluasi.trim() || 'Bacaan baik dan lancar.',
        ustadzName: currentUser.name
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl border border-stone-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-stone-100 flex items-center justify-between bg-stone-50">
          <div>
            <h3 className="text-base font-bold text-stone-900">
              {editingRecord ? 'Edit Catatan Ngaji & Kehadiran' : 'Catat Ngaji & Kehadiran Santri'}
            </h3>
            <p className="text-xs text-stone-500">
              Dicatat oleh: <span className="font-semibold text-stone-800">{currentUser.name}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-200/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
          
          {/* 1. Nama Murid & Tanggal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-800 mb-1">
                1. Nama Murid / Santri *
              </label>
              <select
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full text-xs rounded-lg border border-stone-300 p-2 font-medium bg-white text-stone-900 focus:ring-2 focus:ring-emerald-700"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.currentLevel})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-800 mb-1">
                2. Tanggal Ngaji *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full text-xs rounded-lg border border-stone-300 p-2 bg-white text-stone-900 focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>

          {/* 2. Status Kehadiran Santri */}
          <div>
            <label className="block font-bold text-stone-800 mb-1">
              3. Status Kehadiran *
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { key: 'hadir', label: 'Hadir', activeBg: 'bg-emerald-800 text-white' },
                { key: 'izin', label: 'Izin', activeBg: 'bg-blue-700 text-white' },
                { key: 'sakit', label: 'Sakit', activeBg: 'bg-amber-600 text-white' },
                { key: 'alpa', label: 'Alpa', activeBg: 'bg-rose-700 text-white' }
              ].map(opt => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setAttendanceStatus(opt.key as AttendanceStatus)}
                  className={`py-2 px-2 text-center rounded-lg border font-semibold transition-all cursor-pointer ${
                    attendanceStatus === opt.key
                      ? `${opt.activeBg} border-transparent shadow-xs`
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Materi & Halaman yang Disetorkan */}
          <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 space-y-3">
            <label className="block font-bold text-stone-800">
              4. Materi & Halaman yang Disetorkan
            </label>

            {/* Pilihan Cepat Kategori */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setCategory('iqro');
                  setSelectedPreset('Iqro Jilid 4');
                  setHalamanAyat('Halaman 15');
                }}
                className={`py-1.5 rounded-md font-semibold text-center border cursor-pointer ${
                  category === 'iqro' ? 'bg-emerald-800 text-white border-emerald-800' : 'bg-white text-stone-700 border-stone-200'
                }`}
              >
                Buku Iqro
              </button>
              <button
                type="button"
                onClick={() => {
                  setCategory('surat');
                  setSelectedPreset('An-Naba\'');
                  setHalamanAyat('Ayat 1 - 20');
                }}
                className={`py-1.5 rounded-md font-semibold text-center border cursor-pointer ${
                  category === 'surat' ? 'bg-emerald-800 text-white border-emerald-800' : 'bg-white text-stone-700 border-stone-200'
                }`}
              >
                Surat Juz 30
              </button>
              <button
                type="button"
                onClick={() => {
                  setCategory('doa');
                  setSelectedPreset('Doa Sebelum Makan');
                  setHalamanAyat('Hafal Lancar & Artinya');
                }}
                className={`py-1.5 rounded-md font-semibold text-center border cursor-pointer ${
                  category === 'doa' ? 'bg-emerald-800 text-white border-emerald-800' : 'bg-white text-stone-700 border-stone-200'
                }`}
              >
                Doa Harian
              </button>
              <button
                type="button"
                onClick={() => {
                  setCategory('quran');
                  setSelectedPreset('Al-Qur\'an Juz 1');
                  setHalamanAyat('Halaman 10');
                }}
                className={`py-1.5 rounded-md font-semibold text-center border cursor-pointer ${
                  category === 'quran' ? 'bg-emerald-800 text-white border-emerald-800' : 'bg-white text-stone-700 border-stone-200'
                }`}
              >
                Al-Qur'an
              </button>
            </div>

            {/* Dropdown Kitab / Surat / Doa */}
            <div>
              {category === 'iqro' ? (
                <select
                  value={selectedPreset}
                  onChange={(e) => setSelectedPreset(e.target.value)}
                  className="w-full text-xs rounded-lg border border-stone-300 p-2 bg-white text-stone-900"
                >
                  {IQRO_LEVELS.slice(0, 6).map(lvl => (
                    <option key={lvl} value={lvl}>{lvl}</option>
                  ))}
                </select>
              ) : category === 'surat' ? (
                <select
                  value={selectedPreset}
                  onChange={(e) => setSelectedPreset(e.target.value)}
                  className="w-full text-xs rounded-lg border border-stone-300 p-2 bg-white text-stone-900"
                >
                  {JUZ_30_SURAHS.map(s => (
                    <option key={s.number} value={s.name}>
                      Surat {s.name} ({s.nameArabic}) - {s.totalAyat} ayat
                    </option>
                  ))}
                </select>
              ) : category === 'doa' ? (
                <select
                  value={selectedPreset}
                  onChange={(e) => setSelectedPreset(e.target.value)}
                  className="w-full text-xs rounded-lg border border-stone-300 p-2 bg-white text-stone-900"
                >
                  {DOA_HARIAN.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={selectedPreset}
                  onChange={(e) => setSelectedPreset(e.target.value)}
                  placeholder="Misal: Al-Qur'an Juz 1 / Surat Al-Baqarah"
                  className="w-full text-xs rounded-lg border border-stone-300 p-2 bg-white text-stone-900"
                />
              )}
            </div>

            {/* Kolom Halaman atau Ayat */}
            <div>
              <label className="block text-[11px] text-stone-600 mb-1">
                Halaman atau Rentang Ayat Disetorkan:
              </label>
              <input
                type="text"
                required
                value={halamanAyat}
                onChange={(e) => setHalamanAyat(e.target.value)}
                placeholder="Contoh: Halaman 15, atau Ayat 1-10"
                className="w-full text-xs rounded-lg border border-stone-300 p-2 bg-white text-stone-900 font-medium"
              />
            </div>
          </div>

          {/* 4. Status Kelanjutan & Predikat */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-800 mb-1">
                Status Kelanjutan:
              </label>
              <select
                value={statusKelanjutan}
                onChange={(e) => setStatusKelanjutan(e.target.value as ProgressAction)}
                className="w-full text-xs rounded-lg border border-stone-300 p-2 bg-white text-stone-900 font-medium"
              >
                <option value="lanjut">✓ Lanjut Halaman Berikutnya</option>
                <option value="ulang">↺ Perlu Diulang Pertemuan Depan</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-800 mb-1">
                Predikat Kelancaran:
              </label>
              <select
                value={kelancaran}
                onChange={(e) => setKelancaran(e.target.value as SetoranGrade)}
                className="w-full text-xs rounded-lg border border-stone-300 p-2 bg-white text-stone-900 font-medium"
              >
                <option value="mumtaz">Mumtaz (Sangat Lancar)</option>
                <option value="jayyid_jiddan">Jayyid Jiddan (Lancar)</option>
                <option value="jayyid">Jayyid (Cukup)</option>
                <option value="maqbul">Maqbul (Mengulang)</option>
              </select>
            </div>
          </div>

          {/* 5. Komentar & Evaluasi Pengajar */}
          <div>
            <label className="block font-bold text-stone-800 mb-1">
              5. Catatan / Komentar Evaluasi Pengajar *
            </label>
            <textarea
              required
              rows={3}
              value={komentarEvaluasi}
              onChange={(e) => setKomentarEvaluasi(e.target.value)}
              placeholder="Tuliskan catatan apresiasi, perbaikan makhraj/tajwid, atau pesan untuk orang tua santri..."
              className="w-full text-xs rounded-lg border border-stone-300 p-2.5 text-stone-900 bg-white focus:ring-2 focus:ring-emerald-700"
            />
            {/* Template Cepat */}
            <div className="flex flex-wrap gap-1 mt-1.5">
              {[
                "Bacaan sangat lancar dan tartil.",
                "Perhatikan panjang mad 2 harakat.",
                "Hafalan mutqin, siap lanjut surat berikutnya.",
                "Di rumah mohon sering diulang bersama orang tua."
              ].map(tpl => (
                <button
                  key={tpl}
                  type="button"
                  onClick={() => setKomentarEvaluasi(tpl)}
                  className="text-[10px] bg-stone-100 hover:bg-stone-200 text-stone-700 px-2 py-0.5 rounded cursor-pointer"
                >
                  + {tpl}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-stone-600 hover:text-stone-900 font-medium cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs cursor-pointer"
            >
              Simpan Catatan Ngaji
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
