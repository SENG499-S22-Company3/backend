import { prisma } from './index';

/* export async function findSurvey() {
  const findTeachingPreferenceSurvey =
    await prisma.teachingPreference.findFirst({
      take: 2,
      include: {
        coursePreference: {
          include: {
            course: true,
          },
        },
      },
    });
  return findTeachingPreferenceSurvey;
}*/
export async function findSurvey() {
  const findTeachingPreferenceSurvey = await prisma.teachingPreference.findMany(
    {
      include: {
        coursePreference: {
          include: {
            course: true,
          },
        },
      },
    }
  );
  return findTeachingPreferenceSurvey;
}
