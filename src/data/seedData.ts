import { User, Student, AttendanceRecord, SetoranRecord, TPQProfile } from '../types';
import { JUZ_30_SURAHS, DOA_LIST_DATA } from './quranData';

export const TPQ_INFO: TPQProfile = {
  name: "TPQ Qurratu A'yun",
  address: "Sidoyoso II no. 37, Simokerto, Surabaya, Jawa Timur",
  phone: "0852-3110-1093",
  kepalaName: "Ustadzah Wahyu",
  skKemenag: ""
};

export const INITIAL_USERS: User[] = [
  {
    id: "user-admin-1",
    username: "admin.tpq",
    name: "Administrator TPQ",
    role: "admin",
    title: "Pengelola Sistem & Akun TPQ",
    email: "admin@gmail.com",
    phone: "0857-0606-5175",
    password: "R@hasia123"
  },
  
  {
    id: "user-ustadzah-1",
    username: "ustadzah.indria",
    name: "Ustadzah Eli Indria",
    role: "pengajar",
    title: "Guru Halaqah Iqro Dasar",
    email: "eliindria24@gmail.com",
    phone: "0852-9029-4643",
    password: "ustadzah123"
  },
  {
    id: "user-kepala-1",
    username: "kepala.tpq",
    name: "Ustadzah Wahyu",
    role: "kepala",
    title: "Kepala Lembaga TPQ",
    email: "wahyu.tpq@gmail.com",
    phone: "0852-3110-1093",
    password: "kepalatpq"
  },
  {
    id: "user-wali-1",
    username: "wali.zaid",
    name: "Bpk. Hendra Wijaya",
    role: "wali_murid",
    title: "Wali dari Zaid Abdullah",
    email: "hendra.w@gmail.com",
    phone: "0812-3456-7890",
    studentId: "santri-001",
    studentName: "Zaid Abdullah",
    password: "walizaid"
  },
  {
    id: "user-wali-2",
    username: "wali.aisyah",
    name: "Ibu Ratna Sari, S.E.",
    role: "wali_murid",
    title: "Wali dari Aisyah Humaira",
    email: "ratnasari@gmail.com",
    phone: "0813-8877-6655",
    studentId: "santri-002",
    studentName: "Aisyah Humaira",
    password: "waliaisyah"
  },
  {
    id: "user-wali-3",
    username: "wali.bilal",
    name: "Bpk. Dedi Pratama",
    role: "wali_murid",
    title: "Wali dari Bilal Al-Ghifari",
    email: "dedi.pratama@gmail.com",
    phone: "0857-1122-3344",
    studentId: "santri-003",
    studentName: "Bilal Al-Ghifari",
    password: "walibilal"
  }
];

function generateInitialDoa(numHafal: number) {
  return DOA_LIST_DATA.map((d, index) => {
    let status: 'belum' | 'sedang_menghafal' | 'hafal_lancar' | 'mutqin' = 'belum';
    let completedDate: string | undefined = undefined;
    let notes: string | undefined = undefined;

    if (index < numHafal) {
      status = index < 3 ? 'mutqin' : 'hafal_lancar';
      completedDate = `2026-0${Math.min(9, Math.floor(index / 2) + 6)}-${12 + (index % 10)}`;
      notes = status === 'mutqin' ? 'Sangat fasih dan hafal di luar kepala' : 'Lancar, lafaz jelas';
    } else if (index === numHafal) {
      status = 'sedang_menghafal';
    }

    return {
      id: d.id,
      doaName: d.name,
      doaArabic: d.arabic,
      status,
      completedDate,
      notes
    };
  });
}


function generateInitialHafalan(numHafal: number) {
  const reversedSurahs = [...JUZ_30_SURAHS].reverse();
  return reversedSurahs.map((s, index) => {
    let status: 'belum' | 'sedang_menghafal' | 'hafal_lancar' | 'mutqin' = 'belum';
    let grade: 'mumtaz' | 'jayyid' | 'maqbul' | undefined = undefined;
    let completedDate: string | undefined = undefined;

    if (index < numHafal) {
      status = index < 4 ? 'mutqin' : 'hafal_lancar';
      grade = 'mumtaz';
      completedDate = `2026-0${Math.min(9, Math.floor(index / 3) + 6)}-${10 + (index % 15)}`;
    } else if (index === numHafal) {
      status = 'sedang_menghafal';
    }

    return {
      surahNumber: s.number,
      surahName: s.name,
      surahArabic: s.nameArabic,
      totalAyat: s.totalAyat,
      status,
      grade,
      completedDate,
      notes: status === 'mutqin' ? 'Sangat tartil & mutqin' : status === 'hafal_lancar' ? 'Lancar, tajwid baik' : undefined
    };
  });
}

