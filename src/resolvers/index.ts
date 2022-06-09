import { Context } from "../context";
import { Resolvers } from "../schema";

export const resolvers: Resolvers<Context> = {
  Query: {
    me: (_, _params, ctx) => {
      console.log(ctx.session.username);
      return null;
    },
  },
  Mutation: {
    login: (_, params, ctx) => {
      console.log("params: ", JSON.stringify(params));
      // set user in session
      ctx.session.username = params.username;
      return {
        token: "",
        success: false,
        message: "Not implemented",
      };
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
