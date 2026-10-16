export type UserRole = 'admin' | 'pengajar' | 'kepala' | 'wali_murid';

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  title?: string; // e.g. "Ustadz Pembimbing", "Kepala TPQ", "Wali Santri"
  email: string;
  phone: string;
  studentId?: string; // If role === 'wali_murid', ID of their child
  studentName?: string;
  avatar?: string;
  password?: string;
}

export type AttendanceStatus = 'hadir' | 'izin' | 'sakit' | 'alpa';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  note?: string;
  recordedBy: string; // Teacher/Principal name
  timestamp: number;
}

export type SetoranType = 'iqro' | 'hafalan_surat' | 'tadarus_quran' | 'doa_harian';
export type SetoranGrade = 'mumtaz' | 'jayyid_jiddan' | 'jayyid' | 'maqbul';
export type ProgressAction = 'lanjut' | 'ulang';

export interface SetoranRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string; // YYYY-MM-DD
  type: SetoranType;
  materi: string; // e.g. "Iqro Jilid 4", "Surat An-Naba'", "Surat Al-A'la", "Doa Sebelum Makan"
  halamanAyat: string; // e.g. "Halaman 18", "Ayat 1-20"
  kelancaran: SetoranGrade;
  statusKelanjutan: ProgressAction; // 'lanjut' or 'ulang'
  attendanceStatus?: AttendanceStatus; // Status kehadiran di hari setoran
  tajwidMakhraj?: string; // Catatan tajwid & makhorijul huruf
  komentarEvaluasi: string; // Evaluasi ustadz
  ustadzName: string;
  timestamp: number;
}

export interface StudentHafalanProgress {
  surahNumber: number;
  surahName: string;
  surahArabic: string;
  totalAyat: number;
  status: 'belum' | 'sedang_menghafal' | 'hafal_lancar' | 'mutqin';
  completedDate?: string;
  grade?: SetoranGrade;
  notes?: string;
}

export interface StudentDoaProgress {
  id: string;
  doaName: string;
  doaArabic?: string;
  status: 'belum' | 'sedang_menghafal' | 'hafal_lancar' | 'mutqin';
  completedDate?: string;
  notes?: string;
}

export interface Student {
  id: string;
  nis: string; // Nomor Induk Santri
  name: string;
  nickname: string;
  gender: 'L' | 'P';
  birthDate: string;
  classGroup: string; // e.g. "Kelas Ula (Iqro)", "Kelas Wustha (Tahfidz)", "Kelas Ulya"
  currentLevel: string; // e.g. "Iqro Jilid 4", "Al-Qur'an Juz 1", "Juz 30 (Surat Al-Buruj)"
  parentName: string;
  parentPhone: string;
  parentUserId: string;
  address: string;
  joinDate: string;
  hafalanList: StudentHafalanProgress[];
  doaList?: StudentDoaProgress[];
}

export interface TPQProfile {
  name: string;
  address: string;
  phone: string;
  kepalaName: string;
  skKemenag?: string;
}
