import { Term } from '@prisma/client';
import { prisma } from './index';
export { findCourseSection };

async function findCourseSection(courseterm: Term) {
  const courses = await prisma.courseSection.findMany({
    where: {
      course: {
        term: courseterm,
      },
    },
    include: { course: true, meetingTime: true, user: true, schedule: true },
  });

  return courses;
}
