import { Request } from "express";
import { Session, SessionData } from "express-session";
import { PrismaClient, Prisma, Role } from '@prisma/client';
import type { AuthPayload } from '../schema/graphql'
import { login } from '../auth'

const prisma = new PrismaClient();

export interface Context {
  // TODO: keep here until we have login implemented. a partial given it could be undefined
  session: Session & Partial<SessionData>;
  // TODO: add context (aka. prisma, auth, etc.)
  prisma: PrismaClient;
  logout: () => Promise<void>;
  login: (username: string, password: string) => Promise<AuthPayload>;
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
    prisma,
    login: login,
    logout: async () => new Promise((resolve) => session.destroy(resolve)),
  };
}
