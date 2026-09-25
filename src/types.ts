export interface Employee {
  id: string;
  name: string;
  department: string;
  position: string;
  avatar: string;
  active: boolean;
  email: string;
  password: string;
  twoFactorEnabled: boolean;
}

export interface AdminConfig {
  password: string;
  email: string;
  twoFactorEnabled: boolean;
}

export interface OTPSession {
  email: string;
  code: string;
  expiresAt: number;
  purpose: 'admin-login' | 'employee-login' | 'password-change';
}

export interface ShootEntry {
  id: string;
  date: string;
  time: string;
  employeeId: string;
  type: 'indoor' | 'outdoor';
  checkIn: string;
  checkOut: string | null;
  totalHours: number;
  location: string;
  clientName: string;
  projectDetails: string;
  photoUrl: string | null;
  photoName: string | null;
  submittedAt: string;
  locked: boolean;
}

export interface DailyReport {
  id: string;
  date: string;
  time: string;
  employeeId: string;
  checkIn: string;
  checkOut: string | null;
  totalHours: number;
  tasks: TaskItem[];
  summary: string;
  challenges: string;
  tomorrowPlan: string;
  photoUrl: string | null;
  photoName: string | null;
  submittedAt: string;
  locked: boolean;
}

export interface TaskItem {
  id: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending';
  hours: number;
}

export type UserRole = 'admin' | 'employee';

export interface Notification {
  id: string;
  type: 'email' | 'success' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  to?: string;
  subject?: string;
  code?: string;
}
