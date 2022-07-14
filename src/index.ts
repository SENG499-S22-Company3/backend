import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import cookieParser from 'cookie-parser';
import express, { Express } from 'express';
import { NextFunction, Response } from 'express-serve-static-core';
import fs from 'fs';
import http from 'http';
import { verify } from 'jsonwebtoken';
import path from 'path';
import { algoUrl } from './algorithm';
import { createTokens } from './auth';
import { SECRET_ACCESSTOKEN, SECRET_REFRESHTOKEN } from './auth/keys';
import { createContext } from './context';
import { findUserByUsername } from './prisma/user';
import { resolvers } from './resolvers';
import { Resolvers } from './schema';

const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 4000;
const schemaPath = path.join(__dirname, 'schema/schema.graphql');

async function readSchema(schemaPath: string) {
  return await fs.promises.readFile(schemaPath, 'utf8');
}

// https://www.apollographql.com/docs/apollo-server/integrations/middleware/#apollo-server-express
async function start(app: Express, typeDefs: any, resolvers: Resolvers) {
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    // csrfPrevention: true,
    // eslint-disable-next-line new-cap
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    // TODO: add context (aka. prisma, auth, etc.)
    context: createContext,
  });

  app.use(cookieParser());
  app.use(async (req: any, res, next) => {
    const accessToken = await req.cookies['access-token'];
    const refreshToken = await req.cookies['refresh-token'];

    if (!accessToken && !refreshToken) return next();

    try {
      // Verfying Access Token
      const data = verify(accessToken, SECRET_ACCESSTOKEN) as any;
      req.user = data.user;
      return next();
    } catch {
      // Access Token Expired
    }

    if (!refreshToken) return next();

    try {
      // Verifying Refresh Token
      await tokenRefresh(refreshToken, res, req, next);
    } catch (e) {
      // Refresh Token Expired
      console.log('TOKENS Have Expired, Please Login again');
    }

    next();
  });

  await server.start();
  server.applyMiddleware({
    app,
    cors: {
      origin: ['https://studio.apollographql.com'],
      credentials: true,
    },
  });

  await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));

  console.log(
    `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
  );
}

const app = express();
isProduction && app.set('trust proxy', 1);

app.get('/healthcheck', (_req, res) => {
  res.send('OK');
});

app.get('/runtime', (_req, res) => {
  res.json(algoUrl);
});

async function main() {
  // read schema
  const schema = await readSchema(schemaPath);

  // attach Apollo Server start the web server
  start(app, schema, resolvers);
}

async function tokenRefresh(
  refreshToken: any,
  res: Response<any, Record<string, any>, number>,
  req: any,
  next: NextFunction
) {
  const data = verify(refreshToken, SECRET_REFRESHTOKEN) as any;
  const user = await findUserByUsername(data.user.username);

  if (!user) return next();

  const newTokens = await createTokens(user);

  res.cookie('refresh-token', newTokens.refreshToken);
  res.cookie('access-token', newTokens.accessToken);
  req.user = user;
}

main();
