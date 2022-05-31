import { Context } from "../context";
import { Resolvers } from "../schema";

export const resolvers: Resolvers<Context> = {
  Query: {
    me: (_, c, { username }) => {
      return null;
    },
  },
  Mutation: {
    login: () => {
      return {
        token: "",
        success: false,
        message: "Not implemented",
      };
    },
    logout: () => {
      return {
        token: "",
        success: false,
        message: "Not implemented",
      };
    },
  },
};
