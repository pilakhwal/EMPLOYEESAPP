import { Employee, AdminConfig, OTPSession, ShootEntry, DailyReport, Notification } from './types';

const KEYS = {
  EMPLOYEES: 'app_employees_v2',
  SHOOTS: 'app_shoot_entries',
  REPORTS: 'app_daily_reports',
  SHEETS_URL: 'app_sheets_url',
  ADMIN_CONFIG: 'app_admin_config',
  OTP_SESSION: 'app_otp_session',
  NOTIFICATIONS: 'app_notifications',
};

const defaultEmployees: Employee[] = [
  { id: 'emp-1', name: 'Rahul Sharma', department: 'Camera', position: 'Cinematographer', avatar: 'RS', active: true, email: 'rahul@studio.com', password: 'rahul123', twoFactorEnabled: true },
  { id: 'emp-2', name: 'Priya Patel', department: 'Production', position: 'Producer', avatar: 'PP', active: true, email: 'priya@studio.com', password: 'priya123', twoFactorEnabled: true },
  { id: 'emp-3', name: 'Amit Kumar', department: 'Lighting', position: 'Gaffer', avatar: 'AK', active: true, email: 'amit@studio.com', password: 'amit123', twoFactorEnabled: false },
  { id: 'emp-4', name: 'Sneha Gupta', department: 'Post Production', position: 'Editor', avatar: 'SG', active: true, email: 'sneha@studio.com', password: 'sneha123', twoFactorEnabled: true },
  { id: 'emp-5', name: 'Vikram Singh', department: 'Camera', position: 'Camera Operator', avatar: 'VS', active: true, email: 'vikram@studio.com', password: 'vikram123', twoFactorEnabled: false },
];

const defaultAdminConfig: AdminConfig = {
  password: 'admin123',
  email: 'lalit2info@gmail.com',
  twoFactorEnabled: true,
};

const generateSampleShoots = (): ShootEntry[] => {
  const entries: ShootEntry[] = [];
  const today = new Date();
  const locations = ['Studio A', 'Studio B', 'Client Office', 'Warehouse'];
  const clients = ['Tata Motors', 'Reliance Retail', 'Flipkart', 'Amazon India'];

  for (let i = 6; i >= 1; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    const emp = defaultEmployees[Math.floor(Math.random() * defaultEmployees.length)];
    entries.push({
      id: `shoot-${i}`,
      date: date.toISOString().split('T')[0],
      time: '09:00',
      employeeId: emp.id,
      type: i % 2 === 0 ? 'indoor' : 'outdoor',
      checkIn: '09:00',
      checkOut: '17:30',
      totalHours: 8.5,
      location: locations[Math.floor(Math.random() * locations.length)],
      clientName: clients[Math.floor(Math.random() * clients.length)],
      projectDetails: 'Product photography and video shoot',
      photoUrl: null,
      photoName: null,
      submittedAt: date.toISOString(),
      locked: true,
    });
  }
  return entries;
};

const generateSampleReports = (): DailyReport[] => {
  const reports: DailyReport[] = [];
  const today = new Date();

  for (let i = 5; i >= 1; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    const emp = defaultEmployees[Math.floor(Math.random() * defaultEmployees.length)];
    reports.push({
      id: `report-${i}`,
      date: date.toISOString().split('T')[0],
      time: '09:00',
      employeeId: emp.id,
      checkIn: '09:00',
      checkOut: '17:00',
      totalHours: 8,
      tasks: [
        { id: `t1-${i}`, description: 'Video editing for client project', status: 'completed', hours: 3 },
        { id: `t2-${i}`, description: 'Team meeting and planning', status: 'completed', hours: 1 },
        { id: `t3-${i}`, description: 'Color grading and review', status: 'completed', hours: 2 },
      ],
      summary: 'Completed all assigned tasks for the day.',
      challenges: '',
      tomorrowPlan: 'Continue with post-production work.',
      photoUrl: null,
      photoName: null,
      submittedAt: date.toISOString(),
      locked: true,
    });
  }
  return reports;
};

