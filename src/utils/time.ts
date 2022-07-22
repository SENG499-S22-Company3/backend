import { zonedTimeToUtc } from 'date-fns-tz';
import { Day } from '@prisma/client';
import { parse } from 'date-fns';
import { CourseSectionInput } from '../schema';

const DATE_FORMAT = 'MMM d, yyyy HHmm';

/**
 * Takes a string value of a time in 24 hour format ('HHMM')
 * and converts it into ISO format
 *
 * @param time The time you want to be converted into
 * ISO format in the form 'HHMM'.
 *
 * @returns The formatted ISO time
 */

export const getISOTime = (time: string): string => {
  const hour = time.slice(0, 2);
  const min = time.slice(2, 4);

  const timeISO = zonedTimeToUtc(
    `2020-01-01 ${hour}:${min}`,
    'America/Los_Angeles'
  ).toISOString();

  return timeISO;
};

export const getDateTime = (time: string, date: string): Date => {
  return parse(`${date} ${time}`, DATE_FORMAT, new Date());
};

export const getTime = (time: string): Date => {
  return parse(time, 'HHmm', new Date());
};

export const getDate = (date: string): Date => {
  return parse(`${date}`, 'MMM d, yyyy', new Date());
};

/**
 *
 * Generates an array of the corresponding meeting days from the inputed
 * meetingTime object
 *
 * @param meetingTime The meetingTime object from the historical data
 * @returns An array of type Day with the corresponding meeting days
 */

export const getMeetingDays = (meetingTime: any): Day[] => {
  const days: Day[] = [];

  if (meetingTime.monday) days.push('MONDAY');
  if (meetingTime.tuesday) days.push('TUESDAY');
  if (meetingTime.wednesday) days.push('WEDNESDAY');
  if (meetingTime.thursday) days.push('THURSDAY');
  if (meetingTime.friday) days.push('FRIDAY');
  if (meetingTime.saturday) days.push('SATURDAY');
  if (meetingTime.sunday) days.push('SUNDAY');

  return days;
};

/**
 *
 * Takes a Date object in the format of 20180905, and
 * converts it into a string format of MMM DD, YYYY
 *
 * @param date The date to be formatted
 * @return formatted date in MMM DD, YYYY
 */

export function getFormattedDate(date: CourseSectionInput) {
  const year = String(date).substring(0, 4);
  const month = String(date).substring(4, 6);
  const day = String(date).substring(6, 8);
  const combined = year + ',' + month + ',' + day;
  const formattedDate = new Date(combined).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
  return formattedDate;
}

/**
 *
 * Retrieves meeting times of a given course section and returns the time in string format
 *
 * @param course The course of which meetingTimes will be looked for
 * @param time To compare with strings 'beginTime' or 'endTime'
 * @return Begin or End time of a class based off @param time
 */

export function getClassTime(course: CourseSectionInput, time: string) {
  if (time === 'beginTime')
    // return time.startTime;
    return String(course.meetingTimes.map((m) => m.startTime)[0]);
  else if (time === 'endTime')
    return String(course.meetingTimes.map((m) => m.endTime)[0]);
  return 'Incorrect input provided';
}

/**
 *
 * Takes a course section and a day of a week as an input and
 * checks if the course section has a meeting day on the inputted day
 *
 * @param course The course of which meeting day will be looked for
 * @param day The day of the week to be compared with
 * @returns true when match; false otherwise
 */

export function isMeetingDay(course: CourseSectionInput, day: Day) {
  const isDay = course.meetingTimes.map((m) => m.day === day);
  for (let i = 0; i < isDay.length; i++) {
    if (isDay[i]) return isDay[i];
  }
  return false;
}
