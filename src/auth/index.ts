export { verify };
//
import type { AuthPayload, User } from '../schema/graphql';
import { Role } from '../schema/graphql';
//
const bcrypt = require('bcrypt');

async function verify(username: string, password: string): Promise<AuthPayload> {
  console.log('Fetching the username and password from DB!');
  // Add DB lookup and create userInfo
  console.log('DB LOOKUP NOT IMPLEMENTED, ONLY ALLOWING "testuser:testpassword"');
  // const pwsalt = 'dummysalt';
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

  const token = require('crypto').randomBytes(32).toString('hex');
  console.log('Token:', token);
  console.log('STORING TOKEN IN DB');
  console.log('NOT IMPLEMENTED');

  if (!valid) {
    return {
      message: 'Incorrect username or password',
      success: false,
      token: 'Invalid',
    };
  } else {
    return {
      message: 'Success',
      success: true,
      token: token,
    };
  };
}
