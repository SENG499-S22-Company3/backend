import { PrismaClient, Term } from '@prisma/client';
export { prisma, lookupUser, lookupId, lookupCourses, lookupSchedule };

const prisma = new PrismaClient();

async function lookupUser(username: string) {
  console.log(`looking up ${username}`);
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });
  console.log(user);
  return user;
}

async function lookupId(userid: number) {
  const finduser = await prisma.user.findUnique({
    where: { id: userid },
  });
  return finduser;
}

async function lookupCourses(courseterm: Term) {
  const courses = await prisma.course.findMany({
    where: { term: courseterm },
    include: { courseSection: true, coursePreference: true },
  });
  return courses;
}

async function lookupSchedule(year: number | undefined) {
  const schedule = await prisma.schedule.findUnique({
    where: {},
    include: { courseSection: true },
  });

  return schedule;
}
