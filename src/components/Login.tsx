import { useState } from 'react';
import { Employee, UserRole } from '../types';
import { Shield, Users, Camera, Film, Lock } from 'lucide-react';

interface LoginProps {
  onLogin: (role: UserRole, employee?: Employee) => void;
  employees: Employee[];
}

export default function Login({ onLogin, employees }: LoginProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [adminPassword, setAdminPassword] = useState('');
  const [error, setError] = useState('');

  const activeEmployees = employees.filter(e => e.active);

  const handleContinue = () => {
    if (selectedRole === 'admin') {
      if (adminPassword === 'admin123') {
        onLogin('admin');
      } else {
        setError('Invalid admin password. Use: admin123');
      }
    } else if (selectedRole === 'employee' && selectedEmployee) {
      onLogin('employee', selectedEmployee);
    } else {
      setError('Please select an employee');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-4 border border-white/20">
            <Camera size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">StudioTrack Pro</h1>
          <p className="text-blue-200 mt-2">Attendance & Work Report System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {!selectedRole ? (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-800 text-center mb-6">Select Your Role</h2>
              
              <button
                onClick={() => setSelectedRole('admin')}
                className="w-full flex items-center gap-4 p-5 rounded-2xl border-2 border-slate-200 hover:border-red-400 hover:bg-red-50 transition-all group"
              >
                <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center group-hover:bg-red-200 transition-colors">
                  <Shield size={28} className="text-red-600" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-bold text-slate-800 text-lg">Admin</p>
                  <p className="text-sm text-slate-500">Full access & management</p>
                </div>
              </button>

              <button
                onClick={() => setSelectedRole('employee')}
                className="w-full flex items-center gap-4 p-5 rounded-2xl border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all group"
              >
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <Users size={28} className="text-blue-600" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-bold text-slate-800 text-lg">Employee</p>
                  <p className="text-sm text-slate-500">Submit attendance & reports</p>
                </div>
              </button>
            </div>
          ) : selectedRole === 'admin' ? (
            <div className="space-y-5">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Lock size={32} className="text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Admin Login</h2>
                <p className="text-sm text-slate-500 mt-1">Enter admin password to continue</p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">Password</label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => { setAdminPassword(e.target.value); setError(''); }}
                  placeholder="Enter admin password"
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-red-400 transition-colors"
                  onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
                />
              </div>

              {error && <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>}

              <div className="flex gap-3">
                <button
                  onClick={() => { setSelectedRole(null); setError(''); }}
                  className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleContinue}
                  className="flex-1 py-3 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
                >
                  Login
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Users size={32} className="text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Employee Login</h2>
                <p className="text-sm text-slate-500 mt-1">Select your name to continue</p>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {activeEmployees.map((emp) => (
                  <button
                    key={emp.id}
                    onClick={() => { setSelectedEmployee(emp); setError(''); }}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                      selectedEmployee?.id === emp.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {emp.avatar}
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-medium text-slate-800">{emp.name}</p>
                      <p className="text-xs text-slate-400">{emp.department} • {emp.position}</p>
                    </div>
                    {selectedEmployee?.id === emp.id && (
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {error && <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>}

              <div className="flex gap-3">
                <button
                  onClick={() => { setSelectedRole(null); setError(''); }}
                  className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleContinue}
                  className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                >
                  Continue
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-blue-200 text-sm mt-6">
          © 2026 StudioTrack Pro • Professional Production Management
        </p>
      </div>
    </div>
  );
}
