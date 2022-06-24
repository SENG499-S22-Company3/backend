import { getISOTime, getMeetingDays } from './time';
import { zonedTimeToUtc } from 'date-fns-tz';
import { PrismaClient, Term } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Takes a list of course sections in the format of the historical dataset
 * along with the corresponding term and seeds the database with the course sections
 *
 * @param courseSections An array of course sections
 * @param term The corresponding term of the course sections
 */

export const addCourseSections = async (
  courseSections: Array<any>,
  term: Term
) => {
  for (const courseSection of courseSections) {
    const meetingTime = courseSection.meetingTime;

    // Time
    const beginTimeISO = getISOTime(meetingTime.beginTime);
    const endTimeISO = getISOTime(meetingTime.endTime);

    // Day
    const days = getMeetingDays(meetingTime);

    const startDate = zonedTimeToUtc(
      new Date(meetingTime.startDate),
      'America/Los_Angeles'
    ).toISOString();

    const endDate = zonedTimeToUtc(
      new Date(meetingTime.endDate),
      'America/Los_Angeles'
    ).toISOString();

    let currentCourse = await prisma.course.findFirst({
      where: {
        subject: courseSection.subject,
        courseCode: courseSection.courseNumber,
        term: term,
        title: courseSection.courseTitle,
      },
    });

    if (!currentCourse) {
      // Create course
      currentCourse = await prisma.course.create({
        data: {
          subject: courseSection.subject,
          courseCode: courseSection.courseNumber,
          term: term,
          title: courseSection.courseTitle,
        },
      });
    } else {
      // Update course
      await prisma.course.update({
        where: {
          id: currentCourse.id,
        },
        data: {
          subject: courseSection.subject,
          courseCode: courseSection.courseNumber,
          term: term,
          title: courseSection.courseTitle,
        },
      });
    }

    let section = await prisma.courseSection.findFirst({
      where: {
        course: {
          id: currentCourse.id,
        },
        sectionNumber: courseSection.sequenceNumber,
        startDate: startDate,
        endDate: endDate,
        hoursPerWeek: meetingTime.hoursWeek,
        capacity: 100,
      },
    });

    if (!section) {
      // Create section
      section = await prisma.courseSection.create({
        data: {
          course: {
            connect: {
              id: currentCourse.id,
            },
          },
          sectionNumber: courseSection.sequenceNumber,
          startDate: startDate,
          endDate: endDate,
          hoursPerWeek: meetingTime.hoursWeek,
          capacity: 100,
          schedule: {
            connect: {
              id: 1,
            },
          },
        },
      });

      await prisma.meetingTime.create({
        data: {
          startTime: beginTimeISO,
          endTime: endTimeISO,
          days: days,
          courseSection: {
            connect: {
              id: section.id,
            },
          },
        },
      });
    } else {
      // Update section
      await prisma.courseSection.update({
        where: {
          id: section.id,
        },
        data: {
          course: {
            connect: {
              id: currentCourse.id,
            },
          },
          sectionNumber: courseSection.sequenceNumber,
          startDate: startDate,
          endDate: endDate,
          hoursPerWeek: meetingTime.hoursWeek,
          capacity: 100,
          schedule: {
            connect: {
              id: 1,
            },
          },
        },
      });
    }
  }
};
