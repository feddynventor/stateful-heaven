import fastify, { type FastifyInstance, type FastifyServerOptions } from 'fastify'
import { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts'

import { userRoutes } from './routes/user.route'

import { UserRepository } from './repositories/user.repo'
import docs from './helpers/docs'

export const createServer = async (): Promise<FastifyInstance> => {

    const server = fastify().withTypeProvider<JsonSchemaToTsProvider>()
  
    await server.register(docs)
  
    const userRepository = new UserRepository()
    userRoutes(userRepository).forEach(route => {
      server.register((fastify, opts, next) => {
          fastify.route(route);
          next();
        }, { prefix: '/users' });
    });

    await server.ready()
    return server
}
  