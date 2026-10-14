import React, { useState } from 'react';
import { Student, User } from '../types';
import { UserCheck, Award, BookOpen, Plus, FileText, Search, Phone, MapPin, Calendar } from 'lucide-react';

interface StudentListProps {
  students: Student[];
  currentUser: User;
  onOpenRaport: (student: Student) => void;
  onOpenAddSetoran: (studentId: string) => void;
  onSaveStudent: (student: Student) => void;
}

export const StudentList: React.FC<StudentListProps> = ({
  students,
  currentUser,
  onOpenRaport,
  onOpenAddSetoran,
  onSaveStudent
}) => {
  const canWrite = currentUser.role === 'pengajar' || currentUser.role === 'kepala';
  const isWali = currentUser.role === 'wali_murid';

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New student form state
  const [newNis, setNewNis] = useState(`TPQ-2026-0${students.length + 10}`);
  const [newName, setNewName] = useState('');
  const [newNickname, setNewNickname] = useState('');
  const [newGender, setNewGender] = useState<'L' | 'P'>('L');
  const [newBirthDate, setNewBirthDate] = useState('2018-01-01');
  const [newClassGroup, setNewClassGroup] = useState('Halaqah Ula (Bimbingan Iqro)');
  const [newCurrentLevel, setNewCurrentLevel] = useState('Iqro Jilid 1 (Hal. 1)');
  const [newParentName, setNewParentName] = useState('');
  const [newParentPhone, setNewParentPhone] = useState('');
  const [newAddress, setNewAddress] = useState('');

  // If wali murid, strictly restrict to their child
  const baseStudents = isWali && currentUser.studentId
    ? students.filter(s => s.id === currentUser.studentId)
    : students;

  const filteredStudents = baseStudents.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.nis.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.currentLevel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newStudent: Student = {
      id: `santri-${Date.now()}`,
      nis: newNis.trim(),
      name: newName.trim(),
      nickname: newNickname.trim() || newName.trim().split(' ')[0],
      gender: newGender,
      birthDate: newBirthDate,
      classGroup: newClassGroup,
      currentLevel: newCurrentLevel.trim(),
      parentName: newParentName.trim() || 'Orang Tua Santri',
      parentPhone: newParentPhone.trim() || '-',
      parentUserId: `user-wali-${Date.now()}`,
      address: newAddress.trim() || '-',
      joinDate: new Date().toISOString().slice(0, 10),
      hafalanList: []
    };

    onSaveStudent(newStudent);
    setIsAddModalOpen(false);
    // Reset form
    setNewName('');
    setNewNickname('');
    setNewParentName('');
    setNewParentPhone('');
    setNewAddress('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-stone-900">
            {isWali ? 'Profil & Buku Raport Ananda' : 'Direktori Santri & Raport Digital'}
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            {isWali
              ? 'Data identitas, capaian mengaji, dan cetak raport digital ananda'
              : 'Kelola data santri, pantau tingkatan jilid/juz, dan terbitkan raport resmi'}
          </p>
        </div>

        {canWrite && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Santri Baru</span>
          </button>
        )}
      </div>

      {/* Search Input (For Pengajar/Kepala) */}
      {!isWali && (
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari santri berdasarkan nama, NIS, atau tingkatan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-stone-200 bg-white text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
          />
        </div>
      )}

      {/* Student Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map((student) => {
          const completedHafalan = student.hafalanList.filter(
            h => h.status === 'hafal_lancar' || h.status === 'mutqin'
          );

          return (
            <div
              key={student.id}
              className="bg-white rounded-xl border border-stone-200/90 p-5 hover:border-stone-300 transition-all shadow-2xs flex flex-col justify-between"
            >
              <div>
                {/* Header Profile */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm border border-emerald-200 shrink-0">
                      {student.nickname.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-stone-900 leading-tight">
                        {student.name}
                      </h3>
                      <div className="text-xs text-stone-500 flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono">{student.nis}</span>
                        <span>·</span>
                        <span>{student.gender === 'L' ? 'Ikhwan' : 'Akhwat'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Level & Group Info */}
                <div className="bg-stone-50 rounded-lg p-3 border border-stone-100 mb-3 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Capaian Saat Ini:</span>
                    <span className="font-bold text-emerald-800">{student.currentLevel}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Kelompok Halaqah:</span>
                    <span className="text-stone-800 font-medium truncate max-w-[170px]">{student.classGroup}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Hafalan Juz 30:</span>
                    <span className="font-mono font-semibold text-stone-900">
                      {completedHafalan.length} / 37 Surat
                    </span>
                  </div>
                </div>

                {/* Parent & Contact Details */}
                <div className="space-y-1 text-xs text-stone-600 mb-4 px-1">
                  <div className="flex items-center gap-2">
                    <span className="text-stone-400 w-4">Wali:</span>
                    <span className="text-stone-700">{student.parentName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="font-mono text-stone-600">{student.parentPhone}</span>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-stone-100 flex items-center gap-2">
                <button
                  onClick={() => onOpenRaport(student)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-lg transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Buku Raport</span>
                </button>

                {canWrite && (
                  <button
                    onClick={() => onOpenAddSetoran(student.id)}
                    className="inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
                    title="Catat Setoran Untuk Santri Ini"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Setoran</span>
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Add Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-stone-200 w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
              <h3 className="text-base font-semibold text-stone-900">
                Tambah Data Santri Baru
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">NIS *</label>
                  <input
                    type="text"
                    required
                    value={newNis}
                    onChange={(e) => setNewNis(e.target.value)}
                    className="w-full text-xs rounded border border-stone-300 p-2 text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Nama Panggilan *</label>
                  <input
                    type="text"
                    required
                    value={newNickname}
                    onChange={(e) => setNewNickname(e.target.value)}
                    placeholder="Misal: Fauzan"
                    className="w-full text-xs rounded border border-stone-300 p-2 text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Nama Lengkap Santri *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Misal: Ahmad Fauzan Al-Baqir"
                  className="w-full text-xs rounded border border-stone-300 p-2 text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Jenis Kelamin</label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value as 'L' | 'P')}
                    className="w-full text-xs rounded border border-stone-300 p-2 text-stone-900"
                  >
                    <option value="L">Laki-laki (Ikhwan)</option>
                    <option value="P">Perempuan (Akhwat)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Tanggal Lahir</label>
                  <input
                    type="date"
                    value={newBirthDate}
                    onChange={(e) => setNewBirthDate(e.target.value)}
                    className="w-full text-xs rounded border border-stone-300 p-2 text-stone-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Kelas Halaqah</label>
                  <select
                    value={newClassGroup}
                    onChange={(e) => setNewClassGroup(e.target.value)}
                    className="w-full text-xs rounded border border-stone-300 p-2 text-stone-900"
                  >
                    <option value="Halaqah Ula (Bimbingan Iqro)">Halaqah Ula (Bimbingan Iqro)</option>
                    <option value="Halaqah Wustha (Tilawah Al-Qur'an)">Halaqah Wustha (Tilawah Al-Qur'an)</option>
                    <option value="Halaqah Tahfidz Khusus">Halaqah Tahfidz Khusus</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Tingkatan Awal</label>
                  <input
                    type="text"
                    value={newCurrentLevel}
                    onChange={(e) => setNewCurrentLevel(e.target.value)}
                    placeholder="Misal: Iqro Jilid 1 (Hal. 1)"
                    className="w-full text-xs rounded border border-stone-300 p-2 text-stone-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Nama Orang Tua / Wali *</label>
                  <input
                    type="text"
                    required
                    value={newParentName}
                    onChange={(e) => setNewParentName(e.target.value)}
                    placeholder="Bpk / Ibu..."
                    className="w-full text-xs rounded border border-stone-300 p-2 text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Nomor Kontak / WhatsApp</label>
                  <input
                    type="text"
                    value={newParentPhone}
                    onChange={(e) => setNewParentPhone(e.target.value)}
                    placeholder="0812-xxxx-xxxx"
                    className="w-full text-xs rounded border border-stone-300 p-2 text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Alamat Domisili</label>
                <input
                  type="text"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="Jl..."
                  className="w-full text-xs rounded border border-stone-300 p-2 text-stone-900"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg"
                >
                  Simpan Santri
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
