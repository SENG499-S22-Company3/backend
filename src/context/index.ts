import { Request } from 'express';
import { request } from '../algorithm';
import { verifyToken } from '../auth/verifier';
import { findUserByUsername } from '../prisma/user';
import { FullUser } from '../resolvers/resolverUtils';

export interface Context {
  user?: FullUser;
  algorithm: typeof request;
}

export async function createContext({
  req,
}: {
  req: Request;
}): Promise<Context> {
  const payload = verifyToken(req);
  if (!payload || typeof payload === 'string' || !payload.username)
    return { algorithm: request };

  const user = await findUserByUsername(payload.username);
  if (!user) return { algorithm: request };

  return {
    algorithm: request,
    user: user,
  };
}
