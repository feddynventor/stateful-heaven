import fastify, { FastifyReply, FastifyInstance, FastifyRequest } from 'fastify'
import { FastifyJwtNamespace } from '@fastify/jwt'
import cookie from '@fastify/cookie'

import { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts'
import docs from './helpers/docs'

import { Role, User, UserToken } from '../core/entities/user'
import * as ui from './renderer/user.ui'

import { userRoutes } from './routes/user.route'
import { authRoutes } from './routes/auth.route'
import { postsRoutes } from './routes/posts.route'

import { UserRepository } from '../core/repositories/user.repo'
import { PostsRepository } from '../wordpress/repositories/posts.repo'
import { AuthorsRepository } from '../wordpress/repositories/authors.repo'
import { MediaRepository } from '../wordpress/repositories/media.repo'

declare module 'fastify' {
  export interface FastifyReply {
    payload: any
    prepare(obj: any): FastifyReply
    commit(): FastifyReply
    html(body: string, originalUrl?:string): FastifyReply
    trigger(event: string): FastifyReply
  }
  export interface RouteOptions {
    allowedUser?: Role
  }
}

export const createServer = async (basePath: string): Promise<FastifyInstance> => {

  const server = fastify().withTypeProvider<JsonSchemaToTsProvider>()

  //PLUGIN
  server.decorateReply('payload', undefined)
  server.decorateReply('prepare', function(this: FastifyReply, input: any) {
    this.payload = input
    return this
  })
  server.decorateReply('commit', function(this: FastifyReply) {
    return this.send(this.payload)
  })
  server.decorateReply('html', function(this: FastifyReply, body: string, originalUrl?: string) {
    this.header('Content-Type', 'text/html')
    // non-200 responses are sent immediately as JSON
    // error parsing on the client
    // if (this.statusCode === 200) 
      return this
        .setCookie("lastResource", this.request.originalUrl)
        .send(body)
  })
  server.decorateReply('trigger', function(this: FastifyReply, event: string) {
    return this.header("HX-Trigger-After-Swap",event)
  })
  //END PLUGIN

  await server.register(docs, { prefix: basePath+'/docs' })
  await server.register(require('@fastify/static'), {
    root: process.env['APP_ROOT']+'/src/templates',
    prefix: '/public/',
    // constraints: { host: 'example.com' } // TODO: parameterize
  })
  await server.register(require('@fastify/cookie'), {
      secret: "nonsihamailapappapronta987324",// for cookies signature
      hook: 'onRequest', // set to false to disable cookie autoparsing or set autoparsing onRequest
      parseOptions: {
        sameSite: 'strict', // can be 'strict', 'lax' or 'none'. default: 'lax'
        httpOnly: false, // readable by HTMX js library
        path: '/' // every route
      },
  })
  await server.register(require('@fastify/jwt'), {
    secret: 'nonsihamailapappapronta987324',
    cookie: {  // jwt verify from token if stored in cookie
      cookieName: 'token',
      signed: false
    }
  })

  const userRepository = new UserRepository()
  const unprotectedRoutes = [
    '/auth',
    '/docs',
    '/public',
  ]
  const route_set = {
    '/auth': authRoutes(userRepository, server),
    '/users': userRoutes(userRepository),
  }

  server.addHook('onRequest', (request, reply, next) => {
    const unproc = unprotectedRoutes.filter(  //cerca se URI richiesto rientra tra quelli non protetti
      route => (
        request.originalUrl.startsWith(basePath+route)
        || request.originalUrl.startsWith(basePath+'/api'+route)
      )
    )
    if (
      unproc.length>0 && (
      (!request.headers.authorization || !request.headers.authorization.includes("Bearer"))
      || (!request.cookies || !request.cookies.token)
    )) {
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
      if (request.originalUrl.includes('/api'))
        reply.status(401).send({message: err.toString()})
      else
        reply.html( ui.loginForm() )
    })
  })

  Object.entries(route_set)
  .forEach(([endpoint, set]) => {
    set.forEach(route => {
      // HTMX renderer
      if (route.preHandler) {
        server.register((fastify, opts, next) => {
          route.preValidation = (request, reply, done) => {
            console.log(request.user)
            if (route.allowedUser == undefined) return done()
            if (request.user && parseInt((request.user as UserToken).user.role.toString()) <= route.allowedUser) return done()
            else return reply.status(403).send({message: "Non hai i permessi necessari"})
          }
          fastify.route(route);
          next();
        }, { prefix: basePath+endpoint });
      }
      // JSON API
      server.register((fastify, opts, next) => {
        const { handler, ...rest } = route
        if (route.preHandler) {
          fastify.route({
            ...rest,
            handler: (request, reply: FastifyReply) => {
              reply.commit()
            }
          });
        } else 
          fastify.route(route);
        next();
      }, { prefix: basePath+'/api'+endpoint });
    })
  })

  await server.ready()
  return server
}