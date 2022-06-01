import { Request } from "express";

export interface Context {
  // example context value
  username?: string;
  // TODO: add context (aka. prisma, auth, etc.)
}

export async function createContext(req: Request): Promise<Context> {
  // TODO: add any request specific context (aka. prisma, auth, etc.)
  // TODO: check for session with cookie
  return {
    username: "some username",
  };
}
