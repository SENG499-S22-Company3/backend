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
      const verified: AuthPayload = await login(params.username, params.password);
      // not logged in
      // return an error
      ctx.session.username = params.username;
      return verified;
    },
    logout: async (_, _params, ctx) => {
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
  },
};
