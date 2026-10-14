import React from 'react';
import { User } from '../types';
import { X, Check, ShieldCheck, User as UserIcon, GraduationCap, Lock, HeartHandshake } from 'lucide-react';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  currentUser: User;
  onSelectUser: (user: User) => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({
  isOpen,
  onClose,
  users,
  currentUser,
  onSelectUser
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl border border-stone-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div>
            <h3 className="text-base font-semibold text-stone-900">
              Simulasi Ganti Peran & Pengguna
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Pilih akun untuk menguji fitur otorisasi & tampilan antarmuka
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informative Security Banner */}
        <div className="p-6 space-y-4">
          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-lg text-xs space-y-1.5">
            <div className="font-semibold text-emerald-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              Aturan Hak Akses (Role-Based Access Control):
            </div>
            <p className="text-emerald-800 leading-relaxed">
              <strong>Pengajar & Kepala TPQ:</strong> Akses <em>Read & Write</em> penuh (input absensi harian, catat setoran & nilai tajwid, beri evaluasi, cetak raport semua santri).
            </p>
            <p className="text-emerald-800 leading-relaxed">
              <strong>Wali Murid:</strong> Akses <em>Read Only</em>. Sistem membatasi hanya menampilkan data dari anak kandungnya sendiri untuk privasi santri.
            </p>
          </div>

          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {users.map((user) => {
              const isSelected = user.id === currentUser.id;
              const isWali = user.role === 'wali_murid';

              return (
                <button
                  key={user.id}
                  onClick={() => {
                    onSelectUser(user);
                    onClose();
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start justify-between cursor-pointer ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/40 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50/70'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                        user.role === 'pengajar'
                          ? 'bg-emerald-100 text-emerald-800'
                          : user.role === 'kepala'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-sky-100 text-sky-800'
                      }`}
                    >
                      {user.role === 'pengajar' ? (
                        <GraduationCap className="w-5 h-5" />
                      ) : user.role === 'kepala' ? (
                        <ShieldCheck className="w-5 h-5" />
                      ) : (
                        <HeartHandshake className="w-5 h-5" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-stone-900">
                          {user.name}
                        </span>
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                            user.role === 'pengajar'
                              ? 'bg-emerald-100/70 text-emerald-800'
                              : user.role === 'kepala'
                              ? 'bg-amber-100/70 text-amber-800'
                              : 'bg-sky-100/70 text-sky-800'
                          }`}
                        >
                          {user.role === 'pengajar'
                            ? 'Pengajar (Read/Write)'
                            : user.role === 'kepala'
                            ? 'Kepala TPQ (Read/Write)'
                            : 'Wali Murid (Read Only)'}
                        </span>
                      </div>

                      <div className="text-xs text-stone-500 mt-0.5">
                        {user.title || user.email}
                      </div>

                      {isWali && user.studentName && (
                        <div className="mt-1.5 text-xs text-stone-700 bg-white/80 border border-stone-200/60 px-2.5 py-1 rounded-md inline-block">
                          Santri yang dipantau: <strong className="text-emerald-800">{user.studentName}</strong>
                        </div>
                      )}
                    </div>
                  </div>

                  {isSelected && (
                    <div className="shrink-0 text-emerald-700 bg-emerald-100 p-1 rounded-full">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-stone-100 bg-stone-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
