import { Http2ServerRequest } from "http2";
import { PrismaClient } from "@prisma/client";

const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { createApolloServerProps } = require("./createApolloServerProps.js");
const { getUserId } = require("./utils.js");
const { graphqlUploadExpress } = require("graphql-upload");
const { ApolloServerPluginLandingPageGraphQLPlayground } = require("apollo-server-core");
const { makeExecutableSchema } = require("@graphql-tools/schema");

export type Context = {
  userId: (req: any) => void;
  prisma: PrismaClient;
}

async function startApolloServer() {
  const prisma: PrismaClient = new PrismaClient();

  const { typeDefs, resolvers } = createApolloServerProps();

  const server = new ApolloServer({
    schema: makeExecutableSchema({ typeDefs, resolvers }),
    cacheControl: {
      calculateHttpHeaders: false
    },
    context: ({ req }: { req: Http2ServerRequest }) => {
      return {
        prisma,
        userId: getUserId(req)
      };
    },
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()]
  });

  await server.start();

  const app = express();

  app.use(graphqlUploadExpress());

  server.applyMiddleware({
    app,
    path: "/"
  });

  await new Promise((resolve) => app.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startApolloServer();
