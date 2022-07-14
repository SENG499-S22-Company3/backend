import { Request } from 'express';
import { request } from '../algorithm';

export interface Context {
  req: any;
  res: any;
  algorithm: typeof request;
}

export async function createContext({
  req,
  res,
}: {
  req: Request;
  res: any;
}): Promise<Context> {
  return {
    req,
    res,
    algorithm: request,
  };
}
