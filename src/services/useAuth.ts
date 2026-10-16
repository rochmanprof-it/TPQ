import { useState, useEffect, useCallback } from 'react';
import { storage } from './storage';
import { User } from '../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const active = storage.getActiveUser();
    setUser(active);
    setLoading(false);
  }, []);

  const signIn = useCallback(async (identifier: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setError(null);

    const cleanId = identifier.trim().toLowerCase();
    if (!cleanId || !password) {
      return { success: false, error: 'Email atau username dan kata sandi harus diisi.' };
    }

    const users = storage.getUsers();
    const matchedUser = users.find(u =>
      u.email.toLowerCase() === cleanId ||
      u.username.toLowerCase() === cleanId
    );

    if (!matchedUser) {
      return { success: false, error: 'Email atau username tidak ditemukan. Silakan periksa kembali.' };
    }

    // Verify password (either specific user password, or standard demo passwords, or fallback 123456)
    const expectedPassword = matchedUser.password || '123456';
    const isPasswordValid =
      password === expectedPassword ||
      password === '123456' ||
      (matchedUser.role === 'admin' && (password === 'admin123456' || password === 'admin')) ||
      (matchedUser.role === 'kepala' && (password === 'kepala123456' || password === 'kepala')) ||
      (matchedUser.role === 'pengajar' && (password === 'ustadz123456' || password === 'pengajar')) ||
      (matchedUser.role === 'wali_murid' && (password === 'wali123456' || password === 'wali'));

    if (!isPasswordValid) {
      return { success: false, error: 'Kata sandi salah. Silakan coba lagi.' };
    }

    storage.setActiveUser(matchedUser);
    setUser(matchedUser);
    return { success: true };
  }, []);

  const signOut = useCallback(async () => {
    storage.clearActiveUser();
    setUser(null);
  }, []);

  return { user, loading, error, signIn, signOut };
}
