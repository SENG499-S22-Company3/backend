import { Prisma, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import generator from 'generate-password';
import { sign } from 'jsonwebtoken';
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
import { SECRET_ACCESSTOKEN, SECRET_REFRESHTOKEN } from './keys';
export {
  login,
  logout,
  changePassword,
  createNewUser,
  generateSchedule,
  resetPassword,
  createTokens,
};

// User with username testuser and password testpassword
// username: 'testuser',
// password: '$2b$10$ogZBif.TabQ/LoAk8LjlG./hNq3tsWBE9OAzbc.dY/hQdYMIPhBly',

const failedAuth = {
  message: 'Incorrect username or password',
  success: false,
  token: '', // Won't be needed anymore
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
      token: '',
    };
  } else {
    const tokens = await createTokens(user);
    ctx.res.cookie('refresh-token', tokens.refreshToken);
    ctx.res.cookie('access-token', tokens.accessToken);
    return {
      message: 'Success',
      success: true,
      token: tokens.accessToken,
    };
  }
}

async function logout(ctx: Context) {
  ctx.res.clearCookie('access-token');
  ctx.res.clearCookie('refresh-token');
  return {
    message: 'Logged out Succesfully',
    success: true,
    token: '',
  };
}

async function createTokens(user: User) {
  const accessToken = sign(
    {
      user: user,
    },
    SECRET_ACCESSTOKEN,
    { expiresIn: '15s' } // Set Expiry Time
  );

  const refreshToken = sign(
    {
      user: user,
    },
    SECRET_REFRESHTOKEN,
    { expiresIn: '7d' }
  );
  return { accessToken, refreshToken }; // Set Expiry Time
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

async function resetPassword(userId: number | string) {
  const newPassword = generator.generate({
    length: 16,
    numbers: true,
  });

  const pwsalt = bcrypt.genSaltSync(10);
  const pwhash = bcrypt.hashSync(newPassword, pwsalt);

  if (typeof userId === 'string') {
    userId = parseInt(userId);
  }

  try {
    await prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        password: pwhash,
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
