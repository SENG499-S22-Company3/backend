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
 * Takes a Date object in the format of 2018-09-05T13:30:00.000Z, and
 * converts it into a string format of MMM DD, YYYY
 *
 * @param date The date to be formatted
 * @return formatted date in MMM DD, YYYY
 */

export function getFormattedDate(date: CourseSectionInput) {
  const dateString = String(date);
  const formattedDate = new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
  // console.log('FormattedDate', formattedDate);
  return formattedDate;
}

/**
 *
 * Retrieves meeting times of a given course section as a DateTime object
 * and converts it into HHMM format
 *
 * @param course The course of which meetingTimes will be looked for
 * @param time To compare with strings 'beginTime' or 'endTime'
 * @return the time in string format
 */

export function getClassTime(course: CourseSectionInput, time: string) {
  let stringInput = '';
  if (time === 'beginTime') {
    stringInput = String(course.meetingTimes.map((m) => m.startTime)[0]);
  } else if (time === 'endTime') {
    stringInput = String(course.meetingTimes.map((m) => m.endTime)[0]);
  }
  if (!stringInput || stringInput === '') return 'Incorrect time input';
  const stringDateTime = stringInput.substring(0, stringInput.length - 1);
  const getTime = new Date(stringDateTime)
    .toLocaleTimeString('en-us', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    })
    .replace(':', '');
  // console.log(getTime);
  return getTime;
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

export function isMeetingDay(course: CourseSectionInput, day: Day): boolean {
  const x = course.meetingTimes.find((m) => m.day === day);
  if (!x) return false;
  else return true;
}
