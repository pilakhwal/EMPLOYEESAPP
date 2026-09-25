import { ReactNode } from 'react';
import { LogOut, Bell, Monitor, Smartphone, Keyboard } from 'lucide-react';

interface DesktopLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
  title: string;
  subtitle?: string;
  userAvatar: string;
  userName: string;
  userRole: string;
  onLogout: () => void;
  showShortcuts?: boolean;
}

export default function DesktopLayout({ 
  children, 
  sidebar, 
  title, 
  subtitle,
  userAvatar, 
  userName, 
  userRole, 
  onLogout,
  showShortcuts = true
}: DesktopLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className="hidden lg:block w-64 bg-white border-r border-slate-200 min-h-screen sticky top-0">
        {sidebar}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
          <div className="px-6 py-3 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-800">{title}</h1>
              {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
            </div>
            
            <div className="flex items-center gap-3">
              {showShortcuts && (
                <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg">
                  <Keyboard size={14} />
                  <span>Press <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono">?</kbd> for shortcuts</span>
                </div>
              )}
              
              <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 bg-green-50 px-3 py-1.5 rounded-lg">
                <Monitor size={14} className="text-green-600" />
                <span className="font-medium text-green-700">Desktop View</span>
              </div>
              
              <button 
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>

              <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {userAvatar}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-slate-700">{userName}</p>
                  <p className="text-xs text-slate-400">{userRole}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-100 px-6 py-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>© 2026 StudioTrack Pro • Professional Production Management System</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Monitor size={12} /> Desktop
              </span>
              <span>v3.0.0</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
