import { useState, useEffect } from 'react';
import { Clock, LogIn, LogOut, CheckCircle, AlertCircle, Calendar, MapPin } from 'lucide-react';
import { AttendanceRecord } from '../types';
import { getTodayAttendance, saveAttendanceRecord, getAttendanceRecords } from '../store';
import { getCurrentTimeString, getCurrentDateString, formatTime, formatDate, isLate, calculateWorkHours } from '../utils';

export default function Attendance() {
  const [currentTime, setCurrentTime] = useState(getCurrentTimeString());
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(getTodayAttendance());
  const [allRecords, setAllRecords] = useState<AttendanceRecord[]>(getAttendanceRecords());
  const [note, setNote] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getCurrentTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckIn = () => {
    const now = getCurrentTimeString();
    const today = getCurrentDateString();
    const late = isLate(now);
    
    const record: AttendanceRecord = {
      id: todayRecord?.id || `att-${Date.now()}`,
      date: today,
      checkIn: now,
      checkOut: null,
      status: late ? 'late' : 'present',
      note: note || (late ? 'Late arrival' : ''),
    };
    
    saveAttendanceRecord(record);
    setTodayRecord(record);
    setAllRecords(getAttendanceRecords());
    setNote('');
  };

  const handleCheckOut = () => {
    if (!todayRecord) return;
    const now = getCurrentTimeString();
    
    const record: AttendanceRecord = {
      ...todayRecord,
      checkOut: now,
    };
    
    saveAttendanceRecord(record);
    setTodayRecord(record);
    setAllRecords(getAttendanceRecords());
  };

  const workHours = todayRecord?.checkIn 
    ? calculateWorkHours(todayRecord.checkIn, todayRecord.checkOut || currentTime)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Attendance</h2>
        <p className="text-slate-500 mt-1">Track your daily check-in and check-out times</p>
      </div>

      {/* Current Time & Status Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Clock Card */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white col-span-1 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-blue-200" />
              <span className="text-sm text-blue-200">Office Location</span>
            </div>
            <span className="text-xs bg-white/20 px-3 py-1 rounded-full">
              {formatDate(new Date(), 'EEEE, MMM dd')}
            </span>
          </div>
          
          <div className="text-center mb-6">
            <div className="text-6xl font-mono font-bold tracking-wider">
              {formatTime(currentTime)}
            </div>
            <p className="text-blue-200 mt-2">
              {todayRecord?.checkIn 
                ? (todayRecord.checkOut ? '✓ Day completed' : 'Currently working')
                : 'Ready to check in'}
            </p>
          </div>

          <div className="flex items-center justify-center gap-4">
            {!todayRecord?.checkIn ? (
              <button
                onClick={handleCheckIn}
                className="flex items-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg"
              >
                <LogIn size={20} />
                Check In
              </button>
            ) : !todayRecord?.checkOut ? (
              <button
                onClick={handleCheckOut}
                className="flex items-center gap-2 bg-white text-indigo-600 px-8 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-colors shadow-lg"
              >
                <LogOut size={20} />
                Check Out
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-white/20 px-8 py-3 rounded-xl">
                <CheckCircle size={20} />
                <span className="font-semibold">Day Completed</span>
              </div>
            )}
          </div>

          {todayRecord?.checkIn && (
            <div className="mt-6 flex items-center justify-center gap-6 text-sm">
              <div className="text-center">
                <p className="text-blue-200 text-xs">Check In</p>
                <p className="font-semibold">{formatTime(todayRecord.checkIn)}</p>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="text-center">
                <p className="text-blue-200 text-xs">Check Out</p>
                <p className="font-semibold">{todayRecord.checkOut ? formatTime(todayRecord.checkOut) : '--:--'}</p>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="text-center">
                <p className="text-blue-200 text-xs">Hours</p>
                <p className="font-semibold">{workHours.toFixed(1)}h</p>
              </div>
            </div>
          )}
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-800 mb-4">Today's Status</h3>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                todayRecord?.status === 'present' ? 'bg-green-100' :
                todayRecord?.status === 'late' ? 'bg-amber-100' : 'bg-slate-100'
              }`}>
                {todayRecord?.status === 'present' ? <CheckCircle size={20} className="text-green-600" /> :
                 todayRecord?.status === 'late' ? <AlertCircle size={20} className="text-amber-600" /> :
                 <Clock size={20} className="text-slate-400" />}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">
                  {todayRecord?.checkIn ? (todayRecord.status === 'late' ? 'Late Arrival' : 'On Time') : 'Not Checked In'}
                </p>
                <p className="text-xs text-slate-400">
                  {todayRecord?.note || 'No notes'}
                </p>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <label className="text-xs text-slate-500 font-medium">Add Note (optional)</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g., Working from home, Traffic delay..."
                className="mt-1 w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                disabled={!!todayRecord?.checkIn}
              />
            </div>

            <div className="border-t border-slate-100 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Work Hours</span>
                <span className="font-semibold text-slate-700">{workHours.toFixed(1)}h / 8h</span>
              </div>
              <div className="mt-2 w-full bg-slate-100 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((workHours / 8) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance History */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar size={20} className="text-slate-400" />
            <h3 className="font-semibold text-slate-800">Attendance History</h3>
          </div>
          <span className="text-xs text-slate-400">{allRecords.length} records</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Date</th>
                <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Check In</th>
                <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Check Out</th>
                <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Hours</th>
                <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Status</th>
                <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {allRecords.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 text-sm font-medium text-slate-700">
                    {formatDate(record.date, 'MMM dd, yyyy')}
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-600">
                    {record.checkIn ? formatTime(record.checkIn) : '--:--'}
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-600">
                    {record.checkOut ? formatTime(record.checkOut) : '--:--'}
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-600">
                    {record.checkIn && record.checkOut 
                      ? `${calculateWorkHours(record.checkIn, record.checkOut).toFixed(1)}h`
                      : '--'}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      record.status === 'present' ? 'bg-green-100 text-green-700' :
                      record.status === 'late' ? 'bg-amber-100 text-amber-700' :
                      record.status === 'half-day' ? 'bg-blue-100 text-blue-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-400 max-w-[200px] truncate">
                    {record.note || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {allRecords.length === 0 && (
          <div className="p-12 text-center text-slate-400">
            <Clock size={40} className="mx-auto mb-3 opacity-50" />
            <p>No attendance records yet</p>
            <p className="text-sm mt-1">Check in to start tracking your attendance</p>
          </div>
        )}
      </div>
    </div>
  );
}
