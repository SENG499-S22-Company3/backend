import { Schedule, Term } from '@prisma/client';
import { prisma } from './index';
export { findCourseSection, upsertCourses };
import * as utils from '../utils';
import { getTime, getDateTime } from '../utils/time';
import { Assignment, Course } from '../client/algorithm1';

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

const getMaxHoursPerWeek = (assignments: Assignment[] | undefined): number => {
  if (!assignments) return 0;
  return Math.max(...assignments.map((h) => h.hoursWeek));
};

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

const assignmentsToMeetingTime = (assignments?: Assignment[] | undefined) => {
  if (!assignments) return [];
  return assignments.map((assignment) => {
    return {
      startTime: assignment.beginTime,
      endTime: assignment.endTime,
      days: getDays(assignment),
    };
  });
};

const getMinMaxDateTime = (
  term: Term,
  year: number,
  assignments: Assignment[] | undefined
) => {
  // example: Apr 05, 2019
  if (!assignments) return null;
  // assuming we get proper date objects

  const dates = assignments.map((assignment) => {
    // start
    if (assignment.startDate !== '' && assignment.endDate !== '') {
      return {
        start: getDateTime(assignment.beginTime, assignment.startDate),
        end: getDateTime(assignment.endTime, assignment.endDate),
      };
    }

    const startTime = getTime(assignment.beginTime);
    const endTime = getTime(assignment.endTime);

    if (term === Term.FALL) {
      startTime.setFullYear(year, 10, 1);
      endTime.setFullYear(year, 11, 1);
    } else if (term === Term.SPRING) {
      startTime.setFullYear(year, 0, 1);
      endTime.setFullYear(year, 3, 1);
    } else if (term === Term.SUMMER) {
      startTime.setFullYear(year, 4, 1);
      endTime.setFullYear(year, 9, 1);
    }

    return {
      start: startTime,
      end: endTime,
    };
  });

  return {
    min: getMinDate(dates.map((d) => d.start)),
    max: getMaxDate(dates.map((d) => d.end)),
  };
};

const getMinDate = (dates: Date[]): Date =>
  new Date(Math.min(...dates.map((d) => d.getTime())));

const getMaxDate = (dates: Date[]): Date =>
  new Date(Math.max(...dates.map((d) => d.getTime())));

async function upsertCourses(
  course: Course,
  term: Term,
  scheduleyear: number,
  schedule: Schedule
) {
  const startEnd = getMinMaxDateTime(term, scheduleyear, course.assignment);
  if (!startEnd) return;
  const startDate = startEnd.min;
  const endDate = startEnd.max;

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
          hoursPerWeek: getMaxHoursPerWeek(course.assignment),
          schedule: { connect: { id: schedule.id } },
          meetingTime: {
            createMany: {
              data: assignmentsToMeetingTime(course.assignment),
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
          hoursPerWeek: getMaxHoursPerWeek(course.assignment),
          schedule: { connect: { id: schedule.id } },
          meetingTime: {
            createMany: {
              data: assignmentsToMeetingTime(course.assignment),
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
