import { useState, useEffect } from 'react';
import { Employee, ShootEntry, DailyReport } from '../types';
import { getEmployees, saveEmployees, addEmployee, updateEmployee, deleteEmployee, getShootEntries, getDailyReports, saveShootEntry, saveDailyReport, deleteShootEntry, deleteDailyReport, getSheetsUrl, setSheetsUrl, syncAllToSheets, getEmployeeName, generateId } from '../store';
import { formatDate, formatTime, calculateHours } from '../utils';
import { Users, FileText, Camera, Sun, Settings, LogOut, Plus, Edit2, Trash2, Save, X, Cloud, CheckCircle, Search, Shield, ChevronDown, ChevronUp, Image } from 'lucide-react';

interface AdminPanelProps {
  employees: Employee[];
  onLogout: () => void;
  onRefresh: () => void;
}

export default function AdminPanel({ employees, onLogout, onRefresh }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'employees' | 'indoor' | 'outdoor' | 'reports' | 'settings'>('overview');
  const [allEmployees, setAllEmployees] = useState<Employee[]>(employees);
  const [shoots, setShoots] = useState<ShootEntry[]>(getShootEntries());
  const [reports, setReports] = useState<DailyReport[]>(getDailyReports());
  const [searchQuery, setSearchQuery] = useState('');
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: '', department: '', position: '' });
  const [sheetsUrl, setSheetsUrlState] = useState(getSheetsUrl());
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [editingEntry, setEditingEntry] = useState<any>(null);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);

  useEffect(() => {
    setAllEmployees(getEmployees());
    setShoots(getShootEntries());
    setReports(getDailyReports());
  }, [activeTab]);

  const refreshData = () => {
    setAllEmployees(getEmployees());
    setShoots(getShootEntries());
    setReports(getDailyReports());
    onRefresh();
  };

  // Employee Management
  const handleAddEmployee = () => {
    if (!newEmployee.name.trim()) return;
    const emp: Employee = {
      id: generateId(),
      name: newEmployee.name,
      department: newEmployee.department,
      position: newEmployee.position,
      avatar: newEmployee.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
      active: true,
    };
    addEmployee(emp);
    setNewEmployee({ name: '', department: '', position: '' });
    setShowAddEmployee(false);
    refreshData();
  };

  const handleUpdateEmployee = () => {
    if (!editingEmployee) return;
    updateEmployee(editingEmployee.id, editingEmployee);
    setEditingEmployee(null);
    refreshData();
  };

  const handleDeleteEmployee = (id: string) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      deleteEmployee(id);
      refreshData();
    }
  };

  // Entry Editing (Admin only)
  const handleEditShoot = (entry: ShootEntry) => {
    setEditingEntry({ ...entry });
  };

  const handleSaveShoot = () => {
    if (!editingEntry) return;
    const totalHours = calculateHours(editingEntry.checkIn, editingEntry.checkOut);
    saveShootEntry({ ...editingEntry, totalHours });
    setEditingEntry(null);
    refreshData();
  };

  const handleEditReport = (entry: DailyReport) => {
    setEditingEntry({ ...entry });
  };

  const handleSaveReport = () => {
    if (!editingEntry) return;
    const totalHours = calculateHours(editingEntry.checkIn, editingEntry.checkOut);
    saveDailyReport({ ...editingEntry, totalHours });
    setEditingEntry(null);
    refreshData();
  };

  const handleDeleteShoot = (id: string) => {
    if (confirm('Delete this entry?')) {
      deleteShootEntry(id);
      refreshData();
    }
  };

  const handleDeleteReport = (id: string) => {
    if (confirm('Delete this report?')) {
      deleteDailyReport(id);
      refreshData();
    }
  };

  // Google Sheets Sync
  const handleSync = async () => {
    setSyncStatus('syncing');
    const success = await syncAllToSheets();
    setSyncStatus(success ? 'success' : 'error');
    setTimeout(() => setSyncStatus('idle'), 3000);
  };

  const handleSaveSheetsUrl = () => {
    setSheetsUrl(sheetsUrl);
    alert('Google Sheets URL saved!');
  };

  const filteredShoots = shoots.filter(s => {
    const empName = getEmployeeName(s.employeeId).toLowerCase();
    return empName.includes(searchQuery.toLowerCase()) || s.clientName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const indoorShoots = filteredShoots.filter(s => s.type === 'indoor');
  const outdoorShoots = filteredShoots.filter(s => s.type === 'outdoor');

  const filteredReports = reports.filter(r => {
    const empName = getEmployeeName(r.employeeId).toLowerCase();
    return empName.includes(searchQuery.toLowerCase());
  });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Settings },
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'indoor', label: 'Indoor Shoot', icon: Camera },
    { id: 'outdoor', label: 'Outdoor Shoot', icon: Sun },
    { id: 'reports', label: 'Daily Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-slate-800 text-lg">Admin Panel</h1>
              <p className="text-xs text-slate-400">StudioTrack Pro</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-xs font-medium">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Admin Mode
            </div>
            <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex gap-1 overflow-x-auto pb-0 -mb-px scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
        {/* Search Bar */}
        {activeTab !== 'employees' && activeTab !== 'settings' && (
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by employee name or client..."
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
            </div>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Total Employees</p>
                    <p className="text-3xl font-bold text-slate-800 mt-1">{allEmployees.filter(e => e.active).length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Users size={24} className="text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Indoor Shoots</p>
                    <p className="text-3xl font-bold text-slate-800 mt-1">{shoots.filter(s => s.type === 'indoor').length}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Camera size={24} className="text-purple-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Outdoor Shoots</p>
                    <p className="text-3xl font-bold text-slate-800 mt-1">{shoots.filter(s => s.type === 'outdoor').length}</p>
                  </div>
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <Sun size={24} className="text-amber-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Daily Reports</p>
                    <p className="text-3xl font-bold text-slate-800 mt-1">{reports.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <FileText size={24} className="text-green-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <h3 className="font-semibold text-slate-800 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button onClick={() => setActiveTab('employees')} className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all">
                  <Users size={20} className="text-blue-600" />
                  <span className="text-sm font-medium text-slate-700">Manage Employees</span>
                </button>
                <button onClick={handleSync} className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-green-200 hover:border-green-400 hover:bg-green-50 transition-all">
                  {syncStatus === 'syncing' ? <Cloud size={20} className="text-green-600 animate-pulse" /> :
                   syncStatus === 'success' ? <CheckCircle size={20} className="text-green-600" /> :
                   <Cloud size={20} className="text-green-600" />}
                  <span className="text-sm font-medium text-slate-700">
                    {syncStatus === 'syncing' ? 'Syncing...' : syncStatus === 'success' ? 'Synced!' : 'Backup to Google Sheets'}
                  </span>
                </button>
                <button onClick={() => setActiveTab('settings')} className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all">
                  <Settings size={20} className="text-purple-600" />
                  <span className="text-sm font-medium text-slate-700">App Settings</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Employees Tab */}
        {activeTab === 'employees' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">Employee Management</h2>
              <button
                onClick={() => setShowAddEmployee(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
              >
                <Plus size={16} />
                Add Employee
              </button>
            </div>

            {/* Add Employee Form */}
            {showAddEmployee && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                <h3 className="font-semibold text-slate-800 mb-4">Add New Employee</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                    placeholder="Full Name"
                    className="border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  />
                  <input
                    type="text"
                    value={newEmployee.department}
                    onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
                    placeholder="Department"
                    className="border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  />
                  <input
                    type="text"
                    value={newEmployee.position}
                    onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                    placeholder="Position"
                    className="border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  />
                </div>
                <div className="flex gap-3 mt-4">
                  <button onClick={() => setShowAddEmployee(false)} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800">Cancel</button>
                  <button onClick={handleAddEmployee} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Save Employee</button>
                </div>
              </div>
            )}

            {/* Edit Employee Modal */}
            {editingEmployee && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-200">
                <h3 className="font-semibold text-slate-800 mb-4">Edit Employee</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    value={editingEmployee.name}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, name: e.target.value })}
                    placeholder="Full Name"
                    className="border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  />
                  <input
                    type="text"
                    value={editingEmployee.department}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, department: e.target.value })}
                    placeholder="Department"
                    className="border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  />
                  <input
                    type="text"
                    value={editingEmployee.position}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, position: e.target.value })}
                    placeholder="Position"
                    className="border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  />
                </div>
                <div className="flex gap-3 mt-4">
                  <button onClick={() => setEditingEmployee(null)} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800">Cancel</button>
                  <button onClick={handleUpdateEmployee} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Update</button>
                </div>
              </div>
            )}

            {/* Employee List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="divide-y divide-slate-100">
                {allEmployees.map((emp) => (
                  <div key={emp.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${emp.active ? 'bg-gradient-to-br from-blue-400 to-purple-500' : 'bg-slate-300'}`}>
                        {emp.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{emp.name}</p>
                        <p className="text-sm text-slate-400">{emp.department} • {emp.position}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${emp.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                        {emp.active ? 'Active' : 'Inactive'}
                      </span>
                      <button
                        onClick={() => setEditingEmployee({ ...emp })}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteEmployee(emp.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Indoor Shoots Tab */}
        {activeTab === 'indoor' && (
          <ShootList
            entries={indoorShoots}
            type="indoor"
            editingEntry={editingEntry}
            expandedEntry={expandedEntry}
            onEdit={handleEditShoot}
            onSave={handleSaveShoot}
            onDelete={handleDeleteShoot}
            onCancelEdit={() => setEditingEntry(null)}
            onExpand={setExpandedEntry}
            employees={allEmployees}
          />
        )}

        {/* Outdoor Shoots Tab */}
        {activeTab === 'outdoor' && (
          <ShootList
            entries={outdoorShoots}
            type="outdoor"
            editingEntry={editingEntry}
            expandedEntry={expandedEntry}
            onEdit={handleEditShoot}
            onSave={handleSaveShoot}
            onDelete={handleDeleteShoot}
            onCancelEdit={() => setEditingEntry(null)}
            onExpand={setExpandedEntry}
            employees={allEmployees}
          />
        )}

        {/* Daily Reports Tab */}
        {activeTab === 'reports' && (
          <ReportList
            reports={filteredReports}
            editingEntry={editingEntry}
            expandedEntry={expandedEntry}
            onEdit={handleEditReport}
            onSave={handleSaveReport}
            onDelete={handleDeleteReport}
            onCancelEdit={() => setEditingEntry(null)}
            onExpand={setExpandedEntry}
            employees={allEmployees}
          />
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-2xl">
            <h2 className="text-xl font-bold text-slate-800">Settings</h2>
            
            {/* Google Sheets Backup */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <Cloud size={20} className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Google Sheets Backup</h3>
                  <p className="text-sm text-slate-400">All data will be synced to your Google Sheet</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-2">Google Apps Script Web App URL</label>
                  <input
                    type="url"
                    value={sheetsUrl}
                    onChange={(e) => setSheetsUrlState(e.target.value)}
                    placeholder="https://script.google.com/macros/s/..."
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400"
                  />
                  <p className="text-xs text-slate-400 mt-2">
                    Create a Google Apps Script to receive data. Deploy as Web App and paste the URL here.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleSaveSheetsUrl} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
                    Save URL
                  </button>
                  <button onClick={handleSync} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
                    {syncStatus === 'syncing' ? (
                      <><Cloud size={16} className="animate-pulse" /> Syncing...</>
                    ) : syncStatus === 'success' ? (
                      <><CheckCircle size={16} /> Synced!</>
                    ) : (
                      <><Cloud size={16} /> Sync Now</>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* App Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <h3 className="font-semibold text-slate-800 mb-4">App Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Version</span>
                  <span className="text-slate-700 font-medium">2.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Employees</span>
                  <span className="text-slate-700 font-medium">{allEmployees.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Shoot Entries</span>
                  <span className="text-slate-700 font-medium">{shoots.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Daily Reports</span>
                  <span className="text-slate-700 font-medium">{reports.length}</span>
                </div>
              </div>
            </div>

            {/* Admin Password Info */}
            <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
              <h3 className="font-semibold text-amber-800 mb-2">Admin Credentials</h3>
              <p className="text-sm text-amber-700">Default admin password: <code className="bg-amber-100 px-2 py-0.5 rounded font-mono">admin123</code></p>
              <p className="text-xs text-amber-600 mt-2">Only admin can edit or delete entries after they are submitted.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Shoot List Component
function ShootList({ entries, type, editingEntry, expandedEntry, onEdit, onSave, onDelete, onCancelEdit, onExpand, employees }: any) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-800 capitalize">{type} Shoots ({entries.length})</h2>
      
      {editingEntry && editingEntry.type === type && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-200">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Edit2 size={18} className="text-blue-600" />
            Edit Entry (Admin Only)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-500 block mb-1">Date</label>
              <input type="date" value={editingEntry.date} onChange={(e) => onEdit({ ...editingEntry, date: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 block mb-1">Employee</label>
              <select value={editingEntry.employeeId} onChange={(e) => onEdit({ ...editingEntry, employeeId: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm">
                {employees.map((emp: Employee) => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 block mb-1">Check In</label>
              <input type="time" value={editingEntry.checkIn} onChange={(e) => onEdit({ ...editingEntry, checkIn: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 block mb-1">Check Out</label>
              <input type="time" value={editingEntry.checkOut || ''} onChange={(e) => onEdit({ ...editingEntry, checkOut: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 block mb-1">Location</label>
              <input type="text" value={editingEntry.location} onChange={(e) => onEdit({ ...editingEntry, location: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 block mb-1">Client</label>
              <input type="text" value={editingEntry.clientName} onChange={(e) => onEdit({ ...editingEntry, clientName: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="mt-4">
            <label className="text-xs font-medium text-slate-500 block mb-1">Project Details</label>
            <textarea value={editingEntry.projectDetails} onChange={(e) => onEdit({ ...editingEntry, projectDetails: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" rows={2} />
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={onCancelEdit} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800">Cancel</button>
            <button onClick={onSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
              <Save size={14} /> Save Changes
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {entries.map((entry: ShootEntry) => {
          const isExpanded = expandedEntry === entry.id;
          return (
            <div key={entry.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50" onClick={() => onExpand(isExpanded ? null : entry.id)}>
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${type === 'indoor' ? 'bg-purple-100' : 'bg-amber-100'}`}>
                    {type === 'indoor' ? <Camera size={18} className="text-purple-600" /> : <Sun size={18} className="text-amber-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{formatDate(entry.date)}</span>
                      <span className="text-sm font-medium text-slate-800">{getEmployeeName(entry.employeeId)}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {formatTime(entry.checkIn)} → {entry.checkOut ? formatTime(entry.checkOut) : 'In Progress'} • {entry.totalHours}h • {entry.clientName}
                    </p>
                  </div>
                  {entry.photoUrl && <Image size={16} className="text-green-500" />}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={(e) => { e.stopPropagation(); onEdit(entry); }} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); onDelete(entry.id); }} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 size={14} />
                  </button>
                  {isExpanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                </div>
              </div>
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-slate-100 pt-3 space-y-2">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div><span className="text-slate-400 text-xs">Location:</span><p className="font-medium text-slate-700">{entry.location}</p></div>
                    <div><span className="text-slate-400 text-xs">Client:</span><p className="font-medium text-slate-700">{entry.clientName}</p></div>
                    <div><span className="text-slate-400 text-xs">Total Hours:</span><p className="font-medium text-slate-700">{entry.totalHours}h</p></div>
                    <div><span className="text-slate-400 text-xs">Submitted:</span><p className="font-medium text-slate-700">{formatDate(entry.submittedAt)}</p></div>
                  </div>
                  {entry.projectDetails && <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">{entry.projectDetails}</p>}
                  {entry.photoUrl && (
                    <div className="mt-2">
                      <p className="text-xs text-slate-400 mb-1">Attached Photo:</p>
                      <img src={entry.photoUrl} alt="Shoot" className="w-32 h-32 object-cover rounded-lg border border-slate-200" />
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {entries.length === 0 && (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-100">
            {type === 'indoor' ? <Camera size={40} className="mx-auto mb-3 text-slate-300" /> : <Sun size={40} className="mx-auto mb-3 text-slate-300" />}
            <p className="text-slate-400">No {type} shoot entries found</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Report List Component
function ReportList({ reports, editingEntry, expandedEntry, onEdit, onSave, onDelete, onCancelEdit, onExpand, employees }: any) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-800">Daily Work Reports ({reports.length})</h2>
      
      {editingEntry && editingEntry.tasks && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-200">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Edit2 size={18} className="text-blue-600" />
            Edit Report (Admin Only)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-500 block mb-1">Date</label>
              <input type="date" value={editingEntry.date} onChange={(e) => onEdit({ ...editingEntry, date: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 block mb-1">Employee</label>
              <select value={editingEntry.employeeId} onChange={(e) => onEdit({ ...editingEntry, employeeId: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm">
                {employees.map((emp: Employee) => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 block mb-1">Check In</label>
              <input type="time" value={editingEntry.checkIn} onChange={(e) => onEdit({ ...editingEntry, checkIn: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 block mb-1">Check Out</label>
              <input type="time" value={editingEntry.checkOut || ''} onChange={(e) => onEdit({ ...editingEntry, checkOut: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="mt-4">
            <label className="text-xs font-medium text-slate-500 block mb-1">Summary</label>
            <textarea value={editingEntry.summary} onChange={(e) => onEdit({ ...editingEntry, summary: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" rows={2} />
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={onCancelEdit} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800">Cancel</button>
            <button onClick={onSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
              <Save size={14} /> Save Changes
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {reports.map((report: DailyReport) => {
          const isExpanded = expandedEntry === report.id;
          return (
            <div key={report.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50" onClick={() => onExpand(isExpanded ? null : report.id)}>
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <FileText size={18} className="text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{formatDate(report.date)}</span>
                      <span className="text-sm font-medium text-slate-800">{getEmployeeName(report.employeeId)}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {formatTime(report.checkIn)} → {report.checkOut ? formatTime(report.checkOut) : 'In Progress'} • {report.totalHours}h • {report.tasks?.length || 0} tasks
                    </p>
                  </div>
                  {report.photoUrl && <Image size={16} className="text-green-500" />}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={(e) => { e.stopPropagation(); onEdit(report); }} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); onDelete(report.id); }} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 size={14} />
                  </button>
                  {isExpanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                </div>
              </div>
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-slate-100 pt-3 space-y-3">
                  {report.tasks && report.tasks.map((task: any) => (
                    <div key={task.id} className="flex items-center gap-2 text-sm bg-slate-50 p-2 rounded-lg">
                      <div className={`w-2 h-2 rounded-full ${task.status === 'completed' ? 'bg-green-500' : task.status === 'in-progress' ? 'bg-blue-500' : 'bg-slate-400'}`} />
                      <span className="flex-1 text-slate-700">{task.description}</span>
                      <span className="text-xs text-slate-400">{task.hours}h</span>
                    </div>
                  ))}
                  {report.summary && <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">{report.summary}</p>}
                  {report.photoUrl && (
                    <div className="mt-2">
                      <p className="text-xs text-slate-400 mb-1">Attached Photo:</p>
                      <img src={report.photoUrl} alt="Report" className="w-32 h-32 object-cover rounded-lg border border-slate-200" />
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {reports.length === 0 && (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-100">
            <FileText size={40} className="mx-auto mb-3 text-slate-300" />
            <p className="text-slate-400">No daily reports found</p>
          </div>
        )}
      </div>
    </div>
  );
}
