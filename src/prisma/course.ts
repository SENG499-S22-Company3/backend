import { Term } from '@prisma/client';
import { prisma } from './index';
export { findCourseSection, getAllCourses };

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

/**
 * Retrieve all the courses in the database. Used to retrieve a list
 * of courses that the professor can submit a preference for
 */
async function getAllCourses() {
  return await prisma.course.findMany();
}
