import { getISOTime, getMeetingDays } from './time';
import { zonedTimeToUtc } from 'date-fns-tz';
import { PrismaClient, Term, Role } from '@prisma/client';
import { getSeqNumber } from './courseSequenceNumber';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

/**
 * Adds the specified teaching and course preferences of a given prof
 * @param professor a professor object
 */

const pwsalt = bcrypt.genSaltSync(10);
const pwhash = bcrypt.hashSync('testpassword', pwsalt);

export async function addTeachingAndCoursePreferences(professor: any) {
  const [lastName, firstName] = professor.displayName.split(', ');

  const username = `${firstName}${lastName}`.toLowerCase().replace(/\s/g, '');

  // Create professor user if not created
  let currentProf = await prisma.user.findFirst({
    where: {
      username: username,
    },
  });

  if (!currentProf) {
    currentProf = await prisma.user.create({
      data: {
        active: true,
        hasPeng: true,
        password: pwhash,
        username: username,
        displayName: `${firstName} ${lastName}`,
        role: Role.USER,
      },
    });
  }

  // Create teaching pref if not created
  let currentTeachingPref = await prisma.teachingPreference.findFirst({
    where: {
      userId: currentProf.id,
    },
  });

  if (!currentTeachingPref) {
    currentTeachingPref = await prisma.teachingPreference.create({
      data: {
        hasRelief: true,
        studyLeave: true,
        topicsOrGradCourse: true,
        User: {
          connect: {
            id: currentProf.id,
          },
        },
      },
    });
  }

  for await (const pref of professor.prefs) {
    // Create course if not created
    const splitCourse = pref.courseNum.match(/[a-zA-Z]+|[0-9]+/g);

    if (splitCourse) {
      let currentCourse = await prisma.course.findFirst({
        where: {
          subject: splitCourse[0],
          courseCode: splitCourse[1],
        },
      });

      if (!currentCourse) {
        currentCourse = await prisma.course.create({
          data: {
            subject: splitCourse[0],
            courseCode: splitCourse[1],
            streamSequence: 'test',
            term: Term.FALL,
            title: pref.courseNum,
          },
        });
      }

      // Create course pref if not created
      let currentCoursePref = await prisma.coursePreference.findFirst({
        where: {
          courseId: currentCourse.id,
          teachPreferenceId: currentTeachingPref.id,
        },
      });

      if (!currentCoursePref) {
        currentCoursePref = await prisma.coursePreference.create({
          data: {
            course: {
              connect: {
                id: currentCourse.id,
              },
            },
            teachPreference: {
              connect: {
                id: currentTeachingPref.id,
              },
            },
            preference: pref.preferenceNum,
          },
        });
      }
    }
  }
}

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
          streamSequence: getSeqNumber(
            courseSection.subject,
            courseSection.courseNumber
          ),
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
          streamSequence: getSeqNumber(
            courseSection.subject,
            courseSection.courseNumber
          ),
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
