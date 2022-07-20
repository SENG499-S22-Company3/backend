import { prisma } from './index';
import { CourseSectionInput } from '../schema';

export { findSchedule, initiateSchedule, updateCurrentSchedule };

async function findSchedule(scheduleyear: number) {
  const schedule = await prisma.schedule.findFirst({
    where: { year: scheduleyear },
    include: {
      courseSection: {
        include: {
          course: true,
          meetingTime: true,
          user: {
            include: {
              preference: {
                include: {
                  coursePreference: {
                    include: { course: true },
                  },
                },
              },
            },
          },
        },
      },
    },
    orderBy: { id: 'desc' },
  });

  return schedule;
}

async function initiateSchedule(scheduleyear: number) {
  const schedule = await prisma.schedule.create({
    data: {
      year: scheduleyear,
    },
  });
  return schedule;
}

async function updateCurrentSchedule(
  scheduleId: any,
  courses: CourseSectionInput[]
) {
  // Simply creates a new schedule instead of updating the current schedule

  try {
    const currentSchedule = await prisma.schedule.findFirst({
      where: {
        id: parseInt(scheduleId),
      },
    });

    if (currentSchedule) {
      // Delete course sections linked to original schedule
      await prisma.courseSection.deleteMany({
        where: {
          scheduleId: parseInt(scheduleId),
        },
      });

      // Delete original schedule
      await prisma.schedule.delete({
        where: {
          id: parseInt(scheduleId),
        },
      });
    }
  } catch (error) {
    return {
      success: false,
      message: 'Error deleting original schedule',
      errors: error,
    };
  }

  const currentYear = new Date().getFullYear();
  let newSchedule;

  try {
    newSchedule = await prisma.schedule.create({
      data: {
        year: currentYear,
      },
    });
  } catch (error) {
    return {
      success: false,
      message: 'Error creating new update schedule',
      errors: error,
    };
  }

  try {
    for (const course of courses) {
      // Rename day to days for prisma
      const newMeetingTimes = course.meetingTimes.map((meeting) => ({
        startTime: meeting.startTime,
        endTime: meeting.endTime,
        days: meeting.day,
      }));

      await prisma.courseSection.create({
        data: {
          hoursPerWeek: course.hoursPerWeek ?? 3,
          sectionNumber: course.sectionNumber ?? '',
          capacity: course.capacity ?? 100,
          startDate: course.startDate,
          endDate: course.endDate,
          user: {
            connect: {
              username: course.professors[0] ?? '',
            },
          },
          meetingTime: {
            createMany: {
              data: newMeetingTimes,
            },
          },
          course: {
            connect: {
              subject_courseCode_term: {
                subject: course.id.subject,
                courseCode: course.id.code,
                term: course.id.term,
              },
            },
          },
          schedule: {
            connect: {
              id: newSchedule.id,
            },
          },
        },
      });
    }
  } catch (error) {}

  return {
    success: true,
    message: 'Successfully updated schedule',
    errors: [],
  };
}
