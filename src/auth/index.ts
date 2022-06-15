import { PrismaClient, Prisma, Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import type {
  AuthPayload,
  ChangeUserPasswordInput,
  Response,
  CreateUserMutationResult,
} from '../schema/graphql';

// User with username testuser and password testpassword
// username: 'testuser',
// password: '$2b$10$ogZBif.TabQ/LoAk8LjlG./hNq3tsWBE9OAzbc.dY/hQdYMIPhBly',

const prisma = new PrismaClient();

export async function login(
  username: string,
  password: string
): Promise<AuthPayload> {
  const user = await lookupUser(username);

  const failedAuth = {
    message: 'Incorrect username or password',
    success: false,
    token: '', // Won't be needed anymore
  };

  if (user === null) return failedAuth;

  const valid = await bcrypt.compare(password, user!.password);

  if (!valid) {
    return {
      message: 'Incorrect username or password',
      success: false,
      token: '', // Won't be needed anymore
    };
  } else {
    return {
      message: 'Success',
      success: true,
      token: '',
    };
  }
}

export async function changePassword(
  username: string,
  pwchangeinput: ChangeUserPasswordInput
): Promise<Response> {
  const user = await lookupUser(username);
  const valid = await bcrypt.compare(
    pwchangeinput.currentPassword,
    user!.password
  );
  if (!valid) {
    // basic validation
    return {
      message: 'Incorrect previous password',
      success: false,
    };
  } else {
    console.log('UPDATING PASSWORD TO ', pwchangeinput.newPassword);
    const pwsalt = bcrypt.genSaltSync(10);
    const pwhash = bcrypt.hashSync(pwchangeinput.newPassword, pwsalt);
    await prisma.user.update({
      where: {
        username: username,
      },
      data: {
        password: pwhash,
      },
    });
    return {
      message: 'Password Changed Succesfully',
      success: true,
    };
  }
}

export async function createNewUser(
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

export async function isAdmin(username: string): Promise<boolean> {
  const user = await lookupUser(username);
  if (user === null) {
    throw Error(`User ${username} was not found in the database`);
  }
  return user!.role === Role.ADMIN;
}

async function lookupUser(username: string) {
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });
  console.log(user);
  return user;
}
