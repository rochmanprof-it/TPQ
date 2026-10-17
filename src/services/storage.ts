import { User, Student, AttendanceRecord, SetoranRecord, TPQProfile, StudentHafalanProgress, StudentDoaProgress } from '../types';
import { INITIAL_USERS, INITIAL_STUDENTS, INITIAL_ATTENDANCE, INITIAL_SETORAN, TPQ_INFO } from '../data/seedData';
import { JUZ_30_SURAHS, DOA_LIST_DATA } from '../data/quranData';
import { supabaseService } from './supabaseService';
import { supabase } from './supabaseClient';

const STORAGE_KEYS = {
  USERS: 'tpq_users_v1',
  ACTIVE_USER: 'tpq_active_user_v1',
  STUDENTS: 'tpq_students_v1',
  ATTENDANCE: 'tpq_attendance_v1',
  SETORAN: 'tpq_setoran_v1',
  PROFILE: 'tpq_profile_v1'
};

function createDefaultHafalanList(): StudentHafalanProgress[] {
  const reversedSurahs = [...JUZ_30_SURAHS].reverse();
  return reversedSurahs.map(s => ({
    surahNumber: s.number,
    surahName: s.name,
    surahArabic: s.nameArabic,
    totalAyat: s.totalAyat,
    status: 'belum'
  }));
}

function createDefaultDoaList(): StudentDoaProgress[] {
  return DOA_LIST_DATA.map(d => ({
    id: d.id,
    doaName: d.name,
    doaArabic: d.arabic,
    status: 'belum'
  }));
}

