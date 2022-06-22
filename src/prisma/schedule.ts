import { PrismaClient } from '@prisma/client';
export { findSchedule };

const prisma = new PrismaClient();

async function findSchedule(scheduleyear: number) {
  const schedule = await prisma.schedule.findFirst({
    where: { year: scheduleyear },
    include: { courseSection: true },
  });

  return schedule;
}
