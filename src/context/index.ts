import { Request } from "express";
import { Session, SessionData } from "express-session";

export interface Context {
  // example context value
  username?: string;
  // TODO: keep here until we have login implemented. a partial given it could be undefined
  session: Session & Partial<SessionData>;
  // TODO: add context (aka. prisma, auth, etc.)
  token: string;
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
    username: 'some username',
    token: 'some token that should be sent back with every request',
    logout: async () => new Promise((resolve) => session.destroy(resolve)),
  };
}
