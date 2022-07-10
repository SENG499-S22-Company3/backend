import { findUserById, findAllUsers, updateUserSurvey } from '../prisma/user';
import { findCourseSection, upsertCourses } from '../prisma/course';
import { findSchedule, initiateSchedule } from '../prisma/schedule';
import {
  User,
  CourseSection,
  Schedule,
  Term,
  Role,
  Day,
  MeetingTime,
  GenerateScheduleInput,
  CourseInput,
} from '../schema';
import { Context } from '../context';

import {
  SchedulePostRequest,
  Schedule as ScheduleAlgorithm,
} from '../client/algorithm1/api';
import { getSeqNumber } from '../utils';
import {
  User as PrismaUser,
  Course,
  CoursePreference,
  TeachingPreference,
} from '@prisma/client';
import { CourseObject } from '../client/algorithm2';
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

async function getMe(ctx: Context): Promise<User | null> {
  if (!ctx.session.user) return null;

  return {
    id: ctx.session.user.id,
    username: ctx.session.user.username,
    displayName: ctx.session.user.displayName,
    password: ctx.session.user.password,
    role: ctx.session.user.role as Role,
    preferences: prismaPrefsToGraphQLPrefs(ctx.session.user.preference),
    active: ctx.session.user.active,
    hasPeng: ctx.session.user.hasPeng,
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
      return {
        CourseID: {
          code: course.course.courseCode,
          subject: course.course.subject,
          title: course.course.title,
          term: course.course.term as any,
        },
        capacity: course.capacity,
        sectionNumber: course.sectionNumber,
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
            preferences: [], // Hardcoded now as mapping is not working on coursePreferences array
            // prismaPrefsToGraphQLPrefs(course.course.coursePreference),
            active: course.user.active,
            hasPeng: course.user.hasPeng,
          },
        ],
      };
    }),
  };
}

async function createSchedule(
  year: number,
  term: Term,
  scheduleData: ScheduleAlgorithm
) {
  const schedule = await initiateSchedule(year);

  if (term === Term.Fall) {
    scheduleData.fallCourses?.forEach(async (course) => {
      await upsertCourses(course, term, year, schedule);
    });
  } else if (term === Term.Spring) {
    scheduleData.springCourses?.forEach(async (course) => {
      await upsertCourses(course, term, year, schedule);
    });
  } else if (term === Term.Summer) {
    scheduleData.summerCourses?.forEach(async (course) => {
      await upsertCourses(course, term, year, schedule);
    });
  }
}

async function getCourseCapacities(ctx: Context, input: GenerateScheduleInput) {
  if (!input.courses) return null;

  const request: CourseObject[] = input.courses.map((course) => {
    return {
      subject: course.subject,
      code: course.code,
      seng_ratio: 0.75,
      semester: input.term,
      capacity: 0,
    };
  });

  const alg2 = ctx.algorithm(input.algorithm2).algo2;

  const algorithm2Response = await alg2(request);

  return algorithm2Response;
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
    courseTitle: 'testing',
    // TODO: figure out best value here
    sequenceNumber: 'testing',
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
    ).filter((p) => p.preferences.length > 0) as any,
  };

  const alg1 = ctx.algorithm(input.algorithm1).algo1;
  const response = await alg1(payload);

  return response;
}
