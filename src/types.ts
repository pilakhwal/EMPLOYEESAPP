export interface AttendanceRecord {
  id: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: 'present' | 'late' | 'absent' | 'half-day';
  note: string;
}

export interface WorkReport {
  id: string;
  date: string;
  tasks: TaskItem[];
  summary: string;
  challenges: string;
  tomorrowPlan: string;
  submittedAt: string;
}

export interface TaskItem {
  id: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending';
  hours: number;
}

export interface Employee {
  name: string;
  department: string;
  position: string;
  avatar: string;
}