export const INITIAL_STUDENTS: Student[] = [
  {
    id: "santri-001",
    nis: "TPQ-2024-001",
    name: "Zaid Abdullah",
    nickname: "Zaid",
    gender: "L",
    birthDate: "2017-05-14",
    classGroup: "Halaqah Ula (Bimbingan Iqro Lanjut)",
    currentLevel: "Iqro Jilid 5 (Hal. 14)",
    parentName: "Bpk. Hendra Wijaya",
    parentPhone: "0812-3456-7890",
    parentUserId: "user-wali-1",
    address: "Jl. Melati No. 4, RT 02/05, Damai Asri",
    joinDate: "2024-07-15",
    hafalanList: generateInitialHafalan(14),
    doaList: generateInitialDoa(6)
  },
  {
    id: "santri-002",
    nis: "TPQ-2024-002",
    name: "Aisyah Humaira",
    nickname: "Aisyah",
    gender: "P",
    birthDate: "2016-09-22",
    classGroup: "Halaqah Wustha (Tilawah Al-Qur'an)",
    currentLevel: "Al-Qur'an Juz 1 (Hal. 10)",
    parentName: "Ibu Ratna Sari, S.E.",
    parentPhone: "0813-8877-6655",
    parentUserId: "user-wali-2",
    address: "Komplek Taman Indah Blok C3 No. 11",
    joinDate: "2024-01-10",
    hafalanList: generateInitialHafalan(26),
    doaList: generateInitialDoa(10)
  },
  
];


