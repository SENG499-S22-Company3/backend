import { User, Role } from '@prisma/client';
import { getISOTime, getMeetingDays } from './time';
import { addCourseSections } from './seedingFunctions';
import { getSeqNumber } from './courseSequenceNumber';
const isAdmin = (user: User) => user.role === Role.ADMIN;

export {
  getISOTime,
  isAdmin,
  getMeetingDays,
  addCourseSections,
  getSeqNumber,
  appendDay,
};

const appendDay = (isDay: boolean, day: string, days: string[]): string[] => {
  if (isDay) {
    days.push(day);
  }
  return days;
};
