import { PrismaClient, Term } from '@prisma/client';
export { findCourses, findMeetingTime };

const prisma = new PrismaClient();

async function findCourses(courseterm: Term) {
  console.log('Getting Courses');
  const courses = await prisma.course.findMany({
    where: { term: courseterm },
    include: { courseSection: true, coursePreference: true },
  });

  return courses;
}

async function findMeetingTime(meetingid: number) {
  const meetingTime = await prisma.meetingTime.findUnique({
    where: { id: meetingid },
    include: { courseSection: true },
  });

  return meetingTime;
}
