import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import express, { Express } from "express";
import session from "express-session";
import http from "http";
import fs from "fs";
import path from "path";
import { Resolvers } from "./schema";
import { createContext } from "./context";
import { resolvers } from "./resolvers";

const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT || 4000;
const schemaPath = path.join(__dirname, "schema/schema.graphql");

const sessionConfig: session.SessionOptions = {
  secret: process.env.SESSION_SECRET || "donotuseinproduction",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: isProduction,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
  },
};

async function readSchema(schemaPath: string) {
  return await fs.promises.readFile(schemaPath, "utf8");
}

// https://www.apollographql.com/docs/apollo-server/integrations/middleware/#apollo-server-express
async function start(app: Express, typeDefs: any, resolvers: Resolvers) {
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    // csrfPrevention: true,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    // TODO: add context (aka. prisma, auth, etc.)
    context: createContext,
  });

  await server.start();
  server.applyMiddleware({
    app,
    cors: {
      origin: ["https://studio.apollographql.com"],
      credentials: true,
    },
  });
  // can apply middleware here (auth etc.)

  await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));

  console.log(
    `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
  );
}

const app = express();
app.use(session(sessionConfig));
isProduction && app.set("trust proxy", 1);

async function main() {
  // read schema
  const schema = await readSchema(schemaPath);

  // attach Apollo Server start the web server
  start(app, schema, resolvers);
}

main();
