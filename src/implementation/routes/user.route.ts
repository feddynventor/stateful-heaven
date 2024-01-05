import { type RouteOptions } from 'fastify'

import { deleteUser, listUsers, whoami } from '../controllers/user.ctrl'
import { IUserRepository } from '../../core/repositories/user.repo'

import * as ui from '../renderer/user.ui'

export const userRoutes = (userRepository: IUserRepository): RouteOptions[] => ([
  {
    method: 'GET',
    url: '/me',
    schema: {
      description: "Mostra dettagli utente loggato",
      tags: ["user"],
      security: [{ Bearer: [] }],
    },
    preHandler: whoami(),
    handler: (request, reply) => {
      if (reply.statusCode !== 200)
        reply.html( ui.loginForm() )
      else
        reply.html( ui.userInfo(reply.payload) )
    }
  },{
    method: 'DELETE',
    url: '/',
    schema: {
      description: "Elimina utente loggato",
      tags: ["user"],
      security: [{ Bearer: [] }],
    },
    handler: deleteUser(userRepository)
  },{
    method: 'GET',
    url: '/',
    schema: {
      description: "Lista utenti",
      tags: ["user"],
      security: [{ Bearer: [] }],
    },
    preHandler: listUsers(userRepository),
    handler: (request, reply) => {
      reply.html( ui.usersList(reply.payload) )
    }
  }
])
