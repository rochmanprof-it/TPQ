/*
# Create user profiles table with role-based access control

## Purpose
Stores application-level profile data for each authenticated user: their role
(admin, kepala, pengajar, wali_murid), display name, title, phone, and optionally
the student they are a guardian of. Linked 1:1 to Supabase auth.users.

## New Tables
- `profiles`
  - `id` (uuid, PK, references auth.users) — same as the auth user's id
  - `username` (text, unique) — login identifier shown in the UI
  - `name` (text) — full display name
  - `role` (text, NOT NULL) — one of: 'admin', 'kepala', 'pengajar', 'wali_murid'
  - `title` (text, nullable) — e.g. "Ustadz Pembimbing", "Kepala TPQ"
  - `email` (text) — email address
  - `phone` (text) — phone number
  - `student_id` (text, nullable) — ID of the student this guardian is responsible for
  - `student_name` (text, nullable) — name of that student
  - `created_at` (timestamptz, default now())

## Security (RLS)
- RLS enabled on `profiles`.
- SELECT: every authenticated user can read all profiles (needed to display
  teacher names in setoran records, etc.). This is intentionally shared data.
- INSERT: only admin can create new user profiles.
- UPDATE: admin can update any profile; users can update their own.
- DELETE: only admin can delete profiles.

## Notes
1. The `role` column stores the app role. Authorization in the frontend checks
   this value from the profile row fetched after login.
2. The admin account is bootstrapped separately — we create the auth user and
   then insert the profile row with role='admin'.
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL DEFAULT 'pengajar' CHECK (role IN ('admin', 'kepala', 'pengajar', 'wali_murid')),
  title text,
  email text NOT NULL,
  phone text NOT NULL DEFAULT '',
  student_id text,
  student_name text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- SELECT: all authenticated users can read profiles (shared data for teacher names, etc.)
DROP POLICY IF EXISTS "select_profiles" ON profiles;
CREATE POLICY "select_profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

-- INSERT: only admin can create new user profiles
DROP POLICY IF EXISTS "insert_profiles_admin" ON profiles;
CREATE POLICY "insert_profiles_admin"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- UPDATE: admin can update any profile; users can update their own
DROP POLICY IF EXISTS "update_profiles" ON profiles;
CREATE POLICY "update_profiles"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = id
    OR EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  )
  WITH CHECK (
    auth.uid() = id
    OR EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- DELETE: only admin can delete profiles
DROP POLICY IF EXISTS "delete_profiles_admin" ON profiles;
CREATE POLICY "delete_profiles_admin"
  ON profiles FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );
