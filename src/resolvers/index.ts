import { Context } from '../context';
import { Resolvers } from '../schema';

import {
  login,
  createNewUser,
  changePassword,
  generateSchedule,
} from '../auth';
import * as utils from '../utils';
import {
  getSchedule,
  getCourses,
  getMe,
  getAll,
  getUserByID,
} from './resolverUtils';
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
    allUsers: async (_, _params, ctx) => {
      if (!ctx.session.user || !utils.isAdmin(ctx.session.user)) return null;
      return await getAll();
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

      const res = await ctx.algorithm.algo1.company3.schedulePost({
        coursesToSchedule: {
          fallCourses: [],
          springCourses: [],
          summerCourses: [
            {
              courseNumber: '440',
              subject: 'SENG',
              sequenceNumber: 'A01',
              courseTitle: 'Embedded Systems',
              courseCapacity: 0,
              numSections: 1,
            },
            {
              courseNumber: '499',
              subject: 'SENG',
              sequenceNumber: 'A01',
              courseTitle: 'Design Project II',
              courseCapacity: 0,
              numSections: 1,
            },
          ],
        },
        hardScheduled: {
          fallCourses: [],
          springCourses: [],
          summerCourses: [],
        },
        // professors: [
        //   {
        //     displayName: 'John Doe',
        //     preferences: [
        //       {
        //         courseNum: '499',
        //         term: 'FALL',
        //         preferenceNum: 1,
        //       },
        //     ],
        //     fallTermCourses: 1,
        //   },
        // ],
        professors: (
          await prisma.teachingPreference.findMany({
            include: {
              coursePreference: {
                include: {
                  course: true,
                },
              },
              User: true,
            },
          })
        )
          .map((pref) => ({
            displayName: pref.User?.displayName,
            preferences: pref.coursePreference?.map((p) => ({
              courseNum: p.course.subject + p.course.courseCode,
              term: p.course.term,
              preferenceNum: p.preference,
            })),
          }))
          .filter((p) => p.preferences.length > 0 || !p.displayName) as any,
      });
      console.log(res.statusText);
      console.log(res.data);

      try {
        const baseUrl = 'https://schedulater-algorithm1.herokuapp.com';
        const response = await axios.post<Schedule>(
          `${baseUrl}/schedule`,
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
              streamSequence: utils.getSeqNumber(
                course.subject,
                course.courseNumber
              ),
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
  },
};
