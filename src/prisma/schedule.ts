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
