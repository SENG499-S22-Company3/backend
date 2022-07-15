import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import express, { Express } from 'express';
import fs from 'fs';
import http from 'http';
import path from 'path';
import { algoUrl } from './algorithm';
import { createContext } from './context';
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

main();
