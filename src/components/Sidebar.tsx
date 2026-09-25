import { LayoutDashboard, Clock, FileText, User, Building2 } from 'lucide-react';
import { getEmployee } from '../store';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const employee = getEmployee();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'attendance', label: 'Attendance', icon: Clock },
    { id: 'reports', label: 'Work Reports', icon: FileText },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white min-h-screen flex flex-col shadow-xl">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <Building2 size={22} />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">OfficeTrack</h1>
            <p className="text-xs text-slate-400">Attendance & Reports</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              <Icon size={20} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Employee Profile */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold">
            {employee.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{employee.name}</p>
            <p className="text-xs text-slate-400 truncate">{employee.department}</p>
          </div>
          <User size={16} className="text-slate-400" />
        </div>
      </div>
    </aside>
  );
}
