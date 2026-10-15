import { supabase } from './supabaseClient';
import { User, UserRole } from '../types';

interface ApiUserRow {
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

function mapRowToUser(r: ApiUserRow): User {
  return {
    id: r.id,
    username: r.username,
    name: r.name,
    role: r.role,
    title: r.title || undefined,
    email: r.email,
    phone: r.phone || '',
    studentId: r.student_id || undefined,
    studentName: r.student_name || undefined,
  };
}

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

async function getFunctionUrl(): Promise<string> {
  const url = import.meta.env.VITE_SUPABASE_URL;
  return `${url}/functions/v1/manage-users`;
}

async function getAuthHeaders(): Promise<HeadersInit> {
  const { data: { session } } = await supabase.auth.getSession();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session?.access_token || ''}`,
    'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
  };
}

export const userAdminApi = {
  async listUsers(): Promise<User[]> {
    const headers = await getAuthHeaders();
    const url = await getFunctionUrl();
    const res = await fetch(url, { method: 'GET', headers });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to fetch users' }));
      throw new Error(err.error || `HTTP ${res.status}`);
    }
    const data = await res.json();
    return (data.users as ApiUserRow[]).map(mapRowToUser);
  },

  async createUser(payload: CreateUserPayload): Promise<void> {
    const headers = await getAuthHeaders();
    const url = await getFunctionUrl();
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        username: payload.username,
        name: payload.name,
        role: payload.role,
        title: payload.title,
        email: payload.email,
        phone: payload.phone,
        password: payload.password,
        student_id: payload.studentId,
        student_name: payload.studentName,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to create user' }));
      throw new Error(err.error || `HTTP ${res.status}`);
    }
  },

  async updateUser(id: string, payload: UpdateUserPayload): Promise<void> {
    const headers = await getAuthHeaders();
    const url = await getFunctionUrl();
    const res = await fetch(`${url}?id=${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        username: payload.username,
        name: payload.name,
        role: payload.role,
        title: payload.title,
        email: payload.email,
        phone: payload.phone,
        password: payload.password,
        student_id: payload.studentId,
        student_name: payload.studentName,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to update user' }));
      throw new Error(err.error || `HTTP ${res.status}`);
    }
  },

  async deleteUser(id: string): Promise<void> {
    const headers = await getAuthHeaders();
    const url = await getFunctionUrl();
    const res = await fetch(`${url}?id=${id}`, {
      method: 'DELETE',
      headers,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to delete user' }));
      throw new Error(err.error || `HTTP ${res.status}`);
    }
  },
};
