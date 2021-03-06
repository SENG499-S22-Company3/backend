import { Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import generator from 'generate-password';
import { JwtPayload, sign } from 'jsonwebtoken';
import type { Context } from '../context';
import { prisma } from '../prisma';
import { findUserByUsername } from '../prisma/user';
import type {
  AuthPayload,
  ChangeUserPasswordInput,
  CreateUserMutationResult,
  GenerateScheduleInput,
  Response,
} from '../schema/graphql';
import { SECRET_ACCESSTOKEN } from './keys';
export {
  login,
  changePassword,
  createNewUser,
  generateSchedule,
  resetPassword,
};

// User with username testuser and password testpassword
// username: 'testuser',
// password: '$2b$10$ogZBif.TabQ/LoAk8LjlG./hNq3tsWBE9OAzbc.dY/hQdYMIPhBly',

const failedAuth: AuthPayload = {
  message: 'Incorrect username or password',
  success: false,
  token: '', // Won't be needed anymore
};

const failScheduleGenerate: Response = {
  message: `No schedule available for the input year`,
  success: false,
};
const invalidYearInput: Response = {
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
      token: '',
    };
  } else {
    const accessToken = sign(
      {
        username: user.username,
      },
      SECRET_ACCESSTOKEN,
      { expiresIn: '2 days' }
    ); // token expires in 2 days

    return {
      message: 'Success',
      success: true,
      token: accessToken,
    };
  }
}

async function changePassword(
  user: JwtPayload,
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

    const hash = bcrypt.hashSync(newPassword, 10);
    await prisma.user.update({
      where: {
        username: user.username,
      },
      data: {
        password: hash,
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
        // so the user can be with a displayname
        displayName: username,
        username: username,
        password:
          '$2b$10$ogZBif.TabQ/LoAk8LjlG./hNq3tsWBE9OAzbc.dY/hQdYMIPhBly',
        active: true,
        hasPeng: false,
        role: 'USER',
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

async function resetPassword(userId: number | string) {
  const newPassword = generator.generate({
    length: 16,
    numbers: true,
  });

  const hash = await bcrypt.hash(newPassword, 10);

  if (typeof userId === 'string') {
    userId = parseInt(userId);
  }

  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hash,
      },
    });
    return {
      success: true,
      message: `Reset password of user ${userId} successfully`,
      password: newPassword,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: `Failed to reset password of user ${userId}`,
    };
  }
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
