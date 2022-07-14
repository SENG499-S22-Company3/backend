import { AxiosError } from 'axios';
import {
  changePassword,
  createNewUser,
  generateSchedule,
  login,
  logout,
  resetPassword,
} from '../auth';
import { Context } from '../context';
import { getAllCourses } from '../prisma/course';
import { findUserById } from '../prisma/user';
import { CourseInput, Resolvers, Term } from '../schema';
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
      message: `API call error: Bad response from algorithm ${alg}:\n${e.message}`,
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
      if (!ctx.req.user) return null;
      return await getMe(ctx);
    },
    findUserById: async (_, params, ctx) => {
      if (!ctx.req.user || !params.id) return null;
      return await getUserByID(+params.id);
    },
    survey: async (_, __, ctx) => {
      if (!ctx.req.user) return { courses: [] };

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
      if (!ctx.req.user || !params.term) return null;
      return await getCourses(params.term);
    },
    schedule: async (_, params, ctx) => {
      if (!ctx.req.user) return null;
      return getSchedule(params.year || new Date().getFullYear());
    },
    allUsers: async (_, _params, ctx) => {
      if (!ctx.req.user || !utils.isAdmin(ctx.req.user)) return null;
      return await getAll();
    },
  },
  Mutation: {
    login: async (_, params, ctx) => {
      if (ctx.req.user) return alreadyLoggedIn;
      return await login(ctx, params.username, params.password);
    },
    logout: async (_, _params, ctx) => {
      if (!ctx.req.user) return noLogin;
      return await logout(ctx);
    },
    changeUserPassword: async (_, _params, ctx) => {
      if (!ctx.req.user) return noLogin;
      return changePassword(ctx.req.user, _params.input);
    },
    resetPassword: async (_, _params, ctx) => {
      if (!ctx.req.user) return noLogin;
      else if (!utils.isAdmin(ctx.req.user)) return noPerms;
      return await resetPassword(_params.id);
    },
    createUser: async (_, { username }, ctx) => {
      if (!ctx.req.user) return noLogin;
      else if (!utils.isAdmin(ctx.req.user)) return noPerms;
      return await createNewUser(username);
    },
    createTeachingPreference: async (_, { input }, ctx) => {
      if (!ctx.req.user) return noLogin;

      if (ctx.req.user.preference.length !== 0) {
        return {
          token: '',
          success: false,
          message:
            'Teaching preferences survey has already been submitted for this user',
        };
      }

      await updateUserSurvey(ctx.req.user.id, input);

      // refresh the context user when they update their preferences
      const refreshedUser = await findUserById(ctx.req.user.id);
      // should never be null but just in case
      if (refreshedUser !== null) {
        ctx.req.user = refreshedUser;
      }

      return {
        token: '',
        success: true,
        message: 'Teaching preferences updated.',
      };
    },
    generateSchedule: async (_, { input }, ctx) => {
      if (!ctx.req.user || !input.courses) return noLogin;
      else if (!utils.isAdmin(ctx.req.user)) return noPerms; // Only Admin can generate schedule

      const falltermCourses: CourseInput[] =
        input.term == Term.Fall ? input.courses : [];
      const springtermCourses: CourseInput[] =
        input.term == Term.Spring ? input.courses : [];
      const summertermCourses: CourseInput[] =
        input.term == Term.Summer ? input.courses : [];
      const users = await getAll();

      let capacityDataResponse;
      try {
        capacityDataResponse = await getCourseCapacities(ctx, input);

        if (!capacityDataResponse) {
          return {
            message: 'Algorithm 2 error: No data returned',
            success: false,
          };
        }

        console.log(capacityDataResponse.data);
      } catch (e) {
        return apiErrorHandler('2', e);
      }

      try {
        const scheduleResponse = await generateScheduleWithCapacities(
          ctx,
          input,
          falltermCourses,
          summertermCourses,
          springtermCourses,
          users,
          capacityDataResponse.data
        );
        console.log(scheduleResponse.data);

        await createSchedule(input.year, input.term, scheduleResponse.data);
        // console.info(JSON.stringify(algorithm1Data.data, null, 2));
      } catch (e) {
        return apiErrorHandler('1', e);
      }

      return generateSchedule(input);
    },
  },
};
