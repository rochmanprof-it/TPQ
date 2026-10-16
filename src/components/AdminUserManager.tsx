import React, { useState, useEffect, useCallback } from 'react';
import { User, UserRole } from '../types';
import { userAdminApi, CreateUserPayload, UpdateUserPayload } from '../services/userAdminApi';
import {
  ShieldCheck, GraduationCap, HeartHandshake, Crown, X, Plus, Trash2, Edit2,
  AlertCircle, CheckCircle2, Loader2, Search, Lock, Mail, Phone, User as UserIcon
} from 'lucide-react';

interface AdminUserManagerProps {
  currentUser: User;
  onUserDeleted?: () => void;
}

const ROLE_CONFIG: Record<UserRole, { label: string; icon: React.ReactNode; color: string; bg: string; border: string }> = {
  admin: { label: 'Administrator', icon: <Crown className="w-4 h-4" />, color: 'text-rose-800', bg: 'bg-rose-50', border: 'border-rose-200' },
  kepala: { label: 'Kepala TPQ', icon: <ShieldCheck className="w-4 h-4" />, color: 'text-amber-800', bg: 'bg-amber-50', border: 'border-amber-200' },
  pengajar: { label: 'Pengajar', icon: <GraduationCap className="w-4 h-4" />, color: 'text-emerald-800', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  wali_murid: { label: 'Wali Murid', icon: <HeartHandshake className="w-4 h-4" />, color: 'text-sky-800', bg: 'bg-sky-50', border: 'border-sky-200' },
};

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: 'admin', label: 'Administrator' },
  { value: 'kepala', label: 'Kepala TPQ' },
  { value: 'pengajar', label: 'Pengajar' },
  { value: 'wali_murid', label: 'Wali Murid' },
];