export const storage = {
  getUsers(): User[] {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    let list: User[] = INITIAL_USERS;
    if (raw) {
      try {
        list = JSON.parse(raw);
      } catch {
        list = INITIAL_USERS;
      }
    }

    // Ensure the default admin exists in the list if missing
    if (!list.some(u => u.role === 'admin')) {
      const adminDefault = INITIAL_USERS.find(u => u.role === 'admin');
      if (adminDefault) {
        list.unshift(adminDefault);
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(list));
      }
    }

    // Ensure all stored users have a valid password property
    let hasUpdatedPasswords = false;
    list = list.map(u => {
      if (!u.password) {
        hasUpdatedPasswords = true;
        const defaultPass = u.role === 'admin' ? 'admin123456'
          : u.role === 'kepala' ? 'kepala123456'
          : u.role === 'pengajar' ? 'ustadz123456'
          : 'wali123456';
        return { ...u, password: defaultPass };
      }
      return u;
    });

    if (hasUpdatedPasswords) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(list));
    }

    return list;
  },

  getUserById(id: string): User | undefined {
    return this.getUsers().find(u => u.id === id);
  },

  saveUser(user: User): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index >= 0) {
      users[index] = user;
    } else {
      users.unshift(user);
    }
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    // Keep active user updated if currently logged in
    const active = this.getActiveUser();
    if (active && active.id === user.id) {
      this.setActiveUser(user);
    }

    // Push to Supabase if connected
    supabaseService.upsertUser(user);
  },

  deleteUser(id: string): void {
    const users = this.getUsers().filter(u => u.id !== id);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    // Delete in Supabase if connected
    supabaseService.deleteUser(id);
  },

  getActiveUser(): User | null {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  setActiveUser(user: User): void {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, JSON.stringify(user));
  },

  clearActiveUser(): void {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER);
  },

  getProfile(): TPQProfile {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(TPQ_INFO));
      supabaseService.upsertProfile(TPQ_INFO);
      return TPQ_INFO;
    }
    try {
      const parsed = JSON.parse(raw);
      if (!parsed.name || parsed.name.includes("Al-Ikhlas") || parsed.name.includes("Qurrota") || parsed.name !== "TPQ Qurrata A'yun") {
        const updated = { ...parsed, name: "TPQ Qurrata A'yun" };
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
        supabaseService.upsertProfile(updated);
        return updated;
      }
      return parsed;
    } catch {
      return TPQ_INFO;
    }
  },

  saveProfile(profile: TPQProfile): void {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    supabaseService.upsertProfile(profile);
  },

  getStudents(): Student[] {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    let list: Student[];
    if (!raw) {
      list = INITIAL_STUDENTS;
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
    } else {
      try {
        list = JSON.parse(raw);
        if (!Array.isArray(list) || list.length === 0) {
          list = INITIAL_STUDENTS;
        }
      } catch {
        list = INITIAL_STUDENTS;
      }
    }

    // Ensure every student has a valid hafalanList with all Juz 30 surahs initialized
    let modified = false;
    list = list.map(student => {
      let hafalanList = Array.isArray(student.hafalanList) ? [...student.hafalanList] : [];
      if (hafalanList.length === 0) {
        hafalanList = createDefaultHafalanList();
        modified = true;
      } else {
        // Ensure all 37 surahs exist and surahNumber is typed as number
        const existingNumbers = new Set(hafalanList.map(h => Number(h.surahNumber)));
        const reversedSurahs = [...JUZ_30_SURAHS].reverse();
        for (const s of reversedSurahs) {
          if (!existingNumbers.has(s.number)) {
            hafalanList.push({
              surahNumber: s.number,
              surahName: s.name,
              surahArabic: s.nameArabic,
              totalAyat: s.totalAyat,
              status: 'belum'
            });
            modified = true;
          }
        }
        // Normalize any string surahNumbers to number
        hafalanList = hafalanList.map(h => ({
          ...h,
          surahNumber: Number(h.surahNumber)
        }));
      }

      const doaList = Array.isArray(student.doaList) && student.doaList.length > 0
        ? student.doaList
        : createDefaultDoaList();

      return {
        ...student,
        hafalanList,
        doaList
      };
    });

    if (modified) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(list));
    }

    return list;
  },

  getStudentById(id: string): Student | undefined {
    const students = this.getStudents();
    return students.find(s => s.id === id);
  },

  saveStudent(student: Student): void {
    const students = this.getStudents();
    // Ensure hafalanList is initialized
    if (!student.hafalanList || student.hafalanList.length === 0) {
      student.hafalanList = createDefaultHafalanList();
    }
    if (!student.doaList || student.doaList.length === 0) {
      student.doaList = createDefaultDoaList();
    }

    const index = students.findIndex(s => s.id === student.id);
    if (index >= 0) {
      const oldStudent = students[index];
      students[index] = student;

      // If student name changed, sync in setoran and attendance
      if (oldStudent.name !== student.name) {
        const setoranList = this.getSetoran().map(r => r.studentId === student.id ? { ...r, studentName: student.name } : r);
        localStorage.setItem(STORAGE_KEYS.SETORAN, JSON.stringify(setoranList));

        const attendanceList = this.getAttendance().map(a => a.studentId === student.id ? { ...a, studentName: student.name } : a);
        localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendanceList));
      }
    } else {
      students.unshift(student);
    }
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));

    // Push to Supabase if connected
    supabaseService.upsertStudent(student);
  },

  deleteStudent(id: string): void {
    const students = this.getStudents().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));

    // Cascade delete local setoran & attendance for this student
    const setoran = this.getSetoran().filter(s => s.studentId !== id);
    localStorage.setItem(STORAGE_KEYS.SETORAN, JSON.stringify(setoran));

    const attendance = this.getAttendance().filter(a => a.studentId !== id);
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));

    // Delete in Supabase
    supabaseService.deleteStudent(id);
  },

  updateStudentHafalan(
    studentId: string,
    surahNumber: number,
    status: 'belum' | 'sedang_menghafal' | 'hafal_lancar' | 'mutqin',
    grade?: 'mumtaz' | 'jayyid_jiddan' | 'jayyid' | 'maqbul',
    notes?: string,
    completedDate?: string
  ): void {
    const students = this.getStudents();
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    if (!Array.isArray(student.hafalanList)) {
      student.hafalanList = createDefaultHafalanList();
    }

    const targetSurahNum = Number(surahNumber);
    let hafalanItem = student.hafalanList.find(h => Number(h.surahNumber) === targetSurahNum);
    if (!hafalanItem) {
      const surahMeta = JUZ_30_SURAHS.find(s => s.number === targetSurahNum);
      hafalanItem = {
        surahNumber: targetSurahNum,
        surahName: surahMeta?.name || `Surat ${targetSurahNum}`,
        surahArabic: surahMeta?.nameArabic || '',
        totalAyat: surahMeta?.totalAyat || 0,
        status: 'belum'
      };
      student.hafalanList.push(hafalanItem);
    }

    hafalanItem.status = status;
    hafalanItem.grade = grade || (status === 'hafal_lancar' || status === 'mutqin' ? 'mumtaz' : undefined);
    hafalanItem.notes = notes || (status === 'hafal_lancar' ? 'Lulus hafalan lancar' : status === 'mutqin' ? 'Mutqin dan tartil' : undefined);
    hafalanItem.completedDate = (status === 'hafal_lancar' || status === 'mutqin')
      ? (completedDate || new Date().toISOString().slice(0, 10))
      : undefined;
    
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    supabaseService.upsertStudent(student);
  },

  updateStudentDoa(
    studentId: string,
    doaId: string,
    status: 'belum' | 'sedang_menghafal' | 'hafal_lancar' | 'mutqin',
    notes?: string,
    completedDate?: string
  ): void {
    const students = this.getStudents();
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    if (!Array.isArray(student.doaList)) {
      student.doaList = createDefaultDoaList();
    }

    let doaItem = student.doaList.find(d => String(d.id) === String(doaId));
    if (!doaItem) {
      const doaMeta = DOA_LIST_DATA.find(d => d.id === doaId);
      doaItem = {
        id: doaId,
        doaName: doaMeta?.name || 'Doa Harian',
        doaArabic: doaMeta?.arabic || '',
        status: 'belum'
      };
      student.doaList.push(doaItem);
    }

    doaItem.status = status;
    doaItem.notes = notes || (status === 'hafal_lancar' ? 'Hafal lancar beserta artinya' : undefined);
    doaItem.completedDate = (status === 'hafal_lancar' || status === 'mutqin')
      ? (completedDate || new Date().toISOString().slice(0, 10))
      : undefined;

    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    supabaseService.upsertStudent(student);
  },

  getAttendance(): AttendanceRecord[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(INITIAL_ATTENDANCE));
      return INITIAL_ATTENDANCE;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_ATTENDANCE;
    }
  },

  saveAttendanceBatch(records: AttendanceRecord[]): void {
    const current = this.getAttendance();
    const updated = [...current];
    records.forEach(newRec => {
      const existingIdx = updated.findIndex(r => r.studentId === newRec.studentId && r.date === newRec.date);
      if (existingIdx >= 0) {
        updated[existingIdx] = newRec;
      } else {
        updated.unshift(newRec);
      }
      // Sync to Supabase
      supabaseService.upsertAttendance(newRec);
    });
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(updated));
  },

  deleteAttendance(id: string): void {
    const current = this.getAttendance();
    const filtered = current.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(filtered));
  },

  getSetoran(): SetoranRecord[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SETORAN);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SETORAN, JSON.stringify(INITIAL_SETORAN));
      return INITIAL_SETORAN;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_SETORAN;
    }
  },

  addSetoran(data: Omit<SetoranRecord, 'id' | 'timestamp'>): SetoranRecord {
    const list = this.getSetoran();
    const newRecord: SetoranRecord = {
      ...data,
      id: `set-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now()
    };
    list.unshift(newRecord);
    localStorage.setItem(STORAGE_KEYS.SETORAN, JSON.stringify(list));

    // Also sync attendance record if attendanceStatus provided
    if (data.attendanceStatus) {
      this.saveAttendanceBatch([{
        id: `att-${Date.now()}-${data.studentId}`,
        studentId: data.studentId,
        studentName: data.studentName,
        date: data.date,
        status: data.attendanceStatus,
        note: `Setoran: ${data.materi} (${data.halamanAyat})`,
        recordedBy: data.ustadzName,
        timestamp: Date.now()
      }]);
    }

    // Also update student current level or memorization status automatically
    const students = this.getStudents();
    const student = students.find(s => s.id === data.studentId);
    if (student) {
      if (data.type === 'iqro' || data.type === 'tadarus_quran') {
        student.currentLevel = `${data.materi} (${data.halamanAyat})`;
      } else if (data.type === 'hafalan_surat' && (data.kelancaran === 'mumtaz' || data.kelancaran === 'jayyid_jiddan')) {
        const cleanSurahName = data.materi.replace(/^Surat\s+/i, '').trim();
        const hafalanItem = student.hafalanList.find(h => h.surahName.toLowerCase() === cleanSurahName.toLowerCase());
        if (hafalanItem) {
          hafalanItem.status = data.kelancaran === 'mumtaz' ? 'mutqin' : 'hafal_lancar';
          hafalanItem.grade = data.kelancaran;
          hafalanItem.completedDate = data.date;
          hafalanItem.notes = data.komentarEvaluasi;
        }
      }
      this.saveStudent(student);
    }

    // Push setoran to Supabase
    supabaseService.upsertSetoran(newRecord);

    return newRecord;
  },

  updateSetoran(updated: SetoranRecord): void {
    const list = this.getSetoran();
    const index = list.findIndex(r => r.id === updated.id);
    if (index >= 0) {
      list[index] = updated;
      localStorage.setItem(STORAGE_KEYS.SETORAN, JSON.stringify(list));

      if (updated.attendanceStatus) {
        this.saveAttendanceBatch([{
          id: `att-${Date.now()}-${updated.studentId}`,
          studentId: updated.studentId,
          studentName: updated.studentName,
          date: updated.date,
          status: updated.attendanceStatus,
          note: `Setoran: ${updated.materi} (${updated.halamanAyat})`,
          recordedBy: updated.ustadzName,
          timestamp: Date.now()
        }]);
      }

      const students = this.getStudents();
      const student = students.find(s => s.id === updated.studentId);
      if (student) {
        if (updated.type === 'iqro' || updated.type === 'tadarus_quran') {
          student.currentLevel = `${updated.materi} (${updated.halamanAyat})`;
        }
        this.saveStudent(student);
      }

      // Sync updated record to Supabase
      supabaseService.upsertSetoran(updated);
    }
  },

  deleteSetoran(id: string): void {
    const current = this.getSetoran();
    const filtered = current.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.SETORAN, JSON.stringify(filtered));

    // Delete in Supabase
    supabaseService.deleteSetoran(id);
  },

  /**
   * Mengambil data terbaru dari Supabase ke penyimpanan lokal jika Supabase dikonfigurasi.
   */
  async initSupabaseSync(): Promise<boolean> {
    if (!supabaseService.isConfigured()) return false;
    try {
      const [remoteUsers, remoteStudents, remoteSetoran, remoteAttendance, remoteProfile] = await Promise.all([
        supabaseService.fetchUsers(),
        supabaseService.fetchStudents(),
        supabaseService.fetchSetoran(),
        supabaseService.fetchAttendance(),
        supabaseService.fetchProfile(),
      ]);

      let updated = false;

      if (remoteUsers !== null && remoteUsers.length > 0) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(remoteUsers));
        updated = true;
      }
      if (remoteStudents !== null) {
        localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(remoteStudents));
        updated = true;
      }
      if (remoteSetoran !== null) {
        localStorage.setItem(STORAGE_KEYS.SETORAN, JSON.stringify(remoteSetoran));
        updated = true;
      }
      if (remoteAttendance !== null) {
        localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(remoteAttendance));
        updated = true;
      }
      if (remoteProfile !== null) {
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(remoteProfile));
        updated = true;
      }

      return updated;
    } catch (err) {
      console.warn('Supabase sync notice:', err);
      return false;
    }
  },

  /**
   * Berlangganan perubahan data realtime dari Supabase.
   * Setiap ada penambahan/perubahan/penghapusan data di browser/perangkat manapun,
   * callback akan dipanggil sehingga seluruh perangkat langsung tersinkronisasi.
   */
  subscribeToRemoteChanges(callback: () => void): () => void {
    if (!supabaseService.isConfigured() || !supabase) return () => {};
    const client = supabase;

    try {
      const channel = client
        .channel('tpq-realtime-sync')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public' },
          async () => {
            const hasChanges = await this.initSupabaseSync();
            if (hasChanges) {
              callback();
            }
          }
        )
        .subscribe();

      return () => {
        try {
          client.removeChannel(channel);
        } catch (e) {
          console.warn('Error removing Supabase channel:', e);
        }
      };
    } catch (e) {
      console.warn('Realtime subscription not supported, fallback to polling:', e);
      return () => {};
    }
  },

  resetAllToDefault(): void {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(INITIAL_ATTENDANCE));
    localStorage.setItem(STORAGE_KEYS.SETORAN, JSON.stringify(INITIAL_SETORAN));
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(TPQ_INFO));
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, JSON.stringify(INITIAL_USERS[0]));
  },

  exportDatabase(): string {
    const payload = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      students: this.getStudents(),
      attendance: this.getAttendance(),
      setoran: this.getSetoran(),
      users: this.getUsers(),
      profile: this.getProfile()
    };
    return JSON.stringify(payload, null, 2);
  },

  importDatabase(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.students && Array.isArray(data.students)) {
        localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(data.students));
      }
      if (data.attendance && Array.isArray(data.attendance)) {
        localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(data.attendance));
      }
      if (data.setoran && Array.isArray(data.setoran)) {
        localStorage.setItem(STORAGE_KEYS.SETORAN, JSON.stringify(data.setoran));
      }
      if (data.profile) {
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(data.profile));
      }
      return true;
    } catch (e) {
      console.error("Failed to import database:", e);
      return false;
    }
  }
};
