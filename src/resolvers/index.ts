import { Context } from "../context";
import { Resolvers } from "../schema";
import type { AuthPayload } from '../schema';
import { login, logout } from '../auth';

export const resolvers: Resolvers<Context> = {
  Query: {
    me: (_, _params, ctx) => {
      console.log(ctx.session.username);
      return null;
    },
  },
  Mutation: {
    login: async (_, params, ctx) => {
      console.log('params: ', JSON.stringify(params));
      // set user in session
      const loginResult: AuthPayload = await login(params.username, params.password);
      if (loginResult.success) {
        ctx.session.username = params.username;
      }
      return loginResult;
    },
    logout: async (_, _params, ctx) => {
      console.log("Logging out");
      if (ctx.session.username) {
        await ctx.logout();
        return {
          token: '',
          success: true,
          message: 'Logged out',
        };
      } else {
        return {
          token: '',
          success: true,
          message: 'Not logged in',
        };
      }
    },
    createUser: async (_, _params, ctx) => {
      //DUMMY RESOLVER TEST
      return {
        success: false,
        message: "",
        username: _params.username,
        password: "",
      };
    },
  },
};
