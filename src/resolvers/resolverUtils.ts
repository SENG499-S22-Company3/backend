import { findUserById } from '../prisma/user';
import { findCourses, findMeetingTime } from '../prisma/course';
import { findSchedule } from '../prisma/schedule';
import { User, CourseSection, Schedule, Term, Role, Day } from '../schema';
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

async function getCourses(term: Term): Promise<CourseSection> {
  const courses = await findCourses(term);
  if (!courses) return failedCourses;
  let user;
  let profs;
  let meetingTimes;
  let meetingSlots;
  if (courses[0].courseSection[0].userId)
    user = await findUserById(courses[0].courseSection[0].userId);

  if (!user) profs = failedMeandID;
  else
    profs = {
      id: user.id,
      username: user.username,
      password: user.password,
      role: user.role as Role,
      preferences: [],
      active: user.active,
    };

  if (courses[0].courseSection[0].meetingTimeId)
    meetingTimes = await findMeetingTime(
      courses[0].courseSection[0].meetingTimeId
    );

  if (!meetingTimes) meetingSlots = failedMeeting;
  else
    meetingSlots = {
      day: meetingTimes.days[0] as Day, // How to include all the values in the array day[]
      startTime: meetingTimes.startTime,
      endTime: meetingTimes.endTime,
    };

  // return courses.map((course) => {
  //   return {
  //       CourseID: {
  //         subject: course.subject,
  //         code: course.courseCode,
  //         term: course.term as Term,
  //       },
  //       hoursPerWeek: course.courseSection[0].hoursPerWeek,
  //       capacity: course.courseSection[0].capacity,
  //       professors: [],
  //       startDate: course.courseSection[0].startDate,
  //       endDate: course.courseSection[0].endDate,
  //       meetingTimes: [],
  //     };
  // })

  return {
    CourseID: {
      subject: courses[0].subject,
      code: courses[0].courseCode,
      term: courses[0].term as Term,
    },
    hoursPerWeek: courses[0].courseSection[0].hoursPerWeek,
    capacity: courses[0].courseSection[0].capacity,
    professors: [profs],
    startDate: courses[0].courseSection[0].startDate,
    endDate: courses[0].courseSection[0].endDate,
    meetingTimes: [meetingSlots],
  };
}

async function getSchedule(year: number): Promise<Schedule> {
  const schedule = await findSchedule(year);

  if (!schedule) return failedSchedule;

  return {
    id: `${schedule.id}`, // schedule.id.toString not working
    year: schedule.year,
    createdAt: schedule.createdOn,
    courses: [],
  };
}
