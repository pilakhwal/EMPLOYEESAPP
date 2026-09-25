export interface Employee {
  id: string;
  name: string;
  department: string;
  position: string;
  avatar: string;
  active: boolean;
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

export interface AppState {
  currentUser: Employee | null;
  role: UserRole;
  employees: Employee[];
  shootEntries: ShootEntry[];
  dailyReports: DailyReport[];
}
