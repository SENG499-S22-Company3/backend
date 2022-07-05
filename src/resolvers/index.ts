/* eslint-disable prettier/prettier */
import { Context } from '../context';
import { Resolvers } from '../schema';

import {
  login,
  createNewUser,
  changePassword,
  generateSchedule,
  createTeachingPreference,
} from '../auth';
import * as utils from '../utils';
import { getSchedule, getCourses, getMe, getUserByID, getTeachingPreferenceSurvey } from './resolverUtils';
import axios from 'axios';
import minInput from '../input.json';
import { Schedule } from './types';
import { prisma } from '../prisma';
import { getTime } from '../utils/time';

const noLogin = {
  success: false,
  message: 'Not logged in',
  token: '',
};

const alreadyLoggedIn = {
  success: false,
  message: 'Already logged in',
  token: '',
};

const noPerms = {
  message: 'Insufficient permisions',
  success: false,
};
const EncounteredError = {
  message: `API call error: Error getting response from algorithm`,
  success: false,
};

const appendDay = (isDay: boolean, day: string, days: string[]): string[] => {
  if (isDay) {
    days.push(day);
  }
  return days;
};

export const resolvers: Resolvers<Context> = {
  Query: {
    me: async (_, _params, ctx) => {
      if (!ctx.session.user || !ctx.session.user.username) return null;
      return await getMe(ctx);
    },
    findUserById: async (_, params, ctx) => {
      if (!ctx.session.user || !params.id) return null;
      return await getUserByID(+params.id);
    },
    courses: async (_, params, ctx) => {
      if (!ctx.session.user || !params.term) return null;
      return await getCourses(params.term);
    },
    schedule: async (_, params, ctx) => {
      if (!ctx.session.user) return null;
      return getSchedule(params.year || new Date().getFullYear());
    },

    survey: async (_, _params, ctx) => {
      if (!ctx.session.user) return null;
      return await getTeachingPreferenceSurvey();
    },
  },
  Mutation: {
    login: async (_, params, ctx) => {
      if (ctx.session.user) return alreadyLoggedIn;
      return await login(ctx, params.username, params.password);
    },
    logout: async (_, _params, ctx) => {
      if (!ctx.session.user) return noLogin;
      await ctx.logout();
      return {
        token: '',
        success: true,
        message: 'Logged out',
      };
    },
    changeUserPassword: async (_, _params, ctx) => {
      if (!ctx.session.user) return noLogin;
      return changePassword(ctx.session.user, _params.input);
    },
    createUser: async (_, { username }, ctx) => {
      if (!ctx.session.user) return noLogin;
      else if (!utils.isAdmin(ctx.session.user)) return noPerms;
      return await createNewUser(username);
    },
    generateSchedule: async (_, { input }, ctx) => {
      if (!ctx.session.user) return noLogin;
      else if (!utils.isAdmin(ctx.session.user)) return noPerms; // Only Admin can generate schedule

      try {
        const baseUrl = 'https://schedulater-algorithm1.herokuapp.com';
        const response = await axios.post<Schedule>(
          `${baseUrl}/generate`,
          minInput
        );
        const schedule = await prisma.schedule.create({
          data: {
            year: input.year,
          },
        });

        response.data.summerTermCourses?.forEach(async (course) => {
          let days = appendDay(course.meetingTime.monday, 'MONDAY', []);
          days = appendDay(course.meetingTime.tuesday, 'TUESDAY', days);
          days = appendDay(course.meetingTime.wednesday, 'WEDNESDAY', days);
          days = appendDay(course.meetingTime.thursday, 'THURSDAY', days);
          days = appendDay(course.meetingTime.friday, 'FRIDAY', days);
          days = appendDay(course.meetingTime.saturday, 'SATURDAY', days);
          days = appendDay(course.meetingTime.sunday, 'SUNDAY', days);

          const startDate = getTime(course.meetingTime.beginTime);
          startDate.setFullYear(input.year, 4, 1);
          const endDate = getTime(course.meetingTime.endtime);
          endDate.setFullYear(input.year, 7, 1);

          await prisma.course.upsert({
            create: {
              courseCode: course.courseNumber,
              title: course.courseTitle,
              subject: course.subject,
              term: 'SUMMER',
              courseSection: {
                create: {
                  sectionNumber: course.sequenceNumber,
                  capacity: 0,
                  startDate,
                  endDate,
                  hoursPerWeek: course.meetingTime.hoursWeek,
                  schedule: { connect: { id: schedule.id } },
                  meetingTime: {
                    create: {
                      startTime: startDate,
                      endTime: endDate,
                      days: days as any[],
                    },
                  },
                },
              },
            },
            update: {
              courseSection: {
                create: {
                  sectionNumber: course.sequenceNumber,
                  capacity: 0,
                  startDate,
                  endDate,
                  hoursPerWeek: course.meetingTime.hoursWeek,
                  schedule: { connect: { id: schedule.id } },
                  meetingTime: {
                    create: {
                      startTime: startDate,
                      endTime: endDate,
                      days: days as any[],
                    },
                  },
                },
              },
            },
            where: {
              subject_courseCode_term: {
                courseCode: course.courseNumber,
                subject: course.subject,
                term: 'SUMMER',
              },
            },
          });
        });

        console.info(JSON.stringify(response.data, null, 2));
      } catch (e) {
        console.error(e);
        return EncounteredError;
      }

      return generateSchedule(input);
    },
    
    createTeachingPreference: async (_, _params, ctx) =>{
      if (!ctx.session.user) return noLogin;
      console.log(_params.input);
      return await createTeachingPreference(ctx.session.user, _params.input);
    },
    
  },
};
