import { Clock, CheckCircle, AlertCircle, FileText, TrendingUp, Calendar } from 'lucide-react';
import { AttendanceRecord, WorkReport } from '../types';
import { getEmployee, getTodayAttendance, getAttendanceRecords, getWorkReports } from '../store';
import { formatDate, formatTime, calculateWorkHours, getCurrentDateString, getCurrentTimeString } from '../utils';

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const employee = getEmployee();
  const todayAttendance = getTodayAttendance();
  const allAttendance = getAttendanceRecords();
  const allReports = getWorkReports();
  const today = getCurrentDateString();

  // Stats
  const thisWeekAttendance = allAttendance.filter(r => {
    const date = new Date(r.date);
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return date >= weekAgo;
  });

  const presentDays = thisWeekAttendance.filter(r => r.status === 'present' || r.status === 'late').length;
  const lateDays = thisWeekAttendance.filter(r => r.status === 'late').length;
  const totalHours = thisWeekAttendance.reduce((sum, r) => {
    if (r.checkIn && r.checkOut) return sum + calculateWorkHours(r.checkIn, r.checkOut);
    return sum;
  }, 0);

  const stats = [
    {
      label: 'Today\'s Status',
      value: todayAttendance?.checkIn ? (todayAttendance.checkOut ? 'Completed' : 'Working') : 'Not Checked In',
      icon: Clock,
      color: todayAttendance?.checkIn ? (todayAttendance.checkOut ? 'text-green-500' : 'text-blue-500') : 'text-slate-400',
      bg: todayAttendance?.checkIn ? (todayAttendance.checkOut ? 'bg-green-50' : 'bg-blue-50') : 'bg-slate-50',
    },
    {
      label: 'This Week',
      value: `${presentDays}/5 days`,
      icon: Calendar,
      color: 'text-indigo-500',
      bg: 'bg-indigo-50',
    },
    {
      label: 'Late Arrivals',
      value: `${lateDays}`,
      icon: AlertCircle,
      color: lateDays > 0 ? 'text-amber-500' : 'text-green-500',
      bg: lateDays > 0 ? 'bg-amber-50' : 'bg-green-50',
    },
    {
      label: 'Hours This Week',
      value: `${totalHours.toFixed(1)}h`,
      icon: TrendingUp,
      color: 'text-purple-500',
      bg: 'bg-purple-50',
    },
  ];

  const recentReports = allReports.slice(0, 3);
  const recentAttendance = allAttendance.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {employee.name.split(' ')[0]}!</h2>
            <p className="text-blue-100 mt-1">{employee.position} • {employee.department}</p>
            <p className="text-blue-200 text-sm mt-2">{formatDate(new Date(), 'EEEE, MMMM dd, yyyy')}</p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Clock size={40} className="text-white/80" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}>
                  <Icon size={24} className={stat.color} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Attendance */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">Recent Attendance</h3>
            <button onClick={() => onNavigate('attendance')} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All →
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {recentAttendance.map((record) => (
              <div key={record.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    record.status === 'present' ? 'bg-green-500' :
                    record.status === 'late' ? 'bg-amber-500' :
                    'bg-red-500'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-slate-700">{formatDate(record.date, 'MMM dd, yyyy')}</p>
                    <p className="text-xs text-slate-400">
                      {record.checkIn ? formatTime(record.checkIn) : '--:--'} → {record.checkOut ? formatTime(record.checkOut) : '--:--'}
                    </p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  record.status === 'present' ? 'bg-green-100 text-green-700' :
                  record.status === 'late' ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {record.status}
                </span>
              </div>
            ))}
            {recentAttendance.length === 0 && (
              <div className="p-8 text-center text-slate-400">
                <Clock size={32} className="mx-auto mb-2 opacity-50" />
                <p>No attendance records yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">Recent Reports</h3>
            <button onClick={() => onNavigate('reports')} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All →
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {recentReports.map((report) => (
              <div key={report.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-slate-700">{formatDate(report.date, 'MMM dd, yyyy')}</p>
                  <span className="text-xs text-slate-400">{report.tasks.length} tasks</span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2">{report.summary}</p>
              </div>
            ))}
            {recentReports.length === 0 && (
              <div className="p-8 text-center text-slate-400">
                <FileText size={32} className="mx-auto mb-2 opacity-50" />
                <p>No reports submitted yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
        <h3 className="font-semibold text-slate-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => onNavigate('attendance')}
            className="flex items-center gap-3 p-4 rounded-lg border-2 border-dashed border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock size={20} className="text-blue-600" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-slate-700">Mark Attendance</p>
              <p className="text-xs text-slate-400">Check in / Check out</p>
            </div>
          </button>
          <button
            onClick={() => onNavigate('reports')}
            className="flex items-center gap-3 p-4 rounded-lg border-2 border-dashed border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all"
          >
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText size={20} className="text-purple-600" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-slate-700">Submit Report</p>
              <p className="text-xs text-slate-400">Daily work report</p>
            </div>
          </button>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 border-2 border-slate-100">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle size={20} className="text-green-600" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-slate-700">Today's Tasks</p>
              <p className="text-xs text-slate-400">
                {todayAttendance?.checkIn ? `${calculateWorkHours(todayAttendance.checkIn, todayAttendance.checkOut || getCurrentTimeString()).toFixed(1)}h worked` : 'Not started yet'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
