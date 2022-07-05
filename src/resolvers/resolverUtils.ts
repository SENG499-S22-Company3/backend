import { findUserById } from '../prisma/user';
import { findCourseSection } from '../prisma/course';
import { findSchedule } from '../prisma/schedule';
import {
  User,
  CourseSection,
  Schedule,
  Term,
  Role,
  Day,
  MeetingTime,
} from '../schema';
import { Context } from '../context';
export { getMe, getUserByID, getCourses, getSchedule };

async function getMe(ctx: Context): Promise<User | null> {
  if (!ctx.session.user) return null;

  return {
    id: ctx.session.user.id,
    username: ctx.session.user.username,
    password: ctx.session.user.password,
    role: ctx.session.user.role as Role,
    preferences: [],
    active: ctx.session.user.active,
  };
}

async function getUserByID(id: number): Promise<User | null> {
  const user = await findUserById(id);

  if (!user) return null;

  return {
    id: user.id,
    username: user.username,
    password: user.password,
    role: user.role as Role,
    preferences: [],
    active: user.active,
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
