import { findUserById } from '../prisma/user';
import {
  findCourses,
  findMeetingTime,
  findCourseSection,
} from '../prisma/course';
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

const failedMeeting = {
  day: Day.Sunday,
  startTime: 0,
  endTime: 0,
};

const failedCourses = {
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
  const courses = await findCourses(term);

  if (!courses) return [failedCourses];
  let user: User;
  let meetingTimes: MeetingTime;

  const result = await Promise.all(
    courses.map(async (course) => {
      const courseSection = await findCourseSection(course.id);
      if (!courseSection) return failedCourses;

      if (courseSection.userId) user = await getUserByID(courseSection.userId);
      if (courseSection.meetingTimeId)
        meetingTimes = await getMeetingTime(courseSection.meetingTimeId);

      return {
        CourseID: {
          subject: course.subject,
          code: course.courseCode,
          term: course.term as Term,
        },
        hoursPerWeek: courseSection.hoursPerWeek,
        capacity: courseSection.capacity,
        professors: [user],
        startDate: courseSection.startDate,
        endDate: courseSection.endDate,
        meetingTimes: [meetingTimes],
      };
    })
  );

  return result;
}

async function getSchedule(year: number): Promise<Schedule> {
  const schedule = await findSchedule(year);

  if (!schedule) return failedSchedule;
  const course = await getCourses(Term.Fall); // Have to add term in schedule? As of now it is hardcoded
  console.log(course);
  return {
    id: `${schedule.id}`,
    year: schedule.year,
    createdAt: schedule.createdOn,
    courses: course,
  };
}

async function getMeetingTime(id: number): Promise<MeetingTime> {
  const meetingtime = await findMeetingTime(id);

  if (!meetingtime) return failedMeeting;

  const meetingSlots = {
    day: meetingtime.days[0] as Day, // How to include all the values of day as graphql day has a type of Day not Day[]
    startTime: meetingtime.startTime,
    endTime: meetingtime.endTime,
  };

  return meetingSlots;
}
