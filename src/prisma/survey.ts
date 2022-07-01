import { prisma } from './index';

export async function findSurvey() {
  const findTeachingPreferenceSurvey =
    await prisma.teachingPreference.findFirst({
      include: {
        coursePreference: {
          include: {
            course: true,
          },
        },
      },
    });
  return findTeachingPreferenceSurvey;
}
