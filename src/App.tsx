import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Attendance from './components/Attendance';
import WorkReports from './components/WorkReports';
import { Menu, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveTab} />;
      case 'attendance':
        return <Attendance />;
      case 'reports':
        return <WorkReports />;
      default:
        return <Dashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Desktop */}
      <div className="hidden lg:block">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Sidebar - Mobile */}
      <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:hidden ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar activeTab={activeTab} onTabChange={(tab) => { setActiveTab(tab); setSidebarOpen(false); }} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 px-4 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <div>
              <h1 className="text-lg font-semibold text-slate-800 capitalize">
                {activeTab === 'reports' ? 'Work Reports' : activeTab}
              </h1>
              <p className="text-xs text-slate-400 hidden sm:block">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Online</span>
            </div>
            <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              JA
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <div className="max-w-6xl mx-auto">
            {renderContent()}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-100 px-4 lg:px-8 py-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>© 2026 OfficeTrack - Attendance & Work Report System</span>
            <span className="hidden sm:block">v1.0.0</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
