import { Request } from 'express';
import { Session, SessionData } from 'express-session';

export interface Context {
  // TODO: keep here until we have login implemented. a partial given it could be undefined
  session: Session & Partial<SessionData>;
  // TODO: add context (aka. prisma, auth, etc.)
  logout: () => Promise<void>;
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
  };
}
