import { format, parseISO, isToday, isYesterday, startOfWeek, endOfWeek, eachDayOfInterval, differenceInMinutes } from 'date-fns';
import { AttendanceRecord, WorkReport } from './types';

export const formatDate = (date: string | Date, fmt: string = 'MMM dd, yyyy'): string => {
  if (typeof date === 'string') {
    return format(parseISO(date), fmt);
  }
  return format(date, fmt);
};

export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':');
  const h = parseInt(hours);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 || 12;
  return `${displayH}:${minutes} ${ampm}`;
};

export const getCurrentTimeString = (): string => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

export const getCurrentDateString = (): string => {
  return format(new Date(), 'yyyy-MM-dd');
};

export const isLate = (checkInTime: string): boolean => {
  const [hours, minutes] = checkInTime.split(':').map(Number);
  const checkInMinutes = hours * 60 + minutes;
  const officeStartMinutes = 9 * 60; // 9:00 AM
  return checkInMinutes > officeStartMinutes;
};

export const calculateWorkHours = (checkIn: string, checkOut: string): number => {
  const [inH, inM] = checkIn.split(':').map(Number);
  const [outH, outM] = checkOut.split(':').map(Number);
  return (outH * 60 + outM - (inH * 60 + inM)) / 60;
};

export const getWeekDates = (): string[] => {
  const today = new Date();
  const start = startOfWeek(today, { weekStartsOn: 1 });
  const end = endOfWeek(today, { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end }).map(d => format(d, 'yyyy-MM-dd'));
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
