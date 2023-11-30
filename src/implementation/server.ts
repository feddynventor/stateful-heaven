import fastify, { type FastifyInstance, type FastifyServerOptions } from 'fastify'
import { FastifyJwtNamespace } from '@fastify/jwt'
import { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts'

import { userRoutes } from './routes/user.route'
import { authRoutes } from './routes/auth.route'

import { UserRepository } from './repositories/user.repo'
import docs from './helpers/docs'

export const createServer = async (): Promise<FastifyInstance> => {

    const server = fastify().withTypeProvider<JsonSchemaToTsProvider>()
  
    await server.register(docs)
    await server.register(require('@fastify/jwt'), {
      secret: 'nonsihamailapappapronta987324'
    })
  
    const userRepository = new UserRepository()
    authRoutes(userRepository, server).forEach(route => {
      server.register((fastify, opts, next) => {
          fastify.route(route);
          next();
        }, { prefix: '/auth' });
    });
    userRoutes(userRepository).forEach(route => {
      server.register((fastify, opts, next) => {
          fastify.addHook('onRequest', (request) => request.jwtVerify())
          fastify.route(route);
          next();
        }, { prefix: '/users' });
    });

    await server.ready()
    return server
}