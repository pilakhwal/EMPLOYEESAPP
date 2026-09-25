import { useState, useEffect } from 'react';
import { Employee, UserRole } from './types';
import { getEmployees, getAdminConfig } from './store';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import EmployeeDashboard from './components/EmployeeDashboard';
import DesktopLayout from './components/DesktopLayout';
import AdminDashboard from './components/AdminDashboard';
import { 
  LayoutDashboard, Users, Camera, Sun, FileText, Settings, 
  Shield, Inbox, Keyboard
} from 'lucide-react';

export default function App() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showShortcuts, setShowShortcuts] = useState(false);

  useEffect(() => {
    setEmployees(getEmployees());
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setShowShortcuts(!showShortcuts);
      }
      if (role === 'admin') {
        if (e.key === '1' && e.altKey) setActiveTab('dashboard');
        if (e.key === '2' && e.altKey) setActiveTab('employees');
        if (e.key === '3' && e.altKey) setActiveTab('indoor');
        if (e.key === '4' && e.altKey) setActiveTab('outdoor');
        if (e.key === '5' && e.altKey) setActiveTab('reports');
        if (e.key === '6' && e.altKey) setActiveTab('settings');
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [role, showShortcuts]);

  const handleLogin = (selectedRole: UserRole, employee?: Employee) => {
    setRole(selectedRole);
    if (employee) setCurrentUser(employee);
  };

  const handleLogout = () => {
    setRole(null);
    setCurrentUser(null);
    setActiveTab('dashboard');
  };

  if (!role) {
    return <Login onLogin={handleLogin} employees={employees} />;
  }

  // Admin Panel with Desktop Layout
  if (role === 'admin') {
    const adminConfig = getAdminConfig();
    const unreadCount = JSON.parse(localStorage.getItem('app_notifications') || '[]').filter((n: any) => !n.read).length;

    const sidebar = (
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-slate-800">StudioTrack</h1>
              <p className="text-xs text-slate-400">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, shortcut: 'Alt+1' },
            { id: 'employees', label: 'Employees', icon: Users, shortcut: 'Alt+2' },
            { id: 'indoor', label: 'Indoor Shoots', icon: Camera, shortcut: 'Alt+3' },
            { id: 'outdoor', label: 'Outdoor Shoots', icon: Sun, shortcut: 'Alt+4' },
            { id: 'reports', label: 'Daily Reports', icon: FileText, shortcut: 'Alt+5' },
            { id: 'settings', label: 'Settings', icon: Settings, shortcut: 'Alt+6' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/20'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} />
                  <span>{item.label}</span>
                </div>
                <kbd className="text-[10px] opacity-60 hidden xl:inline">{item.shortcut}</kbd>
              </button>
            );
          })}
        </nav>

        {/* Email Inbox Button */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={() => setActiveTab('settings')}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all"
          >
            <div className="flex items-center gap-3">
              <Inbox size={18} />
              <span>Email Inbox</span>
            </div>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">Admin</p>
              <p className="text-xs text-slate-400 truncate">{adminConfig.email}</p>
            </div>
          </div>
        </div>
      </div>
    );

    return (
      <DesktopLayout
        sidebar={sidebar}
        title={
          activeTab === 'dashboard' ? 'Dashboard' :
          activeTab === 'employees' ? 'Employee Management' :
          activeTab === 'indoor' ? 'Indoor Shoots' :
          activeTab === 'outdoor' ? 'Outdoor Shoots' :
          activeTab === 'reports' ? 'Daily Reports' :
          'Settings & Security'
        }
        subtitle="Admin Panel • StudioTrack Pro"
        userAvatar="AD"
        userName="Admin"
        userRole="Administrator"
        onLogout={handleLogout}
      >
        {activeTab === 'dashboard' && <AdminDashboard />}
        {activeTab !== 'dashboard' && (
          <AdminPanel 
            employees={employees} 
            onLogout={handleLogout} 
            onRefresh={() => setEmployees(getEmployees())}
            initialTab={activeTab as any}
          />
        )}

        {/* Keyboard Shortcuts Modal */}
        {showShortcuts && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowShortcuts(false)}>
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Keyboard size={20} className="text-blue-600" />
                  Keyboard Shortcuts
                </h3>
                <button onClick={() => setShowShortcuts(false)} className="p-1 hover:bg-slate-100 rounded">
                  <span className="text-slate-400">✕</span>
                </button>
              </div>
              <div className="space-y-2">
                {[
                  { keys: '?', action: 'Show/hide shortcuts' },
                  { keys: 'Alt + 1', action: 'Go to Dashboard' },
                  { keys: 'Alt + 2', action: 'Go to Employees' },
                  { keys: 'Alt + 3', action: 'Go to Indoor Shoots' },
                  { keys: 'Alt + 4', action: 'Go to Outdoor Shoots' },
                  { keys: 'Alt + 5', action: 'Go to Daily Reports' },
                  { keys: 'Alt + 6', action: 'Go to Settings' },
                ].map((shortcut, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                    <span className="text-sm text-slate-600">{shortcut.action}</span>
                    <kbd className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-xs font-mono text-slate-700">
                      {shortcut.keys}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </DesktopLayout>
    );
  }

  // Employee Dashboard with Desktop Layout
  if (role === 'employee' && currentUser) {
    const sidebar = (
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Camera size={20} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-slate-800">StudioTrack</h1>
              <p className="text-xs text-slate-400">Employee Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: 'indoor', label: 'Indoor Shoot', icon: Camera },
            { id: 'outdoor', label: 'Outdoor Shoot', icon: Sun },
            { id: 'reports', label: 'Daily Report', icon: FileText },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {currentUser.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">{currentUser.name}</p>
              <p className="text-xs text-slate-400 truncate">{currentUser.department}</p>
            </div>
          </div>
        </div>
      </div>
    );

    return (
      <DesktopLayout
        sidebar={sidebar}
        title={
          activeTab === 'indoor' ? 'Indoor Shoot' :
          activeTab === 'outdoor' ? 'Outdoor Shoot' :
          'Daily Report'
        }
        subtitle="Employee Portal • StudioTrack Pro"
        userAvatar={currentUser.avatar}
        userName={currentUser.name}
        userRole={currentUser.position}
        onLogout={handleLogout}
        showShortcuts={false}
      >
        <EmployeeDashboard 
          employee={currentUser} 
          onLogout={handleLogout}
          initialTab={activeTab as any}
          onTabChange={setActiveTab}
        />
      </DesktopLayout>
    );
  }

  return <Login onLogin={handleLogin} employees={employees} />;
}
