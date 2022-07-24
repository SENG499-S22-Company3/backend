import { AxiosError, AxiosResponse } from 'axios';
import {
  changePassword,
  createNewUser,
  generateSchedule,
  login,
  resetPassword,
} from '../auth';
import { Schedule } from '../client/algorithm1';
import { CourseObject } from '../client/algorithm2';
import { Context } from '../context';
import { getAllCourses } from '../prisma/course';
import { findUserById } from '../prisma/user';
import { updateCurrentSchedule } from '../prisma/schedule';
import { Resolvers, Term, Company } from '../schema';
import * as utils from '../utils';
import {
  createSchedule,
  getAll,
  getCourses,
  getMe,
  getSchedule,
  getUserByID,
  prepareCourseCapacities,
  prepareScheduleWithCapacities,
  updateUserSurvey,
  checkSchedule,
} from './resolverUtils';

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

const noResponse = {
  success: false,
  message: 'Error: No response from algorithm 1',
  errors: ['Error: No response from algorithm 1'],
};

const apiErrorHandler = (id: string, e: unknown, data: any = {}) => {
  console.error(id, e);
  if (e instanceof AxiosError) {
    const error = {
      message: `${id}: API call error: Bad Response:${e.message}:${e.response?.data}`,
      status: e.response?.status,
      ...data,
    };
    return {
      message: JSON.stringify(error),
      success: false,
    };
  } else {
    const error = {
      message: `${id}: Backend ran into an internal server error:\n${e}`,
    };
    return {
      message: JSON.stringify(error),
      success: false,
    };
  }
};

export const resolvers: Resolvers<Context> = {
  Query: {
    me: async (_, _params, ctx) => {
      if (!ctx.user) return null;
      return await getMe(ctx.user);
    },
    findUserById: async (_, params, ctx) => {
      if (!ctx.user || !params.id) return null;
      return await getUserByID(+params.id);
    },
    survey: async (_, __, ctx) => {
      if (!ctx.user) return { courses: [] };

      const courses = (await getAllCourses()).map((c) => ({
        ...c,
        code: c.courseCode,
        term:
          c.term === 'FALL'
            ? Term.Fall
            : c.term === 'SPRING'
            ? Term.Spring
            : Term.Summer,
      }));

      return {
        courses,
      };
    },
    courses: async (_, params, ctx) => {
      if (!ctx.user || !params.term) return null;
      return await getCourses(params.term);
    },
    schedule: async (_, params, ctx) => {
      if (!ctx.user) return null;
      return getSchedule(params.year || new Date().getFullYear());
    },
    allUsers: async (_, _params, ctx) => {
      if (!ctx.user || !utils.isAdmin(ctx.user)) return null;
      return await getAll();
    },
  },
  Mutation: {
    login: async (_, params, ctx) => {
      if (ctx.user) return alreadyLoggedIn;
      return await login(ctx, params.username, params.password);
    },
    logout: async () => {
      return {
        success: true,
        message: 'logged out',
        token: '',
      };
    },
    changeUserPassword: async (_, _params, ctx) => {
      if (!ctx.user) return noLogin;
      return changePassword(ctx.user, _params.input);
    },
    resetPassword: async (_, _params, ctx) => {
      if (!ctx.user) return noLogin;
      else if (!utils.isAdmin(ctx.user)) return noPerms;
      return await resetPassword(_params.id);
    },
    createUser: async (_, { username }, ctx) => {
      if (!ctx.user) return noLogin;
      else if (!utils.isAdmin(ctx.user)) return noPerms;
      return await createNewUser(username);
    },
    createTeachingPreference: async (_, { input }, ctx) => {
      if (!ctx.user) return noLogin;

      if (ctx.user.preference.length !== 0) {
        return {
          token: '',
          success: false,
          message:
            'Teaching preferences survey has already been submitted for this user',
        };
      }

      await updateUserSurvey(ctx.user.id, input);

      // refresh the context user when they update their preferences
      const refreshedUser = await findUserById(ctx.user.id);
      // should never be null but just in case
      if (refreshedUser !== null) {
        ctx.user = refreshedUser;
      }

      return {
        token: '',
        success: true,
        message: 'Teaching preferences updated.',
      };
    },
    generateSchedule: async (_, { input }, ctx) => {
      if (!ctx.user) return noLogin;
      else if (!utils.isAdmin(ctx.user)) return noPerms; // Only Admin can generate schedule

      let capacityDataResponse: AxiosResponse<CourseObject[], any> | null;
      const algo2Payload = prepareCourseCapacities(input);
      if (algo2Payload === null) {
        return {
          success: false,
          message: 'No courses selected',
        };
      }

      try {
        capacityDataResponse = await ctx
          .algorithm(input.algorithm2)
          .algo2(algo2Payload);
      } catch (e) {
        return apiErrorHandler(`ALGORITHM2_${input.algorithm2}`, e, {
          algorithm2: {
            request: algo2Payload,
          },
        });
      }

      if (!capacityDataResponse) {
        return {
          success: false,
          message: 'Error: No Courses Input',
        };
      }

      console.log('ALG 2 RESPONSE DATA');
      console.log(capacityDataResponse.data);
      console.log('END ALG 2 RESPONSE DATA');

      let scheduleResponse: AxiosResponse<Schedule, any> | null;
      const algo1Payload = await prepareScheduleWithCapacities(
        input,
        capacityDataResponse.data
      );
      try {
        scheduleResponse = await ctx
          .algorithm(input.algorithm1)
          .algo1(algo1Payload);
      } catch (e) {
        return apiErrorHandler(`ALGORITHM1_${input.algorithm1}`, e, {
          algorithm2: {
            request: algo2Payload,
            response: capacityDataResponse.data,
          },
          algorithm1: {
            request: algo1Payload,
          },
        });
      }

      if (!scheduleResponse?.data) {
        return {
          success: false,
          message: 'Error: No response from algorithm 1',
        };
      }

      console.log('ALG 1 RESPONSE DATA');
      console.log(scheduleResponse.data);
      console.log('END ALG 1 RESPONSE DATA');

      try {
        await createSchedule(input.year, scheduleResponse.data);
      } catch (e) {
        console.log(`Failed to generate schedule: '${e}'`);
        return {
          success: false,
          message: 'backend failed to insert generated schedule into database',
        };
      }

      return generateSchedule(input);
    },
    updateSchedule: async (_, { input }, ctx) => {
      if (!ctx.user) return noLogin;
      else if (!utils.isAdmin(ctx.user)) return noPerms; // Only Admin can update schedule
      // const err = [];
      if (!input.skipValidation && input.validation === Company.Company3) {
        console.log('Validating schedule...');

        let validation: AxiosResponse<String, any> | undefined;
        const algo1CSPayload = await checkSchedule(input);
        if (algo1CSPayload === null) {
          return noResponse;
        }
        try {
          validation = await ctx
            .algorithm(Company.Company3)
            .algo1Cs?.(algo1CSPayload);
          console.log('RESPONSE: ', validation?.status);
        } catch (error) {
          return apiErrorHandler(`ALGORITHM1_${Company.Company3}`, error, {
            algorithm1: {
              request: algo1CSPayload,
              response: validation?.data,
            },
          });
        }

        if (!validation?.data) {
          return noResponse;
        } else if (validation.data.match(/violation/)) {
          return {
            success: false,
            message: String(validation.data),
            errors: [String(validation.data)],
          };
        }

        // console.log('ALG 1 checkSchedule response below');
        console.log(validation.data);
        // console.log('END ALG 1 checkSchedule RESPONSE');
      }

      return await updateCurrentSchedule(input.id, input.courses);
    },
  },
};
