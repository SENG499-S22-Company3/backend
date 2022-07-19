import { CreateTeachingPreferenceInput } from '../schema';
import { prisma } from './index';
export { findUserByUsername, findUserById, findAllUsers, updateUserSurvey };

async function findUserByUsername(username: string) {
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
    include: {
      preference: {
        include: {
          coursePreference: {
            include: { course: true },
          },
        },
      },
    },
  });
  return user;
}

async function findUserById(userid: number) {
  const finduser = await prisma.user.findUnique({
    where: { id: userid },
    include: {
      preference: {
        include: {
          coursePreference: {
            include: { course: true },
          },
        },
      },
    },
  });
  return finduser;
}

async function findAllUsers() {
  const allusers = await prisma.user.findMany({
    include: {
      preference: {
        include: {
          coursePreference: {
            include: { course: true },
          },
        },
      },
    },
  });
  return allusers;
}

async function updateUserSurvey(
  id: number,
  input: CreateTeachingPreferenceInput
) {
  const preferenceUpdateBody = {
    coursePreference: {
      create: input.courses.map((c) => {
        return {
          preference: c.preference,
          course: {
            connect: {
              subject_courseCode_term: {
                subject: c.subject,
                courseCode: c.code,
                term: c.term,
              },
            },
          },
        };
      }),
    },
    nonTeachingTerm1: input.nonTeachingTerm,
    hasRelief: input.hasRelief,
    reliefReason: input.reliefReason,
    studyLeave: false,
    topicsOrGradCourse: input.hasTopic,
    fallTermCourses: input.fallTermCourses ?? 2,
    springTermCourses: input.springTermCourses ?? 2,
    summerTermCourses: input.summerTermCourses ?? 2,
  };

  await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      preference: {
        upsert: {
          where: {
            userId: id,
          },
          update: preferenceUpdateBody,
          create: preferenceUpdateBody,
        },
      },
    },
  });
}
