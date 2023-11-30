import { type RouteOptions } from 'fastify'

import { createUser, whoami } from '../controllers/user.ctrl'
import { IUserRepository } from '../../core/interfaces/user.iface'

import { newUserSchema } from '../schemas/user.schema'

export const userRoutes = (userRepository: IUserRepository): RouteOptions[] => ([
  {
    method: 'GET',
    url: '/me',
    schema: {
      description: "Mostra dettagli utente loggato",
      tags: ["login"]
    },
    handler: whoami()
  }
])
