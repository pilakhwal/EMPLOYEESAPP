import { useState, useEffect } from 'react';
import { Employee, ShootEntry, DailyReport } from '../types';
import { getEmployees, getShootEntries, getDailyReports, getNotifications } from '../store';
import { formatDate, calculateHours } from '../utils';
import { 
  Users, Camera, Sun, FileText, TrendingUp, Clock, 
  CheckCircle, AlertCircle, Calendar, BarChart3,
  ArrowUpRight, ArrowDownRight, Activity
} from 'lucide-react';

export default function AdminDashboard() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [shoots, setShoots] = useState<ShootEntry[]>([]);
  const [reports, setReports] = useState<DailyReport[]>([]);

  useEffect(() => {
    setEmployees(getEmployees());
    setShoots(getShootEntries());
    setReports(getDailyReports());
  }, []);

  const activeEmployees = employees.filter(e => e.active);
  const indoorShoots = shoots.filter(s => s.type === 'indoor');
  const outdoorShoots = shoots.filter(s => s.type === 'outdoor');
  
  // Calculate stats
  const totalHoursThisWeek = shoots.reduce((sum, s) => sum + s.totalHours, 0);
  const avgHoursPerDay = shoots.length > 0 ? (totalHoursThisWeek / shoots.length).toFixed(1) : '0';
  const completionRate = reports.length > 0 
    ? ((reports.filter(r => r.tasks?.some(t => t.status === 'completed')).length / reports.length) * 100).toFixed(0)
    : '0';

  // Recent activity
  const recentShoots = [...shoots].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt)).slice(0, 5);
  const recentReports = [...reports].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt)).slice(0, 5);

  // Employee performance
  const employeeStats = activeEmployees.map(emp => {
    const empShoots = shoots.filter(s => s.employeeId === emp.id);
    const empReports = reports.filter(r => r.employeeId === emp.id);
    const totalHours = empShoots.reduce((sum, s) => sum + s.totalHours, 0);
    return {
      ...emp,
      shootCount: empShoots.length,
      reportCount: empReports.length,
      totalHours,
    };
  }).sort((a, b) => b.totalHours - a.totalHours);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users size={20} className="text-blue-600" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
              <ArrowUpRight size={12} /> Active
            </span>
          </div>
          <div>
            <p className="text-sm text-slate-500">Total Employees</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">{activeEmployees.length}</p>
            <p className="text-xs text-slate-400 mt-1">{employees.length - activeEmployees.length} inactive</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Camera size={20} className="text-purple-600" />
            </div>
            <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
              Indoor
            </span>
          </div>
          <div>
            <p className="text-sm text-slate-500">Indoor Shoots</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">{indoorShoots.length}</p>
            <p className="text-xs text-slate-400 mt-1">{indoorShoots.reduce((sum, s) => sum + s.totalHours, 0).toFixed(0)}h total</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Sun size={20} className="text-amber-600" />
            </div>
            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
              Outdoor
            </span>
          </div>
          <div>
            <p className="text-sm text-slate-500">Outdoor Shoots</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">{outdoorShoots.length}</p>
            <p className="text-xs text-slate-400 mt-1">{outdoorShoots.reduce((sum, s) => sum + s.totalHours, 0).toFixed(0)}h total</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp size={20} className="text-green-600" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
              <ArrowUpRight size={12} /> {completionRate}%
            </span>
          </div>
          <div>
            <p className="text-sm text-slate-500">Avg Hours/Day</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">{avgHoursPerDay}h</p>
            <p className="text-xs text-slate-400 mt-1">{reports.length} reports submitted</p>
          </div>
        </div>
      </div>

      {/* Charts & Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <BarChart3 size={18} className="text-blue-600" />
                Weekly Activity
              </h3>
              <p className="text-xs text-slate-400 mt-1">Shoots and reports over time</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-purple-500 rounded" /> Indoor
              </span>
              <span className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-amber-500 rounded" /> Outdoor
              </span>
              <span className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-green-500 rounded" /> Reports
              </span>
            </div>
          </div>
          
          {/* Simple Bar Chart */}
          <div className="flex items-end justify-between gap-2 h-48">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
              const indoorCount = indoorShoots.filter(s => new Date(s.date).getDay() === (idx + 1) % 7).length;
              const outdoorCount = outdoorShoots.filter(s => new Date(s.date).getDay() === (idx + 1) % 7).length;
              const reportCount = reports.filter(r => new Date(r.date).getDay() === (idx + 1) % 7).length;
              const maxCount = Math.max(indoorCount, outdoorCount, reportCount, 1);
              
              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col gap-1 items-center" style={{ height: '160px' }}>
                    <div className="flex gap-0.5 items-end h-full">
                      <div 
                        className="w-4 bg-purple-500 rounded-t transition-all hover:bg-purple-600"
                        style={{ height: `${(indoorCount / maxCount) * 100}%`, minHeight: indoorCount > 0 ? '8px' : '0' }}
                        title={`${indoorCount} indoor shoots`}
                      />
                      <div 
                        className="w-4 bg-amber-500 rounded-t transition-all hover:bg-amber-600"
                        style={{ height: `${(outdoorCount / maxCount) * 100}%`, minHeight: outdoorCount > 0 ? '8px' : '0' }}
                        title={`${outdoorCount} outdoor shoots`}
                      />
                      <div 
                        className="w-4 bg-green-500 rounded-t transition-all hover:bg-green-600"
                        style={{ height: `${(reportCount / maxCount) * 100}%`, minHeight: reportCount > 0 ? '8px' : '0' }}
                        title={`${reportCount} reports`}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">{day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
            <Activity size={18} className="text-indigo-600" />
            Quick Stats
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock size={16} className="text-slate-500" />
                <span className="text-sm text-slate-600">Total Hours</span>
              </div>
              <span className="text-lg font-bold text-slate-800">{totalHoursThisWeek.toFixed(1)}h</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle size={16} className="text-green-500" />
                <span className="text-sm text-slate-600">Completion Rate</span>
              </div>
              <span className="text-lg font-bold text-green-600">{completionRate}%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Calendar size={16} className="text-blue-500" />
                <span className="text-sm text-slate-600">Today's Entries</span>
              </div>
              <span className="text-lg font-bold text-slate-800">
                {shoots.filter(s => s.date === new Date().toISOString().split('T')[0]).length + 
                 reports.filter(r => r.date === new Date().toISOString().split('T')[0]).length}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertCircle size={16} className="text-amber-500" />
                <span className="text-sm text-slate-600">Pending Tasks</span>
              </div>
              <span className="text-lg font-bold text-amber-600">
                {reports.reduce((sum, r) => sum + (r.tasks?.filter(t => t.status === 'pending').length || 0), 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Employee Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Shoots */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Camera size={18} className="text-purple-600" />
              Recent Shoots
            </h3>
            <span className="text-xs text-slate-400">{shoots.length} total</span>
          </div>
          <div className="divide-y divide-slate-50">
            {recentShoots.map((shoot) => {
              const emp = employees.find(e => e.id === shoot.employeeId);
              return (
                <div key={shoot.id} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        shoot.type === 'indoor' ? 'bg-purple-100' : 'bg-amber-100'
                      }`}>
                        {shoot.type === 'indoor' ? <Camera size={16} className="text-purple-600" /> : <Sun size={16} className="text-amber-600" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">{emp?.name || 'Unknown'}</p>
                        <p className="text-xs text-slate-400">{shoot.clientName} • {shoot.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-800">{shoot.totalHours}h</p>
                      <p className="text-xs text-slate-400">{formatDate(shoot.date)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
            {recentShoots.length === 0 && (
              <div className="p-8 text-center text-slate-400">
                <Camera size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No shoots yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Employee Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp size={18} className="text-green-600" />
              Top Performers
            </h3>
            <span className="text-xs text-slate-400">By hours worked</span>
          </div>
          <div className="divide-y divide-slate-50">
            {employeeStats.slice(0, 5).map((emp, idx) => (
              <div key={emp.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {emp.avatar}
                      </div>
                      {idx === 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-[10px] font-bold">
                          🏆
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{emp.name}</p>
                      <p className="text-xs text-slate-400">{emp.shootCount} shoots • {emp.reportCount} reports</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-slate-800">{emp.totalHours.toFixed(1)}h</p>
                    <div className="w-20 bg-slate-100 rounded-full h-1.5 mt-1">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full"
                        style={{ width: `${(emp.totalHours / Math.max(...employeeStats.map(e => e.totalHours))) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
