import React, { useState, useEffect } from 'react';
import { User, Student, AttendanceRecord, SetoranRecord, TPQProfile, SetoranGrade } from './types';
import { storage } from './services/storage';
import { SimpleHeader } from './components/SimpleHeader';
import { SimpleCatatanTable } from './components/SimpleCatatanTable';
import { SimpleInputModal } from './components/SimpleInputModal';
import { SimpleHafalanView } from './components/SimpleHafalanView';
import { SimpleRaportView } from './components/SimpleRaportView';
import { SimpleSantriManager } from './components/SimpleSantriManager';
import { LoginView } from './components/LoginView';
import { BookOpen, CheckCircle2, Award, FileText, UserCheck, ShieldCheck, HeartHandshake } from 'lucide-react';

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [setoran, setSetoran] = useState<SetoranRecord[]>([]);
  const [profile, setProfile] = useState<TPQProfile>(storage.getProfile());

  const [activeTab, setActiveTab] = useState<string>('catatan');
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [editingSetoran, setEditingSetoran] = useState<SetoranRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    const loadedUsers = storage.getUsers();
    const active = storage.getActiveUser();
    const loadedStudents = storage.getStudents();
    const loadedAttendance = storage.getAttendance();
    const loadedSetoran = storage.getSetoran();
    const loadedProfile = storage.getProfile();

    setUsers(loadedUsers);
    setCurrentUser(active);
    setStudents(loadedStudents);
    setAttendance(loadedAttendance);
    setSetoran(loadedSetoran);
    setProfile(loadedProfile);
    setIsLoaded(true);
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    storage.setActiveUser(user);
    setActiveTab('catatan');
    showToast(`✓ Berhasil masuk sebagai ${user.name}`);
  };

  const handleLogout = () => {
    storage.clearActiveUser();
    setCurrentUser(null);
    showToast('✓ Anda telah keluar dari akun');
  };

  const handleSwitchUser = (user: User) => {
    setCurrentUser(user);
    storage.setActiveUser(user);
    setActiveTab('catatan');
    showToast(`✓ Beralih akun ke ${user.name}`);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 text-xs text-stone-500 font-mono">
        Memuat data TPQ...
      </div>
    );
  }

  // Jika belum login, tampilkan portal login peran
  if (!currentUser) {
    return (
      <>
        <LoginView
          users={users}
          onLogin={handleLogin}
        />
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl border border-stone-800 flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}
      </>
    );
  }

  const isWali = currentUser.role === 'wali_murid';
  const childStudent = isWali && currentUser.studentId
    ? students.find(s => s.id === currentUser.studentId) || students[0]
    : null;

  const handleOpenAddSetoran = () => {
    setEditingSetoran(null);
    setIsInputModalOpen(true);
  };

  const handleEditSetoran = (record: SetoranRecord) => {
    setEditingSetoran(record);
    setIsInputModalOpen(true);
  };

  const handleSaveSetoran = (data: Omit<SetoranRecord, 'id' | 'timestamp'>) => {
    storage.addSetoran(data);
    setSetoran([...storage.getSetoran()]);
    setAttendance([...storage.getAttendance()]);
    setStudents([...storage.getStudents()]);
    setIsInputModalOpen(false);
  };

  const handleUpdateSetoran = (record: SetoranRecord) => {
    storage.updateSetoran(record);
    setSetoran([...storage.getSetoran()]);
    setAttendance([...storage.getAttendance()]);
    setStudents([...storage.getStudents()]);
    setIsInputModalOpen(false);
    setEditingSetoran(null);
  };

  const handleDeleteSetoran = (id: string) => {
    storage.deleteSetoran(id);
    setSetoran([...storage.getSetoran()]);
    showToast('✓ Catatan mengaji berhasil dihapus');
  };

  const handleUpdateHafalan = (
    studentId: string,
    surahNumber: number,
    status: 'belum' | 'sedang_menghafal' | 'hafal_lancar' | 'mutqin',
    grade?: SetoranGrade,
    notes?: string
  ) => {
    storage.updateStudentHafalan(studentId, surahNumber, status, grade, notes);
    setStudents([...storage.getStudents()]);
  };

  const handleSaveStudent = (student: Student) => {
    const isNew = !students.some(s => s.id === student.id);
    storage.saveStudent(student);
    setStudents([...storage.getStudents()]);
    setSetoran([...storage.getSetoran()]);
    setAttendance([...storage.getAttendance()]);
    showToast(isNew ? `✓ Santri "${student.name}" berhasil didaftarkan` : `✓ Biodata "${student.name}" berhasil disimpan`);
  };

  const handleDeleteStudent = (id: string) => {
    const student = students.find(s => s.id === id);
    const studentName = student ? student.name : 'Santri';
    storage.deleteStudent(id);
    setStudents([...storage.getStudents()]);
    setSetoran([...storage.getSetoran()]);
    setAttendance([...storage.getAttendance()]);
    showToast(`✓ Santri "${studentName}" berhasil dihapus dari sistem TPQ`);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-between selection:bg-emerald-100 selection:text-emerald-900">
      
      <div>
        {/* Header Bersih & Profil Login Terverifikasi */}
        <SimpleHeader
          currentUser={currentUser}
          users={users}
          onSwitchUser={handleSwitchUser}
          onLogout={handleLogout}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Content Container */}
        <main className="max-w-6xl mx-auto px-4 py-6">
          
          {/* JIKA WALI MURID: TAMPILAN KHUSUS ORANG TUA (SUPER BERSIH & JELAS) */}
          {isWali && childStudent ? (
            <div className="space-y-6">
              
              {/* Ringkasan Profil Anak */}
              <div className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold text-sky-800 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200 inline-block mb-1.5">
                      Buku Laporan Mengaji Santri
                    </span>
                    <h2 className="text-xl font-bold text-stone-900">
                      Ananda {childStudent.name}
                    </h2>
                    <p className="text-xs text-stone-500 mt-0.5">
                      NIS: <span className="font-mono">{childStudent.nis}</span> · Halaqah: {childStudent.classGroup}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setActiveTab('raport')}
                      className={`px-4 py-2 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                        activeTab === 'raport'
                          ? 'bg-stone-900 text-white border-stone-900'
                          : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                      }`}
                    >
                      {activeTab === 'raport' ? '← Kembali ke Buku Harian' : '🖨️ Cetak Lembar Raport'}
                    </button>
                  </div>
                </div>

                {/* 3 Kotak Inti Capaian Anak */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-stone-100 text-xs">
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                    <span className="text-stone-500 block">Posisi Mengaji Saat Ini:</span>
                    <strong className="text-emerald-900 text-sm block mt-0.5">{childStudent.currentLevel}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                    <span className="text-stone-500 block">Daftar Surat Dihafal:</span>
                    <strong className="text-stone-900 text-sm block mt-0.5">
                      {childStudent.hafalanList.filter(h => h.status === 'hafal_lancar' || h.status === 'mutqin').length} dari 37 Surat (Juz 30)
                    </strong>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                    <span className="text-stone-500 block">Kehadiran Mengaji:</span>
                    <strong className="text-stone-900 text-sm block mt-0.5">
                      {attendance.filter(a => a.studentId === childStudent.id && a.status === 'hadir').length} Pertemuan Hadir
                    </strong>
                  </div>
                </div>
              </div>

              {/* Tampilan Konten Wali */}
              {activeTab === 'raport' ? (
                <SimpleRaportView
                  students={[childStudent]}
                  attendance={attendance}
                  setoran={setoran}
                  profile={profile}
                  currentUser={currentUser}
                />
              ) : (
                <div className="space-y-6">
                  {/* Riwayat Setoran Anak */}
                  <SimpleCatatanTable
                    records={setoran}
                    students={[childStudent]}
                    currentUser={currentUser}
                    onOpenAddModal={() => {}}
                    onDeleteRecord={() => {}}
                    onOpenRaport={() => setActiveTab('raport')}
                  />

                  {/* Daftar Surat yang Dihafal Anak */}
                  <SimpleHafalanView
                    students={[childStudent]}
                    currentUser={currentUser}
                    onUpdateHafalan={() => {}}
                  />
                </div>
              )}

            </div>
          ) : (
            /* JIKA PENGAJAR / KEPALA TPQ: TAMPILAN TERPADU */
            <div>
              {activeTab === 'catatan' && (
                <SimpleCatatanTable
                  records={setoran}
                  students={students}
                  currentUser={currentUser}
                  onOpenAddModal={handleOpenAddSetoran}
                  onEditRecord={handleEditSetoran}
                  onDeleteRecord={handleDeleteSetoran}
                  onOpenRaport={() => setActiveTab('raport')}
                />
              )}

              {activeTab === 'santri' && (
                <SimpleSantriManager
                  students={students}
                  currentUser={currentUser}
                  onSaveStudent={handleSaveStudent}
                  onDeleteStudent={handleDeleteStudent}
                  onOpenRaport={() => setActiveTab('raport')}
                />
              )}

              {activeTab === 'hafalan' && (
                <SimpleHafalanView
                  students={students}
                  currentUser={currentUser}
                  onUpdateHafalan={handleUpdateHafalan}
                />
              )}

              {activeTab === 'raport' && (
                <SimpleRaportView
                  students={students}
                  attendance={attendance}
                  setoran={setoran}
                  profile={profile}
                  currentUser={currentUser}
                />
              )}
            </div>
          )}

        </main>
      </div>

      {/* Footer Sederhana */}
      <footer className="no-print border-t border-stone-200 bg-white py-4 text-center text-xs text-stone-500">
        <p className="font-semibold text-stone-800">{profile.name}</p>
        <p className="text-[11px] text-stone-400 mt-0.5">
          Sistem Digital Buku Penghubung & Pelaporan Mengaji Santri TPQ
        </p>
      </footer>

      {/* Modal Input Terpadu (Tambah & Edit) */}
      <SimpleInputModal
        isOpen={isInputModalOpen}
        onClose={() => {
          setIsInputModalOpen(false);
          setEditingSetoran(null);
        }}
        students={students}
        currentUser={currentUser}
        onSave={handleSaveSetoran}
        editingRecord={editingSetoran}
        onUpdate={handleUpdateSetoran}
      />

      {/* Toast Notifikasi Sukses */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl border border-stone-800 flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
