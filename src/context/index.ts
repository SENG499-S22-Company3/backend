import { Request } from 'express';
import { Session, SessionData } from 'express-session';
import { DefaultApi as Algo1 } from '../client/algorithm1/api';
import { DefaultApi as Algo2 } from '../client/algorithm2/api';

// Instantiate api clients
const algorithm1 = new Algo1(process.env.ALGO1_API_URL);
const algorithm2 = new Algo2(process.env.ALGO1_API_URL);

export interface Context {
  // TODO: keep here until we have login implemented. a partial given it could be undefined
  session: Session & Partial<SessionData>;
  // TODO: add context (aka. prisma, auth, etc.)
  logout: () => Promise<void>;
  // dependencies
  algorithm1: Algo1;
  algorithm2: Algo2;
}

export async function createContext({
  req,
}: {
  req: Request;
}): Promise<Context> {
  // TODO: add any request specific context (aka. prisma, auth, etc.)
  // TODO: check for session with cookie
  const { session } = req;
  return {
    session,
    logout: async () => new Promise((resolve) => session.destroy(resolve)),
    algorithm1,
    algorithm2,
  };
}
