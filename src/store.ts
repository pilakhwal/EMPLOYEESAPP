import { AttendanceRecord, WorkReport, Employee } from './types';
import { getCurrentDateString } from './utils';

const STORAGE_KEYS = {
  ATTENDANCE: 'office_attendance_records',
  REPORTS: 'office_work_reports',
  EMPLOYEE: 'office_employee',
};

// Default employee
const defaultEmployee: Employee = {
  name: 'John Anderson',
  department: 'Engineering',
  position: 'Software Developer',
  avatar: 'JA',
};

// Generate sample data
const generateSampleAttendance = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const today = new Date();
  
  for (let i = 7; i >= 1; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dayOfWeek = date.getDay();
    
    if (dayOfWeek === 0 || dayOfWeek === 6) continue; // Skip weekends
    
    const isLate = Math.random() > 0.7;
    const checkInHour = isLate ? 9 + Math.floor(Math.random() * 2) : 8 + Math.floor(Math.random() * 1);
    const checkInMin = Math.floor(Math.random() * 59);
    const checkOutHour = 17 + Math.floor(Math.random() * 2);
    const checkOutMin = Math.floor(Math.random() * 59);
    
    records.push({
      id: `sample-${i}`,
      date: date.toISOString().split('T')[0],
      checkIn: `${String(checkInHour).padStart(2, '0')}:${String(checkInMin).padStart(2, '0')}`,
      checkOut: `${String(checkOutHour).padStart(2, '0')}:${String(checkOutMin).padStart(2, '0')}`,
      status: isLate ? 'late' : 'present',
      note: isLate ? 'Traffic delay' : '',
    });
  }
  
  return records;
};

const generateSampleReports = (): WorkReport[] => {
  const reports: WorkReport[] = [];
  const today = new Date();
  
  const taskTemplates: { desc: string; status: 'completed' | 'in-progress' | 'pending'; hours: number }[] = [
    { desc: 'Code review for feature branch', status: 'completed', hours: 2 },
    { desc: 'Bug fixes in payment module', status: 'completed', hours: 3 },
    { desc: 'Team standup meeting', status: 'completed', hours: 0.5 },
    { desc: 'API documentation update', status: 'completed', hours: 1.5 },
    { desc: 'Database optimization', status: 'in-progress', hours: 2 },
    { desc: 'Unit test writing', status: 'completed', hours: 2 },
    { desc: 'Client requirement analysis', status: 'completed', hours: 1 },
    { desc: 'Sprint planning preparation', status: 'completed', hours: 1 },
  ];

  for (let i = 5; i >= 1; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dayOfWeek = date.getDay();
    
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;
    
    const numTasks = 3 + Math.floor(Math.random() * 3);
    const shuffled = [...taskTemplates].sort(() => 0.5 - Math.random());
    const tasks = shuffled.slice(0, numTasks).map((t, idx) => ({
      id: `task-${i}-${idx}`,
      description: t.desc,
      status: t.status,
      hours: t.hours,
    }));

    reports.push({
      id: `report-${i}`,
      date: date.toISOString().split('T')[0],
      tasks,
      summary: 'Completed assigned tasks for the day. Collaborated with team on project deliverables.',
      challenges: i % 2 === 0 ? 'Waiting for design assets from the UI team.' : '',
      tomorrowPlan: 'Continue with current sprint tasks and code reviews.',
      submittedAt: date.toISOString(),
    });
  }
  
  return reports;
};

export const getEmployee = (): Employee => {
  const stored = localStorage.getItem(STORAGE_KEYS.EMPLOYEE);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(STORAGE_KEYS.EMPLOYEE, JSON.stringify(defaultEmployee));
  return defaultEmployee;
};

export const getAttendanceRecords = (): AttendanceRecord[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
  if (stored) return JSON.parse(stored);
  
  const sample = generateSampleAttendance();
  localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(sample));
  return sample;
};

export const saveAttendanceRecord = (record: AttendanceRecord): void => {
  const records = getAttendanceRecords();
  const existingIdx = records.findIndex(r => r.date === record.date);
  
  if (existingIdx >= 0) {
    records[existingIdx] = record;
  } else {
    records.push(record);
  }
  
  records.sort((a, b) => b.date.localeCompare(a.date));
  localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(records));
};

export const getTodayAttendance = (): AttendanceRecord | null => {
  const records = getAttendanceRecords();
  const today = getCurrentDateString();
  return records.find(r => r.date === today) || null;
};

export const getWorkReports = (): WorkReport[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.REPORTS);
  if (stored) return JSON.parse(stored);
  
  const sample = generateSampleReports();
  localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(sample));
  return sample;
};

export const saveWorkReport = (report: WorkReport): void => {
  const reports = getWorkReports();
  const existingIdx = reports.findIndex(r => r.date === report.date);
  
  if (existingIdx >= 0) {
    reports[existingIdx] = report;
  } else {
    reports.push(report);
  }
  
  reports.sort((a, b) => b.date.localeCompare(a.date));
  localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
};
