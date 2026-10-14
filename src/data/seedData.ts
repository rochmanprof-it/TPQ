import { User, Student, AttendanceRecord, SetoranRecord, TPQProfile } from '../types';
import { JUZ_30_SURAHS, DOA_LIST_DATA } from './quranData';

export const TPQ_INFO: TPQProfile = {
  name: "TPQ Al-Ikhlas Nurul Iman",
  address: "Jl. Masjid Baiturrahman No. 12, Kota Damai",
  phone: "0812-9988-7766",
  kepalaName: "Ustadz H. Mansur Al-Hafidz, M.Ag",
  skKemenag: "KD.11.02/5/PP.00.7/1042/2021"
};

export const INITIAL_USERS: User[] = [
  {
    id: "user-ustadz-1",
    username: "ustadz.ahmad",
    name: "Ustadz Ahmad Fauzi, S.Pd.I",
    role: "pengajar",
    title: "Guru Halaqah Tilawah & Tahfidz",
    email: "ahmad.fauzi@tpq-alikhlas.sch.id",
    phone: "0812-3344-5566",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
  },
  {
    id: "user-ustadzah-2",
    username: "ustadzah.fatimah",
    name: "Ustadzah Fatimah Azzahra",
    role: "pengajar",
    title: "Guru Halaqah Iqro Dasar",
    email: "fatimah@tpq-alikhlas.sch.id",
    phone: "0813-7788-9900"
  },
  {
    id: "user-kepala-1",
    username: "kepala.tpq",
    name: "Ustadz H. Mansur Al-Hafidz, M.Ag",
    role: "kepala",
    title: "Kepala Lembaga TPQ",
    email: "mansur.tpq@tpq-alikhlas.sch.id",
    phone: "0811-2233-4455"
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
    studentName: "Zaid Abdullah"
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
    studentName: "Aisyah Humaira"
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
    studentName: "Bilal Al-Ghifari"
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
  {
    id: "santri-003",
    nis: "TPQ-2024-003",
    name: "Bilal Al-Ghifari",
    nickname: "Bilal",
    gender: "L",
    birthDate: "2018-02-10",
    classGroup: "Halaqah Ula (Iqro Dasar)",
    currentLevel: "Iqro Jilid 3 (Hal. 22)",
    parentName: "Bpk. Dedi Pratama",
    parentPhone: "0857-1122-3344",
    parentUserId: "user-wali-3",
    address: "Jl. Kenanga No. 19, Sukamaju",
    joinDate: "2024-08-01",
    hafalanList: generateInitialHafalan(7),
    doaList: generateInitialDoa(4)
  },
  {
    id: "santri-004",
    nis: "TPQ-2023-018",
    name: "Maryam Azzahra",
    nickname: "Maryam",
    gender: "P",
    birthDate: "2015-11-03",
    classGroup: "Halaqah Tahfidz Khusus",
    currentLevel: "Al-Qur'an Juz 2 & Muroja'ah Juz 30",
    parentName: "Bpk. Farhan Hakim",
    parentPhone: "0812-7766-5544",
    parentUserId: "user-wali-maryam",
    address: "Jl. Cendrawasih No. 8B",
    joinDate: "2023-07-10",
    hafalanList: generateInitialHafalan(37),
    doaList: generateInitialDoa(12)
  },
  {
    id: "santri-005",
    nis: "TPQ-2025-007",
    name: "Umar Al-Faruq",
    nickname: "Umar",
    gender: "L",
    birthDate: "2019-01-15",
    classGroup: "Halaqah Pra-Iqro",
    currentLevel: "Iqro Jilid 2 (Hal. 15)",
    parentName: "Ibu Nurul Aini",
    parentPhone: "0878-1234-9876",
    parentUserId: "user-wali-umar",
    address: "Jl. Anggrek No. 14, Damai Asri",
    joinDate: "2025-01-12",
    hafalanList: generateInitialHafalan(4),
    doaList: generateInitialDoa(3)
  },
  {
    id: "santri-006",
    nis: "TPQ-2024-045",
    name: "Khadijah An-Nur",
    nickname: "Khadijah",
    gender: "P",
    birthDate: "2017-08-29",
    classGroup: "Halaqah Ula (Bimbingan Iqro Lanjut)",
    currentLevel: "Iqro Jilid 6 (Hal. 18)",
    parentName: "Bpk. Rahmat Hidayat",
    parentPhone: "0813-5566-7788",
    parentUserId: "user-wali-khadijah",
    address: "Jl. Flamboyan Blok D-5",
    joinDate: "2024-03-20",
    hafalanList: generateInitialHafalan(18),
    doaList: generateInitialDoa(8)
  }
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
  {
    id: "set-003",
    studentId: "santri-002",
    studentName: "Aisyah Humaira",
    date: "2026-10-13",
    type: "tadarus_quran",
    materi: "Al-Qur'an Surat Al-Baqarah",
    halamanAyat: "Halaman 10 (Ayat 62 - 69)",
    kelancaran: "mumtaz",
    statusKelanjutan: "lanjut",
    tajwidMakhraj: "Idgham bighunnah sangat merdu dan dengung konsisten 2 harakat.",
    komentarEvaluasi: "Maa syaa Allah tartil luar biasa. Nada bacaan tenang dan makharijul huruf 'Ain dan Ha sangat bersih.",
    ustadzName: "Ustadz Ahmad Fauzi, S.Pd.I",
    timestamp: 1791882000000
  },
  {
    id: "set-004",
    studentId: "santri-002",
    studentName: "Aisyah Humaira",
    date: "2026-10-12",
    type: "hafalan_surat",
    materi: "Surat Al-Fajr",
    halamanAyat: "Ayat 1 - 15",
    kelancaran: "jayyid_jiddan",
    statusKelanjutan: "lanjut",
    tajwidMakhraj: "Perhatikan hukum ra' tafkhim dan tarqiq pada ayat ke-5.",
    komentarEvaluasi: "Alhamdulillah hafalan kuat, sedikit terlupa di peralihan ayat 10. Di rumah mohon diulang bersama umi.",
    ustadzName: "Ustadz Ahmad Fauzi, S.Pd.I",
    timestamp: 1791795000000
  },
  {
    id: "set-005",
    studentId: "santri-003",
    studentName: "Bilal Al-Ghifari",
    date: "2026-10-12",
    type: "iqro",
    materi: "Iqro Jilid 3",
    halamanAyat: "Halaman 22 (Kasrah panjang & Ya sukun)",
    kelancaran: "jayyid",
    statusKelanjutan: "lanjut",
    tajwidMakhraj: "Terkadang huruf 'Tsa' dan 'Sin' tertukar. Sudah dilatih pengucapan ujung lidah.",
    komentarEvaluasi: "Bilal sangat semangat belajar. Butuh bimbingan tenang saat membedakan mad thobi'i kasrah panjang. Lanjut hal 23.",
    ustadzName: "Ustadzah Fatimah Azzahra",
    timestamp: 1791796000000
  },
  {
    id: "set-006",
    studentId: "santri-004",
    studentName: "Maryam Azzahra",
    date: "2026-10-13",
    type: "hafalan_surat",
    materi: "Muroja'ah Surat An-Naba'",
    halamanAyat: "Ayat 1 - 40 (Full)",
    kelancaran: "mumtaz",
    statusKelanjutan: "lanjut",
    tajwidMakhraj: "Kaidah waqaf dan ibtida' sangat tepat. Mad lazim kilmi mutsaqqal sempurna.",
    komentarEvaluasi: "Mumtaz! Hafalan Juz 30 Maryam mutqin dan siap diikutsertakan lomba tahfidz tingkat kecamatan.",
    ustadzName: "Ustadzah Fatimah Azzahra",
    timestamp: 1791883000000
  },
  {
    id: "set-007",
    studentId: "santri-005",
    studentName: "Umar Al-Faruq",
    date: "2026-10-10",
    type: "iqro",
    materi: "Iqro Jilid 2",
    halamanAyat: "Halaman 15 (Huruf bersambung Ba-Ta-Tsa)",
    kelancaran: "jayyid",
    statusKelanjutan: "lanjut",
    tajwidMakhraj: "Sudah mulai mengenali bentuk huruf sambung di awal dan di tengah.",
    komentarEvaluasi: "Umar pintar dan ceria, konsentrasi 15 menit sangat baik. Ayah dan Bunda mohon dipuji di rumah ya.",
    ustadzName: "Ustadzah Fatimah Azzahra",
    timestamp: 1791625000000
  },
  {
    id: "set-008",
    studentId: "santri-006",
    studentName: "Khadijah An-Nur",
    date: "2026-10-13",
    type: "iqro",
    materi: "Iqro Jilid 6",
    halamanAyat: "Halaman 18 (Pengenalan Waqaf Lazim)",
    kelancaran: "mumtaz",
    statusKelanjutan: "lanjut",
    tajwidMakhraj: "Tanda waqaf sudah dipahami dengan baik, tidak mencuri nafas.",
    komentarEvaluasi: "Tinggal beberapa halaman lagi Khadijah siap naik ke Al-Qur'an (Tadarus). Pertahankan prestasimu!",
    ustadzName: "Ustadz Ahmad Fauzi, S.Pd.I",
    timestamp: 1791884000000
  },
  {
    id: "set-009",
    studentId: "santri-001",
    studentName: "Zaid Abdullah",
    date: "2026-10-10",
    type: "iqro",
    materi: "Iqro Jilid 5",
    halamanAyat: "Halaman 13",
    kelancaran: "mumtaz",
    statusKelanjutan: "lanjut",
    tajwidMakhraj: "Tanwin bertemu huruf halqi (Izh-har Halqi) dibaca jelas tanpa dengung.",
    komentarEvaluasi: "Sangat lancar, pemahaman kaidah izh-har sangat cepat.",
    ustadzName: "Ustadz Ahmad Fauzi, S.Pd.I",
    timestamp: 1791626000000
  }
];
