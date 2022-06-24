import { prisma } from './index';
export { findSchedule };

async function findSchedule(scheduleyear: number) {
  const schedule = await prisma.schedule.findFirst({
    where: { year: scheduleyear },
    include: { courseSection: true },
  });

  return schedule;
}
