import { zonedTimeToUtc } from 'date-fns-tz';
import { Day } from '@prisma/client';
import { parse } from 'date-fns';

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
