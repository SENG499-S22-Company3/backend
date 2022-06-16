import { Context } from '../context';
import { Resolvers } from '../schema';
import type { AuthPayload } from '../schema';
import { login, createNewUser, changePassword, isAdmin } from '../auth';

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
      console.log(ctx.session.username);
      return null;
    },
  },
  Mutation: {
    login: async (_, params, ctx) => {
      if (ctx.session.username) return alreadyLoggedIn;

      //const loginResult: AuthPayload = await login(params.username, params.password, ctx);

     // if (loginResult.success) {
     //   // set user in session
     //   ctx.session.username = params.username;
     // }
     // return loginResult;

      return await ctx.login(params.username, params.password);
    },
    logout: async (_, _params, ctx) => {
      if (!ctx.session.username) return noLogin;
      else {
        await ctx.logout();
        return {
          token: '',
          success: true,
          message: 'Logged out',
        };
      };
    },
    changeUserPassword: async (_, _params, ctx) => {
      if (!ctx.session.username) return noLogin;
      else return changePassword(ctx.session.username, _params.input);
    },
    createUser: async (_, _params, ctx) => {
      if (!ctx.session.username) return noLogin;
      else if (! await isAdmin(ctx.session.username)) return noPerms;
      else return await createNewUser(_params.username);
    },
  },
};
