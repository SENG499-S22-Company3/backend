import { prisma } from './index';
export { findSchedule };

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