// Admin Config
export const getAdminConfig = (): AdminConfig => {
  const stored = localStorage.getItem(KEYS.ADMIN_CONFIG);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(KEYS.ADMIN_CONFIG, JSON.stringify(defaultAdminConfig));
  return defaultAdminConfig;
};

export const saveAdminConfig = (config: AdminConfig) => {
  localStorage.setItem(KEYS.ADMIN_CONFIG, JSON.stringify(config));
};

export const verifyAdminPassword = (password: string): boolean => {
  return getAdminConfig().password === password;
};

export const changeAdminPassword = (oldPassword: string, newPassword: string): boolean => {
  const config = getAdminConfig();
  if (config.password !== oldPassword) return false;
  config.password = newPassword;
  saveAdminConfig(config);
  return true;
};

// OTP / 2FA System
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const createOTPSession = (email: string, purpose: OTPSession['purpose']): string => {
  const code = generateOTP();
  const session: OTPSession = {
    email,
    code,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    purpose,
  };
  localStorage.setItem(KEYS.OTP_SESSION, JSON.stringify(session));
  
  // Create email notification (simulated)
  addNotification({
    type: 'email',
    title: '🔐 Verification Code - StudioTrack Pro',
    message: `Your verification code is: ${code}. This code expires in 5 minutes. Do not share this code with anyone.`,
    to: email,
    subject: 'Two-Factor Authentication Code',
    code,
  });
  
  return code;
};

export const verifyOTP = (code: string): boolean => {
  const stored = localStorage.getItem(KEYS.OTP_SESSION);
  if (!stored) return false;
  const session: OTPSession = JSON.parse(stored);
  if (Date.now() > session.expiresAt) {
    localStorage.removeItem(KEYS.OTP_SESSION);
    return false;
  }
  if (session.code === code) {
    localStorage.removeItem(KEYS.OTP_SESSION);
    return true;
  }
  return false;
};

export const getCurrentOTP = (): string | null => {
  const stored = localStorage.getItem(KEYS.OTP_SESSION);
  if (!stored) return null;
  const session: OTPSession = JSON.parse(stored);
  if (Date.now() > session.expiresAt) {
    localStorage.removeItem(KEYS.OTP_SESSION);
    return null;
  }
  return session.code;
};

// Notifications (Simulated Email Inbox)
export const getNotifications = (): Notification[] => {
  const stored = localStorage.getItem(KEYS.NOTIFICATIONS);
  if (stored) return JSON.parse(stored);
  return [];
};

export const addNotification = (notification: Pick<Notification, 'type' | 'title' | 'message'> & Partial<Pick<Notification, 'to' | 'subject' | 'code'>>) => {
  const notifications = getNotifications();
  notifications.unshift({
    id: `notif-${Date.now()}`,
    type: notification.type,
    title: notification.title,
    message: notification.message,
    timestamp: Date.now(),
    read: false,
    to: notification.to,
    subject: notification.subject,
    code: notification.code,
  });
  // Keep only last 50 notifications
  const trimmed = notifications.slice(0, 50);
  localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(trimmed));
};

export const markNotificationRead = (id: string) => {
  const notifications = getNotifications().map(n => n.id === id ? { ...n, read: true } : n);
  localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifications));
};

export const clearNotifications = () => {
  localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify([]));
};

// Employees
export const getEmployees = (): Employee[] => {
  const stored = localStorage.getItem(KEYS.EMPLOYEES);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(KEYS.EMPLOYEES, JSON.stringify(defaultEmployees));
  return defaultEmployees;
};

export const saveEmployees = (employees: Employee[]) => {
  localStorage.setItem(KEYS.EMPLOYEES, JSON.stringify(employees));
};

