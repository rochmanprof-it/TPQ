import React, { useState } from 'react';
import { AttendanceRecord, Student, User } from '../types';
import { Calendar, UserCheck, Plus, Search, Filter, Trash2, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

interface AbsensiListProps {
  attendance: AttendanceRecord[];
  students: Student[];
  currentUser: User;
  onOpenBatchModal: () => void;
  onDeleteRecord: (id: string) => void;
}

export const AbsensiList: React.FC<AbsensiListProps> = ({
  attendance,
  students,
  currentUser,
  onOpenBatchModal,
  onDeleteRecord
}) => {
  const canWrite = currentUser.role === 'pengajar' || currentUser.role === 'kepala';
  const isWali = currentUser.role === 'wali_murid';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudentFilter, setSelectedStudentFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('');

  // Restrict to child if wali murid
  const baseAttendance = isWali && currentUser.studentId
    ? attendance.filter(a => a.studentId === currentUser.studentId)
    : attendance;

  // Filter
  const filtered = baseAttendance.filter(item => {
    const matchSearch = item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.note && item.note.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchStudent = selectedStudentFilter === 'all' || item.studentId === selectedStudentFilter;
    const matchStatus = selectedStatusFilter === 'all' || item.status === selectedStatusFilter;
    const matchDate = !selectedDateFilter || item.date === selectedDateFilter;
    return matchSearch && matchStudent && matchStatus && matchDate;
  });

  // Calculate high-level stats
  const total = baseAttendance.length;
  const hadir = baseAttendance.filter(a => a.status === 'hadir').length;
  const izin = baseAttendance.filter(a => a.status === 'izin').length;
  const sakit = baseAttendance.filter(a => a.status === 'sakit').length;
  const alpa = baseAttendance.filter(a => a.status === 'alpa').length;
  const rate = total > 0 ? Math.round((hadir / total) * 100) : 100;

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-stone-900">
            {isWali ? 'Riwayat Kehadiran Ananda' : 'Pencatatan & Riwayat Absensi Santri'}
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            {isWali
              ? 'Catatan disiplin kehadiran mengaji di TPQ'
              : 'Pantau kehadiran harian santri, izin, sakit, dan tingkat kedisiplinan'}
          </p>
        </div>

        {canWrite && (
          <button
            onClick={onOpenBatchModal}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <UserCheck className="w-4 h-4" />
            <span>Isi Absensi Hari Ini (Massal)</span>
          </button>
        )}
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-stone-200">
          <div className="text-[11px] font-medium text-stone-500">Total Absensi</div>
          <div className="text-xl font-bold text-stone-900 font-mono tabular-nums mt-0.5">{total}</div>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-stone-200">
          <div className="text-[11px] font-medium text-emerald-700">Hadir</div>
          <div className="text-xl font-bold text-emerald-800 font-mono tabular-nums mt-0.5">{hadir}</div>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-stone-200">
          <div className="text-[11px] font-medium text-blue-700">Izin</div>
          <div className="text-xl font-bold text-blue-800 font-mono tabular-nums mt-0.5">{izin}</div>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-stone-200">
          <div className="text-[11px] font-medium text-amber-700">Sakit</div>
          <div className="text-xl font-bold text-amber-800 font-mono tabular-nums mt-0.5">{sakit}</div>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-stone-200 col-span-2 sm:col-span-1">
          <div className="text-[11px] font-medium text-stone-700">Persentase Hadir</div>
          <div className="text-xl font-bold text-stone-900 font-mono tabular-nums mt-0.5">{rate}%</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari santri atau catatan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-stone-200 bg-stone-50/70 text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700"
            />
          </div>

          {!isWali && (
            <div>
              <select
                value={selectedStudentFilter}
                onChange={(e) => setSelectedStudentFilter(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-stone-200 bg-stone-50/70 text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700"
              >
                <option value="all">Semua Santri</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-lg border border-stone-200 bg-stone-50/70 text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700"
            >
              <option value="all">Semua Status</option>
              <option value="hadir">Hadir</option>
              <option value="izin">Izin</option>
              <option value="sakit">Sakit</option>
              <option value="alpa">Alpa</option>
            </select>
          </div>

          <div>
            <input
              type="date"
              value={selectedDateFilter}
              onChange={(e) => setSelectedDateFilter(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-lg border border-stone-200 bg-stone-50/70 text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700"
            />
          </div>

        </div>

        {/* Active Filters Info */}
        <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
          <div>
            Menampilkan <span className="font-semibold text-stone-900 tabular-nums">{filtered.length}</span> catatan
          </div>
          {(searchTerm || selectedStudentFilter !== 'all' || selectedStatusFilter !== 'all' || selectedDateFilter) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedStudentFilter('all');
                setSelectedStatusFilter('all');
                setSelectedDateFilter('');
              }}
              className="text-emerald-700 hover:text-emerald-800 font-medium cursor-pointer"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 text-stone-700 font-semibold border-b border-stone-200">
            <tr>
              <th className="py-3 px-4 w-28">Tanggal</th>
              <th className="py-3 px-4">Nama Santri</th>
              <th className="py-3 px-4 w-28">Status Kehadiran</th>
              <th className="py-3 px-4">Keterangan / Catatan Izin</th>
              <th className="py-3 px-4 w-36">Pengajar Pencatat</th>
              {canWrite && <th className="py-3 px-4 w-16 text-center">Aksi</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={canWrite ? 6 : 5} className="py-8 text-center text-stone-500">
                  Tidak ada catatan kehadiran yang sesuai filter.
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="py-3 px-4 font-mono tabular-nums text-stone-600">
                    {item.date}
                  </td>
                  <td className="py-3 px-4 font-medium text-stone-900">
                    {item.studentName}
                  </td>
                  <td className="py-3 px-4">
                    {item.status === 'hadir' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Hadir
                      </span>
                    ) : item.status === 'izin' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        <Clock className="w-3 h-3 text-blue-600" />
                        Izin
                      </span>
                    ) : item.status === 'sakit' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        Sakit
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        Alpa
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-stone-600">
                    {item.note || '-'}
                  </td>
                  <td className="py-3 px-4 text-stone-500 text-[11px]">
                    {item.recordedBy}
                  </td>
                  {canWrite && (
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          if (confirm(`Hapus catatan kehadiran ${item.studentName} tanggal ${item.date}?`)) {
                            onDeleteRecord(item.id);
                          }
                        }}
                        className="text-stone-400 hover:text-rose-600 p-1 rounded hover:bg-stone-100 transition-colors cursor-pointer"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
