import { Context } from '../context';
import { Resolvers } from '../schema';
import { login, createNewUser, changePassword } from '../auth';
import * as utils from '../utils';

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
    me: (_, _params, ctx) => {
      if (!ctx.session.user) return null;
      console.log(ctx.session.user.username);
      return null;
    },
  },
  Mutation: {
    login: async (_, params, ctx) => {
      if (ctx.session.user) return alreadyLoggedIn;
      else return await login(params.username, params.password, ctx);
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