export const addEmployee = (emp: Employee) => {
  const emps = getEmployees();
  emps.push(emp);
  saveEmployees(emps);
};

export const updateEmployee = (id: string, data: Partial<Employee>) => {
  const emps = getEmployees();
  const idx = emps.findIndex(e => e.id === id);
  if (idx >= 0) { emps[idx] = { ...emps[idx], ...data }; saveEmployees(emps); }
};

export const deleteEmployee = (id: string) => {
  const emps = getEmployees().filter(e => e.id !== id);
  saveEmployees(emps);
};

export const verifyEmployeePassword = (id: string, password: string): boolean => {
  const emp = getEmployees().find(e => e.id === id);
  return emp?.password === password;
};

export const changeEmployeePassword = (id: string, oldPassword: string, newPassword: string): boolean => {
  const emps = getEmployees();
  const idx = emps.findIndex(e => e.id === id);
  if (idx < 0 || emps[idx].password !== oldPassword) return false;
  emps[idx].password = newPassword;
  saveEmployees(emps);
  return true;
};

// Shoot Entries
export const getShootEntries = (): ShootEntry[] => {
  const stored = localStorage.getItem(KEYS.SHOOTS);
  if (stored) return JSON.parse(stored);
  const sample = generateSampleShoots();
  localStorage.setItem(KEYS.SHOOTS, JSON.stringify(sample));
  return sample;
};

export const saveShootEntry = (entry: ShootEntry) => {
  const entries = getShootEntries();
  const idx = entries.findIndex(e => e.id === entry.id);
  if (idx >= 0) entries[idx] = entry;
  else entries.push(entry);
  entries.sort((a, b) => b.date.localeCompare(a.date));
  localStorage.setItem(KEYS.SHOOTS, JSON.stringify(entries));
};

export const deleteShootEntry = (id: string) => {
  const entries = getShootEntries().filter(e => e.id !== id);
  localStorage.setItem(KEYS.SHOOTS, JSON.stringify(entries));
};

// Daily Reports
export const getDailyReports = (): DailyReport[] => {
  const stored = localStorage.getItem(KEYS.REPORTS);
  if (stored) return JSON.parse(stored);
  const sample = generateSampleReports();
  localStorage.setItem(KEYS.REPORTS, JSON.stringify(sample));
  return sample;
};

export const saveDailyReport = (report: DailyReport) => {
  const reports = getDailyReports();
  const idx = reports.findIndex(r => r.id === report.id);
  if (idx >= 0) reports[idx] = report;
  else reports.push(report);
  reports.sort((a, b) => b.date.localeCompare(a.date));
  localStorage.setItem(KEYS.REPORTS, JSON.stringify(reports));
};

export const deleteDailyReport = (id: string) => {
  const reports = getDailyReports().filter(r => r.id !== id);
  localStorage.setItem(KEYS.REPORTS, JSON.stringify(reports));
};

// Google Sheets
export const getSheetsUrl = (): string => {
  return localStorage.getItem(KEYS.SHEETS_URL) || '';
};

export const setSheetsUrl = (url: string) => {
  localStorage.setItem(KEYS.SHEETS_URL, url);
};

export const syncToGoogleSheets = async (type: 'shoot' | 'report', data: any): Promise<boolean> => {
  const url = getSheetsUrl();
  if (!url) return false;
  try {
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, data, timestamp: new Date().toISOString() }),
    });
    return true;
  } catch {
    return false;
  }
};

export const syncAllToSheets = async (): Promise<boolean> => {
  const url = getSheetsUrl();
  if (!url) return false;
  try {
    const employees = getEmployees();
    const shoots = getShootEntries();
    const reports = getDailyReports();
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'full_backup', employees, shoots, reports, timestamp: new Date().toISOString() }),
    });
    return true;
  } catch {
    return false;
  }
};

export const getEmployeeName = (id: string): string => {
  const emp = getEmployees().find(e => e.id === id);
  return emp?.name || 'Unknown';
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
