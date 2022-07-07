import session from 'express-session';
import { FullUser } from './src/resolvers/resolverUtils';

declare module 'express-session' {
  interface SessionData {
    user: FullUser;
  }
}
