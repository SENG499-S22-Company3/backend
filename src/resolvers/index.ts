import { Context } from "../context";
import { Resolvers } from "../schema";
import type { AuthPayload } from '../schema';
import { verify } from '../auth';

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
      ctx.session.username = params.username;
      const verified: AuthPayload = await verify(params.username, params.password);
      return verified;
    },
    logout: async (_, _params, ctx) => {
      if (ctx.session.username) {
        await ctx.logout();
        return {
          token: "",
          success: true,
          message: "Logged out",
        };
      }
      return {
        token: "",
        success: false,
        message: "Not logged in",
      };
    },
  },
};
