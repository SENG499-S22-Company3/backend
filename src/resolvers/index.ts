import { Context } from '../context';
import { Resolvers } from '../schema';
import { login, createNewUser, changePassword } from '../auth';
import * as utils from '../utils';
import { getSchedule, getCourses, getMe, getUserByID } from './resolverUtils';

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

export const resolvers: Resolvers<Context> = {
  Query: {
    me: async (_, _params, ctx) => {
      let username;
      if (!ctx.session.user) return null;
      else if (!ctx.session.user.username) return null;
      else username = ctx.session.user.username;

      return await getMe(username);
    },
    findUserById: async (_, _params, ctx) => {
      if (!ctx.session.user) return null;
      else if (!_params.id) return null;
      else return await getUserByID(+_params.id);
    },
    courses: async (_, _params, ctx) => {
      if (!ctx.session.user) return null;
      else if (!_params.term) return null;
      else return [await getCourses(_params.term)];
    },
    schedule: async (_, _params, ctx) => {
      if (!ctx.session.user) return null;
      else return getSchedule(_params.year || undefined);
    },
  },
  Mutation: {
    login: async (_, params, ctx) => {
      if (ctx.session.user) return alreadyLoggedIn;
      else return await login(ctx, params.username, params.password);
    },
    logout: async (_, _params, ctx) => {
      if (!ctx.session.user) return noLogin;
      else {
        await ctx.logout();
        return {
          token: '',
          success: true,
          message: 'Logged out',
        };
      }
    },
    changeUserPassword: async (_, _params, ctx) => {
      if (!ctx.session.user) return noLogin;
      else return changePassword(ctx.session.user, _params.input);
    },
    createUser: async (_, _params, ctx) => {
      if (!ctx.session.user) return noLogin;
      else if (!(await utils.isAdmin(ctx.session.user))) return noPerms;
      else return await createNewUser(_params.username);
    },
  },
};
