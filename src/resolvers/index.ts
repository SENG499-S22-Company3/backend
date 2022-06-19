import { Context } from '../context';
import { CourseId, Resolvers, Role } from '../schema';
import { prisma, lookupUser } from '../prisma';
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
    me: async (_, _params, ctx) => {
      const user = await prisma.user.findUnique({
        where: { username: ctx.session.user?.username }, //replace testuser with session.username?
      });
      if (!user) return null;

      return {
        id: user.id,
        username: user.username,
        password: user.password,
        role: user.role as Role,
        preferences: [],
        active: user.active
      };
    },
    findUserById: async (_, _params, ctx) => {

      const finduser = await prisma.user.findUnique({
        where: { id: +_params.id},
      });

      if (!finduser) return null;

      return {
        id: finduser.id,
        username: finduser.username,
        password: finduser.password,
        role: finduser.role as Role,
        preferences: [],
        active: finduser.active
      };

    },
    courses: async (_, _params, ctx) => {
     
      const courses = await prisma.course.findMany({
          where: { term: _params.term || undefined },
          include: { courseSection: true, coursePreference: true}
      });

      
      return [{
        CourseID: courses[0].courseSection[0].courseId as unknown as CourseId,
        hoursPerWeek: courses[0].courseSection[0].hoursPerWeek,
        capacity: courses[0].courseSection[0].capacity,
        professors: [], 
        startDate: courses[0].courseSection[0].startDate,
        endDate: courses[0].courseSection[0].endDate,
        meetingTimes: []
      }]
    
      
    },
    schedule: async (_, _params, ctx) => {
     
      const schedule = await prisma.schedule.findUnique({
          where: {},
          include: {courseSection: true}
      });

      if (!schedule) return null;

      return{
        id: "test", // schedule.id.toString not working
        year: schedule.year,
        createdAt: schedule.createdOn,
        courses: []

      }
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
