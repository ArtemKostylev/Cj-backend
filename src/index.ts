const {ApolloServer} = require('apollo-server-express');
const {createApolloServerProps} = require('./createApolloServerProps');
import {PrismaClient, User} from '@prisma/client';

const {getUserInfo} = require('./utils');
const {graphqlUploadExpress} = require('graphql-upload');
const {ApolloServerPluginLandingPageGraphQLPlayground} = require('apollo-server-core');
const {makeExecutableSchema} = require('@graphql-tools/schema');
import express, {Request} from 'express';

export type Context = {
  user: User;
  prisma: PrismaClient;
}

async function startApolloServer() {
  const prisma = new PrismaClient();

  const {typeDefs, resolvers} = createApolloServerProps();
  const server = new ApolloServer({
    schema: makeExecutableSchema({typeDefs, resolvers}),
    cacheControl: {
      calculateHttpHeaders: false,
    },
    context: async ({req}: { req: Request }) => {
      return {
        prisma,
        user: await getUserInfo(req, prisma),
      };
    },
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  });

  await server.start();

  const app = express();

  app.use(graphqlUploadExpress());

  server.applyMiddleware({
    app,
    path: '/',
  });

  await new Promise((resolve) => app.listen({port: 4000}, resolve as () => void));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startApolloServer();
