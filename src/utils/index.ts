import { Day, Role } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';
import { getSeqNumber } from './courseSequenceNumber';
import {
  addCourseSections,
  addTeachingAndCoursePreferences,
} from './seedingFunctions';
import { getISOTime, getMeetingDays } from './time';
const isAdmin = (user: JwtPayload) => user.role === Role.ADMIN;

export {
  getISOTime,
  isAdmin,
  getMeetingDays,
  addCourseSections,
  getSeqNumber,
  appendDay,
  addTeachingAndCoursePreferences,
};

const appendDay = (isDay: boolean, day: Day, days: Day[]): Day[] => {
  if (isDay) {
    days.push(day);
  }
  return days;
};
