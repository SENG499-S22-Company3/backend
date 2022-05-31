import { Request } from "express";

export interface Context {
  // example
  username?: string;
  // TODO: add context (aka. prisma, auth, etc.)
}

export async function createContext(req: Request): Promise<Context> {
  return {
    username: "some username",
  };
}
