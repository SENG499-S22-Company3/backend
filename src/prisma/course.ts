import { Schedule, Term } from '@prisma/client';
import { prisma } from './index';
export { findCourseSection, upsertCourses };
import * as utils from '../utils';
import { getTime } from '../utils/time';

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

async function upsertCourses(
  course: any,
  courseterm: Term,
  scheduleyear: number,
  schedule: Schedule,
  days: any[]
) {
  const startDate = getTime(course.meetingTime.beginTime);
  startDate.setFullYear(scheduleyear, 4, 1);
  const endDate = getTime(course.meetingTime.endtime);
  endDate.setFullYear(scheduleyear, 7, 1);

  await prisma.course.upsert({
    create: {
      courseCode: course.courseNumber,
      title: course.courseTitle,
      subject: course.subject,
      term: courseterm,
      streamSequence: utils.getSeqNumber(course.subject, course.courseNumber),
      courseSection: {
        create: {
          sectionNumber: course.sequenceNumber,
          capacity: 0,
          startDate,
          endDate,
          hoursPerWeek: course.meetingTime.hoursWeek,
          schedule: { connect: { id: schedule.id } },
          meetingTime: {
            create: {
              startTime: startDate,
              endTime: endDate,
              days: days as any[],
            },
          },
        },
      },
    },
    update: {
      courseSection: {
        create: {
          sectionNumber: course.sequenceNumber,
          capacity: 0,
          startDate,
          endDate,
          hoursPerWeek: course.meetingTime.hoursWeek,
          schedule: { connect: { id: schedule.id } },
          meetingTime: {
            create: {
              startTime: startDate,
              endTime: endDate,
              days: days as any[],
            },
          },
        },
      },
    },
    where: {
      subject_courseCode_term: {
        courseCode: course.courseNumber,
        subject: course.subject,
        term: courseterm,
      },
    },
  });
}
