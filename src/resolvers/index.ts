import { Context } from '../context';
import { Resolvers, Term } from '../schema';
import { AxiosError } from 'axios';
import {
  login,
  createNewUser,
  changePassword,
  generateSchedule,
  resetPassword,
} from '../auth';
import * as utils from '../utils';
import {
  getSchedule,
  getCourses,
  getMe,
  getAll,
  getUserByID,
  getCourseCapacities,
  generateScheduleWithCapacities,
  createSchedule,
  updateUserSurvey,
} from './resolverUtils';
import { findUserById } from '../prisma/user';
import { getAllCourses } from '../prisma/course';
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
      if (!ctx.session.user || !ctx.session.user.username) return null;
      return await getMe(ctx);
    },
    findUserById: async (_, params, ctx) => {
      if (!ctx.session.user || !params.id) return null;
      return await getUserByID(+params.id);
    },
    survey: async (_, __, ctx) => {
      if (!ctx.session.user) return { courses: [] };

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
    resetPassword: async (_, _params, ctx) => {
      if (!ctx.session.user) return noLogin;
      else if (!utils.isAdmin(ctx.session.user)) return noPerms;
      return await resetPassword(_params.id);
    },
    createUser: async (_, { username }, ctx) => {
      if (!ctx.session.user) return noLogin;
      else if (!utils.isAdmin(ctx.session.user)) return noPerms;
      return await createNewUser(username);
    },
    createTeachingPreference: async (_, { input }, ctx) => {
      if (!ctx.session.user) return noLogin;

      if (ctx.session.user.preference.length !== 0) {
        return {
          token: '',
          success: false,
          message:
            'Teaching preferences survey has already been submitted for this user',
        };
      }

      await updateUserSurvey(ctx.session.user.id, input);

      // refresh the context user when they update their preferences
      const refreshedUser = await findUserById(ctx.session.user.id);
      // should never be null but just in case
      if (refreshedUser !== null) {
        ctx.session.user = refreshedUser;
      }

      return {
        token: '',
        success: true,
        message: 'Teaching preferences updated.',
      };
    },
    generateSchedule: async (_, { input }, ctx) => {
      if (!ctx.session.user) return noLogin;
      else if (!utils.isAdmin(ctx.session.user)) return noPerms; // Only Admin can generate schedule

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
  },
};
