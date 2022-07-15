import { Request } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import { SECRET_ACCESSTOKEN } from './keys';

export const verifyToken = (req: Request): string | JwtPayload | null => {
  const token = req.headers.authorization;
  if (!token) return null;

  try {
    const payload = verify(token, SECRET_ACCESSTOKEN);
    return payload;
  } catch (e) {
    console.error(e);
  }

  return null;
};
