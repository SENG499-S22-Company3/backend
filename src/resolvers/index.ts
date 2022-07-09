import { Context } from '../context';
import { CourseInput, Resolvers, Term } from '../schema';
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

      const courses = (
        await Promise.all([
          getCourses(Term.Fall),
          getCourses(Term.Spring),
          getCourses(Term.Summer),
        ])
      )
        .flatMap((p) => p ?? [])
        .map((c) => c.CourseID);

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
      if (!ctx.session.user || !input.courses) return noLogin;
      else if (!utils.isAdmin(ctx.session.user)) return noPerms; // Only Admin can generate schedule

      const falltermCourses: CourseInput[] =
        input.term == Term.Fall ? input.courses : [];
      const springtermCourses: CourseInput[] =
        input.term == Term.Spring ? input.courses : [];
      const summertermCourses: CourseInput[] =
        input.term == Term.Summer ? input.courses : [];
      const users = await getAll();

      try {
        const capacityDataResponse = await getCourseCapacities(ctx, input);

        if (!capacityDataResponse) return EncounteredError;

        console.log(capacityDataResponse.data);
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
        console.error(e);
        return EncounteredError;
      }

      return generateSchedule(input);
    },
  },
};
