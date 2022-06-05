export {};

import type { AuthPayload, User } from '../schema/graphql'
import { Role } from '../schema/graphql'

const passport = require('passport');
const LocalStrategy = require('passport-local');
const crypto = require('crypto');


interface Callback<T> {
  (error: Error): void;
  (error: null, value: T): void;
}

passport.use(new LocalStrategy(function verify(username: string, password: string, cb: Callback<AuthPayload>) {
  console.log('Retreiving the username/password from DB!');
  // Add DB lookup and create userInfo
  console.log('DB LOOKUP NOT IMPLEMENTED, Allowing all passwords');

  const pwsalt = "dummysalt";
  const userInfo: User = {
    id: 1,
    username: "Test",
    active: true,
    password: "665e66e4d16835f18c88a5c1a4204e75e68169c9",
    role: Role.Admin
  }

  crypto.pbkdf2(password, pwsalt, 310000, 32, 'sha256', function(err: Error, hashedPassword: string) {
    if (err) { return cb(err); }
    //Currently will allow if if passwords DO NOT MATCH. Negate the statement to fix.
    if (crypto.timingSafeEqual(userInfo.password, password)) {
      const payload: AuthPayload = {
        message: 'Incorrect username or password',
        success: false,
        token: 'There should not be a token required for failed logins'
      }
      return cb(null, payload);
    }
    const SuccessPayload: AuthPayload = {
      message: 'Success',
      success: true,
      token: 'I do not know where this token is supposed to come from at the moment'
    }
    return cb(null, SuccessPayload);
});



/*
class LoginHandler {
  readonly username: string;
  readonly passwordHash: string;
  isAuthenticated: boolean = false;

  constructor(username: string, passwordHash: string) {
    this.username = username;
    this.passwordHash= passwordHash;
  }

  check_password(givenPassword: string): boolean {
    // Put the password checking logic here
    return false;
  }
}
*/
