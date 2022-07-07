import { findUserById, findAllUsers } from '../prisma/user';
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
import { Schedule as ScheduleAlgorithm } from './types';
import { SchedulePostRequest } from '../client/algorithm1/api';
import axios, { AxiosResponse } from 'axios';
import { appendDay } from '../utils';
export {
  getMe,
  getAll,
  getUserByID,
  getCourses,
  getSchedule,
  connectAlgorithm2,
  connectAlgorithm1,
  createSchedule,
};

async function getMe(ctx: Context): Promise<User | null> {
  if (!ctx.session.user) return null;

  return {
    id: ctx.session.user.id,
    username: ctx.session.user.username,
    displayName: ctx.session.user.displayName,
    password: ctx.session.user.password,
    role: ctx.session.user.role as Role,
    preferences: [],
    active: ctx.session.user.active,
    hasPeng: ctx.session.user.hasPeng,
  };
}

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
      preferences: [],
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
    preferences: [],
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
    }),
  };
}

async function createSchedule(
  year: number,
  term: Term,
  algorithm1Data: AxiosResponse<ScheduleAlgorithm, any>
) {
  const schedule = await initiateSchedule(year);

  algorithm1Data.data.summerTermCourses?.forEach(
    async (course: {
      meetingTime: {
        monday: boolean;
        tuesday: boolean;
        wednesday: boolean;
        thursday: boolean;
        friday: boolean;
        saturday: boolean;
        sunday: boolean;
        beginTime: string;
        endtime: string;
        hoursWeek: any;
      };
      courseNumber: string;
      courseTitle: any;
      subject: string;
      sequenceNumber: any;
    }) => {
      let days = appendDay(course.meetingTime.monday, 'MONDAY', []);
      days = appendDay(course.meetingTime.tuesday, 'TUESDAY', days);
      days = appendDay(course.meetingTime.wednesday, 'WEDNESDAY', days);
      days = appendDay(course.meetingTime.thursday, 'THURSDAY', days);
      days = appendDay(course.meetingTime.friday, 'FRIDAY', days);
      days = appendDay(course.meetingTime.saturday, 'SATURDAY', days);
      days = appendDay(course.meetingTime.sunday, 'SUNDAY', days);

      await upsertCourses(course, term, year, schedule, days);
    }
  );
}

async function connectAlgorithm2(
  input: GenerateScheduleInput
): Promise<any | null> {
  const algorithm2Url = 'https://algorithm-2.herokuapp.com/predict_class_size';
  if (!input.courses) return null;

  const algorithm2Response = await axios.post<ScheduleAlgorithm>(
    `${algorithm2Url}`,
    input.courses.map((course) => {
      return {
        subject: course.subject,
        code: course.code,
        seng_ratio: 0.75,
        semester: input.term,
        capacity: 0,
      };
    })
  );
  return algorithm2Response;
}

async function connectAlgorithm1(
  falltermCourses: CourseInput[],
  summertermCourses: CourseInput[],
  springtermCourses: CourseInput[],
  users: User[] | null
  // TODO: Grab Algorithm2data as algorithm2response
): Promise<any | null> {
  const baseUrl = 'https://schedulater-algorithm1.herokuapp.com';
  const algorithm1Response = await axios.post<ScheduleAlgorithm>(
    `${baseUrl}/schedule`,
    {
      coursesToSchedule: {
        fallCourses: falltermCourses.map((course) => {
          return {
            subject: course.subject,
            courseNumber: course.code,
            numSections: course.section,
            courseCapacity: 0, // TODO: set capacity from algorithm2Response? but how??
            courseTitle: 'testing',
            sequenceNumber: 'test',
            streamSequence: 'test',
          };
        }),
        springCourses: springtermCourses.map((course) => {
          return {
            subject: course.subject,
            courseNumber: course.code,
            numSections: course.section,
            courseCapacity: 0, // TODO: set capacity from algorithm2Response? but how??
            courseTitle: 'testing',
            sequenceNumber: 'test',
            streamSequence: 'test',
          };
        }),
        summerCourses: summertermCourses.map((course) => {
          return {
            subject: course.subject,
            courseNumber: course.code,
            numSections: course.section,
            courseCapacity: 0, // TODO: set capacity from algorithm2Response? but how??
            courseTitle: 'testing',
            sequenceNumber: 'test',
            streamSequence: 'test',
          };
        }),
      },
      hardScheduled: {
        fallCourses: [],
        springCourses: [],
        summerCourses: [],
      },
      professors: users?.map((user) => {
        return {
          displayName: user.displayName,
          preferences: user.preferences?.map((preference) => {
            return {
              subject: preference.id.subject,
              courseNum: preference.id.code,
              term: preference.id.term,
              preferenceNum: preference.preference,
            };
          }),
        };
      }),
    } as SchedulePostRequest
  );
  return algorithm1Response;
}
