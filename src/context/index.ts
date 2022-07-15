import { ExpressContext } from 'apollo-server-express';
import { request } from '../algorithm';

export interface Context {
  req: any;
  algorithm: typeof request;
}

export async function createContext({
  req,
}: {
  req: ExpressContext;
}): Promise<Context> {
  return {
    req,
    algorithm: request,
  };
}
