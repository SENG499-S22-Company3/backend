import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import teachingPref from '../data/teacher-pref-data.json';
import baseCourses from '../data/base_courses.json';
import { getSeqNumber } from '../src/utils';

const prisma = new PrismaClient();
const hash = bcrypt.hashSync('testpassword', 10);

async function seedUsers(): Promise<void> {
  // create default users
  // Admin
  const admin = {
    displayName: 'Test Admin',
    username: 'testadmin',
    password: hash,
    active: true,
    hasPeng: false,
    role: Role.ADMIN,
  };

  const user = {
    displayName: 'Test user',
    username: 'testuser',
    password: hash,
    active: true,
    hasPeng: false,
    role: Role.USER,
  };

  const tbd = {
    displayName: 'TBD',
    username: 'TBD',
    password: hash,
    active: false,
    hasPeng: false,
    role: Role.USER,
  };

  const res = await prisma.user.createMany({
    data: [admin, user, tbd],
  });
  console.log(`Seeded ${res.count} users`);
}

async function seedCourses(): Promise<void> {
  const res = await prisma.course.createMany({
    data: baseCourses.map((course) => ({
      subject: course.subject,
      courseCode: course.code,
      title: course.title,
      streamSequence: getSeqNumber(course.subject, course.code),
      term: course.term as any,
    })),
    skipDuplicates: true,
  });
  console.log(`Seeded ${res.count} courses`);
}

async function seedProfessors(): Promise<void> {
  const { professors } = teachingPref;
  const res = await prisma.user.createMany({
    data: professors.map((professor) => ({
      displayName: professor.displayName,
      username: professor.displayName
        // replace with generated username
        .replace(/[\s|,]/g, '')
        .toLocaleLowerCase(),
      password: hash,
      active: true,
      hasPeng: false,
      role: Role.USER,
    })),
    skipDuplicates: true,
  });
  console.log(`Seeded ${res.count} professors`);
}

// A `main` function so that you can use async/await
async function main() {
  // users used for testing and ci
  console.log('Seeding base users (admin, user, tbd)...');
  await seedUsers();
  console.log('Seeding courses...');
  await seedCourses();
  console.log('Seeding professors...');
  await seedProfessors();
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
