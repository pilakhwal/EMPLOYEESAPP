import { useState, useEffect } from 'react';
import { Employee, UserRole } from './types';
import { getEmployees } from './store';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import EmployeeDashboard from './components/EmployeeDashboard';

export default function App() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    setEmployees(getEmployees());
  }, []);

  const handleLogin = (selectedRole: UserRole, employee?: Employee) => {
    setRole(selectedRole);
    if (employee) setCurrentUser(employee);
  };

  const handleLogout = () => {
    setRole(null);
    setCurrentUser(null);
  };

  if (!role) {
    return <Login onLogin={handleLogin} employees={employees} />;
  }

  if (role === 'admin') {
    return <AdminPanel employees={employees} onLogout={handleLogout} onRefresh={() => setEmployees(getEmployees())} />;
  }

  if (role === 'employee' && currentUser) {
    return <EmployeeDashboard employee={currentUser} onLogout={handleLogout} />;
  }

  return <Login onLogin={handleLogin} employees={employees} />;
}
