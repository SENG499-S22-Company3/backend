import { PrismaClient, Term, Role } from '@prisma/client';
// import { UserInputError } from 'apollo-server-core';
import bcrypt from 'bcrypt';
import historicalData from '../data/historical-data-2019.json';
import { addCourseSections } from '../src/utils';
import userPref from '../input-test.json';

const prisma = new PrismaClient();
// let User: { id: any };
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

  // Other users
  /*
  await prisma.user.upsert({
    where: {
      username: 'BergCelina',
    },

    create: {
      displayName: 'Berg Celina',
      username: 'BergCelina',
      password: await bcrypt.hash('testpassword', 10),
      active: true,
      hasPeng: false,
      role: Role.USER,
    },

    update: {
      displayName: 'Berg Celina',
      username: 'BergCelina',
      password: await bcrypt.hash('testpassword', 10),
      active: true,
      hasPeng: false,
      role: Role.USER,
    },
  });*/
}

async function coursePreference(
  displayName: string,
  username: string,
  subject: string,
  code: string,
  preference: number
): Promise<void> {
  const User = await prisma.user.upsert({
    where: {
      username: username, // 'BergCelina',
    },
    create: {
      displayName: displayName, // 'Berg Celina',
      username: username, // 'BergCelina',
      password: 'testpassword', // bcrypt.hash('testpassword', 10),
      active: true,
      hasPeng: false,
      role: Role.USER,
    },
    update: {
      displayName: displayName, // 'Berg Celina',
      // username: username, // 'BergCelina',
      password: 'testpassword', // bcrypt.hash('testpassword', 10),
      active: true,
      hasPeng: false,
      role: Role.USER,
    },
  });

  const teachingPrefernce = await prisma.teachingPreference.upsert({
    create: {
      userId: User.id,
      /*
      userId: {
        connect: {
          id: User.id,
        },
      },*/
      // nonTeachingTerm1: nonTeachingTerm,
      // nonTeachingTerm2: nonTeachingTerm,
      hasRelief: false,
      // reliefReason: reliefReason,
      topicsOrGradCourse: false,
      // topicDescription: topicDescription,
      // Hardcoded value: Mandatory property for teachingPrefernece Table. Needs to be added in graphQL schema
      studyLeave: false,
    },
    update: {
      userId: User.id,
      /*
      User: {
        connect: {
          id: User.id,
        },
      },*/
      // nonTeachingTerm1: nonTeachingTerm,
      // nonTeachingTerm2: nonTeachingTerm,
      hasRelief: false,
      // reliefReason: reliefReason,
      topicsOrGradCourse: false,
      // topicDescription: topicDescription,
      // Hardcoded value: Mandatory property for teachingPrefernece Table. Needs to be added in graphQL schema
      studyLeave: false,
    },
    where: {
      userId: User.id /* {
        connect: {
          id: User.id,
        },
      },*/,
    },
  });

  const courseT = await prisma.course.upsert({
    create: {
      courseCode: code, // '111',
      subject: subject, // 'CSC',
      term: 'FALL',
      title: 'Advanced Mathematics+',
      streamSequence: 'A01',
    },
    update: {
      courseCode: code, // '111',
      subject: subject, // 'CSC',
      term: 'FALL',
      title: 'Advanced Mathematics+',
      streamSequence: 'A01',
    },
    where: {
      subject_courseCode_term: {
        courseCode: code, // '111',
        subject: subject, // 'CSC',
        term: 'FALL',
      },
    },
  });
  const x = await prisma.coursePreference.upsert({
    create: {
      preference: preference, // 4,
      course: {
        connect: { id: courseT.id },
      },
      teachPreference: {
        connect: { id: teachingPrefernce.id },
      },
    },

    update: {
      preference: preference, // 4,
      teachPreference: {
        connect: { id: teachingPrefernce.id },
      },
    },
    where: {
      teachPreferenceId_preference_courseId: {
        teachPreferenceId: teachingPrefernce.id,
        preference: preference, // 4,
        courseId: courseT.id,
      },
    },
  });
  console.log(x);
}

async function seedSections(): Promise<void> {
  const fallSections = historicalData?.fallTermCourses;
  const springSections = historicalData?.springTermCourses;
  const summerSections = historicalData?.summerTermCourses;

  // console.log(fallSections);
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
async function seedUserPrefs(): Promise<void> {
  userPref.professors.forEach((prof) => {
    // console.log(prof);
    const username = prof.displayName.replace(/[,\s]/g, '');
    prof.prefs.forEach((pref) => {
      const code = pref.courseNum.substring(
        pref.courseNum.length - 3,
        pref.courseNum.length
      );
      const subject = pref.courseNum.substring(0, pref.courseNum.length - 3);
      /*
      console.log(
        prof.displayName,
        ':',
        username,
        ': ',
        subject,
        ' ',
        code,
        ' ',
        pref.preferenceNum
      );*/
      // Call function
      const x = coursePreference(
        prof.displayName,
        username,
        subject,
        code,
        pref.preferenceNum
      );
      console.log(x);
    });
  });
  // const x = Object.assign({}, userPref.professors);
  // const y = Object.assign({}, x[0].)
  // console.log(x);
  // const retrieveData = userPref?.professors;
  // console.log('ghj', retrieveData.displayName);

  // Send data to function for assigning
}
// A `main` function so that you can use async/await
async function main() {
  await Promise.all([
    seedUsers(),
    seedSections(),
    // coursePreference(),
    seedUserPrefs(),
  ]);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
