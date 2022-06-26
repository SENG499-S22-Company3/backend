import { Context } from '../context';
import { Resolvers } from '../schema';

import {
  login,
  createNewUser,
  changePassword,
  generateSchedule,
} from '../auth';
import * as utils from '../utils';
import { getSchedule, getCourses, getMe, getUserByID } from './resolverUtils';
import { prisma } from '../prisma';

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
    courses: async (_, params, ctx) => {
      if (!ctx.session.user || !params.term) return null;
      return await getCourses(params.term);
    },
    schedule: async (_, params, ctx) => {
      if (!ctx.session.user) return null;
      return getSchedule(params.year || new Date().getFullYear());
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
        // TODO: fill out empty arrays
        const response = await ctx.algorithm1.schedulePost({
          hardScheduled: [],
          coursesToSchedule: [],
          professors: [],
        });

        console.log(JSON.stringify(response.data));
        // TODO: store response in database
        await prisma.schedule.create({
          data: {
            year: input.year,

            courseSection: {
              createMany: {
                data: [],
                skipDuplicates: true,
              },
            },
          },
        });
      } catch (e) {
        return EncounteredError;
      }

      return generateSchedule(input);
    },
  },
};
