import { Context } from '../context';
import { Resolvers } from '../schema';
import { Algorithm1Api } from '../clientAPI/openapi/algorithm1/api';
// import { Algorithm2API } from '../clientAPI/openapi/algorithm2/api';
import {
  login,
  createNewUser,
  changePassword,
  generateSchedule,
} from '../auth';
import * as utils from '../utils';
import { getSchedule, getCourses, getMe, getUserByID } from './resolverUtils';

// Instanciate api clients
const apiClientAlg1: Algorithm1Api = new Algorithm1Api();
// const apiClientAlg2: Algorithm2API = new Algorithm2API();

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

    generateSchedule: async (_, _params, ctx) => {
      if (!ctx.session.user) return noLogin;
      else if (!utils.isAdmin(ctx.session.user)) return noPerms; // Only Admin can generate schedule

      // Call Algorithm 1 API
      // schedulePost requires 3 parameters - {Historic data}, {coursesToSchedule} & [professors]
      const response = apiClientAlg1.schedulePost();
      console.log('Response from Alg1', response);
      if (!response) return EncounteredError;

      return generateSchedule(_params.input);
    },
  },
};
