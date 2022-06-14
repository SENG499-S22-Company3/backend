import { Context } from "../context";
import { Day, Resolvers, Role, Term } from "../schema";
import type { AuthPayload } from "../schema";
import { login, createNewUser, changePassword, isAdmin } from "../auth";

const noLogin = {
  success: false,
  message: "Not logged in",
  token: "",
};

const alreadyLoggedIn = {
  success: false,
  message: "Already logged in",
  token: "",
};

const noPerms = {
  message: "Insufficient permisions",
  success: false,
};

export const resolvers: Resolvers<Context> = {
  Query: {
    me: (_, _params, ctx) => {
      console.log(ctx.session.username);
      return null;
    },
    courses: (_, params) => {
      const fall = [
        {
          CourseID: {
            subject: "CHEM",
            code: "101",
            term: Term.Fall,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Sep 05, 2018",
          endDate: "Dec 05, 2018",
          meetingTimes: [
            {
              day: Day.Monday,
              startTime: "1300",
              endTime: "1420",
            },
            {
              day: Day.Thursday,
              startTime: "1300",
              endTime: "1420",
            },
          ],
        },
        {
          CourseID: {
            subject: "CHEM",
            code: "101",
            term: Term.Fall,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Sep 05, 2018",
          endDate: "Dec 05, 2018",
          meetingTimes: [
            {
              day: Day.Tuesday,
              startTime: "0930",
              endTime: "1020",
            },
            {
              day: Day.Wednesday,
              startTime: "0930",
              endTime: "1020",
            },
            {
              day: Day.Friday,
              startTime: "0930",
              endTime: "1020",
            },
          ],
        },
        {
          CourseID: {
            subject: "CHEM",
            code: "101",
            term: Term.Fall,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Sep 05, 2018",
          endDate: "Dec 05, 2018",
          meetingTimes: [
            {
              day: Day.Tuesday,
              startTime: "1230",
              endTime: "1320",
            },
            {
              day: Day.Wednesday,
              startTime: "1230",
              endTime: "1320",
            },
            {
              day: Day.Friday,
              startTime: "1230",
              endTime: "1320",
            },
          ],
        },
        {
          CourseID: {
            subject: "PHYS",
            code: "110",
            term: Term.Fall,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Sep 05, 2018",
          endDate: "Dec 05, 2018",
          meetingTimes: [
            {
              day: Day.Tuesday,
              startTime: "1030",
              endTime: "1120",
            },
            {
              day: Day.Wednesday,
              startTime: "1030",
              endTime: "1120",
            },
            {
              day: Day.Friday,
              startTime: "1030",
              endTime: "1120",
            },
          ],
        },
        {
          CourseID: {
            subject: "PHYS",
            code: "110",
            term: Term.Fall,
          },
          hoursPerWeek: 1.5,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Nov 17, 2018",
          endDate: "Nov 17, 2018",
          meetingTimes: [
            {
              day: Day.Saturday,
              startTime: "1400",
              endTime: "1530",
            },
          ],
        },
        {
          CourseID: {
            subject: "PHYS",
            code: "110",
            term: Term.Fall,
          },
          hoursPerWeek: 1.5,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Nov 17, 2018",
          endDate: "Nov 17, 2018",
          meetingTimes: [
            {
              day: Day.Saturday,
              startTime: "1400",
              endTime: "1530",
            },
          ],
        },
        {
          CourseID: {
            subject: "PHYS",
            code: "110",
            term: Term.Fall,
          },
          hoursPerWeek: 1.5,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Nov 17, 2018",
          endDate: "Nov 17, 2018",
          meetingTimes: [
            {
              day: Day.Saturday,
              startTime: "1400",
              endTime: "1530",
            },
          ],
        },
        {
          CourseID: {
            subject: "SENG",
            code: "265",
            term: Term.Fall,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Sep 05, 2018",
          endDate: "Dec 05, 2018",
          meetingTimes: [
            {
              day: Day.Wednesday,
              startTime: "1000",
              endTime: "1120",
            },
            {
              day: Day.Friday,
              startTime: "1000",
              endTime: "1120",
            },
          ],
        },
        {
          CourseID: {
            subject: "SENG",
            code: "265",
            term: Term.Fall,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Sep 05, 2018",
          endDate: "Dec 05, 2018",
          meetingTimes: [
            {
              day: Day.Wednesday,
              startTime: "1000",
              endTime: "1120",
            },
            {
              day: Day.Friday,
              startTime: "1000",
              endTime: "1120",
            },
          ],
        },
        {
          CourseID: {
            subject: "SENG",
            code: "321",
            term: Term.Fall,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Sep 05, 2018",
          endDate: "Dec 05, 2018",
          meetingTimes: [
            {
              day: Day.Monday,
              startTime: "1000",
              endTime: "1120",
            },
            {
              day: Day.Thursday,
              startTime: "1000",
              endTime: "1120",
            },
          ],
        },
        {
          CourseID: {
            subject: "SENG",
            code: "350",
            term: Term.Fall,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Sep 05, 2018",
          endDate: "Dec 05, 2018",
          meetingTimes: [
            {
              day: Day.Monday,
              startTime: "1300",
              endTime: "1420",
            },
            {
              day: Day.Thursday,
              startTime: "1300",
              endTime: "1420",
            },
          ],
        },
        {
          CourseID: {
            subject: "SENG",
            code: "360",
            term: Term.Fall,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Sep 05, 2018",
          endDate: "Dec 05, 2018",
          meetingTimes: [
            {
              day: Day.Monday,
              startTime: "1600",
              endTime: "1650",
            },
            {
              day: Day.Wednesday,
              startTime: "1600",
              endTime: "1650",
            },
            {
              day: Day.Thursday,
              startTime: "1600",
              endTime: "1650",
            },
          ],
        },
        {
          CourseID: {
            subject: "SENG",
            code: "360",
            term: Term.Fall,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Sep 05, 2018",
          endDate: "Dec 05, 2018",
          meetingTimes: [
            {
              day: Day.Monday,
              startTime: "1600",
              endTime: "1650",
            },
            {
              day: Day.Wednesday,
              startTime: "1600",
              endTime: "1650",
            },
            {
              day: Day.Thursday,
              startTime: "1600",
              endTime: "1650",
            },
          ],
        },
        {
          CourseID: {
            subject: "SENG",
            code: "474",
            term: Term.Fall,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Sep 05, 2018",
          endDate: "Dec 05, 2018",
          meetingTimes: [
            {
              day: Day.Monday,
              startTime: "1130",
              endTime: "1250",
            },
            {
              day: Day.Thursday,
              startTime: "1130",
              endTime: "1250",
            },
          ],
        },
        {
          CourseID: {
            subject: "STAT",
            code: "260",
            term: Term.Fall,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Sep 05, 2018",
          endDate: "Dec 05, 2018",
          meetingTimes: [
            {
              day: Day.Monday,
              startTime: "1530",
              endTime: "1620",
            },
            {
              day: Day.Wednesday,
              startTime: "1530",
              endTime: "1620",
            },
            {
              day: Day.Thursday,
              startTime: "1530",
              endTime: "1620",
            },
          ],
        },
        {
          CourseID: {
            subject: "STAT",
            code: "260",
            term: Term.Fall,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Sep 05, 2018",
          endDate: "Dec 05, 2018",
          meetingTimes: [
            {
              day: Day.Tuesday,
              startTime: "1230",
              endTime: "1320",
            },
            {
              day: Day.Wednesday,
              startTime: "1230",
              endTime: "1320",
            },
            {
              day: Day.Friday,
              startTime: "1230",
              endTime: "1320",
            },
          ],
        },
      ];

      const spring = [
        {
          CourseID: {
            subject: "CHEM",
            code: "150",
            term: Term.Spring,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Jan 07, 2019",
          endDate: "Apr 05, 2019",
          meetingTimes: [
            {
              day: Day.Monday,
              startTime: "0830",
              endTime: "0950",
            },
            {
              day: Day.Thursday,
              startTime: "0830",
              endTime: "0950",
            },
          ],
        },
        {
          CourseID: {
            subject: "CSC",
            code: "111",
            term: Term.Spring,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Jan 07, 2019",
          endDate: "Apr 05, 2019",
          meetingTimes: [
            {
              day: Day.Monday,
              startTime: "1000",
              endTime: "1120",
            },
            {
              day: Day.Thursday,
              startTime: "1000",
              endTime: "1120",
            },
          ],
        },
        {
          CourseID: {
            subject: "CSC",
            code: "111",
            term: Term.Spring,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Jan 07, 2019",
          endDate: "Apr 05, 2019",
          meetingTimes: [
            {
              day: Day.Monday,
              startTime: "1000",
              endTime: "1120",
            },
            {
              day: Day.Thursday,
              startTime: "1000",
              endTime: "1120",
            },
          ],
        },
        {
          CourseID: {
            subject: "CSC",
            code: "115",
            term: Term.Spring,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Jan 07, 2019",
          endDate: "Apr 05, 2019",
          meetingTimes: [
            {
              day: Day.Monday,
              startTime: "1130",
              endTime: "1250",
            },
            {
              day: Day.Thursday,
              startTime: "1130",
              endTime: "1250",
            },
          ],
        },
        {
          CourseID: {
            subject: "CSC",
            code: "115",
            term: Term.Spring,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Jan 07, 2019",
          endDate: "Apr 05, 2019",
          meetingTimes: [
            {
              day: Day.Monday,
              startTime: "1130",
              endTime: "1250",
            },
            {
              day: Day.Thursday,
              startTime: "1130",
              endTime: "1250",
            },
          ],
        },
        {
          CourseID: {
            subject: "CSC",
            code: "115",
            term: Term.Spring,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Jan 07, 2019",
          endDate: "Apr 05, 2019",
          meetingTimes: [
            {
              day: Day.Tuesday,
              startTime: "1430",
              endTime: "1520",
            },
            {
              day: Day.Wednesday,
              startTime: "1430",
              endTime: "1520",
            },
            {
              day: Day.Friday,
              startTime: "1430",
              endTime: "1520",
            },
          ],
        },
        {
          CourseID: {
            subject: "CSC",
            code: "115",
            term: Term.Spring,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Jan 07, 2019",
          endDate: "Apr 05, 2019",
          meetingTimes: [
            {
              day: Day.Tuesday,
              startTime: "1430",
              endTime: "1520",
            },
            {
              day: Day.Wednesday,
              startTime: "1430",
              endTime: "1520",
            },
            {
              day: Day.Friday,
              startTime: "1430",
              endTime: "1520",
            },
          ],
        },
        {
          CourseID: {
            subject: "CSC",
            code: "225",
            term: Term.Spring,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Jan 07, 2019",
          endDate: "Apr 05, 2019",
          meetingTimes: [
            {
              day: Day.Monday,
              startTime: "1430",
              endTime: "1520",
            },
            {
              day: Day.Wednesday,
              startTime: "1430",
              endTime: "1520",
            },
            {
              day: Day.Thursday,
              startTime: "1430",
              endTime: "1520",
            },
          ],
        },
        {
          CourseID: {
            subject: "CSC",
            code: "226",
            term: Term.Spring,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Jan 07, 2019",
          endDate: "Apr 05, 2019",
          meetingTimes: [
            {
              day: Day.Monday,
              startTime: "1130",
              endTime: "1250",
            },
            {
              day: Day.Thursday,
              startTime: "1130",
              endTime: "1250",
            },
          ],
        },
        {
          CourseID: {
            subject: "CSC",
            code: "226",
            term: Term.Spring,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Jan 07, 2019",
          endDate: "Apr 05, 2019",
          meetingTimes: [
            {
              day: Day.Monday,
              startTime: "1130",
              endTime: "1250",
            },
            {
              day: Day.Thursday,
              startTime: "1130",
              endTime: "1250",
            },
          ],
        },
        {
          CourseID: {
            subject: "CSC",
            code: "230",
            term: Term.Spring,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Jan 07, 2019",
          endDate: "Apr 05, 2019",
          meetingTimes: [
            {
              day: Day.Tuesday,
              startTime: "1230",
              endTime: "1320",
            },
            {
              day: Day.Wednesday,
              startTime: "1230",
              endTime: "1320",
            },
            {
              day: Day.Friday,
              startTime: "1230",
              endTime: "1320",
            },
          ],
        },
        {
          CourseID: {
            subject: "CSC",
            code: "320",
            term: Term.Spring,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Jan 07, 2019",
          endDate: "Apr 05, 2019",
          meetingTimes: [
            {
              day: Day.Tuesday,
              startTime: "1130",
              endTime: "1220",
            },
            {
              day: Day.Wednesday,
              startTime: "1130",
              endTime: "1220",
            },
            {
              day: Day.Friday,
              startTime: "1130",
              endTime: "1220",
            },
          ],
        },
        {
          CourseID: {
            subject: "CSC",
            code: "360",
            term: Term.Spring,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Jan 07, 2019",
          endDate: "Apr 05, 2019",
          meetingTimes: [
            {
              day: Day.Tuesday,
              startTime: "0930",
              endTime: "1020",
            },
            {
              day: Day.Wednesday,
              startTime: "0930",
              endTime: "1020",
            },
            {
              day: Day.Friday,
              startTime: "0930",
              endTime: "1020",
            },
          ],
        },
        {
          CourseID: {
            subject: "CSC",
            code: "360",
            term: Term.Spring,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Jan 07, 2019",
          endDate: "Apr 05, 2019",
          meetingTimes: [
            {
              day: Day.Tuesday,
              startTime: "0930",
              endTime: "1020",
            },
            {
              day: Day.Wednesday,
              startTime: "0930",
              endTime: "1020",
            },
            {
              day: Day.Friday,
              startTime: "0930",
              endTime: "1020",
            },
          ],
        },
        {
          CourseID: {
            subject: "CSC",
            code: "361",
            term: Term.Spring,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Jan 07, 2019",
          endDate: "Apr 05, 2019",
          meetingTimes: [
            {
              day: Day.Tuesday,
              startTime: "1230",
              endTime: "1320",
            },
            {
              day: Day.Wednesday,
              startTime: "1230",
              endTime: "1320",
            },
            {
              day: Day.Friday,
              startTime: "1230",
              endTime: "1320",
            },
          ],
        },
        {
          CourseID: {
            subject: "CSC",
            code: "370",
            term: Term.Spring,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Jan 07, 2019",
          endDate: "Apr 05, 2019",
          meetingTimes: [
            {
              day: Day.Monday,
              startTime: "1630",
              endTime: "1750",
            },
            {
              day: Day.Wednesday,
              startTime: "1630",
              endTime: "1750",
            },
          ],
        },
        {
          CourseID: {
            subject: "CSC",
            code: "460",
            term: Term.Spring,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Jan 07, 2019",
          endDate: "Apr 05, 2019",
          meetingTimes: [
            {
              day: Day.Tuesday,
              startTime: "1430",
              endTime: "1550",
            },
            {
              day: Day.Friday,
              startTime: "1430",
              endTime: "1550",
            },
          ],
        },
        {
          CourseID: {
            subject: "CSC",
            code: "460",
            term: Term.Spring,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Jan 07, 2019",
          endDate: "Apr 05, 2019",
          meetingTimes: [
            {
              day: Day.Tuesday,
              startTime: "1430",
              endTime: "1550",
            },
            {
              day: Day.Friday,
              startTime: "1430",
              endTime: "1550",
            },
          ],
        },
        {
          CourseID: {
            subject: "ECE",
            code: "300",
            term: Term.Spring,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Jan 07, 2019",
          endDate: "Apr 05, 2019",
          meetingTimes: [
            {
              day: Day.Monday,
              startTime: "1000",
              endTime: "1120",
            },
            {
              day: Day.Thursday,
              startTime: "1000",
              endTime: "1120",
            },
          ],
        },
        {
          CourseID: {
            subject: "ECE",
            code: "310",
            term: Term.Spring,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Jan 07, 2019",
          endDate: "Apr 05, 2019",
          meetingTimes: [
            {
              day: Day.Tuesday,
              startTime: "1030",
              endTime: "1120",
            },
            {
              day: Day.Wednesday,
              startTime: "1030",
              endTime: "1120",
            },
            {
              day: Day.Friday,
              startTime: "1030",
              endTime: "1120",
            },
          ],
        },
        {
          CourseID: {
            subject: "ECE",
            code: "310",
            term: Term.Spring,
          },
          hoursPerWeek: 2.5,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Jan 07, 2019",
          endDate: "Apr 05, 2019",
          meetingTimes: [
            {
              day: Day.Tuesday,
              startTime: "1030",
              endTime: "1120",
            },
            {
              day: Day.Wednesday,
              startTime: "1030",
              endTime: "1120",
            },
            {
              day: Day.Friday,
              startTime: "1030",
              endTime: "1120",
            },
          ],
        },
        {
          CourseID: {
            subject: "ECE",
            code: "320",
            term: Term.Spring,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Jan 07, 2019",
          endDate: "Apr 05, 2019",
          meetingTimes: [
            {
              day: Day.Tuesday,
              startTime: "0830",
              endTime: "0920",
            },
            {
              day: Day.Wednesday,
              startTime: "0830",
              endTime: "0920",
            },
            {
              day: Day.Friday,
              startTime: "0830",
              endTime: "0920",
            },
          ],
        },
        {
          CourseID: {
            subject: "ECE",
            code: "330",
            term: Term.Spring,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Jan 07, 2019",
          endDate: "Apr 05, 2019",
          meetingTimes: [
            {
              day: Day.Tuesday,
              startTime: "1130",
              endTime: "1220",
            },
            {
              day: Day.Wednesday,
              startTime: "1130",
              endTime: "1220",
            },
            {
              day: Day.Friday,
              startTime: "1130",
              endTime: "1220",
            },
          ],
        },
        {
          CourseID: {
            subject: "ECE",
            code: "340",
            term: Term.Spring,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Jan 07, 2019",
          endDate: "Apr 05, 2019",
          meetingTimes: [
            {
              day: Day.Monday,
              startTime: "1130",
              endTime: "1250",
            },
            {
              day: Day.Thursday,
              startTime: "1130",
              endTime: "1250",
            },
          ],
        },
        {
          CourseID: {
            subject: "ECE",
            code: "360",
            term: Term.Spring,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Jan 07, 2019",
          endDate: "Apr 05, 2019",
          meetingTimes: [
            {
              day: Day.Tuesday,
              startTime: "0930",
              endTime: "1020",
            },
            {
              day: Day.Wednesday,
              startTime: "0930",
              endTime: "1020",
            },
            {
              day: Day.Friday,
              startTime: "0930",
              endTime: "1020",
            },
          ],
        },
        {
          CourseID: {
            subject: "ECE",
            code: "455",
            term: Term.Spring,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Jan 07, 2019",
          endDate: "Apr 05, 2019",
          meetingTimes: [
            {
              day: Day.Tuesday,
              startTime: "0830",
              endTime: "0920",
            },
            {
              day: Day.Wednesday,
              startTime: "0830",
              endTime: "0920",
            },
            {
              day: Day.Friday,
              startTime: "0830",
              endTime: "0920",
            },
          ],
        },
        {
          CourseID: {
            subject: "ECE",
            code: "458",
            term: Term.Spring,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Jan 07, 2019",
          endDate: "Apr 05, 2019",
          meetingTimes: [
            {
              day: Day.Monday,
              startTime: "1300",
              endTime: "1420",
            },
            {
              day: Day.Thursday,
              startTime: "1300",
              endTime: "1420",
            },
          ],
        },
        {
          CourseID: {
            subject: "ENGR",
            code: "120",
            term: Term.Spring,
          },
          hoursPerWeek: 1,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Jan 07, 2019",
          endDate: "Apr 05, 2019",
          meetingTimes: [
            {
              day: Day.Tuesday,
              startTime: "1430",
              endTime: "1520",
            },
          ],
        },
        {
          CourseID: {
            subject: "ENGR",
            code: "120",
            term: Term.Spring,
          },
          hoursPerWeek: 1,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Jan 07, 2019",
          endDate: "Apr 05, 2019",
          meetingTimes: [
            {
              day: Day.Tuesday,
              startTime: "1430",
              endTime: "1520",
            },
          ],
        },
        {
          CourseID: {
            subject: "ENGR",
            code: "120",
            term: Term.Spring,
          },
          hoursPerWeek: 1,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Jan 07, 2019",
          endDate: "Apr 05, 2019",
          meetingTimes: [
            {
              day: Day.Tuesday,
              startTime: "1530",
              endTime: "1620",
            },
          ],
        },
        {
          CourseID: {
            subject: "ENGR",
            code: "120",
            term: Term.Spring,
          },
          hoursPerWeek: 1,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Jan 07, 2019",
          endDate: "Apr 05, 2019",
          meetingTimes: [
            {
              day: Day.Tuesday,
              startTime: "1430",
              endTime: "1520",
            },
          ],
        },
        {
          CourseID: {
            subject: "ENGR",
            code: "120",
            term: Term.Spring,
          },
          hoursPerWeek: 1,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Jan 07, 2019",
          endDate: "Apr 05, 2019",
          meetingTimes: [
            {
              day: Day.Tuesday,
              startTime: "1430",
              endTime: "1520",
            },
          ],
        },
        {
          CourseID: {
            subject: "ENGR",
            code: "120",
            term: Term.Spring,
          },
          hoursPerWeek: 1,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Jan 07, 2019",
          endDate: "Apr 05, 2019",
          meetingTimes: [
            {
              day: Day.Tuesday,
              startTime: "1430",
              endTime: "1520",
            },
          ],
        },
        {
          CourseID: {
            subject: "ENGR",
            code: "120",
            term: Term.Spring,
          },
          hoursPerWeek: 1,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Jan 07, 2019",
          endDate: "Apr 05, 2019",
          meetingTimes: [
            {
              day: Day.Tuesday,
              startTime: "1530",
              endTime: "1620",
            },
          ],
        },
        {
          CourseID: {
            subject: "ENGR",
            code: "120",
            term: Term.Spring,
          },
          hoursPerWeek: 1,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Jan 07, 2019",
          endDate: "Apr 05, 2019",
          meetingTimes: [
            {
              day: Day.Tuesday,
              startTime: "1530",
              endTime: "1620",
            },
          ],
        },
        {
          CourseID: {
            subject: "ENGR",
            code: "120",
            term: Term.Spring,
          },
          hoursPerWeek: 1,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Jan 07, 2019",
          endDate: "Apr 05, 2019",
          meetingTimes: [
            {
              day: Day.Tuesday,
              startTime: "1530",
              endTime: "1620",
            },
          ],
        },
        {
          CourseID: {
            subject: "ENGR",
            code: "120",
            term: Term.Spring,
          },
          hoursPerWeek: 1,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Jan 07, 2019",
          endDate: "Apr 05, 2019",
          meetingTimes: [
            {
              day: Day.Tuesday,
              startTime: "1430",
              endTime: "1520",
            },
          ],
        },
        {
          CourseID: {
            subject: "ENGR",
            code: "120",
            term: Term.Spring,
          },
          hoursPerWeek: 1,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Jan 07, 2019",
          endDate: "Apr 05, 2019",
          meetingTimes: [
            {
              day: Day.Tuesday,
              startTime: "1530",
              endTime: "1620",
            },
          ],
        },
        {
          CourseID: {
            subject: "ENGR",
            code: "120",
            term: Term.Spring,
          },
          hoursPerWeek: 1,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Jan 07, 2019",
          endDate: "Apr 05, 2019",
          meetingTimes: [
            {
              day: Day.Tuesday,
              startTime: "1530",
              endTime: "1620",
            },
          ],
        },
        {
          CourseID: {
            subject: "ENGR",
            code: "141",
            term: Term.Spring,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Jan 07, 2019",
          endDate: "Apr 05, 2019",
          meetingTimes: [
            {
              day: Day.Monday,
              startTime: "1130",
              endTime: "1250",
            },
            {
              day: Day.Thursday,
              startTime: "1130",
              endTime: "1250",
            },
          ],
        },
        {
          CourseID: {
            subject: "ENGR",
            code: "141",
            term: Term.Spring,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Jan 07, 2019",
          endDate: "Apr 05, 2019",
          meetingTimes: [
            {
              day: Day.Monday,
              startTime: "1530",
              endTime: "1650",
            },
            {
              day: Day.Thursday,
              startTime: "1530",
              endTime: "1650",
            },
          ],
        },
        {
          CourseID: {
            subject: "MATH",
            code: "101",
            term: Term.Spring,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Jan 07, 2019",
          endDate: "Apr 05, 2019",
          meetingTimes: [
            {
              day: Day.Monday,
              startTime: "1430",
              endTime: "1520",
            },
            {
              day: Day.Wednesday,
              startTime: "1430",
              endTime: "1520",
            },
            {
              day: Day.Thursday,
              startTime: "1430",
              endTime: "1520",
            },
          ],
        },
        {
          CourseID: {
            subject: "MATH",
            code: "101",
            term: Term.Spring,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Jan 07, 2019",
          endDate: "Apr 05, 2019",
          meetingTimes: [
            {
              day: Day.Tuesday,
              startTime: "0830",
              endTime: "0920",
            },
            {
              day: Day.Wednesday,
              startTime: "0830",
              endTime: "0920",
            },
            {
              day: Day.Friday,
              startTime: "0830",
              endTime: "0920",
            },
          ],
        },
        {
          CourseID: {
            subject: "MATH",
            code: "101",
            term: Term.Spring,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Jan 07, 2019",
          endDate: "Apr 05, 2019",
          meetingTimes: [
            {
              day: Day.Tuesday,
              startTime: "1230",
              endTime: "1320",
            },
            {
              day: Day.Wednesday,
              startTime: "1230",
              endTime: "1320",
            },
            {
              day: Day.Friday,
              startTime: "1230",
              endTime: "1320",
            },
          ],
        },
        {
          CourseID: {
            subject: "MATH",
            code: "101",
            term: Term.Spring,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Jan 07, 2019",
          endDate: "Apr 05, 2019",
          meetingTimes: [
            {
              day: Day.Tuesday,
              startTime: "1330",
              endTime: "1420",
            },
            {
              day: Day.Wednesday,
              startTime: "1330",
              endTime: "1420",
            },
            {
              day: Day.Friday,
              startTime: "1330",
              endTime: "1420",
            },
          ],
        },
        {
          CourseID: {
            subject: "MATH",
            code: "101",
            term: Term.Spring,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Jan 07, 2019",
          endDate: "Apr 05, 2019",
          meetingTimes: [
            {
              day: Day.Monday,
              startTime: "1530",
              endTime: "1620",
            },
            {
              day: Day.Wednesday,
              startTime: "1530",
              endTime: "1620",
            },
            {
              day: Day.Thursday,
              startTime: "1530",
              endTime: "1620",
            },
          ],
        },
        {
          CourseID: {
            subject: "SENG",
            code: "265",
            term: Term.Spring,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Jan 07, 2019",
          endDate: "Apr 05, 2019",
          meetingTimes: [
            {
              day: Day.Tuesday,
              startTime: "0930",
              endTime: "1020",
            },
            {
              day: Day.Wednesday,
              startTime: "0930",
              endTime: "1020",
            },
            {
              day: Day.Friday,
              startTime: "0930",
              endTime: "1020",
            },
          ],
        },
        {
          CourseID: {
            subject: "SENG",
            code: "265",
            term: Term.Spring,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Jan 07, 2019",
          endDate: "Apr 05, 2019",
          meetingTimes: [
            {
              day: Day.Tuesday,
              startTime: "0930",
              endTime: "1020",
            },
            {
              day: Day.Wednesday,
              startTime: "0930",
              endTime: "1020",
            },
            {
              day: Day.Friday,
              startTime: "0930",
              endTime: "1020",
            },
          ],
        },
        {
          CourseID: {
            subject: "SENG",
            code: "310",
            term: Term.Spring,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Jan 07, 2019",
          endDate: "Apr 05, 2019",
          meetingTimes: [
            {
              day: Day.Monday,
              startTime: "1130",
              endTime: "1250",
            },
            {
              day: Day.Thursday,
              startTime: "1130",
              endTime: "1250",
            },
          ],
        },
        {
          CourseID: {
            subject: "SENG",
            code: "321",
            term: Term.Spring,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Jan 07, 2019",
          endDate: "Apr 05, 2019",
          meetingTimes: [
            {
              day: Day.Monday,
              startTime: "1000",
              endTime: "1120",
            },
            {
              day: Day.Thursday,
              startTime: "1000",
              endTime: "1120",
            },
          ],
        },
        {
          CourseID: {
            subject: "SENG",
            code: "321",
            term: Term.Spring,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Jan 07, 2019",
          endDate: "Apr 05, 2019",
          meetingTimes: [
            {
              day: Day.Monday,
              startTime: "1000",
              endTime: "1120",
            },
            {
              day: Day.Thursday,
              startTime: "1000",
              endTime: "1120",
            },
          ],
        },
        {
          CourseID: {
            subject: "SENG",
            code: "371",
            term: Term.Spring,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Jan 07, 2019",
          endDate: "Apr 05, 2019",
          meetingTimes: [
            {
              day: Day.Tuesday,
              startTime: "1530",
              endTime: "1620",
            },
            {
              day: Day.Wednesday,
              startTime: "1530",
              endTime: "1620",
            },
            {
              day: Day.Friday,
              startTime: "1530",
              endTime: "1620",
            },
          ],
        },
        {
          CourseID: {
            subject: "SENG",
            code: "371",
            term: Term.Spring,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Jan 07, 2019",
          endDate: "Apr 05, 2019",
          meetingTimes: [
            {
              day: Day.Tuesday,
              startTime: "1530",
              endTime: "1620",
            },
            {
              day: Day.Wednesday,
              startTime: "1530",
              endTime: "1620",
            },
            {
              day: Day.Friday,
              startTime: "1530",
              endTime: "1620",
            },
          ],
        },
        {
          CourseID: {
            subject: "SENG",
            code: "401",
            term: Term.Spring,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Jan 07, 2019",
          endDate: "Apr 05, 2019",
          meetingTimes: [
            {
              day: Day.Monday,
              startTime: "1630",
              endTime: "1750",
            },
            {
              day: Day.Thursday,
              startTime: "1630",
              endTime: "1750",
            },
          ],
        },
        {
          CourseID: {
            subject: "SENG",
            code: "401",
            term: Term.Spring,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Jan 07, 2019",
          endDate: "Apr 05, 2019",
          meetingTimes: [
            {
              day: Day.Monday,
              startTime: "1630",
              endTime: "1750",
            },
            {
              day: Day.Thursday,
              startTime: "1630",
              endTime: "1750",
            },
          ],
        },
        {
          CourseID: {
            subject: "SENG",
            code: "468",
            term: Term.Spring,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Jan 07, 2019",
          endDate: "Apr 05, 2019",
          meetingTimes: [
            {
              day: Day.Tuesday,
              startTime: "1330",
              endTime: "1420",
            },
            {
              day: Day.Wednesday,
              startTime: "1330",
              endTime: "1420",
            },
            {
              day: Day.Friday,
              startTime: "1330",
              endTime: "1420",
            },
          ],
        },
        {
          CourseID: {
            subject: "SENG",
            code: "468",
            term: Term.Spring,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Jan 07, 2019",
          endDate: "Apr 05, 2019",
          meetingTimes: [
            {
              day: Day.Tuesday,
              startTime: "1330",
              endTime: "1420",
            },
            {
              day: Day.Wednesday,
              startTime: "1330",
              endTime: "1420",
            },
            {
              day: Day.Friday,
              startTime: "1330",
              endTime: "1420",
            },
          ],
        },
        {
          CourseID: {
            subject: "SENG",
            code: "474",
            term: Term.Spring,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "Jan 07, 2019",
          endDate: "Apr 05, 2019",
          meetingTimes: [
            {
              day: Day.Tuesday,
              startTime: "0930",
              endTime: "1020",
            },
            {
              day: Day.Wednesday,
              startTime: "0930",
              endTime: "1020",
            },
            {
              day: Day.Friday,
              startTime: "0930",
              endTime: "1020",
            },
          ],
        },
      ];

      const summer = [
        {
          CourseID: {
            subject: "CSC",
            code: "115",
            term: Term.Summer,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "May 06, 2019",
          endDate: "Aug 02, 2019",
          meetingTimes: [
            {
              day: Day.Monday,
              startTime: "1300",
              endTime: "1420",
            },
            {
              day: Day.Thursday,
              startTime: "1300",
              endTime: "1420",
            },
          ],
        },
        {
          CourseID: {
            subject: "CSC",
            code: "115",
            term: Term.Summer,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "May 06, 2019",
          endDate: "Aug 02, 2019",
          meetingTimes: [
            {
              day: Day.Monday,
              startTime: "1300",
              endTime: "1420",
            },
            {
              day: Day.Thursday,
              startTime: "1300",
              endTime: "1420",
            },
          ],
        },
        {
          CourseID: {
            subject: "CSC",
            code: "225",
            term: Term.Summer,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "May 06, 2019",
          endDate: "Aug 02, 2019",
          meetingTimes: [
            {
              day: Day.Tuesday,
              startTime: "0930",
              endTime: "1020",
            },
            {
              day: Day.Wednesday,
              startTime: "0930",
              endTime: "1020",
            },
            {
              day: Day.Friday,
              startTime: "0930",
              endTime: "1020",
            },
          ],
        },
        {
          CourseID: {
            subject: "CSC",
            code: "225",
            term: Term.Summer,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "May 06, 2019",
          endDate: "Aug 02, 2019",
          meetingTimes: [
            {
              day: Day.Tuesday,
              startTime: "0930",
              endTime: "1020",
            },
            {
              day: Day.Wednesday,
              startTime: "0930",
              endTime: "1020",
            },
            {
              day: Day.Friday,
              startTime: "0930",
              endTime: "1020",
            },
          ],
        },
        {
          CourseID: {
            subject: "CSC",
            code: "225",
            term: Term.Summer,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "May 06, 2019",
          endDate: "Aug 02, 2019",
          meetingTimes: [
            {
              day: Day.Tuesday,
              startTime: "0930",
              endTime: "1020",
            },
            {
              day: Day.Wednesday,
              startTime: "0930",
              endTime: "1020",
            },
            {
              day: Day.Friday,
              startTime: "0930",
              endTime: "1020",
            },
          ],
        },
        {
          CourseID: {
            subject: "CSC",
            code: "226",
            term: Term.Summer,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "May 06, 2019",
          endDate: "Aug 02, 2019",
          meetingTimes: [
            {
              day: Day.Tuesday,
              startTime: "0930",
              endTime: "1020",
            },
            {
              day: Day.Wednesday,
              startTime: "0930",
              endTime: "1020",
            },
            {
              day: Day.Friday,
              startTime: "0930",
              endTime: "1020",
            },
          ],
        },
        {
          CourseID: {
            subject: "CSC",
            code: "226",
            term: Term.Summer,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "May 06, 2019",
          endDate: "Aug 02, 2019",
          meetingTimes: [
            {
              day: Day.Tuesday,
              startTime: "0930",
              endTime: "1020",
            },
            {
              day: Day.Wednesday,
              startTime: "0930",
              endTime: "1020",
            },
            {
              day: Day.Friday,
              startTime: "0930",
              endTime: "1020",
            },
          ],
        },
        {
          CourseID: {
            subject: "CSC",
            code: "230",
            term: Term.Summer,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "May 06, 2019",
          endDate: "Aug 02, 2019",
          meetingTimes: [
            {
              day: Day.Monday,
              startTime: "1300",
              endTime: "1420",
            },
            {
              day: Day.Thursday,
              startTime: "1300",
              endTime: "1420",
            },
          ],
        },
        {
          CourseID: {
            subject: "CSC",
            code: "230",
            term: Term.Summer,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "May 06, 2019",
          endDate: "Aug 02, 2019",
          meetingTimes: [
            {
              day: Day.Monday,
              startTime: "1300",
              endTime: "1420",
            },
            {
              day: Day.Thursday,
              startTime: "1300",
              endTime: "1420",
            },
          ],
        },
        {
          CourseID: {
            subject: "CSC",
            code: "320",
            term: Term.Summer,
          },
          hoursPerWeek: 4,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "May 01, 2019",
          endDate: "Jun 28, 2019",
          meetingTimes: [
            {
              day: Day.Tuesday,
              startTime: "1030",
              endTime: "1220",
            },
            {
              day: Day.Friday,
              startTime: "1030",
              endTime: "1220",
            },
          ],
        },
        {
          CourseID: {
            subject: "CSC",
            code: "320",
            term: Term.Summer,
          },
          hoursPerWeek: 4,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "May 01, 2019",
          endDate: "Jun 28, 2019",
          meetingTimes: [
            {
              day: Day.Tuesday,
              startTime: "1030",
              endTime: "1220",
            },
            {
              day: Day.Friday,
              startTime: "1030",
              endTime: "1220",
            },
          ],
        },
        {
          CourseID: {
            subject: "CSC",
            code: "370",
            term: Term.Summer,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "May 06, 2019",
          endDate: "Aug 02, 2019",
          meetingTimes: [
            {
              day: Day.Monday,
              startTime: "1000",
              endTime: "1120",
            },
            {
              day: Day.Thursday,
              startTime: "1000",
              endTime: "1120",
            },
          ],
        },
        {
          CourseID: {
            subject: "CSC",
            code: "370",
            term: Term.Summer,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "May 06, 2019",
          endDate: "Aug 02, 2019",
          meetingTimes: [
            {
              day: Day.Monday,
              startTime: "1000",
              endTime: "1120",
            },
            {
              day: Day.Thursday,
              startTime: "1000",
              endTime: "1120",
            },
          ],
        },
        {
          CourseID: {
            subject: "ECON",
            code: "180",
            term: Term.Summer,
          },
          hoursPerWeek: 6,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "May 13, 2019",
          endDate: "Jun 28, 2019",
          meetingTimes: [
            {
              day: Day.Monday,
              startTime: "1430",
              endTime: "1620",
            },
            {
              day: Day.Wednesday,
              startTime: "1430",
              endTime: "1620",
            },
            {
              day: Day.Thursday,
              startTime: "1430",
              endTime: "1620",
            },
          ],
        },
        {
          CourseID: {
            subject: "ECE",
            code: "216",
            term: Term.Summer,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "May 06, 2019",
          endDate: "Aug 02, 2019",
          meetingTimes: [
            {
              day: Day.Monday,
              startTime: "0830",
              endTime: "0950",
            },
            {
              day: Day.Thursday,
              startTime: "0830",
              endTime: "0950",
            },
          ],
        },
        {
          CourseID: {
            subject: "ECE",
            code: "216",
            term: Term.Summer,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "May 06, 2019",
          endDate: "Aug 02, 2019",
          meetingTimes: [
            {
              day: Day.Monday,
              startTime: "0830",
              endTime: "0950",
            },
            {
              day: Day.Thursday,
              startTime: "0830",
              endTime: "0950",
            },
          ],
        },
        {
          CourseID: {
            subject: "ECE",
            code: "220",
            term: Term.Summer,
          },
          hoursPerWeek: 0.83,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "May 06, 2019",
          endDate: "Aug 02, 2019",
          meetingTimes: [
            {
              day: Day.Wednesday,
              startTime: "1130",
              endTime: "1220",
            },
          ],
        },
        {
          CourseID: {
            subject: "ECE",
            code: "250",
            term: Term.Summer,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "May 06, 2019",
          endDate: "Aug 02, 2019",
          meetingTimes: [
            {
              day: Day.Monday,
              startTime: "1130",
              endTime: "1250",
            },
            {
              day: Day.Thursday,
              startTime: "1130",
              endTime: "1250",
            },
          ],
        },
        {
          CourseID: {
            subject: "ECE",
            code: "260",
            term: Term.Summer,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "May 06, 2019",
          endDate: "Aug 02, 2019",
          meetingTimes: [
            {
              day: Day.Tuesday,
              startTime: "1030",
              endTime: "1120",
            },
            {
              day: Day.Wednesday,
              startTime: "1030",
              endTime: "1120",
            },
            {
              day: Day.Friday,
              startTime: "1030",
              endTime: "1120",
            },
          ],
        },
        {
          CourseID: {
            subject: "ECE",
            code: "260",
            term: Term.Summer,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "May 06, 2019",
          endDate: "Aug 02, 2019",
          meetingTimes: [
            {
              day: Day.Tuesday,
              startTime: "1030",
              endTime: "1120",
            },
            {
              day: Day.Wednesday,
              startTime: "1030",
              endTime: "1120",
            },
            {
              day: Day.Friday,
              startTime: "1030",
              endTime: "1120",
            },
          ],
        },
        {
          CourseID: {
            subject: "ECE",
            code: "299",
            term: Term.Summer,
          },
          hoursPerWeek: 1,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "May 06, 2019",
          endDate: "Aug 02, 2019",
          meetingTimes: [
            {
              day: Day.Wednesday,
              startTime: "1530",
              endTime: "1620",
            },
          ],
        },
        {
          CourseID: {
            subject: "ECE",
            code: "310",
            term: Term.Summer,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "May 06, 2019",
          endDate: "Aug 02, 2019",
          meetingTimes: [
            {
              day: Day.Monday,
              startTime: "1000",
              endTime: "1120",
            },
            {
              day: Day.Thursday,
              startTime: "1000",
              endTime: "1120",
            },
          ],
        },
        {
          CourseID: {
            subject: "ECE",
            code: "310",
            term: Term.Summer,
          },
          hoursPerWeek: 3,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "May 06, 2019",
          endDate: "Aug 02, 2019",
          meetingTimes: [
            {
              day: Day.Monday,
              startTime: "1000",
              endTime: "1120",
            },
            {
              day: Day.Thursday,
              startTime: "1000",
              endTime: "1120",
            },
          ],
        },
        {
          CourseID: {
            subject: "ECE",
            code: "499",
            term: Term.Summer,
          },
          hoursPerWeek: 1,
          capacity: 123,
          professors: [
            {
              id: 1,
              username: "jimmy",
              password: "Why is this accessible in the API????",
              role: Role.Admin,
              active: true,
              preferences: [],
            },
          ],
          startDate: "May 06, 2019",
          endDate: "Aug 02, 2019",
          meetingTimes: [
            {
              day: Day.Thursday,
              startTime: "1630",
              endTime: "1720",
            },
          ],
        },
      ];

      if (params.term === Term.Fall) {
        return fall;
      }
      if (params.term === Term.Spring) {
        return spring;
      }

      return summer;
    },
  },
  Mutation: {
    login: async (_, params, ctx) => {
      if (ctx.session.username) return alreadyLoggedIn;

      const loginResult: AuthPayload = await login(
        params.username,
        params.password
      );

      if (loginResult.success) {
        // set user in session
        ctx.session.username = params.username;
      }
      return loginResult;
    },
    logout: async (_, _params, ctx) => {
      if (!ctx.session.username) return noLogin;
      else {
        await ctx.logout();
        return {
          token: "",
          success: true,
          message: "Logged out",
        };
      }
    },
    changeUserPassword: async (_, _params, ctx) => {
      if (!ctx.session.username) return noLogin;
      else return changePassword(ctx.session.username, _params.input);
    },
    createUser: async (_, _params, ctx) => {
      if (!ctx.session.username) return noLogin;
      else if (!(await isAdmin(ctx.session.username))) return noPerms;
      else return await createNewUser(_params.username);
    },
  },
};
