import {
  Course,
  CoursePreference,
  TeachingPreference,
  User as PrismaUser,
} from '@prisma/client';

// import { coursesquery } from '../../tests/typeDefs';
// import { getTime, getDate } from '../utils/time';
import {
  Professor,
  Schedule as ScheduleAlgorithm,
  SchedulePostRequest,
} from '../client/algorithm1/api';
import { CourseObject } from '../client/algorithm2';
import { Context } from '../context';
import { findCourseSection, upsertCourses } from '../prisma/course';
import { findSchedule, initiateSchedule } from '../prisma/schedule';
import { findAllUsers, findUserById, updateUserSurvey } from '../prisma/user';
import {
  CourseInput,
  CourseSection,
  Company,
  Day,
  GenerateScheduleInput,
  MeetingTime,
  Role,
  Schedule,
  Term,
  User,
  CourseSectionInput,
  UpdateScheduleInput,
} from '../schema';
import { getSeqNumber } from '../utils';

export {
  getMe,
  getAll,
  getUserByID,
  getCourses,
  getSchedule,
  getCourseCapacities,
  generateScheduleWithCapacities,
  createSchedule,
  updateUserSurvey,
  checkSchedule,
};
/**
 * Prisma-based type representing the User model
 * with the preferences joined in
 */
export type FullUser = PrismaUser & {
  preference: PrismaTeachPref;
};

export type PrismaTeachPref = (TeachingPreference & {
  coursePreference: (CoursePreference & {
    course: Course;
  })[];
})[];

async function getMe(user: FullUser): Promise<User | null> {
  if (!user) return null;

  return {
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    password: user.password,
    role: user.role as Role,
    preferences: prismaPrefsToGraphQLPrefs(user.preference),
    active: user.active,
    hasPeng: user.hasPeng,
  };
}

const prismaPrefsToGraphQLPrefs = (input: PrismaTeachPref) => {
  return input.flatMap((p) => {
    return p.coursePreference.map((c) => ({
      ...c,
      id: {
        ...c.course,
        // code and term mappings are required because these fields don't match up
        // between graphql and prisma...
        code: c.course.courseCode,
        term:
          c.course.term === 'FALL'
            ? Term.Fall
            : c.course.term === 'SPRING'
            ? Term.Spring
            : Term.Summer,
      },
    }));
  });
};

async function getAll(): Promise<User[] | null> {
  const allusers = await findAllUsers();

  if (!allusers) return null;

  return allusers.map<User>((alluser) => {
    return {
      id: alluser.id,
      username: alluser.username,
      displayName: alluser.displayName,
      password: alluser.password,
      role: alluser.role as Role,
      preferences: prismaPrefsToGraphQLPrefs(alluser.preference),
      active: alluser.active,
      hasPeng: alluser.hasPeng,
    };
  });
}

async function getUserByID(id: number): Promise<User | null> {
  const user = await findUserById(id);

  if (!user) return null;

  return {
    id: user.id,
    username: user.username,
    password: user.password,
    displayName: user.displayName,
    role: user.role as Role,
    preferences: prismaPrefsToGraphQLPrefs(user.preference),
    active: user.active,
    hasPeng: user.hasPeng,
  };
}

async function getCourses(term: Term): Promise<CourseSection[] | null> {
  const courses = await findCourseSection(term);

  if (!courses) return null;

  return courses.map<CourseSection>((course) => {
    return {
      CourseID: {
        code: course.course.courseCode,
        subject: course.course.subject,
        title: course.course.title,
        term: course.course.term as any,
      },
      capacity: course.capacity,
      hoursPerWeek: course.hoursPerWeek,
      startDate: course.startDate,
      endDate: course.endDate,
      meetingTimes: course.meetingTime.flatMap<MeetingTime>((meetingTime) => {
        return meetingTime.days.map((day) => ({
          day: day as Day,
          endTime: meetingTime.endTime,
          startTime: meetingTime.startTime,
        }));
      }),
    };
  });
}

async function getSchedule(year: number): Promise<Schedule | null> {
  const schedule = await findSchedule(year);
  if (!schedule) return null;
  return {
    id: `${schedule.id}`,
    year: schedule.year,
    createdAt: schedule.createdOn,
    courses: schedule.courseSection.map<CourseSection>((course) => {
      // console.log('CoursePreference: ', course.course.coursePreference);
      if (!course.user)
        return {
          CourseID: {
            code: course.course.courseCode,
            subject: course.course.subject,
            title: course.course.title,
            term: course.course.term as any,
          },
          capacity: course.capacity,
          hoursPerWeek: course.hoursPerWeek,
          sectionNumber: course.sectionNumber,
          startDate: course.startDate,
          endDate: course.endDate,
          meetingTimes: course.meetingTime.flatMap<MeetingTime>(
            (meetingTime) => {
              return meetingTime.days.map((day) => ({
                day: day as Day,
                endTime: meetingTime.endTime,
                startTime: meetingTime.startTime,
              }));
            }
          ),
          professors: [
            {
              id: 0,
              username: 'not found',
              password: 'not found',
              displayName: 'not found',
              role: Role.User,
              preferences: [],
              active: false,
              hasPeng: false,
            },
          ],
        };
      return {
        CourseID: {
          code: course.course.courseCode,
          subject: course.course.subject,
          title: course.course.title,
          term: course.course.term as any,
        },
        capacity: course.capacity,
        hoursPerWeek: course.hoursPerWeek,
        sectionNumber: course.sectionNumber,
        startDate: course.startDate,
        endDate: course.endDate,
        meetingTimes: course.meetingTime.flatMap<MeetingTime>((meetingTime) => {
          return meetingTime.days.map((day) => ({
            day: day as Day,
            endTime: meetingTime.endTime,
            startTime: meetingTime.startTime,
          }));
        }),
        professors: [
          {
            id: course.user.id,
            username: course.user.username,
            password: course.user.password,
            displayName: course.user.displayName,
            role: course.user.role as Role,
            preferences: prismaPrefsToGraphQLPrefs(course.user.preference),
            active: course.user.active,
            hasPeng: course.user.hasPeng,
          },
        ],
      };
    }),
  };
}

async function createSchedule(year: number, scheduleData: ScheduleAlgorithm) {
  const schedule = await initiateSchedule(year);

  scheduleData.fallCourses?.forEach(async (course) => {
    await upsertCourses(course, Term.Fall, year, schedule);
  });
  scheduleData.springCourses?.forEach(async (course) => {
    await upsertCourses(course, Term.Spring, year, schedule);
  });
  scheduleData.summerCourses?.forEach(async (course) => {
    await upsertCourses(course, Term.Summer, year, schedule);
  });
}

async function getCourseCapacities(
  ctx: Context,
  summerCourses: CourseInput[],
  springCourses: CourseInput[],
  fallCourses: CourseInput[],
  company: Company
) {
  if (summerCourses.length + springCourses.length + fallCourses.length === 0) {
    return null;
  }

  const courseMapper = (course: CourseInput, term: Term) => {
    return {
      subject: course.subject,
      code: course.code,
      seng_ratio: 0.75,
      semester: term,
      capacity: 0,
    };
  };

  const summerRequest: CourseObject[] = summerCourses.map((course) =>
    courseMapper(course, Term.Summer)
  );

  const springRequest: CourseObject[] = springCourses.map((course) =>
    courseMapper(course, Term.Spring)
  );

  const fallRequest: CourseObject[] = fallCourses.map((course) =>
    courseMapper(course, Term.Fall)
  );

  const combinedRequest = ([] as CourseObject[]).concat(
    summerRequest,
    springRequest,
    fallRequest
  );

  const alg2 = ctx.algorithm(company).algo2;

  const algorithm2Response = await alg2(combinedRequest);

  return algorithm2Response;
}

function getFormattedDate(date: CourseSectionInput) {
  const year = String(date).substring(0, 4);
  const month = String(date).substring(4, 6);
  const day = String(date).substring(6, 8);
  const combined = year + ',' + month + ',' + day;
  const formattedDate = new Date(combined).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
  return formattedDate;
}

function getClassTime(times: CourseSectionInput, input: string) {
  if (input === 'beginTime')
    return String(times.meetingTimes.map((m) => m.startTime)[0]);
  else if (input === 'endTime')
    return String(times.meetingTimes.map((m) => m.endTime)[0]);
  return 'Incorrect input provided';
}

function isDay(days: CourseSectionInput, day: Day) {
  const x = days.meetingTimes.map((m) => m.day === day);
  console.log(x);
  for (let i = 0; i < x.length; i++) {
    if (x[i]) return x[i];
  }
  console.log('Only false');
  return false;
}

function removeObjectFromArray(array: Course[]) {
  for (let i = 0; i < array.length; i++) {
    if (array[i].subject == 'not found') {
      array.splice(i, 1);
      i--;
    }
  }
}

