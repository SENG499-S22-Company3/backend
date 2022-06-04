
class LoginHandler {
  username: string;
  passwordHash: string;
  isAuthenticated: boolean;

  constructor(username: string, passwordHash: string) {
    this.username = username;
    this.passwordHash= passwordHash;
    this.isAuthenticated = false;
  }

  check_password(givenPassword: string): boolean {
    // Put the password checking logic here
    return false;
  }
}
