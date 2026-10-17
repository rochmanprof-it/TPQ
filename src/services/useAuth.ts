import { useState, useEffect, useCallback } from 'react';
import { storage } from './storage';
import { supabaseService } from './supabaseService';
import { User } from '../types';

type AuthListener = (user: User | null) => void;
const listeners = new Set<AuthListener>();

function notifyAuthChange(user: User | null) {
  listeners.forEach((listener) => {
    try {
      listener(user);
    } catch (err) {
      console.error('Error notifying auth listener:', err);
    }
  });
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(
    () => storage.getActiveUser()
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Sync current active user on mount
    const active = storage.getActiveUser();
    setUser(active);

    // If Supabase is connected, refresh users in background so newly registered users can log in
    if (supabaseService.isConfigured()) {
      supabaseService.fetchUsers().then((remoteUsers) => {
        if (remoteUsers && remoteUsers.length > 0) {
          localStorage.setItem('tpq_users_v1', JSON.stringify(remoteUsers));
        }
      }).catch((e) => console.warn('Background user sync notice:', e));
    }

    const listener: AuthListener = (newUser) => {
      setUser(newUser);
    };

    listeners.add(listener);

    // Cross-tab synchronization
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'tpq_active_user_v1') {
        const updated = storage.getActiveUser();
        setUser(updated);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      listeners.delete(listener);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const signIn = useCallback(
    async (
      identifier: string,
      password: string
    ): Promise<{
      success: boolean;
      error?: string;
      user?: User;
    }> => {
      setError(null);

      const cleanId = identifier.trim().toLowerCase();

      if (!cleanId || !password) {
        const message =
          'Username atau email dan kata sandi harus diisi.';

        setError(message);
        return { success: false, error: message };
      }

      // If Supabase is connected, always fetch latest users first so newly created accounts
      // or changed passwords on another browser/device can log in immediately
      let users = storage.getUsers();
      if (supabaseService.isConfigured()) {
        try {
          const remoteUsers = await supabaseService.fetchUsers();
          if (remoteUsers && remoteUsers.length > 0) {
            localStorage.setItem('tpq_users_v1', JSON.stringify(remoteUsers));
            users = remoteUsers;
          }
        } catch (err) {
          console.warn('Supabase users fetch failed during sign in, fallback to local cache:', err);
        }
      }

      // Match by email, username, or common aliases
      const matchedUser = users.find((u) => {
        const uEmail = (u.email || '').toLowerCase().trim();
        const uUsername = (u.username || '').toLowerCase().trim();

        // Exact match
        if (uEmail === cleanId || uUsername === cleanId) {
          return true;
        }

        // Friendly username shortcuts
        if (
          cleanId === 'admin' &&
          (u.role === 'admin' || uUsername.startsWith('admin'))
        ) {
          return true;
        }

        if (
          cleanId === 'kepala' &&
          (u.role === 'kepala' || uUsername.startsWith('kepala'))
        ) {
          return true;
        }

        if (
          ['ustadz', 'pengajar', 'guru'].includes(cleanId) &&
          u.role === 'pengajar'
        ) {
          return true;
        }

        return false;
      });

      if (!matchedUser) {
        const message =
          `Akun "${identifier.trim()}" tidak ditemukan. ` +
          'Pastikan username atau email sudah terdaftar.';

        setError(message);
        return { success: false, error: message };
      }

      // STRICT PASSWORD VALIDATION
      // No universal password and no role-based password fallbacks.
      const storedPassword = matchedUser.password;
      const trimmedInputPass = password.trim();

      const isPasswordValid =
        typeof storedPassword === 'string' &&
        storedPassword.length > 0 &&
        trimmedInputPass === storedPassword;

      if (!isPasswordValid) {
        const message =
          'Kata sandi tidak sesuai. Silakan coba kembali.';

        setError(message);
        return { success: false, error: message };
      }

      // Save and notify all listeners
      storage.setActiveUser(matchedUser);
      setUser(matchedUser);
      notifyAuthChange(matchedUser);

      return {
        success: true,
        user: matchedUser
      };
    },
    []
  );

  const signOut = useCallback(async () => {
    storage.clearActiveUser();
    setUser(null);
    setError(null);
    notifyAuthChange(null);
  }, []);

  return {
    user,
    loading,
    error,
    signIn,
    signOut
  };
}