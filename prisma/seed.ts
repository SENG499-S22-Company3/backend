import { PrismaClient, Term } from '@prisma/client';
import bcrypt from 'bcrypt';
import {} from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import { Role } from '../src/schema';
import historicalData from '../data/historical-data-2019.json';
import { addCourseSections } from '../src/utils';

const prisma = new PrismaClient();

// A `main` function so that you can use async/await
async function main() {
  const fallSections = historicalData?.fallTermCourses;
  const springSections = historicalData?.springTermCourses;
  const summerSections = historicalData?.summerTermCourses;

  const fall: Term = 'FALL';
  const spring: Term = 'SPRING';
  const summer: Term = 'SUMMER';

  //Add a years worth of course sections
  await Promise.all([
    addCourseSections(fallSections, fall),
    addCourseSections(springSections, spring),
    addCourseSections(summerSections, summer),
  ]);

  // create default development admin user
  const user = await prisma.user.upsert({
    where: {
      username: 'testuser',
    },

    create: {
      displayName: 'Test User',
      username: 'testuser',
      password: await bcrypt.hash('testpassword', 10),
      active: true,
      hasPeng: false,
      role: Role.Admin,
    },

    update: {},
  });
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
