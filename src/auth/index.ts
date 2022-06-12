import type { AuthPayload, User, ChangeUserPasswordInput, Response} from '../schema/graphql';
import { Role } from '../schema/graphql';
//
const bcrypt = require('bcrypt');

export async function login(username: string, password: string): Promise<AuthPayload> {
  console.log('Fetching the username and password from DB!');
  // Add DB lookup and create userInfo
  console.log('DB LOOKUP NOT IMPLEMENTED, ONLY ALLOWING "testuser:testpassword"');

  const pwsalt = '$2b$10$ogZBif.TabQ/LoAk8LjlG.';
  // const pwsalt = bcrypt.genSaltSync(10);
  const pwhash = bcrypt.hashSync(password, pwsalt);

  console.log('Given password: ', password);
  console.log('hash: ', pwhash);
  console.log('salt: ', pwsalt);

  const userInfo: User = {
    id: 1,
    username: 'Test',
    active: true,
    password: '$2b$10$ogZBif.TabQ/LoAk8LjlG./hNq3tsWBE9OAzbc.dY/hQdYMIPhBly',
    role: Role.Admin,
  };

  const valid = await bcrypt.compare(password, userInfo.password);
  console.log('Valid:', valid);

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
  };
}

async function lookupUser(username: string): Promise<User> {
  return {
    id: -1,
    username: 'DB LOOKUP NOT IMPLEMENTED, password is "testpassword"',
    active: true,
    password: '$2b$10$ogZBif.TabQ/LoAk8LjlG./hNq3tsWBE9OAzbc.dY/hQdYMIPhBly',
    role: Role.Admin,
  };
}


export async function changePassword(username: string, pwchangeinput: ChangeUserPasswordInput): Promise<Response> {
  const userInfo = await lookupUser(username);
  const valid = await bcrypt.compare(pwchangeinput.currentPassword, userInfo.password);
  if (!valid) { // basic validation
    return {
      message: 'Incorrect previous password',
      success: false,
    };
  } else {
    // PASSWORD CHANGE DB LOGIC HERE
    console.log('UPDATING PASSWORD TO ', pwchangeinput.newPassword);
    return {
      message: 'Password Changed Succesfully',
      success: true,
    };
  }
}