export const AdminUserManager: React.FC<AdminUserManagerProps> = ({ currentUser, onUserDeleted }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<User | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [students, setStudents] = useState<{ id: string; name: string }[]>([]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await userAdminApi.listUsers();
      setUsers(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat daftar pengguna');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    // Load students from localStorage for wali_murid linking
    try {
      const raw = localStorage.getItem('tpq_students_v1');
      if (raw) {
        const parsed = JSON.parse(raw) as { id: string; name: string }[];
        setStudents(parsed.map(s => ({ id: s.id, name: s.name })));
      }
    } catch {
      // ignore
    }
  }, [fetchUsers]);

  const filteredUsers = users.filter(u => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    );
  });

  const handleOpenCreate = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await userAdminApi.deleteUser(confirmDelete.id);
      setUsers(users.filter(u => u.id !== confirmDelete.id));
      showToast(`Akun "${confirmDelete.name}" berhasil dihapus`);
      setConfirmDelete(null);
      onUserDeleted?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menghapus pengguna');
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & Actions */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <Crown className="w-5 h-5 text-rose-700" />
              Manajemen Akun Pengguna
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Kelola akun pengguna, peran, dan hak akses. Hanya administrator yang dapat mengelola akun.
            </p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-rose-800 hover:bg-rose-900 rounded-xl shadow-xs transition-colors cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Akun Baru</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan nama, username, atau email..."
            className="w-full text-xs rounded-xl border border-stone-300 pl-9 pr-3 py-2.5 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-700"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-12 text-stone-500 text-xs">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          Memuat daftar pengguna...
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-left text-stone-600 font-bold">
                  <th className="px-4 py-3">Nama & Akun</th>
                  <th className="px-4 py-3">Peran</th>
                  <th className="px-4 py-3 hidden sm:table-cell">Kontak</th>
                  <th className="px-4 py-3 hidden md:table-cell">Info Santri</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredUsers.map(u => {
                  const cfg = ROLE_CONFIG[u.role];
                  const isSelf = u.id === currentUser.id;
                  return (
                    <tr key={u.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
                            {cfg.icon}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-stone-900 flex items-center gap-1.5">
                              {u.name}
                              {isSelf && <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-semibold">Anda</span>}
                            </div>
                            <div className="text-[11px] text-stone-500 font-mono">@{u.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full font-semibold text-[11px] ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
                          {cfg.icon}
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <div className="text-stone-700 flex items-center gap-1.5 text-[11px]">
                          <Mail className="w-3 h-3 text-stone-400" />
                          {u.email}
                        </div>
                        <div className="text-stone-500 flex items-center gap-1.5 text-[11px] mt-0.5">
                          <Phone className="w-3 h-3 text-stone-400" />
                          {u.phone || '-'}
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        {u.studentName ? (
                          <span className="text-stone-700 text-[11px]">
                            {u.studentName}
                            <span className="text-stone-400 block">ID: {u.studentId}</span>
                          </span>
                        ) : (
                          <span className="text-stone-400 text-[11px]">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(u)}
                            className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                            title="Edit akun"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setConfirmDelete(u)}
                            disabled={isSelf}
                            className="p-1.5 text-rose-600 hover:text-rose-900 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                            title={isSelf ? 'Tidak dapat menghapus akun sendiri' : 'Hapus akun'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredUsers.length === 0 && (
            <div className="py-8 text-center text-stone-400 text-xs">
              Tidak ada pengguna yang cocok dengan pencarian.
            </div>
          )}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl border border-stone-800 flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Create/Edit Modal */}
      {modalOpen && (
        <UserFormModal
          editingUser={editingUser}
          students={students}
          currentUserId={currentUser.id}
          onClose={() => { setModalOpen(false); setEditingUser(null); }}
          onSaved={() => {
            setModalOpen(false);
            setEditingUser(null);
            fetchUsers();
            showToast(editingUser ? 'Akun berhasil diperbarui' : 'Akun baru berhasil dibuat');
          }}
        />
      )}

      {/* Delete Confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-100">
          <div className="bg-white rounded-2xl shadow-xl border border-stone-200 w-full max-w-sm overflow-hidden">
            <div className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5 text-rose-700" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900">Hapus Akun Pengguna?</h3>
                  <p className="text-xs text-stone-500 mt-0.5">Tindakan ini tidak dapat dibatalkan.</p>
                </div>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed">
                Anda akan menghapus akun <strong>{confirmDelete.name}</strong> (@{confirmDelete.username}).
                Semua data terkait akun ini akan dihapus permanen.
              </p>
              <div className="flex items-center gap-2 mt-5">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-2 text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 rounded-xl transition-colors cursor-pointer"
                >
                  Ya, Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ===== User Form Modal =====

interface UserFormModalProps {
  editingUser: User | null;
  students: { id: string; name: string }[];
  currentUserId: string;
  onClose: () => void;
  onSaved: () => void;
}

const UserFormModal: React.FC<UserFormModalProps> = ({ editingUser, students, onClose, onSaved }) => {
  const isEdit = !!editingUser;
  const [formData, setFormData] = useState({
    username: editingUser?.username || '',
    name: editingUser?.name || '',
    role: editingUser?.role || ('pengajar' as UserRole),
    title: editingUser?.title || '',
    email: editingUser?.email || '',
    phone: editingUser?.phone || '',
    password: '',
    studentId: editingUser?.studentId || '',
    studentName: editingUser?.studentName || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.username.trim() || !formData.name.trim() || !formData.email.trim()) {
      setError('Username, nama, dan email wajib diisi.');
      return;
    }

    if (!isEdit && !formData.password) {
      setError('Kata sandi wajib diisi untuk akun baru.');
      return;
    }

    if (!isEdit && formData.password.length < 6) {
      setError('Kata sandi minimal 6 karakter.');
      return;
    }

    setSaving(true);
    try {
      if (isEdit && editingUser) {
        const payload: UpdateUserPayload = {
          username: formData.username,
          name: formData.name,
          role: formData.role,
          title: formData.title || undefined,
          email: formData.email,
          phone: formData.phone,
          studentId: formData.role === 'wali_murid' ? formData.studentId : undefined,
          studentName: formData.role === 'wali_murid' ? formData.studentName : undefined,
        };
        if (formData.password) payload.password = formData.password;
        await userAdminApi.updateUser(editingUser.id, payload);
      } else {
        const payload: CreateUserPayload = {
          username: formData.username,
          name: formData.name,
          role: formData.role,
          title: formData.title || undefined,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          studentId: formData.role === 'wali_murid' ? formData.studentId : undefined,
          studentName: formData.role === 'wali_murid' ? formData.studentName : undefined,
        };
        await userAdminApi.createUser(payload);
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan akun');
    } finally {
      setSaving(false);
    }
  };

  const handleStudentSelect = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    setFormData({
      ...formData,
      studentId,
      studentName: student?.name || '',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-100">
      <div className="bg-white rounded-2xl shadow-xl border border-stone-200 w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
        <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            {isEdit ? <Edit2 className="w-5 h-5 text-stone-700" /> : <Plus className="w-5 h-5 text-rose-700" />}
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                {isEdit ? 'Edit Akun Pengguna' : 'Tambah Akun Pengguna Baru'}
              </h3>
              <p className="text-xs text-stone-500">
                {isEdit ? `Perbarui data akun @${editingUser?.username}` : 'Isi data lengkap untuk akun baru'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700 p-1 rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Role Selection */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-2">Peran / Role</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ROLE_OPTIONS.map(opt => {
                const cfg = ROLE_CONFIG[opt.value];
                const selected = formData.role === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: opt.value })}
                    className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      selected ? `${cfg.bg} ${cfg.color} ${cfg.border} ring-2 ring-offset-1` : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {cfg.icon}
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Name & Username */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Nama Lengkap</label>
              <div className="relative">
                <UserIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs rounded-xl border border-stone-300 pl-8 pr-3 py-2.5 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-700"
                  placeholder="Nama lengkap pengguna"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full text-xs rounded-xl border border-stone-300 px-3 py-2.5 bg-white text-stone-900 font-mono focus:outline-none focus:ring-2 focus:ring-rose-700"
                placeholder="username.unik"
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Jabatan / Titel (opsional)</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full text-xs rounded-xl border border-stone-300 px-3 py-2.5 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-700"
              placeholder="Contoh: Guru Halaqah Tilawah, Kepala TPQ, Wali dari..."
            />
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full text-xs rounded-xl border border-stone-300 pl-8 pr-3 py-2.5 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-700"
                  placeholder="email@contoh.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">No. Telepon</label>
              <div className="relative">
                <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full text-xs rounded-xl border border-stone-300 pl-8 pr-3 py-2.5 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-700"
                  placeholder="08xx-xxxx-xxxx"
                />
              </div>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Kata Sandi {isEdit && '(kosongkan jika tidak ingin mengubah)'}
            </label>
            <div className="relative">
              <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full text-xs rounded-xl border border-stone-300 pl-8 pr-3 py-2.5 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-700"
                placeholder={isEdit ? '•••••• (opsional)' : 'Minimal 6 karakter'}
              />
            </div>
          </div>

          {/* Student Link for Wali Murid */}
          {formData.role === 'wali_murid' && (
            <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-200 space-y-3">
              <div className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-sky-700" />
                Data Santri yang Diwali
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-sky-800 mb-1">Pilih Santri</label>
                <select
                  value={formData.studentId}
                  onChange={(e) => handleStudentSelect(e.target.value)}
                  className="w-full text-xs rounded-lg border border-sky-300 px-3 py-2.5 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-sky-700"
                >
                  <option value="">-- Pilih Santri --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                  ))}
                </select>
              </div>
              {formData.studentName && (
                <div className="text-[11px] text-sky-800 bg-white/80 rounded-lg px-2.5 py-1.5 border border-sky-200/60">
                  Wali dari: <strong>{formData.studentName}</strong>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 text-xs font-bold text-white bg-rose-800 hover:bg-rose-900 rounded-xl transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isEdit ? 'Simpan Perubahan' : 'Buat Akun'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