async function checkSchedule(
  ctx: Context,
  input: UpdateScheduleInput,
  users: User[] | null
) {
  if (!input) return null;
  // Defining default values to avoid undefined error.
  const defaultValues = {
    subject: 'not found',
    courseNumber: 'not found',
    courseTitle: 'not found',
    numSections: 1,
    courseCapacity: 100,
    sequenceNumber: 'A01',
    streamSequence: 'not found',
  };
  /*
  // using this object gives type error in hardScheduled
  const courseMapping = (course: CourseSectionInput): Course => {
    return {
      subject: course.id.subject,
      courseNumber: course.id.code,
      courseTitle: course.id.title,
      numSections: 1,
      courseCapacity: course.capacity,
      sequenceNumber: course.sectionNumber ?? 'A01',
      streamSequence: getSeqNumber(course.id.subject, course.id.code),
      assignment: {
        startDate: 'Sep 05, 2018',
        endDate: 'Dec 05, 2018',
        beginTime: '1300',
        endTime: '1420',
        hoursWeek: 3,
        sunday: false,
        monday: true,
        tuesday: false,
        wednesday: false,
        thursday: true,
        friday: false,
        saturday: false,
      },
      prof: {
        displayName: course.professors[0],
        preferences: [],
      },
    };
  };
*/
  // Summer Courses
  const summerCourses = input.courses.map((course: CourseSectionInput) => {
    if (course.id.term !== Term.Summer) {
      return defaultValues;
    }
    // returning the commented object 'courseMapping' here gives a type error in 'payload'
    return {
      subject: course.id.subject,
      courseNumber: course.id.code,
      courseTitle: course.id.title,
      numSections: 1,
      courseCapacity: course.capacity,
      sequenceNumber: course.sectionNumber ?? 'A01',
      streamSequence: getSeqNumber(course.id.subject, course.id.code),
      assignment: {
        startDate: getFormattedDate(course.startDate), // 'Sep 05, 2018',
        endDate: getFormattedDate(course.endDate), // 'Dec 05, 2018',
        beginTime: getClassTime(course, 'beginTime'), // '1300',
        endTime: getClassTime(course, 'endTime'), // '1420',
        hoursWeek: course.hoursPerWeek,
        sunday: isDay(course, Day.Sunday), // false,
        monday: isDay(course, Day.Monday), // true,
        tuesday: isDay(course, Day.Tuesday), // false,
        wednesday: isDay(course, Day.Wednesday), // false,
        thursday: isDay(course, Day.Thursday), // true,
        friday: isDay(course, Day.Friday), // false,
        saturday: isDay(course, Day.Saturday), // false,
      },
      prof: {
        displayName: course.professors[0],
        preferences: [],
      },
    };
  });

  // Fall Courses
  const fallCourses = input.courses.map((course: CourseSectionInput) => {
    if (course.id.term !== Term.Fall) {
      return defaultValues;
    }
    return {
      subject: course.id.subject,
      courseNumber: course.id.code,
      courseTitle: course.id.title,
      numSections: 1,
      courseCapacity: course.capacity,
      sequenceNumber: course.sectionNumber ?? 'A01',
      streamSequence: getSeqNumber(course.id.subject, course.id.code),
      assignment: {
        startDate: getFormattedDate(course.startDate),
        endDate: getFormattedDate(course.endDate),
        beginTime: getClassTime(course, 'beginTime'), // '1330',
        endTime: getClassTime(course, 'endTime'),
        hoursWeek: course.hoursPerWeek,
        sunday: isDay(course, Day.Sunday), // false,
        monday: isDay(course, Day.Monday), // true,
        tuesday: isDay(course, Day.Tuesday), // false,
        wednesday: isDay(course, Day.Wednesday), // false,
        thursday: isDay(course, Day.Thursday), // true,
        friday: isDay(course, Day.Friday), // false,
        saturday: isDay(course, Day.Saturday), // false,
      },
      prof: {
        displayName: course.professors[0], // 'Wu, Kui',
        preferences: [],
      },
    };
  });

  // Spring Courses
  const springCourses = input.courses.map((course: CourseSectionInput) => {
    if (course.id.term !== Term.Spring) {
      return defaultValues;
    }
    return {
      subject: course.id.subject,
      courseNumber: course.id.code,
      courseTitle: course.id.title,
      numSections: 1,
      courseCapacity: course.capacity,
      sequenceNumber: course.sectionNumber ?? 'A01',
      streamSequence: getSeqNumber(course.id.subject, course.id.code),
      assignment: {
        startDate: getFormattedDate(course.startDate),
        endDate: getFormattedDate(course.endDate),
        beginTime: getClassTime(course, 'beginTime'),
        endTime: getClassTime(course, 'endTime'),
        hoursWeek: course.hoursPerWeek,
        sunday: isDay(course, Day.Sunday), // false,
        monday: isDay(course, Day.Monday), // false,
        tuesday: isDay(course, Day.Tuesday), // true,
        wednesday: isDay(course, Day.Wednesday), // true,
        thursday: isDay(course, Day.Thursday), // false,
        friday: isDay(course, Day.Friday), // true,
        saturday: isDay(course, Day.Saturday), // false,
      },
      prof: {
        displayName: course.professors[0],
        preferences: [],
      },
    };
  });

  removeObjectFromArray(summerCourses);
  removeObjectFromArray(fallCourses);
  removeObjectFromArray(springCourses);
  console.log('SummerCourses: ', summerCourses);
  console.log('FallCourses: ', fallCourses);
  console.log('SpringCourses: ', springCourses);

  const payload: SchedulePostRequest = {
    coursesToSchedule: {
      fallCourses: [],
      springCourses: [],
      summerCourses: [],
    },
    hardScheduled: {
      fallCourses: fallCourses ?? [],
      springCourses: springCourses ?? [],
      summerCourses: summerCourses ?? [],
    },
    professors: (
      users?.map<Professor>((user) => {
        return {
          displayName: user.displayName ?? '',
          fallTermCourses: 2,
          springTermCourses: 2,
          summerTermCourses: 2,
          preferences:
            user.preferences?.map((preference) => {
              return {
                courseNum: preference.id.subject + preference.id.code,
                // term: preference.id.term,
                preferenceNum: preference.preference,
              };
            }) ?? [],
        };
      }) ?? []
    ).filter((p) => p.preferences.length > 0),
  };

  const alg1CheckSchedule = ctx.algorithm(Company.Company3).algo1Cs;
  const response = await alg1CheckSchedule?.(payload);
  console.log(
    'RESPONSE: ',
    response?.status
    // JSON.stringify(response?.config.data)
  );
  return response;
}

