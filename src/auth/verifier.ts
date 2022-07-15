import { JwtPayload, verify } from 'jsonwebtoken';
import { SECRET_ACCESSTOKEN } from './keys';

export const verifyLogin = (req: any, requireAuth = true) => {
  const header = req.headers.authorization;
  if (header) {
    const accessToken = header;
    try {
      const userInfo = verify(accessToken, SECRET_ACCESSTOKEN) as JwtPayload;
      return userInfo;
    } catch (e) {
      console.log('Token Expired');
    }
  }

  if (requireAuth) console.log('Token not Set Yet');
  return null;
};
