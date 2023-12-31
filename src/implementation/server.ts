import fastify, { type FastifyInstance } from 'fastify'
import { FastifyJwtNamespace } from '@fastify/jwt'
import { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts'
import docs from './helpers/docs'

import { userRoutes } from './routes/user.route'
import { authRoutes } from './routes/auth.route'

import { UserRepository } from './repositories/user.repo'
import { User, UserToken } from '../core/entities/user'

export const createServer = async (basePath: string): Promise<FastifyInstance> => {

    const server = fastify().withTypeProvider<JsonSchemaToTsProvider>()

    await server.register(docs, { prefix: basePath+'/docs' })
    await server.register(require('@fastify/jwt'), {
      secret: 'nonsihamailapappapronta987324'
    })

    const userRepository = new UserRepository()
    const unprotectedRoutes = [
      '/auth',
      '/docs'
    ]

    server.addHook('onRequest', (request, reply, next) => {
      const unproc = unprotectedRoutes.filter(  //cerca se URI richiesto rientra tra quelli non protetti
        route => request.originalUrl.startsWith(basePath+route)
      )
      if (unproc.length>0 && (!request.headers.authorization || !request.headers.authorization.includes("Bearer"))) {
        next()
        return;
      }

      request.jwtVerify()
      .then((jwt)=>{
        if ((jwt as UserToken).iat < Date.now()/1000-3600) throw new Error("Token scaduto")
        else return (jwt as UserToken).payload.uuid
      })
      .then( userRepository.getUser )
      .then((res)=>{
        if (!res) throw new Error("Utente non trovato");
        (request.user as UserToken).user = new User(res)
        next()
      })
      .catch(err => {
        reply.status(401).send({message: err.toString()})
      })
    })
  
    authRoutes(userRepository, server).forEach(route => {
      server.register((fastify, opts, next) => {
          fastify.route(route);
          next();
        }, { prefix: basePath+'/auth' });
    });
    userRoutes(userRepository).forEach(route => {
      server.register((fastify, opts, next) => {
          fastify.route(route);
          next();
        }, { prefix: basePath+'/users' });
    });

    await server.ready()
    return server
}