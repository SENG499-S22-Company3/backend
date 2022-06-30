import { Prisma, User } from '@prisma/client';
import { findUserByUsername } from '../prisma/user';
import { prisma } from '../prisma';
import bcrypt from 'bcrypt';
import type {
  AuthPayload,
  ChangeUserPasswordInput,
  Response,
  CreateUserMutationResult,
  GenerateScheduleInput,
  CreateTeachingPreferenceInput,
} from '../schema/graphql';
import type { Context } from '../context';
export {
  login,
  changePassword,
  createNewUser,
  createTeachingPreference,
  generateSchedule,
};

// User with username testuser and password testpassword
// username: 'testuser',
// password: '$2b$10$ogZBif.TabQ/LoAk8LjlG./hNq3tsWBE9OAzbc.dY/hQdYMIPhBly',

const failedAuth = {
  message: 'Incorrect username or password',
  success: false,
  token: '', // Won't be needed anymore
};
/*
const failScheduleGenerate = {
  message: `No schedule available for the input year`,
  success: false,
};
const invalidYearInput = {
  message: `Invalid year input. Year format: YYYY`,
  success: false,
};
*/
const invalidUserId = {
  message: `userId does not exist. Please input valid userId`,
  success: false,
};

const failScheduleGenerate = {
  message: `No schedule available for the input year`,
  success: false,
};
const invalidYearInput = {
  message: `Invalid year input. Year format: YYYY`,
  success: false,
};

async function login(
  ctx: Context,
  username: string,
  password: string
): Promise<AuthPayload> {
  const user = await findUserByUsername(username);

  if (user === null) return failedAuth;

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    return {
      message: 'Incorrect username or password',
      success: false,
      token: '', // Won't be needed anymore
    };
  } else {
    ctx.session.user = user;
    return {
      message: 'Success',
      success: true,
      token: '',
    };
  }
}

async function changePassword(
  user: User,
  { currentPassword, newPassword }: ChangeUserPasswordInput
): Promise<Response> {
  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) {
    return {
      message: 'Incorrect previous password',
      success: false,
    };
  } else {
    console.log('UPDATING PASSWORD TO', newPassword);
    const pwsalt = bcrypt.genSaltSync(10);
    const pwhash = bcrypt.hashSync(newPassword, pwsalt);
    await prisma.user.update({
      where: {
        username: user.username,
      },
      data: {
        password: pwhash,
      },
    });
    return {
      message: 'Password Changed Successfully',
      success: true,
    };
  }
}

async function createNewUser(
  username: string
): Promise<CreateUserMutationResult> {
  try {
    await prisma.user.create({
      data: {
        username: username,
        password:
          '$2b$10$ogZBif.TabQ/LoAk8LjlG./hNq3tsWBE9OAzbc.dY/hQdYMIPhBly',
        active: false,
        hasPeng: false,
      },
    });
  } catch (e: unknown) {
    // P2002 is the code for unique constraint violation
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === 'P2002'
    ) {
      return {
        message: `Failed to create user, username '${username}' already exists.`,
        success: false,
      };
    } else {
      throw e;
    }
  }

  return {
    message:
      "User created successfully with password 'testpassword'. Please login and change it.",
    success: true,
    username: username,
    password: 'testpassword',
  };
}

async function createTeachingPreference(
  user: User,
  { peng, userId, courses }: CreateTeachingPreferenceInput
): Promise<Response> {
  try {
    if (Number(userId) !== user.id) {
      console.log('userId: ', Number(userId), 'id: ', user.id);
      return invalidUserId;
    }
    // userId in teachingPreference model === id in user model
    await prisma.teachingPreference.create({
      data: {
        userId: Number(userId),
        // Hardcoded values populated for now
        hasRelief: false,
        studyLeave: false,
        topicsOrGradCourse: false,
      },
    });

    await prisma.course.create({
      data: {
        title: 'aj',
        courseCode: courses[0].code,
        subject: courses[0].subject,
        term: courses[0].term,
      },
    });
    // Update hasPeng property (which is by default false) based on survey input
    await prisma.user.update({
      where: {
        id: +userId,
      },
      data: {
        hasPeng: peng,
      },
    });

    await prisma.coursePreference.create({
      data: {
        preference: courses[0].preference,
        // Hardcoded for now. Doesnt work without it
        courseId: 14,
      },
    });
  } catch (error: any) {
    if (error.code === 'P2003') {
      return {
        message: `Course has no id 1`,
        success: false,
      };
    }
    throw error;
  }

  return {
    message: 'Preference Survey Created',
    success: true,
  };
}

function checkDigits(year: number) {
  const numOfDigits = year.toString().length;
  return numOfDigits;
}
async function generateSchedule(
  year: GenerateScheduleInput
): Promise<Response> {
  const numOfDigits = checkDigits(year.year);
  if (numOfDigits !== 4) return invalidYearInput;
  else if (!year.year || year.year < 1990) return failScheduleGenerate;
  return {
    message: `Generating Schedule for Year: ${year.year}`,
    success: true,
  };
}
