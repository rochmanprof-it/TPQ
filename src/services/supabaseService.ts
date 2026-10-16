
import {
  supabase,
  isSupabaseConfigured,
} from './supabaseClient';

import type {
  User,
  Student,
  AttendanceRecord,
  SetoranRecord,
  TPQProfile,
} from '../types';

/**
 * Service sinkronisasi data aplikasi TPQ dengan Supabase.
 *
 * Mengembalikan null untuk operasi fetch yang gagal atau saat
 * Supabase belum dikonfigurasi.
 *
 * Operasi tulis mencatat error dan tidak menganggap operasi
 * berhasil jika Supabase mengembalikan error.
 */

type SupabaseClient = NonNullable<typeof supabase>;

function getClient(): SupabaseClient | null {
  if (!isSupabaseConfigured || !supabase) {
    console.warn(
      '[Supabase] Client belum dikonfigurasi. Periksa URL dan API key.'
    );
    return null;
  }

  return supabase;
}

function logSupabaseError(
  operation: string,
  error: unknown
): void {
  console.error(`[Supabase] ${operation} gagal:`, error);
}

export const supabaseService = {
  isConfigured(): boolean {
    return Boolean(isSupabaseConfigured && supabase);
  },

  // ===== USERS =====

  async fetchUsers(): Promise<User[] | null> {
    const client = getClient();
    if (!client) return null;

    try {
      const { data, error } = await client
        .from('tpq_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        logSupabaseError('fetchUsers', error);
        return null;
      }

      if (!data) return null;

      return data.map((u: any) => ({
        id: u.id,
        username: u.username,
        name: u.name,
        role: u.role,
        title: u.title || undefined,
        email: u.email,
        phone: u.phone || '-',

        // Do not silently assign a default password.
        password: typeof u.password === 'string' ? u.password : '',

        studentId: u.student_id || undefined,
        studentName: u.student_name || undefined,
        avatar: u.avatar || undefined,
      }));
    } catch (error) {
      logSupabaseError('fetchUsers', error);
      return null;
    }
  },

  async upsertUser(user: User): Promise<void> {
    const client = getClient();
    if (!client) return;

    try {
      const { error } = await client
        .from('tpq_users')
        .upsert({
          id: user.id,
          username: user.username,
          name: user.name,
          role: user.role,
          title: user.title || null,
          email: user.email,
          phone: user.phone || '-',

          // Never create a universal default password.
          password:
            typeof user.password === 'string'
              ? user.password
              : '',

          student_id: user.studentId || null,
          student_name: user.studentName || null,
          avatar: user.avatar || null,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        logSupabaseError('upsertUser', error);
      }
    } catch (error) {
      logSupabaseError('upsertUser', error);
    }
  },

  async deleteUser(id: string): Promise<void> {
    const client = getClient();
    if (!client) return;

    try {
      const { error } = await client
        .from('tpq_users')
        .delete()
        .eq('id', id);

      if (error) logSupabaseError('deleteUser', error);
    } catch (error) {
      logSupabaseError('deleteUser', error);
    }
  },

  // ===== STUDENTS =====

  async fetchStudents(): Promise<Student[] | null> {
    const client = getClient();
    if (!client) return null;

    try {
      const { data, error } = await client
        .from('students')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        logSupabaseError('fetchStudents', error);
        return null;
      }

      if (!data) return null;

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
        hafalanList: Array.isArray(s.hafalan_list)
          ? s.hafalan_list
          : [],
        doaList: Array.isArray(s.doa_list)
          ? s.doa_list
          : [],
      }));
    } catch (error) {
      logSupabaseError('fetchStudents', error);
      return null;
    }
  },

  async upsertStudent(student: Student): Promise<void> {
    const client = getClient();
    if (!client) return;

    try {
      const { error } = await client
        .from('students')
        .upsert({
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

      if (error) logSupabaseError('upsertStudent', error);
    } catch (error) {
      logSupabaseError('upsertStudent', error);
    }
  },

  async deleteStudent(id: string): Promise<void> {
    const client = getClient();
    if (!client) return;

    try {
      const { error } = await client
        .from('students')
        .delete()
        .eq('id', id);

      if (error) logSupabaseError('deleteStudent', error);
    } catch (error) {
      logSupabaseError('deleteStudent', error);
    }
  },

  // ===== SETORAN =====

  async fetchSetoran(): Promise<SetoranRecord[] | null> {
    const client = getClient();
    if (!client) return null;

    try {
      const { data, error } = await client
        .from('setoran_records')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        logSupabaseError('fetchSetoran', error);
        return null;
      }

      if (!data) return null;

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
    } catch (error) {
      logSupabaseError('fetchSetoran', error);
      return null;
    }
  },

  async upsertSetoran(record: SetoranRecord): Promise<void> {
    const client = getClient();
    if (!client) return;

    try {
      const { error } = await client
        .from('setoran_records')
        .upsert({
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

      if (error) logSupabaseError('upsertSetoran', error);
    } catch (error) {
      logSupabaseError('upsertSetoran', error);
    }
  },

  async deleteSetoran(id: string): Promise<void> {
    const client = getClient();
    if (!client) return;

    try {
      const { error } = await client
        .from('setoran_records')
        .delete()
        .eq('id', id);

      if (error) logSupabaseError('deleteSetoran', error);
    } catch (error) {
      logSupabaseError('deleteSetoran', error);
    }
  },

  // ===== ATTENDANCE =====

  async fetchAttendance(): Promise<AttendanceRecord[] | null> {
    const client = getClient();
    if (!client) return null;

    try {
      const { data, error } = await client
        .from('attendance_records')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        logSupabaseError('fetchAttendance', error);
        return null;
      }

      if (!data) return null;

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
    } catch (error) {
      logSupabaseError('fetchAttendance', error);
      return null;
    }
  },

  async upsertAttendance(
    record: AttendanceRecord
  ): Promise<void> {
    const client = getClient();
    if (!client) return;

    try {
      const { error } = await client
        .from('attendance_records')
        .upsert({
          id: record.id,
          student_id: record.studentId,
          student_name: record.studentName,
          date: record.date,
          status: record.status,
          note: record.note || null,
          recorded_by: record.recordedBy,
          timestamp: record.timestamp,
        });

      if (error) logSupabaseError('upsertAttendance', error);
    } catch (error) {
      logSupabaseError('upsertAttendance', error);
    }
  },

  // ===== PROFILE =====

  async fetchProfile(): Promise<TPQProfile | null> {
    const client = getClient();
    if (!client) return null;

    try {
      const { data, error } = await client
        .from('tpq_profile')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) {
        logSupabaseError('fetchProfile', error);
        return null;
      }

      if (!data) return null;

      return {
        name: data.name,
        address: data.address || '',
        phone: data.phone || '',
        kepalaName: data.kepala_name || '',
        skKemenag: data.sk_kemenag || undefined,
      };
    } catch (error) {
      logSupabaseError('fetchProfile', error);
      return null;
    }
  },

  async upsertProfile(profile: TPQProfile): Promise<void> {
    const client = getClient();
    if (!client) return;

    try {
      const { error } = await client
        .from('tpq_profile')
        .upsert({
          id: 'main-tpq-profile',
          name: profile.name,
          address: profile.address,
          phone: profile.phone,
          kepala_name: profile.kepalaName,
          sk_kemenag: profile.skKemenag || null,
          updated_at: new Date().toISOString(),
        });

      if (error) logSupabaseError('upsertProfile', error);
    } catch (error) {
      logSupabaseError('upsertProfile', error);
    }
  },
};
