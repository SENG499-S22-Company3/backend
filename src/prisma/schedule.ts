import { prisma } from './index';
export { findSchedule, initiateSchedule };

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
