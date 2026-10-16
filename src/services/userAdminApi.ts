import { storage } from './storage';
import { User, UserRole } from '../types';

export interface CreateUserPayload {
  username: string;
  name: string;
  role: UserRole;
  title?: string;
  email: string;
  phone: string;
  password: string;
  studentId?: string;
  studentName?: string;
}

export interface UpdateUserPayload {
  username?: string;
  name?: string;
  role?: UserRole;
  title?: string;
  email?: string;
  phone?: string;
  password?: string;
  studentId?: string;
  studentName?: string;
}

export const userAdminApi = {
  async listUsers(): Promise<User[]> {
    return storage.getUsers();
  },

  async createUser(payload: CreateUserPayload): Promise<void> {
    const users = storage.getUsers();
    
    // Check for duplicate username
    if (users.some(u => u.username.toLowerCase() === payload.username.trim().toLowerCase())) {
      throw new Error(`Username "${payload.username}" sudah digunakan. Silakan gunakan username lain.`);
    }

    // Check for duplicate email
    if (users.some(u => u.email.toLowerCase() === payload.email.trim().toLowerCase())) {
      throw new Error(`Email "${payload.email}" sudah terdaftar.`);
    }

    const newUser: User = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      username: payload.username.trim(),
      name: payload.name.trim(),
      role: payload.role,
      title: payload.title?.trim() || undefined,
      email: payload.email.trim().toLowerCase(),
      phone: payload.phone.trim() || '-',
      password: payload.password,
      studentId: payload.role === 'wali_murid' ? payload.studentId : undefined,
      studentName: payload.role === 'wali_murid' ? payload.studentName : undefined,
    };

    storage.saveUser(newUser);
  },

  async updateUser(id: string, payload: UpdateUserPayload): Promise<void> {
    const users = storage.getUsers();
    const existing = users.find(u => u.id === id);
    if (!existing) {
      throw new Error('Akun pengguna tidak ditemukan.');
    }

    if (payload.username && payload.username.trim().toLowerCase() !== existing.username.toLowerCase()) {
      if (users.some(u => u.id !== id && u.username.toLowerCase() === payload.username!.trim().toLowerCase())) {
        throw new Error(`Username "${payload.username}" sudah digunakan.`);
      }
    }

    if (payload.email && payload.email.trim().toLowerCase() !== existing.email.toLowerCase()) {
      if (users.some(u => u.id !== id && u.email.toLowerCase() === payload.email!.trim().toLowerCase())) {
        throw new Error(`Email "${payload.email}" sudah terdaftar.`);
      }
    }

    const updatedUser: User = {
      ...existing,
      username: payload.username !== undefined ? payload.username.trim() : existing.username,
      name: payload.name !== undefined ? payload.name.trim() : existing.name,
      role: payload.role !== undefined ? payload.role : existing.role,
      title: payload.title !== undefined ? (payload.title.trim() || undefined) : existing.title,
      email: payload.email !== undefined ? payload.email.trim().toLowerCase() : existing.email,
      phone: payload.phone !== undefined ? payload.phone.trim() : existing.phone,
      studentId: payload.role === 'wali_murid' ? (payload.studentId || undefined) : undefined,
      studentName: payload.role === 'wali_murid' ? (payload.studentName || undefined) : undefined,
      password: payload.password ? payload.password : existing.password,
    };

    storage.saveUser(updatedUser);
  },

  async deleteUser(id: string): Promise<void> {
    const active = storage.getActiveUser();
    if (active && active.id === id) {
      throw new Error('Tidak dapat menghapus akun yang sedang Anda gunakan saat ini.');
    }
    storage.deleteUser(id);
  },
};
