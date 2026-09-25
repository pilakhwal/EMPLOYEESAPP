import { useState, useEffect } from 'react';
import { Employee, ShootEntry, DailyReport, TaskItem } from '../types';
import { getShootEntries, getDailyReports, saveShootEntry, saveDailyReport, syncToGoogleSheets, getEmployeeName, generateId, changeEmployeePassword } from '../store';
import { formatDate, formatTime, getCurrentTime, getCurrentDate, calculateHours, fileToBase64 } from '../utils';
import { Camera, Sun, FileText, LogOut, Clock, MapPin, User, Image, Upload, CheckCircle, Lock, Plus, Trash2, ChevronDown, ChevronUp, KeyRound, X } from 'lucide-react';

interface EmployeeDashboardProps {
  employee: Employee;
  onLogout: () => void;
}

export default function EmployeeDashboard({ employee, onLogout }: EmployeeDashboardProps) {
  const [activeTab, setActiveTab] = useState<'indoor' | 'outdoor' | 'reports'>('indoor');
  const [shoots, setShoots] = useState<ShootEntry[]>(getShootEntries());
  const [reports, setReports] = useState<DailyReport[]>(getDailyReports());
  const [showForm, setShowForm] = useState(false);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState('');
  
  // Password Change
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Form State
  const [formDate, setFormDate] = useState(getCurrentDate());
  const [formTime, setFormTime] = useState(getCurrentTime());
  const [checkIn, setCheckIn] = useState(getCurrentTime());
  const [checkOut, setCheckOut] = useState('');
  const [location, setLocation] = useState('');
  const [clientName, setClientName] = useState('');
  const [projectDetails, setProjectDetails] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [tasks, setTasks] = useState<TaskItem[]>([{ id: generateId(), description: '', status: 'completed', hours: 1 }]);
  const [summary, setSummary] = useState('');
  const [challenges, setChallenges] = useState('');
  const [tomorrowPlan, setTomorrowPlan] = useState('');

  const myShoots = shoots.filter(s => s.employeeId === employee.id);
  const myIndoorShoots = myShoots.filter(s => s.type === 'indoor');
  const myOutdoorShoots = myShoots.filter(s => s.type === 'outdoor');
  const myReports = reports.filter(r => r.employeeId === employee.id);

  const totalHours = checkIn && checkOut ? calculateHours(checkIn, checkOut) : 0;

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/jpeg') && !file.type.startsWith('image/jpg') && !file.type.startsWith('image/png')) {
      alert('Please upload a JPEG or PNG image');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }
    const base64 = await fileToBase64(file);
    setPhotoUrl(base64);
    setPhotoName(file.name);
  };

  const resetForm = () => {
    setFormDate(getCurrentDate());
    setFormTime(getCurrentTime());
    setCheckIn(getCurrentTime());
    setCheckOut('');
    setLocation('');
    setClientName('');
    setProjectDetails('');
    setPhotoUrl(null);
    setPhotoName(null);
    setTasks([{ id: generateId(), description: '', status: 'completed', hours: 1 }]);
    setSummary('');
    setChallenges('');
    setTomorrowPlan('');
  };

  const handleSubmitShoot = () => {
    if (!checkIn) { alert('Please enter check-in time'); return; }
    if (!location.trim()) { alert('Please enter location'); return; }
    if (!clientName.trim()) { alert('Please enter client name'); return; }

    const entry: ShootEntry = {
      id: generateId(),
      date: formDate,
      time: formTime,
      employeeId: employee.id,
      type: activeTab as 'indoor' | 'outdoor',
      checkIn,
      checkOut: checkOut || null,
      totalHours,
      location,
      clientName,
      projectDetails,
      photoUrl,
      photoName,
      submittedAt: new Date().toISOString(),
      locked: true,
    };

    saveShootEntry(entry);
    syncToGoogleSheets('shoot', entry);
    setShoots(getShootEntries());
    resetForm();
    setShowForm(false);
    setSyncStatus('Entry saved & synced!');
    setTimeout(() => setSyncStatus(''), 3000);
  };

  const handleSubmitReport = () => {
    if (!checkIn) { alert('Please enter check-in time'); return; }
    if (!summary.trim()) { alert('Please enter work summary'); return; }

    const validTasks = tasks.filter(t => t.description.trim());
    if (validTasks.length === 0) { alert('Please add at least one task'); return; }

    const report: DailyReport = {
      id: generateId(),
      date: formDate,
      time: formTime,
      employeeId: employee.id,
      checkIn,
      checkOut: checkOut || null,
      totalHours,
      tasks: validTasks,
      summary,
      challenges,
      tomorrowPlan,
      photoUrl,
      photoName,
      submittedAt: new Date().toISOString(),
      locked: true,
    };

    saveDailyReport(report);
    syncToGoogleSheets('report', report);
    setReports(getDailyReports());
    resetForm();
    setShowForm(false);
    setSyncStatus('Report saved & synced!');
    setTimeout(() => setSyncStatus(''), 3000);
  };

  const handleChangePassword = () => {
    setPasswordError('');
    setPasswordSuccess('');
    
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError('All fields are required');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    const success = changeEmployeePassword(employee.id, oldPassword, newPassword);
    if (success) {
      setPasswordSuccess('Password changed successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setShowPasswordChange(false);
        setPasswordSuccess('');
      }, 2000);
    } else {
      setPasswordError('Current password is incorrect');
    }
  };

  const addTask = () => {
    setTasks([...tasks, { id: generateId(), description: '', status: 'pending', hours: 1 }]);
  };

  const removeTask = (id: string) => {
    if (tasks.length > 1) setTasks(tasks.filter(t => t.id !== id));
  };

  const updateTask = (id: string, field: keyof TaskItem, value: string | number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const tabs = [
    { id: 'indoor' as const, label: 'Indoor Shoot', icon: Camera, color: 'purple' },
    { id: 'outdoor' as const, label: 'Outdoor Shoot', icon: Sun, color: 'amber' },
    { id: 'reports' as const, label: 'Daily Report', icon: FileText, color: 'green' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
              {employee.avatar}
            </div>
            <div>
              <h1 className="font-bold text-slate-800">{employee.name}</h1>
              <p className="text-xs text-slate-400">{employee.department} • {employee.position}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {syncStatus && (
              <span className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full font-medium animate-pulse">
                {syncStatus}
              </span>
            )}
            <button 
              onClick={() => setShowPasswordChange(!showPasswordChange)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <KeyRound size={16} />
              <span className="hidden sm:inline">Password</span>
            </button>
            <button onClick={onLogout} className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto pb-0 -mb-px">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setShowForm(false); }}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? tab.color === 'purple' ? 'border-purple-600 text-purple-600' :
                        tab.color === 'amber' ? 'border-amber-600 text-amber-600' :
                        'border-green-600 text-green-600'
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
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Password Change Form */}
        {showPasswordChange && (
          <div className="bg-white rounded-2xl shadow-sm border border-blue-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <KeyRound size={20} className="text-blue-600" />
                Change Password
              </h3>
              <button onClick={() => { setShowPasswordChange(false); setPasswordError(''); setPasswordSuccess(''); }} className="p-1 hover:bg-slate-100 rounded">
                <X size={18} className="text-slate-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-500 block mb-1">Current Password</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Enter your current password"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 block mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 block mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                />
              </div>

              {passwordError && <p className="text-sm text-red-500 bg-red-50 p-2 rounded-lg">{passwordError}</p>}
              {passwordSuccess && <p className="text-sm text-green-600 bg-green-50 p-2 rounded-lg flex items-center gap-1"><CheckCircle size={14} /> {passwordSuccess}</p>}

              <div className="flex gap-3">
                <button
                  onClick={() => { setShowPasswordChange(false); setPasswordError(''); setPasswordSuccess(''); }}
                  className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleChangePassword}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 text-sm"
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        )}

        {/* New Entry Button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className={`w-full mb-6 flex items-center justify-center gap-2 p-4 rounded-2xl font-medium text-sm transition-all shadow-lg ${
              activeTab === 'indoor' ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-purple-600/20' :
              activeTab === 'outdoor' ? 'bg-amber-600 text-white hover:bg-amber-700 shadow-amber-600/20' :
              'bg-green-600 text-white hover:bg-green-700 shadow-green-600/20'
            }`}
          >
            <Plus size={20} />
            New {activeTab === 'indoor' ? 'Indoor Shoot' : activeTab === 'outdoor' ? 'Outdoor Shoot' : 'Daily Report'} Entry
          </button>
        )}

        {/* Entry Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6">
            <div className={`p-5 ${
              activeTab === 'indoor' ? 'bg-gradient-to-r from-purple-50 to-indigo-50' :
              activeTab === 'outdoor' ? 'bg-gradient-to-r from-amber-50 to-orange-50' :
              'bg-gradient-to-r from-green-50 to-emerald-50'
            } border-b border-slate-100`}>
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                {activeTab === 'indoor' ? <Camera size={20} className="text-purple-600" /> :
                 activeTab === 'outdoor' ? <Sun size={20} className="text-amber-600" /> :
                 <FileText size={20} className="text-green-600" />}
                New {activeTab === 'indoor' ? 'Indoor Shoot' : activeTab === 'outdoor' ? 'Outdoor Shoot' : 'Daily Report'} Entry
              </h3>
            </div>

            <div className="p-6 space-y-5">
              {/* Step 1: Date & Time */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <div className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">1</div>
                  Date & Time
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Date</label>
                    <input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Entry Time</label>
                    <input type="time" value={formTime} onChange={(e) => setFormTime(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Current Time</label>
                    <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2.5 bg-slate-50 text-sm text-slate-600">
                      <Clock size={14} className="text-blue-500" />
                      {formatTime(getCurrentTime())}
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Employee Name */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <div className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">2</div>
                  Employee Name
                </div>
                <div className="flex items-center gap-3 border border-slate-200 rounded-lg px-4 py-3 bg-blue-50">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {employee.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{employee.name}</p>
                    <p className="text-xs text-slate-400">{employee.department} • {employee.position}</p>
                  </div>
                </div>
              </div>

              {/* Step 3: Working Time IN & OUT */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <div className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">3</div>
                  Working Time
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Check In (IN)</label>
                    <input type="time" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Check Out (OUT)</label>
                    <input type="time" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Total Working Hours</label>
                    <div className={`flex items-center gap-2 border rounded-lg px-3 py-2.5 text-sm font-bold ${totalHours > 0 ? 'bg-green-50 border-green-200 text-green-700' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                      <Clock size={14} />
                      {totalHours > 0 ? `${totalHours} hours` : 'Enter times above'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Shoot-specific fields */}
              {(activeTab === 'indoor' || activeTab === 'outdoor') && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <div className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">4</div>
                    Shoot Details
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Location</label>
                      <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g., Studio A, Client Office" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Client Name</label>
                      <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="e.g., Tata Motors" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Project Details</label>
                    <textarea value={projectDetails} onChange={(e) => setProjectDetails(e.target.value)} placeholder="Describe the shoot project..." rows={2} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none" />
                  </div>
                </div>
              )}

              {/* Daily Report Tasks */}
              {activeTab === 'reports' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <div className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">4</div>
                    Tasks
                  </div>
                  <div className="space-y-2">
                    {tasks.map((task, idx) => (
                      <div key={task.id} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                        <span className="text-xs text-slate-400 w-5">{idx + 1}.</span>
                        <input type="text" value={task.description} onChange={(e) => updateTask(task.id, 'description', e.target.value)} placeholder="Task description..." className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
                        <select value={task.status} onChange={(e) => updateTask(task.id, 'status', e.target.value)} className="border border-slate-200 rounded-lg px-2 py-2 text-sm bg-white">
                          <option value="completed">Done</option>
                          <option value="in-progress">In Progress</option>
                          <option value="pending">Pending</option>
                        </select>
                        <div className="flex items-center gap-1">
                          <input type="number" value={task.hours} onChange={(e) => updateTask(task.id, 'hours', parseFloat(e.target.value) || 0)} min="0.5" step="0.5" className="w-16 border border-slate-200 rounded-lg px-2 py-2 text-sm bg-white" />
                          <span className="text-xs text-slate-400">h</span>
                        </div>
                        <button onClick={() => removeTask(task.id)} className="p-1.5 text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                      </div>
                    ))}
                  </div>
                  <button onClick={addTask} className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                    <Plus size={14} /> Add Task
                  </button>

                  <div className="mt-4 space-y-3">
                    <div>
                      <label className="text-xs font-medium text-slate-500 block mb-1">Work Summary *</label>
                      <textarea value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Brief summary of today's work..." rows={2} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500 block mb-1">Challenges / Blockers</label>
                      <textarea value={challenges} onChange={(e) => setChallenges(e.target.value)} placeholder="Any challenges faced (optional)..." rows={2} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-500 block mb-1">Tomorrow's Plan</label>
                      <textarea value={tomorrowPlan} onChange={(e) => setTomorrowPlan(e.target.value)} placeholder="Plan for tomorrow (optional)..." rows={2} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none" />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Photo Upload */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <div className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">
                    {activeTab === 'reports' ? '5' : '5'}
                  </div>
                  Photo Upload (JPEG)
                </div>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                  {photoUrl ? (
                    <div className="space-y-3">
                      <img src={photoUrl} alt="Uploaded" className="w-40 h-40 object-cover rounded-lg mx-auto border border-slate-200" />
                      <p className="text-xs text-slate-400">{photoName}</p>
                      <button onClick={() => { setPhotoUrl(null); setPhotoName(null); }} className="text-xs text-red-500 hover:text-red-600 font-medium">
                        Remove Photo
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload size={32} className="mx-auto text-slate-300 mb-2" />
                      <p className="text-sm text-slate-500">Click to upload JPEG image</p>
                      <p className="text-xs text-slate-400 mt-1">Max 5MB • JPEG, PNG supported</p>
                      <label className="mt-3 inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer hover:bg-blue-100 transition-colors">
                        <Image size={16} />
                        Choose Photo
                        <input type="file" accept="image/jpeg,image/jpg,image/png" onChange={handlePhotoUpload} className="hidden" />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button onClick={() => { setShowForm(false); resetForm(); }} className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button
                  onClick={activeTab === 'reports' ? handleSubmitReport : handleSubmitShoot}
                  className={`flex-1 py-3 rounded-xl text-white font-medium transition-colors shadow-lg flex items-center justify-center gap-2 ${
                    activeTab === 'indoor' ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/20' :
                    activeTab === 'outdoor' ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20' :
                    'bg-green-600 hover:bg-green-700 shadow-green-600/20'
                  }`}
                >
                  <CheckCircle size={18} />
                  Submit Entry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Entry History */}
        <div className="space-y-3">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            {activeTab === 'indoor' ? <Camera size={18} className="text-purple-500" /> :
             activeTab === 'outdoor' ? <Sun size={18} className="text-amber-500" /> :
             <FileText size={18} className="text-green-500" />}
            My {activeTab === 'indoor' ? 'Indoor Shoots' : activeTab === 'outdoor' ? 'Outdoor Shoots' : 'Daily Reports'}
            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
              {activeTab === 'indoor' ? myIndoorShoots.length : activeTab === 'outdoor' ? myOutdoorShoots.length : myReports.length}
            </span>
          </h3>

          {/* Display entries */}
          {(activeTab === 'indoor' ? myIndoorShoots : activeTab === 'outdoor' ? myOutdoorShoots : myReports).map((entry: any) => {
            const isExpanded = expandedEntry === entry.id;
            return (
              <div key={entry.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => setExpandedEntry(isExpanded ? null : entry.id)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        activeTab === 'indoor' ? 'bg-purple-100' : activeTab === 'outdoor' ? 'bg-amber-100' : 'bg-green-100'
                      }`}>
                        {activeTab === 'indoor' ? <Camera size={18} className="text-purple-600" /> :
                         activeTab === 'outdoor' ? <Sun size={18} className="text-amber-600" /> :
                         <FileText size={18} className="text-green-600" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{formatDate(entry.date)}</span>
                          {entry.locked && <Lock size={12} className="text-slate-400" />}
                        </div>
                        <p className="text-sm text-slate-600 mt-0.5">
                          {formatTime(entry.checkIn)} → {entry.checkOut ? formatTime(entry.checkOut) : 'In Progress'} • <span className="font-semibold">{entry.totalHours}h</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {entry.photoUrl && <Image size={14} className="text-green-500" />}
                      {isExpanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-slate-100 pt-3 space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-xs text-slate-400">Date & Time</span>
                        <p className="font-medium text-slate-700">{formatDate(entry.date)} at {formatTime(entry.time)}</p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400">Employee</span>
                        <p className="font-medium text-slate-700">{getEmployeeName(entry.employeeId)}</p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400">Check In</span>
                        <p className="font-medium text-green-700">{formatTime(entry.checkIn)}</p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400">Check Out</span>
                        <p className="font-medium text-red-700">{entry.checkOut ? formatTime(entry.checkOut) : 'Not yet'}</p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400">Total Hours</span>
                        <p className="font-bold text-slate-800">{entry.totalHours} hours</p>
                      </div>
                    </div>

                    {/* Shoot details */}
                    {entry.location && (
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-xs text-slate-400">Location</span>
                            <p className="font-medium text-slate-700 flex items-center gap-1"><MapPin size={12} /> {entry.location}</p>
                          </div>
                          <div>
                            <span className="text-xs text-slate-400">Client</span>
                            <p className="font-medium text-slate-700 flex items-center gap-1"><User size={12} /> {entry.clientName}</p>
                          </div>
                        </div>
                        {entry.projectDetails && <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">{entry.projectDetails}</p>}
                      </div>
                    )}

                    {/* Report tasks */}
                    {entry.tasks && (
                      <div className="space-y-2">
                        <span className="text-xs text-slate-400">Tasks</span>
                        {entry.tasks.map((task: any) => (
                          <div key={task.id} className="flex items-center gap-2 text-sm bg-slate-50 p-2 rounded-lg">
                            <div className={`w-2 h-2 rounded-full ${task.status === 'completed' ? 'bg-green-500' : task.status === 'in-progress' ? 'bg-blue-500' : 'bg-slate-400'}`} />
                            <span className="flex-1 text-slate-700">{task.description}</span>
                            <span className="text-xs text-slate-400">{task.hours}h</span>
                          </div>
                        ))}
                        {entry.summary && <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg mt-2">{entry.summary}</p>}
                      </div>
                    )}

                    {/* Photo */}
                    {entry.photoUrl && (
                      <div>
                        <span className="text-xs text-slate-400 block mb-1">Attached Photo:</span>
                        <img src={entry.photoUrl} alt="Entry" className="w-40 h-40 object-cover rounded-lg border border-slate-200" />
                      </div>
                    )}

                    {/* Lock Notice */}
                    {entry.locked && (
                      <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded-lg">
                        <Lock size={12} />
                        This entry is locked. Only admin can edit or delete it.
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Empty State */}
          {(activeTab === 'indoor' ? myIndoorShoots : activeTab === 'outdoor' ? myOutdoorShoots : myReports).length === 0 && !showForm && (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-100">
              {activeTab === 'indoor' ? <Camera size={40} className="mx-auto mb-3 text-slate-300" /> :
               activeTab === 'outdoor' ? <Sun size={40} className="mx-auto mb-3 text-slate-300" /> :
               <FileText size={40} className="mx-auto mb-3 text-slate-300" />}
              <p className="text-slate-400">No entries yet</p>
              <p className="text-xs text-slate-300 mt-1">Click the button above to submit your first entry</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 px-4 py-3 mt-8">
        <p className="text-center text-xs text-slate-400">© 2026 StudioTrack Pro • Entries are locked after submission</p>
      </footer>
    </div>
  );
}
