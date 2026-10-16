import React, { useState } from 'react';
import { Student, User } from '../types';
import { Plus, Edit2, Trash2, Search, FileText, UserPlus, Users, Check, X, Phone, BookOpen, AlertCircle } from 'lucide-react';

interface SimpleSantriManagerProps {
  students: Student[];
  currentUser: User;
  onSaveStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onOpenRaport: (student: Student) => void;
}

export const SimpleSantriManager: React.FC<SimpleSantriManagerProps> = ({
  students,
  currentUser,
  onSaveStudent,
  onDeleteStudent,
  onOpenRaport
}) => {
  const canWrite = currentUser.role === 'pengajar' || currentUser.role === 'kepala' || currentUser.role === 'admin';
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  // Form state
  const [nis, setNis] = useState('');
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState<'L' | 'P'>('L');
  const [classGroup, setClassGroup] = useState('Halaqah Ula (Bimbingan Iqro)');
  const [currentLevel, setCurrentLevel] = useState('Iqro Jilid 1 (Hal. 1)');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [address, setAddress] = useState('');

  const openAddModal = () => {
    setEditingStudent(null);
    setNis(`TPQ-${new Date().getFullYear()}-${String(students.length + 1).padStart(3, '0')}`);
    setName('');
    setNickname('');
    setGender('L');
    setClassGroup('Halaqah Ula (Bimbingan Iqro)');
    setCurrentLevel('Iqro Jilid 1 (Hal. 1)');
    setParentName('');
    setParentPhone('');
    setAddress('');
    setIsModalOpen(true);
  };

  const openEditModal = (student: Student) => {
    setEditingStudent(student);
    setNis(student.nis);
    setName(student.name);
    setNickname(student.nickname);
    setGender(student.gender);
    setClassGroup(student.classGroup);
    setCurrentLevel(student.currentLevel);
    setParentName(student.parentName);
    setParentPhone(student.parentPhone);
    setAddress(student.address);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingStudent) {
      // Update existing
      const updated: Student = {
        ...editingStudent,
        nis: nis.trim(),
        name: name.trim(),
        nickname: nickname.trim() || name.trim().split(' ')[0],
        gender,
        classGroup,
        currentLevel: currentLevel.trim(),
        parentName: parentName.trim() || 'Orang Tua Santri',
        parentPhone: parentPhone.trim() || '-',
        address: address.trim() || '-'
      };
      onSaveStudent(updated);
    } else {
      // Create new
      const newStudent: Student = {
        id: `santri-${Date.now()}`,
        nis: nis.trim(),
        name: name.trim(),
        nickname: nickname.trim() || name.trim().split(' ')[0],
        gender,
        birthDate: '2018-01-01',
        classGroup,
        currentLevel: currentLevel.trim(),
        parentName: parentName.trim() || 'Orang Tua Santri',
        parentPhone: parentPhone.trim() || '-',
        parentUserId: `user-wali-${Date.now()}`,
        address: address.trim() || '-',
        joinDate: new Date().toISOString().slice(0, 10),
        hafalanList: []
      };
      onSaveStudent(newStudent);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (student: Student) => {
    setStudentToDelete(student);
  };

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.nis.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.currentLevel.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.parentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      
      {/* Top Banner & Main Action */}
      <div className="bg-white p-5 rounded-xl border border-stone-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-800" />
            <span>Kelola Daftar Nama Santri TPQ</span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Fitur khusus Ustadz & Ustadzah untuk menambah santri baru, memperbarui biodata, atau menghapus data santri
          </p>
        </div>

        {canWrite && (
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Tambah Santri Baru</span>
          </button>
        )}
      </div>

      {/* Search & Info Bar */}
      <div className="bg-white p-3 rounded-xl border border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-stone-400 shrink-0" />
          <input
            type="text"
            placeholder="Cari santri berdasarkan nama, NIS, atau wali murid..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-md px-2.5 py-1.5 text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700"
          />
        </div>

        <div className="text-stone-500">
          Total Terdaftar: <strong className="text-stone-900 font-mono tabular-nums">{students.length}</strong> Santri
        </div>
      </div>

      {/* Tabel Data Santri Lengkap dengan Tombol Tambah, Edit, Hapus */}
      <div className="bg-white rounded-xl border border-stone-200/90 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-800 font-bold border-b border-stone-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-3 w-10 text-center">No</th>
                <th className="py-3 px-4 w-44">Nama Santri</th>
                <th className="py-3 px-4 w-28">NIS & Gender</th>
                <th className="py-3 px-4 w-48">Halaqah / Kelas</th>
                <th className="py-3 px-4 w-44">Capaian Saat Ini</th>
                <th className="py-3 px-4">Orang Tua / Wali</th>
                <th className="py-3 px-3 w-36 text-center">Aksi (Edit / Hapus)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-stone-500">
                    <Users className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                    <p className="font-semibold text-stone-700">Tidak ada santri yang ditemukan</p>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      Klik tombol "+ Tambah Santri Baru" untuk mendaftarkan santri.
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((s, index) => {
                  const hafalCount = s.hafalanList.filter(h => h.status === 'hafal_lancar' || h.status === 'mutqin').length;

                  return (
                    <tr key={s.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3 px-3 text-center font-mono font-medium text-stone-400 tabular-nums">
                        {index + 1}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-stone-900 text-sm">
                          {s.name}
                        </div>
                        <div className="text-[11px] text-stone-500">
                          Panggilan: <span className="font-medium text-stone-700">{s.nickname}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-mono text-stone-700 font-semibold text-[11px]">
                          {s.nis}
                        </div>
                        <div className="text-[11px] text-stone-500">
                          {s.gender === 'L' ? 'Ikhwan (L)' : 'Akhwat (P)'}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-medium text-stone-800">
                          {s.classGroup}
                        </div>
                        <div className="text-[10px] text-stone-500">
                          Gabung: {s.joinDate}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-emerald-950">
                          {s.currentLevel}
                        </div>
                        <div className="text-[11px] text-stone-500">
                          Hafalan: <strong className="text-stone-800 font-mono">{hafalCount}</strong>/37 Surat
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-stone-900">
                          {s.parentName}
                        </div>
                        <div className="text-[11px] text-stone-500 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-stone-400" />
                          <span className="font-mono">{s.parentPhone}</span>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Tombol Edit */}
                          <button
                            onClick={() => openEditModal(s)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors cursor-pointer"
                            title="Edit data santri ini"
                          >
                            <Edit2 className="w-3 h-3 text-emerald-700" />
                            <span>Edit</span>
                          </button>

                          {/* Tombol Hapus */}
                          <button
                            onClick={() => setStudentToDelete(s)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md transition-colors cursor-pointer"
                            title="Hapus santri ini"
                          >
                            <Trash2 className="w-3 h-3 text-rose-600" />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah / Edit Santri */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-stone-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="px-5 py-3.5 border-b border-stone-100 flex items-center justify-between bg-stone-50">
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  {editingStudent ? 'Edit Data Santri' : 'Tambah Santri Baru'}
                </h3>
                <p className="text-xs text-stone-500">
                  {editingStudent ? `Memperbarui biodata ananda ${editingStudent.name}` : 'Mendaftarkan santri baru ke sistem TPQ'}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-200/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-3.5 max-h-[80vh] overflow-y-auto text-xs">
              
              {/* Baris 1: Nama Lengkap & Panggilan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-800 mb-1">
                    Nama Lengkap Santri *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Muhammad Farhan Al-Fatih"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs rounded-lg border border-stone-300 p-2 bg-white text-stone-900 font-medium focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-1">
                    Nama Panggilan *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Farhan"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full text-xs rounded-lg border border-stone-300 p-2 bg-white text-stone-900 font-medium focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              {/* Baris 2: NIS & Jenis Kelamin */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-800 mb-1">
                    Nomor Induk Santri (NIS) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: TPQ-2026-007"
                    value={nis}
                    onChange={(e) => setNis(e.target.value)}
                    className="w-full text-xs rounded-lg border border-stone-300 p-2 font-mono bg-white text-stone-900 focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-1">
                    Jenis Kelamin *
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'L' | 'P')}
                    className="w-full text-xs rounded-lg border border-stone-300 p-2 bg-white text-stone-900 font-medium focus:ring-2 focus:ring-emerald-700"
                  >
                    <option value="L">Laki-laki (Ikhwan)</option>
                    <option value="P">Perempuan (Akhwat)</option>
                  </select>
                </div>
              </div>

              {/* Baris 3: Kelompok Halaqah & Capaian Awal/Saat Ini */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-800 mb-1">
                    Kelompok Halaqah *
                  </label>
                  <select
                    value={classGroup}
                    onChange={(e) => setClassGroup(e.target.value)}
                    className="w-full text-xs rounded-lg border border-stone-300 p-2 bg-white text-stone-900 font-medium focus:ring-2 focus:ring-emerald-700"
                  >
                    <option value="Halaqah Ula (Bimbingan Iqro)">Halaqah Ula (Bimbingan Iqro)</option>
                    <option value="Halaqah Wustha (Tilawah Al-Qur'an)">Halaqah Wustha (Tilawah Al-Qur'an)</option>
                    <option value="Halaqah Tahfidz Khusus (Juz 30)">Halaqah Tahfidz Khusus (Juz 30)</option>
                    <option value="Halaqah Pra-Iqro">Halaqah Pra-Iqro</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-1">
                    Posisi / Capaian Saat Ini *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Iqro Jilid 3 (Hal. 10)"
                    value={currentLevel}
                    onChange={(e) => setCurrentLevel(e.target.value)}
                    className="w-full text-xs rounded-lg border border-stone-300 p-2 bg-white text-stone-900 font-medium focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              {/* Baris 4: Data Orang Tua / Wali */}
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-3">
                <span className="font-bold text-stone-800 block text-xs">
                  Data Orang Tua / Wali Santri
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-600 mb-1 font-semibold">
                      Nama Orang Tua / Wali *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Bpk / Ibu..."
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      className="w-full text-xs rounded-lg border border-stone-300 p-2 bg-white text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-600 mb-1 font-semibold">
                      No. WhatsApp / HP *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="0812-xxxx-xxxx"
                      value={parentPhone}
                      onChange={(e) => setParentPhone(e.target.value)}
                      className="w-full text-xs rounded-lg border border-stone-300 p-2 font-mono bg-white text-stone-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-600 mb-1 font-semibold">
                    Alamat Domisili
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Jl. Melati No. 4, RT 02/05"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full text-xs rounded-lg border border-stone-300 p-2 bg-white text-stone-900"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:text-stone-900 font-medium cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs cursor-pointer"
                >
                  {editingStudent ? 'Simpan Perubahan' : 'Daftarkan Santri'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Santri */}
      {studentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-100">
          <div className="bg-white rounded-2xl shadow-xl border border-stone-200 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-700">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  Hapus Data Santri?
                </h3>
                <p className="text-xs text-stone-500">
                  Tindakan ini tidak dapat dibatalkan
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-3 rounded-lg border border-stone-200">
              Apakah Anda yakin ingin menghapus santri <strong>{studentToDelete.name}</strong> (NIS: <span className="font-mono font-semibold">{studentToDelete.nis}</span>)? Seluruh catatan setoran dan absensinya juga akan dihapus.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStudentToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteStudent(studentToDelete.id);
                  setStudentToDelete(null);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Ya, Hapus Santri
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
