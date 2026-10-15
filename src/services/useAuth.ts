import { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabaseClient';
import { User, UserRole } from '../types';

interface ProfileRow {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  title: string | null;
  email: string;
  phone: string;
  student_id: string | null;
  student_name: string | null;
}

function mapProfileToUser(p: ProfileRow): User {
  return {
    id: p.id,
    username: p.username,
    name: p.name,
    role: p.role,
    title: p.title || undefined,
    email: p.email,
    phone: p.phone || '',
    studentId: p.student_id || undefined,
    studentName: p.student_name || undefined,
  };
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async (userId: string): Promise<User | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, name, role, title, email, phone, student_id, student_name')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    if (!data) return null;
    return mapProfileToUser(data as ProfileRow);
  }, []);

  useEffect(() => {
    let mounted = true;

    // Check active session on mount
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!mounted) return;

      if (session?.user) {
        const profileUser = await fetchProfile(session.user.id);
        if (mounted) {
          setUser(profileUser);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    })();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        if (session?.user) {
          const profileUser = await fetchProfile(session.user.id);
          if (mounted) setUser(profileUser);
        } else {
          if (mounted) setUser(null);
        }
        if (mounted) setLoading(false);
      })();
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signIn = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setError(null);

    if (!email.trim() || !password) {
      return { success: false, error: 'Email dan kata sandi harus diisi.' };
    }

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (signInError) {
      const msg = signInError.message;
      if (msg.includes('Invalid login credentials')) {
        return { success: false, error: 'Email atau kata sandi salah. Silakan periksa kembali.' };
      }
      return { success: false, error: msg };
    }

    if (!data.user) {
      return { success: false, error: 'Login gagal. Akun tidak ditemukan.' };
    }

    const profileUser = await fetchProfile(data.user.id);
    if (!profileUser) {
      await supabase.auth.signOut();
      return { success: false, error: 'Profil pengguna tidak ditemukan. Hubungi administrator.' };
    }

    setUser(profileUser);
    return { success: true };
  }, [fetchProfile]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  return { user, loading, error, signIn, signOut };
}
