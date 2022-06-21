import { lookupUser, lookupId, lookupCourses, lookupSchedule } from '../prisma';
import { User, CourseSection, Schedule, CourseId, Term, Role } from '../schema';
export { getMe, getUserByID, getCourses, getSchedule };

const failedMeandID = {
  id: 0,
  username: 'Not Found',
  password: 'Not Found',
  role: Role.User,
  preferences: [],
  active: false,
};

const failedSchedule = {
  id: 'Not Found',
  year: 0,
  createdAt: Date,
  courses: [],
};

async function getMe(username: string): Promise<User> {
  const user = await lookupUser(username);

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

async function getUserByID(id: number): Promise<User> {
  const user = await lookupId(id);

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

async function getCourses(term: Term): Promise<CourseSection> {
  const courses = await lookupCourses(term);

  return {
    CourseID: courses[0].courseSection[0].courseId as unknown as CourseId,
    hoursPerWeek: courses[0].courseSection[0].hoursPerWeek,
    capacity: courses[0].courseSection[0].capacity,
    professors: [],
    startDate: courses[0].courseSection[0].startDate,
    endDate: courses[0].courseSection[0].endDate,
    meetingTimes: [],
  };
}

async function getSchedule(year: number | undefined): Promise<Schedule> {
  const schedule = await lookupSchedule(year || undefined);

  if (!schedule) return failedSchedule;

  return {
    id: 'test', // schedule.id.toString not working
    year: schedule.year,
    createdAt: schedule.createdOn,
    courses: [],
  };
}
