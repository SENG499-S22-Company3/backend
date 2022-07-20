import { AxiosError } from 'axios';
import {
  changePassword,
  createNewUser,
  generateSchedule,
  login,
  resetPassword,
} from '../auth';
import { Context } from '../context';
import { getAllCourses } from '../prisma/course';
import { findUserById } from '../prisma/user';
import { updateCurrentSchedule } from '../prisma/schedule';
import { Resolvers, Term, Company } from '../schema';
import * as utils from '../utils';
import {
  createSchedule,
  generateScheduleWithCapacities,
  getAll,
  getCourseCapacities,
  getCourses,
  getMe,
  getSchedule,
  getUserByID,
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

const apiErrorHandler = (alg: string, e: unknown) => {
  console.error(e);
  if (e instanceof AxiosError) {
    return {
      message: `API call error: Bad response from algorithm ${alg}:${e.message}:${e.response?.data}`,
      success: false,
    };
  } else
    return {
      message: `Backend ran into an internal server error:\n${e}`,
      success: false,
    };
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

      const users = await getAll();

      let capacityDataResponse;
      try {
        capacityDataResponse = await getCourseCapacities(
          ctx,
          input.summerCourses ?? [],
          input.springCourses ?? [],
          input.fallCourses ?? [],
          input.algorithm2
        );
      } catch (e) {
        return apiErrorHandler('2', e);
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

      let scheduleResponse;
      try {
        scheduleResponse = await generateScheduleWithCapacities(
          ctx,
          input,
          input.fallCourses ?? [],
          input.summerCourses ?? [],
          input.springCourses ?? [],
          users,
          capacityDataResponse.data
        );
      } catch (e) {
        return apiErrorHandler('1', e);
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
      const err = [];
      if (!input.skipValidation && input.validation === Company.Company3) {
        console.log('Validating schedule...');
        const users = await getAll();
        let validation;
        try {
          validation = await checkSchedule(ctx, input, users);
        } catch (error) {
          console.log(`Failed to validate schedule: '${error}'`);
          err.push(error); // can be sent to updateCurrentSchedule function
        }

        if (!validation?.data) {
          return {
            success: false,
            message: 'Error: No response from algorithm 1',
            // errors: err,
          };
        } else if (validation.data.match(/Error:/)) {
          return {
            success: false,
            message: validation.data,
          };
        }

        console.log('ALG 1 checkSchedule response below');
        console.log(validation.data);
        console.log('END ALG 1 checkSchedule RESPONSE');
      }

      return await updateCurrentSchedule(input.id, input.courses);
    },
  },
};
