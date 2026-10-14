import React, { useState } from 'react';
import { Student, AttendanceRecord, AttendanceStatus, User } from '../types';
import { X, CheckCircle2, UserCheck, AlertCircle } from 'lucide-react';

interface AbsensiBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  currentUser: User;
  onSaveBatch: (records: AttendanceRecord[]) => void;
  existingAttendance: AttendanceRecord[];
}

export const AbsensiBatchModal: React.FC<AbsensiBatchModalProps> = ({
  isOpen,
  onClose,
  students,
  currentUser,
  onSaveBatch,
  existingAttendance
}) => {
  if (!isOpen) return null;

  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  // Initialize status map for the given date from existing records or default to 'hadir'
  const [statusMap, setStatusMap] = useState<Record<string, { status: AttendanceStatus; note: string }>>(() => {
    const map: Record<string, { status: AttendanceStatus; note: string }> = {};
    const today = new Date().toISOString().slice(0, 10);
    students.forEach((s) => {
      const match = existingAttendance.find(a => a.studentId === s.id && a.date === today);
      map[s.id] = {
        status: match ? match.status : 'hadir',
        note: match?.note || ''
      };
    });
    return map;
  });

  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    const map: Record<string, { status: AttendanceStatus; note: string }> = {};
    students.forEach((s) => {
      const match = existingAttendance.find(a => a.studentId === s.id && a.date === newDate);
      map[s.id] = {
        status: match ? match.status : 'hadir',
        note: match?.note || ''
      };
    });
    setStatusMap(map);
  };

  const setStatus = (studentId: string, status: AttendanceStatus) => {
    setStatusMap(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status
      }
    }));
  };

  const setNote = (studentId: string, note: string) => {
    setStatusMap(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        note
      }
    }));
  };

  const markAllHadir = () => {
    const updated: Record<string, { status: AttendanceStatus; note: string }> = {};
    students.forEach(s => {
      updated[s.id] = {
        status: 'hadir',
        note: statusMap[s.id]?.note || ''
      };
    });
    setStatusMap(updated);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const records: AttendanceRecord[] = students.map((s) => ({
      id: `att-${Date.now()}-${s.id}`,
      studentId: s.id,
      studentName: s.name,
      date,
      status: statusMap[s.id]?.status || 'hadir',
      note: statusMap[s.id]?.note?.trim() || undefined,
      recordedBy: currentUser.name,
      timestamp: Date.now()
    }));

    onSaveBatch(records);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl border border-stone-200 w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-stone-900">
                Pencatatan Absensi Santri Harian
              </h3>
              <p className="text-xs text-stone-500">
                Dicatat oleh: <span className="text-stone-700 font-medium">{currentUser.name}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar (Date & Quick button) */}
        <div className="px-6 py-3 bg-stone-50 border-b border-stone-200/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-stone-700">Tanggal Absen:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => handleDateChange(e.target.value)}
              className="text-xs rounded-md border border-stone-300 bg-white px-2.5 py-1.5 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>
          <button
            type="button"
            onClick={markAllHadir}
            className="text-xs font-medium text-emerald-900 bg-emerald-100/80 hover:bg-emerald-200/80 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            Tandai Semua Hadir
          </button>
        </div>

        {/* Student Attendance List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          {students.map((student, index) => {
            const currentStatus = statusMap[student.id]?.status || 'hadir';
            const currentNote = statusMap[student.id]?.note || '';

            return (
              <div
                key={student.id}
                className="p-3.5 rounded-lg border border-stone-200 bg-white hover:border-stone-300 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-xs text-stone-400 font-mono tabular-nums text-right">
                      {index + 1}.
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-stone-900">
                        {student.name}
                      </div>
                      <div className="text-xs text-stone-500 flex items-center gap-2">
                        <span>{student.nis}</span>
                        <span>·</span>
                        <span className="text-emerald-800 font-medium">{student.currentLevel}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Options */}
                  <div className="flex items-center gap-1.5">
                    {[
                      { key: 'hadir', label: 'Hadir', activeBg: 'bg-emerald-700 text-white border-emerald-700' },
                      { key: 'izin', label: 'Izin', activeBg: 'bg-amber-600 text-white border-amber-600' },
                      { key: 'sakit', label: 'Sakit', activeBg: 'bg-blue-600 text-white border-blue-600' },
                      { key: 'alpa', label: 'Alpa', activeBg: 'bg-rose-600 text-white border-rose-600' }
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => setStatus(student.id, opt.key as AttendanceStatus)}
                        className={`text-xs px-3 py-1.5 rounded-md border font-medium transition-colors cursor-pointer ${
                          currentStatus === opt.key
                            ? opt.activeBg
                            : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Optional Note (especially useful if Izin/Sakit) */}
                <div className="mt-2.5 pt-2 border-t border-stone-100">
                  <input
                    type="text"
                    placeholder="Catatan kehadiran (misal: 'Izin lomba', 'Sakit flu', 'Datang terlambat 15 menit')..."
                    value={currentNote}
                    onChange={(e) => setNote(student.id, e.target.value)}
                    className="w-full text-xs rounded border border-stone-200 bg-stone-50/70 px-2.5 py-1 text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="text-xs text-stone-500">
            Total {students.length} Santri
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Simpan Absensi Harian
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
