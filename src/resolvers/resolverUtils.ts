import { findUserById } from '../prisma/user';
import { findCourseSection } from '../prisma/course';
import { findSchedule } from '../prisma/schedule';
import { User, CourseSection, Schedule, Term, Role, Day } from '../schema';
import { Context } from '../context';
export { getMe, getUserByID, getCourses, getSchedule };

const failedMeandID: User = {
  id: 0,
  username: 'Not Found',
  password: 'Not Found',
  role: Role.User,
  preferences: [],
  active: false,
};

const failedSchedule: Schedule = {
  id: 'Not Found',
  year: 0,
  createdAt: Date,
  courses: [],
};

const failedCourses: CourseSection = {
  CourseID: {
    subject: 'not found',
    code: 'not found',
    term: Term.Fall,
  },
  hoursPerWeek: 0,
  capacity: 0,
  professors: [],
  startDate: 0,
  endDate: 0,
  meetingTimes: [],
};

async function getMe(ctx: Context): Promise<User> {
  if (!ctx.session.user) return failedMeandID;

  return {
    id: ctx.session.user.id,
    username: ctx.session.user.username,
    password: ctx.session.user.password,
    role: ctx.session.user.role as Role,
    preferences: [],
    active: ctx.session.user.active,
  };
}

async function getUserByID(id: number): Promise<User> {
  const user = await findUserById(id);

  if (!user) return failedMeandID;

  return {
    id: user.id,
    username: user.username,
    password: user.password,
    role: user.role as Role,
    preferences: [],
    active: user.active,
  };
}

async function getCourses(term: Term): Promise<CourseSection[]> {
  const courses = await findCourseSection(term);

  if (!courses) return [failedCourses];

  return courses.map<CourseSection>((course: any) => {
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
      meetingTimes: course.meetingTime.days.map((day: Day) => ({
        day: day as Day,
        endTime: course.meetingTime.endTime,
        startTime: course.meetingTime.startTime,
      })),
    };
  });
}

async function getSchedule(year: number): Promise<Schedule> {
  const schedule = await findSchedule(year);

  if (!schedule) return failedSchedule;
  const course = await getCourses(Term.Fall); // Have to add term in schedule? As of now it is hardcoded
  return {
    id: `${schedule.id}`,
    year: schedule.year,
    createdAt: schedule.createdOn,
    courses: course,
  };
}
