import { useState } from 'react';
import { Employee, UserRole } from '../types';
import { verifyAdminPassword, verifyEmployeePassword, createOTPSession, verifyOTP, getAdminConfig } from '../store';
import { Shield, Users, Camera, Lock, Mail, KeyRound, ArrowLeft, CheckCircle } from 'lucide-react';

interface LoginProps {
  onLogin: (role: UserRole, employee?: Employee) => void;
  employees: Employee[];
}

type LoginStep = 'role-select' | 'admin-password' | 'admin-2fa' | 'employee-select' | 'employee-password' | 'employee-2fa';

export default function Login({ onLogin, employees }: LoginProps) {
  const [step, setStep] = useState<LoginStep>('role-select');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [adminPassword, setAdminPassword] = useState('');
  const [employeePassword, setEmployeePassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState('');
  const [otpEmail, setOtpEmail] = useState('');

  const activeEmployees = employees.filter(e => e.active);
  const adminConfig = getAdminConfig();

  const handleAdminLogin = () => {
    if (!adminPassword.trim()) {
      setError('Please enter admin password');
      return;
    }
    if (!verifyAdminPassword(adminPassword)) {
      setError('Invalid admin password');
      return;
    }
    setError('');
    
    // Check if 2FA is enabled
    if (adminConfig.twoFactorEnabled) {
      const code = createOTPSession(adminConfig.email, 'admin-login');
      setOtpEmail(adminConfig.email);
      setStep('admin-2fa');
    } else {
      onLogin('admin');
    }
  };

  const handleEmployeeLogin = () => {
    if (!selectedEmployee) {
      setError('Please select an employee');
      return;
    }
    if (!employeePassword.trim()) {
      setError('Please enter your password');
      return;
    }
    if (!verifyEmployeePassword(selectedEmployee.id, employeePassword)) {
      setError('Invalid password');
      return;
    }
    setError('');
    
    // Check if 2FA is enabled for this employee
    if (selectedEmployee.twoFactorEnabled) {
      const code = createOTPSession(selectedEmployee.email, 'employee-login');
      setOtpEmail(selectedEmployee.email);
      setStep('employee-2fa');
    } else {
      onLogin('employee', selectedEmployee);
    }
  };

  const handleOTPVerify = () => {
    if (!otpCode.trim()) {
      setError('Please enter verification code');
      return;
    }
    if (otpCode.length !== 6) {
      setError('Code must be 6 digits');
      return;
    }
    if (!verifyOTP(otpCode)) {
      setError('Invalid or expired code');
      return;
    }
    setError('');
    
    if (step === 'admin-2fa') {
      onLogin('admin');
    } else if (step === 'employee-2fa' && selectedEmployee) {
      onLogin('employee', selectedEmployee);
    }
  };

  const handleResendOTP = () => {
    const purpose = step === 'admin-2fa' ? 'admin-login' : 'employee-login';
    createOTPSession(otpEmail, purpose);
    setOtpCode('');
    setError('');
  };

  const goBack = () => {
    setError('');
    setOtpCode('');
    if (step === 'admin-password' || step === 'admin-2fa') {
      setAdminPassword('');
      setStep('role-select');
    } else if (step === 'employee-password' || step === 'employee-2fa') {
      setEmployeePassword('');
      setStep('employee-select');
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
          {/* Step 1: Role Selection */}
          {step === 'role-select' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-800 text-center mb-6">Select Your Role</h2>
              
              <button
                onClick={() => setStep('admin-password')}
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
                onClick={() => setStep('employee-select')}
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

              <div className="pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-400 text-center">
                  🔐 Secure login with password & 2FA verification
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Admin Password */}
          {step === 'admin-password' && (
            <div className="space-y-5">
              <button onClick={goBack} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700">
                <ArrowLeft size={16} /> Back
              </button>
              
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
                  onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                />
              </div>

              {error && <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>}

              <div className="flex gap-3">
                <button
                  onClick={goBack}
                  className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdminLogin}
                  className="flex-1 py-3 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
                >
                  Login
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Admin 2FA */}
          {step === 'admin-2fa' && (
            <div className="space-y-5">
              <button onClick={goBack} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700">
                <ArrowLeft size={16} /> Back
              </button>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Mail size={32} className="text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Two-Factor Authentication</h2>
                <p className="text-sm text-slate-500 mt-1">Enter the 6-digit code sent to</p>
                <p className="text-sm font-medium text-slate-700 mt-1">{otpEmail}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">Verification Code</label>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => { setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setError(''); }}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-center text-2xl font-mono tracking-widest focus:outline-none focus:border-green-400 transition-colors"
                  onKeyDown={(e) => e.key === 'Enter' && handleOTPVerify()}
                />
                <p className="text-xs text-slate-400 mt-2 text-center">
                  💡 Check your email inbox (simulated) for the code
                </p>
              </div>

              {error && <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>}

              <div className="flex gap-3">
                <button
                  onClick={handleResendOTP}
                  className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                >
                  Resend Code
                </button>
                <button
                  onClick={handleOTPVerify}
                  className="flex-1 py-3 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20"
                >
                  Verify
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Employee Selection */}
          {step === 'employee-select' && (
            <div className="space-y-5">
              <button onClick={goBack} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700">
                <ArrowLeft size={16} /> Back
              </button>
              
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
                        <CheckCircle size={16} className="text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {error && <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>}

              <div className="flex gap-3">
                <button
                  onClick={goBack}
                  className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => selectedEmployee && setStep('employee-password')}
                  disabled={!selectedEmployee}
                  className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Employee Password */}
          {step === 'employee-password' && selectedEmployee && (
            <div className="space-y-5">
              <button onClick={goBack} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700">
                <ArrowLeft size={16} /> Back
              </button>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <KeyRound size={32} className="text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Enter Password</h2>
                <p className="text-sm text-slate-500 mt-1">Welcome, {selectedEmployee.name}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">Your Password</label>
                <input
                  type="password"
                  value={employeePassword}
                  onChange={(e) => { setEmployeePassword(e.target.value); setError(''); }}
                  placeholder="Enter your password"
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-400 transition-colors"
                  onKeyDown={(e) => e.key === 'Enter' && handleEmployeeLogin()}
                />
              </div>

              {error && <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>}

              <div className="flex gap-3">
                <button
                  onClick={goBack}
                  className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEmployeeLogin}
                  className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                >
                  Login
                </button>
              </div>
            </div>
          )}

          {/* Step 6: Employee 2FA */}
          {step === 'employee-2fa' && (
            <div className="space-y-5">
              <button onClick={goBack} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700">
                <ArrowLeft size={16} /> Back
              </button>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Mail size={32} className="text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Two-Factor Authentication</h2>
                <p className="text-sm text-slate-500 mt-1">Enter the 6-digit code sent to</p>
                <p className="text-sm font-medium text-slate-700 mt-1">{otpEmail}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">Verification Code</label>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => { setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setError(''); }}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-center text-2xl font-mono tracking-widest focus:outline-none focus:border-green-400 transition-colors"
                  onKeyDown={(e) => e.key === 'Enter' && handleOTPVerify()}
                />
                <p className="text-xs text-slate-400 mt-2 text-center">
                  💡 Check your email inbox (simulated) for the code
                </p>
              </div>

              {error && <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>}

              <div className="flex gap-3">
                <button
                  onClick={handleResendOTP}
                  className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                >
                  Resend Code
                </button>
                <button
                  onClick={handleOTPVerify}
                  className="flex-1 py-3 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20"
                >
                  Verify
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