async function generateScheduleWithCapacities(
  ctx: Context,
  input: GenerateScheduleInput,
  falltermCourses: CourseInput[],
  summertermCourses: CourseInput[],
  springtermCourses: CourseInput[],
  users: User[] | null,
  capacities: CourseObject[]
) {
  const courseToCourseInput = (term: Term) => (input: CourseInput) => ({
    subject: input.subject,
    courseNumber: input.code,
    numSections: input.section,
    courseCapacity:
      capacities.find((course) => {
        return (
          course.subject === input.subject &&
          course.code === input.code &&
          course.semester === term
        );
      })?.capacity ?? 0,
    // default capacity to 0 if not found
    courseTitle: 'Untitled(New Course)',
    // Course title is returned by algo1 as we send it but they just send it back.
    // The course title they send back matters when it's a course we don't have in
    // our db. The new course gets inserted with this courseTitle.
    sequenceNumber: 'A01',
    streamSequence: getSeqNumber(input.subject, input.code),
  });

  const payload: SchedulePostRequest = {
    // in theory only one of the term arrays will be populated with values
    coursesToSchedule: {
      fallCourses: falltermCourses.map(courseToCourseInput(Term.Fall)),
      springCourses: springtermCourses.map(courseToCourseInput(Term.Spring)),
      summerCourses: summertermCourses.map(courseToCourseInput(Term.Summer)),
    },
    hardScheduled: {
      fallCourses: [],
      springCourses: [],
      summerCourses: [],
    },
    professors: (
      users?.map((user) => {
        return {
          displayName: user.displayName ?? '',
          fallTermCourses: 1,
          springTermCourses: 1,
          summerTermCourses: 1,
          preferences:
            user.preferences?.map((preference) => {
              return {
                courseNum: preference.id.subject + preference.id.code,
                term: preference.id.term,
                preferenceNum: preference.preference,
              };
            }) ?? [],
        };
      }) ?? []
    ).filter((p) => p.preferences.length > 0),
  };

  const alg1 = ctx.algorithm(input.algorithm1).algo1;
  //  const fs = require('fs');
  //  await fs.promises.writeFile(
  //    '/tmp/payload.json',
  //    JSON.stringify(payload, null, 2),
  //    'utf8'
  //  );
  //  console.log('Saved agl1 payload to /tmp/payload.json');

  const response = await alg1(payload);

  return response;
}
