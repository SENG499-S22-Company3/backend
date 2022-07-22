import {
  Course,
  CoursePreference,
  TeachingPreference,
  User as PrismaUser,
} from '@prisma/client';
import {
  Preference,
  Professor,
  Schedule as ScheduleAlgorithm,
  SchedulePostRequest,
} from '../client/algorithm1/api';
import { CourseObject } from '../client/algorithm2';

import {
  findCourseSection,
  getAllCourses,
  upsertCourses,
} from '../prisma/course';
import { findSchedule, initiateSchedule } from '../prisma/schedule';
import { findAllUsers, findUserById, updateUserSurvey } from '../prisma/user';
import {
  CourseInput,
  CourseSection,
  Day,
  GenerateScheduleInput,
  MeetingTime,
  Role,
  Schedule,
  Term,
  User,
} from '../schema';
import { getSeqNumber, prefValue } from '../utils';

const defaultPref = prefValue();

export {
  getMe,
  getAll,
  getUserByID,
  getCourses,
  getSchedule,
  prepareScheduleWithCapacities,
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
    if (!course.user) {
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
    }
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

export function prepareCourseCapacities({
  fallCourses,
  springCourses,
  summerCourses,
}: GenerateScheduleInput): CourseObject[] | null {
  const fall = fallCourses ?? [];
  const spring = springCourses ?? [];
  const summer = summerCourses ?? [];

  if (summer.length + spring.length + fall.length === 0) {
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

  const summerRequest: CourseObject[] = summer.map((course) =>
    courseMapper(course, Term.Summer)
  );

  const springRequest: CourseObject[] = spring.map((course) =>
    courseMapper(course, Term.Spring)
  );

  const fallRequest: CourseObject[] = fall.map((course) =>
    courseMapper(course, Term.Fall)
  );

  const combinedRequest = ([] as CourseObject[]).concat(
    summerRequest,
    springRequest,
    fallRequest
  );
  return combinedRequest;
}

async function prepareScheduleWithCapacities(
  { fallCourses, springCourses, summerCourses }: GenerateScheduleInput,
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

  const users = await findAllUsers();
  const courses = await getAllCourses();

  const defaultCourses = 2;

  const profs = users.map<Professor>((user) => {
    // preferred number of courses to be taught by a prof in a given term
    const fallTermCourses = user.preference.find((p) => p.fallTermCourses);
    const springTermCourses = user.preference.find((p) => p.springTermCourses);
    const summerTermCourses = user.preference.find((p) => p.summerTermCourses);

    // while the schema returns multiple instances of a teaching preference survey for a user
    // we can only have one teaching pref for a given user by a unique contraint on the user id field.
    const preferences = user.preference.flatMap<Preference>((teachingPref) =>
      teachingPref.coursePreference.map(
        ({ course: { subject, courseCode, term }, preference }) => ({
          courseNum: `${subject}${courseCode}`,
          preferenceNum: preference,
          term,
        })
      )
    );

    const userPrefs = new Map<string, number>(
      preferences.map((p) => [
        `${p.courseNum}-${p.term ?? ''}`,
        p.preferenceNum,
      ])
    );

    // inject default values for preference if not found
    const prefs = courses.map<Preference>(({ subject, courseCode, term }) => ({
      courseNum: `${subject}${courseCode}`,
      preferenceNum:
        userPrefs.get(`${subject}${courseCode}-${term}`) ?? defaultPref,
      term,
    }));

    return {
      // fallback to username for display name
      displayName: user.displayName ?? user.username,
      // default values to pass into algorithm 1
      fallTermCourses: fallTermCourses?.fallTermCourses ?? defaultCourses,
      springTermCourses: springTermCourses?.springTermCourses ?? defaultCourses,
      summerTermCourses: summerTermCourses?.summerTermCourses ?? defaultCourses,
      preferences: prefs,
    };
  });

  const payload: SchedulePostRequest = {
    // in theory only one of the term arrays will be populated with values
    coursesToSchedule: {
      fallCourses: fallCourses?.map(courseToCourseInput(Term.Fall)) ?? [],
      springCourses: springCourses?.map(courseToCourseInput(Term.Spring)) ?? [],
      summerCourses: summerCourses?.map(courseToCourseInput(Term.Summer)) ?? [],
    },
    hardScheduled: {
      fallCourses: [],
      springCourses: [],
      summerCourses: [],
    },
    // avoid sending profs with no preferences.
    professors: profs.filter((prof) => prof.preferences.length > 0),
  };

  return payload;
}
