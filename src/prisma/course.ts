import { Schedule, Term } from '@prisma/client';
import { prisma } from './index';
import * as utils from '../utils';
import { getTime, getDateTime } from '../utils/time';
import { Assignment, Course } from '../client/algorithm1';

export { findCourseSection, upsertCourses, getAllCourses };

async function findCourseSection(courseterm: Term) {
  const courses = await prisma.courseSection.findMany({
    where: {
      course: {
        term: courseterm,
      },
    },
    include: { course: true, meetingTime: true, user: true, schedule: true },
  });

  return courses;
}

/**
 * Retrieve all the courses in the database. Used to retrieve a list
 * of courses that the professor can submit a preference for
 */
async function getAllCourses() {
  return await prisma.course.findMany();
}

const getDays = (assignment: Assignment) => {
  let days = utils.appendDay(assignment.monday, 'MONDAY', []);
  days = utils.appendDay(assignment.tuesday, 'TUESDAY', days);
  days = utils.appendDay(assignment.wednesday, 'WEDNESDAY', days);
  days = utils.appendDay(assignment.thursday, 'THURSDAY', days);
  days = utils.appendDay(assignment.friday, 'FRIDAY', days);
  days = utils.appendDay(assignment.saturday, 'SATURDAY', days);
  days = utils.appendDay(assignment.sunday, 'SUNDAY', days);
  return days;
};

const assignmentToMeetingTime = (assignment: Assignment) => {
  return {
    startTime: getTime(assignment.beginTime),
    endTime: getTime(assignment.endTime),
    days: getDays(assignment),
  };
};

const getMinMaxDateTime = (
  term: Term,
  year: number,
  assignment: Assignment
) => {
  // example: Apr 05, 2019
  if (!assignment) return null;
  // assuming we get proper date objects

  if (assignment.startDate !== '' && assignment.endDate !== '') {
    return {
      start: getDateTime(assignment.beginTime, assignment.startDate),
      end: getDateTime(assignment.endTime, assignment.endDate),
    };
  }

  const startTime = getTime(assignment.beginTime);
  const endTime = getTime(assignment.endTime);

  // month in setFullYear indexes from 0
  if (term === Term.FALL) {
    // Sept (8)
    startTime.setFullYear(year, 8, 1);
    // Dec (11)
    endTime.setFullYear(year, 11, 1);
  } else if (term === Term.SPRING) {
    // Jan (0)
    startTime.setFullYear(year, 0, 1);
    // Apr (3)
    endTime.setFullYear(year, 3, 1);
  } else if (term === Term.SUMMER) {
    // May (4)
    startTime.setFullYear(year, 4, 1);
    // Aug (7)
    endTime.setFullYear(year, 8, 1);
  }

  return {
    min: startTime,
    max: endTime,
  };
};

async function upsertCourses(
  course: Course,
  term: Term,
  scheduleyear: number,
  schedule: Schedule
) {
  if (!course.assignment) return;
  const startEnd = getMinMaxDateTime(term, scheduleyear, course.assignment);
  if (!startEnd) return;

  const startDate = startEnd.start;
  const endDate = startEnd.end;
  if (!startDate || !endDate) return;

  const prof = await prisma.user.findFirst({
    where: {
      displayName: course.prof?.displayName,
    },
  });

  await prisma.course.upsert({
    create: {
      courseCode: course.courseNumber,
      title: course.courseTitle,
      subject: course.subject,
      term: term,
      streamSequence: utils.getSeqNumber(course.subject, course.courseNumber),
      courseSection: {
        create: {
          sectionNumber: course.sequenceNumber,
          capacity: course.courseCapacity,
          startDate,
          endDate,
          hoursPerWeek: 0,
          schedule: { connect: { id: schedule.id } },
          meetingTime: {
            create: assignmentToMeetingTime(course.assignment),
          },
          user: {
            connect: {
              id: prof?.id,
            },
          },
        },
      },
    },
    update: {
      courseSection: {
        create: {
          sectionNumber: course.sequenceNumber,
          capacity: course.courseCapacity,
          startDate,
          endDate,
          hoursPerWeek: course.assignment?.hoursWeek ?? 0,
          schedule: { connect: { id: schedule.id } },
          meetingTime: {
            create: assignmentToMeetingTime(course.assignment),
          },
          user: {
            connect: {
              id: prof?.id,
            },
          },
        },
      },
    },
    where: {
      subject_courseCode_term: {
        courseCode: course.courseNumber,
        subject: course.subject,
        term: term,
      },
    },
  });
}