export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  // Today's attendance
  { id: "att-101", studentId: "santri-001", studentName: "Zaid Abdullah", date: "2026-10-13", status: "hadir", note: "Datang tepat waktu & ceria", recordedBy: "Ustadz Ahmad Fauzi, S.Pd.I", timestamp: 1791880000000 },
  { id: "att-102", studentId: "santri-002", studentName: "Aisyah Humaira", date: "2026-10-13", status: "hadir", note: "Membawa Al-Qur'an dan juz 'amma", recordedBy: "Ustadz Ahmad Fauzi, S.Pd.I", timestamp: 1791880100000 },
  { id: "att-103", studentId: "santri-003", studentName: "Bilal Al-Ghifari", date: "2026-10-13", status: "izin", note: "Acara keluarga di luar kota (wali sudah konfirmasi)", recordedBy: "Ustadz Ahmad Fauzi, S.Pd.I", timestamp: 1791880200000 },
  { id: "att-104", studentId: "santri-004", studentName: "Maryam Azzahra", date: "2026-10-13", status: "hadir", note: "Aktif membantu menyimak teman", recordedBy: "Ustadzah Fatimah Azzahra", timestamp: 1791880300000 },
  { id: "att-105", studentId: "santri-005", studentName: "Umar Al-Faruq", date: "2026-10-13", status: "hadir", note: "Fokus belajar huruf hijaiyyah", recordedBy: "Ustadzah Fatimah Azzahra", timestamp: 1791880400000 },
  { id: "att-106", studentId: "santri-006", studentName: "Khadijah An-Nur", date: "2026-10-13", status: "hadir", note: "Semangat latihan waqaf", recordedBy: "Ustadz Ahmad Fauzi, S.Pd.I", timestamp: 1791880500000 },

  // Previous days
  { id: "att-201", studentId: "santri-001", studentName: "Zaid Abdullah", date: "2026-10-12", status: "hadir", recordedBy: "Ustadz Ahmad Fauzi, S.Pd.I", timestamp: 1791793600000 },
  { id: "att-202", studentId: "santri-002", studentName: "Aisyah Humaira", date: "2026-10-12", status: "hadir", recordedBy: "Ustadz Ahmad Fauzi, S.Pd.I", timestamp: 1791793700000 },
  { id: "att-203", studentId: "santri-003", studentName: "Bilal Al-Ghifari", date: "2026-10-12", status: "hadir", recordedBy: "Ustadz Ahmad Fauzi, S.Pd.I", timestamp: 1791793800000 },
  { id: "att-204", studentId: "santri-004", studentName: "Maryam Azzahra", date: "2026-10-12", status: "hadir", recordedBy: "Ustadzah Fatimah Azzahra", timestamp: 1791793900000 },
  { id: "att-205", studentId: "santri-005", studentName: "Umar Al-Faruq", date: "2026-10-12", status: "sakit", note: "Demam, surat dokter via WA", recordedBy: "Ustadzah Fatimah Azzahra", timestamp: 1791794000000 },
  { id: "att-206", studentId: "santri-006", studentName: "Khadijah An-Nur", date: "2026-10-12", status: "hadir", recordedBy: "Ustadz Ahmad Fauzi, S.Pd.I", timestamp: 1791794100000 },

  { id: "att-301", studentId: "santri-001", studentName: "Zaid Abdullah", date: "2026-10-10", status: "hadir", recordedBy: "Ustadz Ahmad Fauzi, S.Pd.I", timestamp: 1791620000000 },
  { id: "att-302", studentId: "santri-002", studentName: "Aisyah Humaira", date: "2026-10-10", status: "hadir", recordedBy: "Ustadz Ahmad Fauzi, S.Pd.I", timestamp: 1791620100000 },
  { id: "att-303", studentId: "santri-003", studentName: "Bilal Al-Ghifari", date: "2026-10-10", status: "hadir", recordedBy: "Ustadz Ahmad Fauzi, S.Pd.I", timestamp: 1791620200000 },
  { id: "att-304", studentId: "santri-004", studentName: "Maryam Azzahra", date: "2026-10-10", status: "hadir", recordedBy: "Ustadzah Fatimah Azzahra", timestamp: 1791620300000 },
  { id: "att-305", studentId: "santri-005", studentName: "Umar Al-Faruq", date: "2026-10-10", status: "hadir", recordedBy: "Ustadzah Fatimah Azzahra", timestamp: 1791620400000 },
  { id: "att-306", studentId: "santri-006", studentName: "Khadijah An-Nur", date: "2026-10-10", status: "hadir", recordedBy: "Ustadz Ahmad Fauzi, S.Pd.I", timestamp: 1791620500000 }
];

export const INITIAL_SETORAN: SetoranRecord[] = [
  {
    id: "set-001",
    studentId: "santri-001",
    studentName: "Zaid Abdullah",
    date: "2026-10-13",
    type: "iqro",
    materi: "Iqro Jilid 5",
    halamanAyat: "Halaman 14 (Baris 1-7)",
    kelancaran: "mumtaz",
    statusKelanjutan: "lanjut",
    tajwidMakhraj: "Makhraj huruf Shad dan Dhad sudah sangat baik. Mad thobi'i tepat 2 harakat.",
    komentarEvaluasi: "Alhamdulillah ananda Zaid sangat tekun dan fokus. Suara lantang dan tajwid rapi. Lanjut ke halaman 15 besok insyaAllah.",
    ustadzName: "Ustadz Ahmad Fauzi, S.Pd.I",
    timestamp: 1791881000000
  },
  {
    id: "set-002",
    studentId: "santri-001",
    studentName: "Zaid Abdullah",
    date: "2026-10-13",
    type: "hafalan_surat",
    materi: "Surat Ad-Duha",
    halamanAyat: "Ayat 1 - 11 (Khatam)",
    kelancaran: "mumtaz",
    statusKelanjutan: "lanjut",
    tajwidMakhraj: "Qalqalah kubro pada akhir ayat terdengar jelas, mad wajib muttashil terjaga.",
    komentarEvaluasi: "Hafalan Surat Ad-Duha tuntas dan dinyatakan lulus munaqosah kelas. Target berikutnya Surat Al-Lail ayat 1-10.",
    ustadzName: "Ustadz Ahmad Fauzi, S.Pd.I",
    timestamp: 1791881500000
  },
  
];
