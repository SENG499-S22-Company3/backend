import { Context } from "../context";
import { Resolvers } from "../schema";

export const resolvers: Resolvers<Context> = {
  Query: {
    me: (_, _params, _context) => {
      return null;
    },
  },
  Mutation: {
    login: (_, params, _ctx) => {
      console.log("params: ", JSON.stringify(params));
      return {
        token: "",
        success: false,
        message: "Not implemented",
      };
    },
    logout: (_, params, ctx) => {
      console.log("username:" + ctx.username);
      console.log("params:" + JSON.stringify(params));
      return {
        token: "",
        success: false,
        message: "Not implemented",
      };
    },
  },
};
