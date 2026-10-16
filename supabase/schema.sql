-- ==============================================================================
-- SKEMA LENGKAP DATABASE TPQ AL-IKHLAS NURUL IMAN UNTUK SUPABASE
-- Jalankan seluruh script SQL ini di menu "SQL Editor" pada Dashboard Supabase
-- ==============================================================================

-- 1. Ekstensi UUID (opsional jika dibutuhkan)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. TABEL: tpq_profile (Profil Kelembagaan TPQ)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS tpq_profile (
  id text PRIMARY KEY DEFAULT 'main-tpq-profile',
  name text NOT NULL,
  address text,
  phone text,
  kepala_name text,
  sk_kemenag text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ==============================================================================
-- 3. TABEL: tpq_users (Akun Pengguna & Hak Akses Multi-Peran / RBAC)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS tpq_users (
  id text PRIMARY KEY,
  username text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'kepala', 'pengajar', 'wali_murid')),
  title text,
  email text UNIQUE NOT NULL,
  phone text DEFAULT '-',
  password text NOT NULL DEFAULT 'R@hasia123',
  student_id text,
  student_name text,
  avatar text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ==============================================================================
-- 4. TABEL: students (Data Santri, Buku Induk, & Progres Hafalan Juz 30 / Doa)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS students (
  id text PRIMARY KEY,
  nis text UNIQUE NOT NULL,
  name text NOT NULL,
  nickname text,
  gender text CHECK (gender IN ('L', 'P')),
  birth_date text,
  class_group text NOT NULL,
  current_level text NOT NULL,
  parent_name text NOT NULL,
  parent_phone text NOT NULL,
  parent_user_id text,
  address text,
  join_date text,
  hafalan_list jsonb NOT NULL DEFAULT '[]'::jsonb,
  doa_list jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ==============================================================================
-- 5. TABEL: attendance_records (Buku Presensi / Absensi Harian Santri)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS attendance_records (
  id text PRIMARY KEY,
  student_id text NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  student_name text NOT NULL,
  date text NOT NULL, -- Format: YYYY-MM-DD
  status text NOT NULL CHECK (status IN ('hadir', 'izin', 'sakit', 'alpa')),
  note text,
  recorded_by text NOT NULL,
  timestamp bigint NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- ==============================================================================
-- 6. TABEL: setoran_records (Catatan Harian Mengaji Iqro, Al-Qur'an & Hafalan)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS setoran_records (
  id text PRIMARY KEY,
  student_id text NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  student_name text NOT NULL,
  date text NOT NULL, -- Format: YYYY-MM-DD
  type text NOT NULL CHECK (type IN ('iqro', 'hafalan_surat', 'tadarus_quran', 'doa_harian')),
  materi text NOT NULL,
  halaman_ayat text NOT NULL,
  kelancaran text NOT NULL CHECK (kelancaran IN ('mumtaz', 'jayyid_jiddan', 'jayyid', 'maqbul')),
  status_kelanjutan text NOT NULL CHECK (status_kelanjutan IN ('lanjut', 'ulang')),
  attendance_status text CHECK (attendance_status IN ('hadir', 'izin', 'sakit', 'alpa')),
  tajwid_makhraj text,
  komentar_evaluasi text NOT NULL,
  ustadz_name text NOT NULL,
  timestamp bigint NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- ==============================================================================
-- 7. INDEX UNTUK PERFORMA QUERY
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_users_username ON tpq_users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON tpq_users(email);
CREATE INDEX IF NOT EXISTS idx_students_nis ON students(nis);
CREATE INDEX IF NOT EXISTS idx_students_class ON students(class_group);
CREATE INDEX IF NOT EXISTS idx_attendance_student_date ON attendance_records(student_id, date);
CREATE INDEX IF NOT EXISTS idx_setoran_student_date ON setoran_records(student_id, date);

-- ==============================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- Mengizinkan akses publik/anonim yang aman sesuai token API anon Supabase
-- ==============================================================================
ALTER TABLE tpq_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE tpq_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE setoran_records ENABLE ROW LEVEL SECURITY;

-- Kebijakan Akses Penuh untuk Anon/Authenticated (Client Application)
DROP POLICY IF EXISTS "Public access for tpq_profile" ON tpq_profile;
CREATE POLICY "Public access for tpq_profile" ON tpq_profile FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access for tpq_users" ON tpq_users;
CREATE POLICY "Public access for tpq_users" ON tpq_users FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access for students" ON students;
CREATE POLICY "Public access for students" ON students FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access for attendance_records" ON attendance_records;
CREATE POLICY "Public access for attendance_records" ON attendance_records FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access for setoran_records" ON setoran_records;
CREATE POLICY "Public access for setoran_records" ON setoran_records FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ==============================================================================
-- 9. DATA AWAL (SEED DATA): PROFIL LEMBAGA & AKUN UTAMA
-- ==============================================================================

-- 9.1 Profil TPQ
INSERT INTO tpq_profile (id, name, address, phone, kepala_name, sk_kemenag)
VALUES (
  'main-tpq-profile',
  'TPQ Qurrata Ayun',
  'Sidotopo II no 37, Simokerto, Surabaya, Jawa Timur, Indonesia',
  '0812-9988-7766',
  'Ustadzah Wahyu',
  'KD.11.02/5/PP.00.7/1042/2021'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  kepala_name = EXCLUDED.kepala_name,
  sk_kemenag = EXCLUDED.sk_kemenag;

-- 9.2 Akun Pengguna Utama (Termasuk Administrator)
INSERT INTO tpq_users (id, username, name, role, title, email, phone, password)
VALUES 
  (
    'user-admin-1',
    'admin',
    'Administrator TPQ',
    'admin',
    'Pengelola Sistem & Akun TPQ',
    'admin@gmail.com',
    '0811-9988-0001',
    'R@hasia123'
  ),
  (
    'user-kepala-1',
    'kepala.tpq',
    'Ustadzah Wahyu',
    'kepala',
    'Kepala Lembaga TPQ',
    'wahyu.tpq@gmail.com',
    '0811-2233-4455',
    'kepala123456'
  ),
  
  (
    'user-ustadzah-2',
    'ustadzah.indria',
    'Ustadzah Eli Indria',
    'pengajar',
    'Guru Halaqah Iqro Dasar',
    'indria@gmail.com',
    '0813-7788-9900',
    '123456'
  )
ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  email = EXCLUDED.email,
  password = EXCLUDED.password;
