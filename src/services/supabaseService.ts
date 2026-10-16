import { supabase, isSupabaseConfigured } from './supabaseClient';
import { User, Student, AttendanceRecord, SetoranRecord, TPQProfile } from '../types';

/**
 * Service untuk sinkronisasi data antara aplikasi TPQ dan Database Supabase.
 * Bekerja secara otomatis jika VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY telah dikonfigurasi.
 */
export const supabaseService = {
  isConfigured(): boolean {
    return isSupabaseConfigured;
  },

  // ===== USERS =====
  async fetchUsers(): Promise<User[] | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase.from('tpq_users').select('*').order('created_at', { ascending: false });
      if (error || !data) return null;
      return data.map((u: any) => ({
        id: u.id,
        username: u.username,
        name: u.name,
        role: u.role,
        title: u.title || undefined,
        email: u.email,
        phone: u.phone || '-',
        password: u.password || '123456',
        studentId: u.student_id || undefined,
        studentName: u.student_name || undefined,
        avatar: u.avatar || undefined,
      }));
    } catch {
      return null;
    }
  },

  async upsertUser(user: User): Promise<void> {
    if (!isSupabaseConfigured) return;
    try {
      await supabase.from('tpq_users').upsert({
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        title: user.title || null,
        email: user.email,
        phone: user.phone || '-',
        password: user.password || '123456',
        student_id: user.studentId || null,
        student_name: user.studentName || null,
        avatar: user.avatar || null,
        updated_at: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Gagal sinkronisasi user ke Supabase:', err);
    }
  },

  async deleteUser(id: string): Promise<void> {
    if (!isSupabaseConfigured) return;
    try {
      await supabase.from('tpq_users').delete().eq('id', id);
    } catch (err) {
      console.warn('Gagal menghapus user di Supabase:', err);
    }
  },

  // ===== STUDENTS =====
  async fetchStudents(): Promise<Student[] | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase.from('students').select('*').order('name', { ascending: true });
      if (error || !data) return null;
      return data.map((s: any) => ({
        id: s.id,
        nis: s.nis,
        name: s.name,
        nickname: s.nickname || '',
        gender: s.gender || 'L',
        birthDate: s.birth_date || '',
        classGroup: s.class_group,
        currentLevel: s.current_level,
        parentName: s.parent_name || '',
        parentPhone: s.parent_phone || '',
        parentUserId: s.parent_user_id || '',
        address: s.address || '',
        joinDate: s.join_date || '',
        hafalanList: Array.isArray(s.hafalan_list) ? s.hafalan_list : [],
        doaList: Array.isArray(s.doa_list) ? s.doa_list : [],
      }));
    } catch {
      return null;
    }
  },

  async upsertStudent(student: Student): Promise<void> {
    if (!isSupabaseConfigured) return;
    try {
      await supabase.from('students').upsert({
        id: student.id,
        nis: student.nis,
        name: student.name,
        nickname: student.nickname,
        gender: student.gender,
        birth_date: student.birthDate,
        class_group: student.classGroup,
        current_level: student.currentLevel,
        parent_name: student.parentName,
        parent_phone: student.parentPhone,
        parent_user_id: student.parentUserId,
        address: student.address,
        join_date: student.joinDate,
        hafalan_list: student.hafalanList,
        doa_list: student.doaList || [],
        updated_at: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Gagal sinkronisasi santri ke Supabase:', err);
    }
  },

  async deleteStudent(id: string): Promise<void> {
    if (!isSupabaseConfigured) return;
    try {
      await supabase.from('students').delete().eq('id', id);
    } catch (err) {
      console.warn('Gagal menghapus santri di Supabase:', err);
    }
  },

  // ===== SETORAN =====
  async fetchSetoran(): Promise<SetoranRecord[] | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase.from('setoran_records').select('*').order('date', { ascending: false });
      if (error || !data) return null;
      return data.map((r: any) => ({
        id: r.id,
        studentId: r.student_id,
        studentName: r.student_name,
        date: r.date,
        type: r.type,
        materi: r.materi,
        halamanAyat: r.halaman_ayat,
        kelancaran: r.kelancaran,
        statusKelanjutan: r.status_kelanjutan,
        attendanceStatus: r.attendance_status || undefined,
        tajwidMakhraj: r.tajwid_makhraj || undefined,
        komentarEvaluasi: r.komentar_evaluasi,
        ustadzName: r.ustadz_name,
        timestamp: Number(r.timestamp),
      }));
    } catch {
      return null;
    }
  },

  async upsertSetoran(record: SetoranRecord): Promise<void> {
    if (!isSupabaseConfigured) return;
    try {
      await supabase.from('setoran_records').upsert({
        id: record.id,
        student_id: record.studentId,
        student_name: record.studentName,
        date: record.date,
        type: record.type,
        materi: record.materi,
        halaman_ayat: record.halamanAyat,
        kelancaran: record.kelancaran,
        status_kelanjutan: record.statusKelanjutan,
        attendance_status: record.attendanceStatus || null,
        tajwid_makhraj: record.tajwidMakhraj || null,
        komentar_evaluasi: record.komentarEvaluasi,
        ustadz_name: record.ustadzName,
        timestamp: record.timestamp,
      });
    } catch (err) {
      console.warn('Gagal sinkronisasi setoran ke Supabase:', err);
    }
  },

  async deleteSetoran(id: string): Promise<void> {
    if (!isSupabaseConfigured) return;
    try {
      await supabase.from('setoran_records').delete().eq('id', id);
    } catch (err) {
      console.warn('Gagal menghapus setoran di Supabase:', err);
    }
  },

  // ===== ATTENDANCE =====
  async fetchAttendance(): Promise<AttendanceRecord[] | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase.from('attendance_records').select('*').order('date', { ascending: false });
      if (error || !data) return null;
      return data.map((a: any) => ({
        id: a.id,
        studentId: a.student_id,
        studentName: a.student_name,
        date: a.date,
        status: a.status,
        note: a.note || undefined,
        recordedBy: a.recorded_by,
        timestamp: Number(a.timestamp),
      }));
    } catch {
      return null;
    }
  },

  async upsertAttendance(record: AttendanceRecord): Promise<void> {
    if (!isSupabaseConfigured) return;
    try {
      await supabase.from('attendance_records').upsert({
        id: record.id,
        student_id: record.studentId,
        student_name: record.studentName,
        date: record.date,
        status: record.status,
        note: record.note || null,
        recorded_by: record.recordedBy,
        timestamp: record.timestamp,
      });
    } catch (err) {
      console.warn('Gagal sinkronisasi presensi ke Supabase:', err);
    }
  },

  // ===== PROFILE =====
  async fetchProfile(): Promise<TPQProfile | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase.from('tpq_profile').select('*').limit(1).maybeSingle();
      if (error || !data) return null;
      return {
        name: data.name,
        address: data.address || '',
        phone: data.phone || '',
        kepalaName: data.kepala_name || '',
        skKemenag: data.sk_kemenag || undefined,
      };
    } catch {
      return null;
    }
  },

  async upsertProfile(profile: TPQProfile): Promise<void> {
    if (!isSupabaseConfigured) return;
    try {
      await supabase.from('tpq_profile').upsert({
        id: 'main-tpq-profile',
        name: profile.name,
        address: profile.address,
        phone: profile.phone,
        kepala_name: profile.kepalaName,
        sk_kemenag: profile.skKemenag || null,
        updated_at: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Gagal sinkronisasi profil ke Supabase:', err);
    }
  },
};
