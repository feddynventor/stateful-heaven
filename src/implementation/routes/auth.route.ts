import { FastifyInstance, type RouteOptions } from 'fastify'

import { IUserRepository } from '../../core/repositories/user.repo'

import { newUserSchema, verifyUserSchema } from '../schemas/user.schema'
import { createUser, verifyUser } from '../controllers/user.ctrl'

import * as ui from '../renderer/user.ui'

export const authRoutes = (userRepository: IUserRepository, server: FastifyInstance): RouteOptions[] => ([
  {
    method: 'POST',
    url: '/login',
    schema: verifyUserSchema,
    preHandler: verifyUser(userRepository, server),
    handler: (request, reply) => {
      console.log(reply.payload, reply.statusCode)
      if (reply.statusCode !== 200)
        reply.html( ui.loginForm() )
      else
        reply
          .trigger('user_logged_state')
          .redirect(302, request.cookies['lastResource']||'/users/me')
        // `lastResource` settato ad ogni richiesta con successo 200
    }
  },{
    method: 'POST',
    url: '/signup',
    schema: newUserSchema,
    handler: createUser(userRepository, server)
  },{
    method: 'GET',
    url: '/logout',
    schema: {
      description: "Rimuove il cookie dalla sessione",
      tags: ["login"],
      security: [{ Bearer: [] }],
    },
    handler: (request, reply) => {  // no repository needed
      reply
        .setCookie('token','deleted')
        .trigger('user_logged_state')
        .html( ui.loginForm() )
        // .redirect("/users/me")
    }
  }
])
