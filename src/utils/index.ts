import { Day, Role } from '@prisma/client';
import { FullUser } from '../resolvers/resolverUtils';
import { getSeqNumber } from './courseSequenceNumber';
import {
  addCourseSections,
  addTeachingAndCoursePreferences,
} from './seedingFunctions';
import { getISOTime, getMeetingDays } from './time';
const isAdmin = (user: FullUser) => user.role === Role.ADMIN;

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

export function getEnvValue(key: string, defaultValue: number): number {
  const value = process.env[key];
  if (!value) return defaultValue;
  try {
    return parseInt(value, 10);
  } catch (e) {
    console.error(`Failed to parse ${key} as number ${value}`);
    return defaultValue;
  }
}

// To match type 'Course' in hardScheduled
export type CourseType = {
  courseNumber: string;
  subject: string;
  sequenceNumber: string;
  streamSequence: string;
  courseTitle: string;
  numSections: number;
  courseCapacity: number;
  assignment: {
    startDate: string;
    endDate: string;
    beginTime: string;
    endTime: string;
    hoursWeek: number;
    sunday: boolean;
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
  };
  prof: {
    displayName: string;
    preferences: [];
  };
};
