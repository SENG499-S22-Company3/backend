import { Term } from '@prisma/client';
import { prisma } from './index';
export { findCourses, findMeetingTime, findCourseSection };

async function findCourses(courseterm: Term) {
  console.log('Getting Courses');
  const courses = await prisma.course.findMany({
    where: { term: courseterm },
    include: { courseSection: true, coursePreference: true },
  });

  return courses;
}

async function findCourseSection(courseid: number) {
  console.log('Getting Courses');
  const courses = await prisma.courseSection.findFirst({
    where: { courseId: courseid },
    include: { course: true },
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
