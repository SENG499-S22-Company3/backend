import { PrismaClient, Term, Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import historicalData from '../data/historical-data-2019.json';
import { addCourseSections } from '../src/utils';

const prisma = new PrismaClient();

async function seedUsers(): Promise<void> {
  // create default users

  // Admin
  await prisma.user.upsert({
    where: {
      username: 'testadmin',
    },

    create: {
      displayName: 'Test Admin',
      username: 'testadmin',
      password: await bcrypt.hash('testpassword', 10),
      active: true,
      hasPeng: false,
      role: Role.ADMIN,
    },

    update: {
      displayName: 'Test Admin',
      username: 'testadmin',
      password: await bcrypt.hash('testpassword', 10),
      active: true,
      hasPeng: false,
      role: Role.ADMIN,
    },
  });

  // User
  await prisma.user.upsert({
    where: {
      username: 'testuser',
    },

    create: {
      displayName: 'Test user',
      username: 'testuser',
      password: await bcrypt.hash('testpassword', 10),
      active: true,
      hasPeng: false,
      role: Role.USER,
    },

    update: {
      displayName: 'Test user',
      username: 'testuser',
      password: await bcrypt.hash('testpassword', 10),
      active: true,
      hasPeng: false,
      role: Role.USER,
    },
  });
}

async function seedSections(): Promise<void> {
  const fallSections = historicalData?.fallTermCourses;
  const springSections = historicalData?.springTermCourses;
  const summerSections = historicalData?.summerTermCourses;

  const fall: Term = 'FALL';
  const spring: Term = 'SPRING';
  const summer: Term = 'SUMMER';

  // Create a schedule object
  await prisma.schedule.upsert({
    where: {
      id: 1,
    },
    create: {
      year: 2019,
    },
    update: {},
  });

  // Add a years worth of course sections
  await Promise.all([
    addCourseSections(fallSections, fall),
    addCourseSections(springSections, spring),
    addCourseSections(summerSections, summer),
  ]);
}

// A `main` function so that you can use async/await
async function main() {
  await Promise.all([seedUsers(), seedSections()]);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
