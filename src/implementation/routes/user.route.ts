import { type RouteOptions } from 'fastify'

import { deleteUser, listUsers, whoami } from '../controllers/user.ctrl'
import { IUserRepository } from '../../core/interfaces/user.iface'

export const userRoutes = (userRepository: IUserRepository): RouteOptions[] => ([
  {
    method: 'GET',
    url: '/me',
    schema: {
      description: "Mostra dettagli utente loggato",
      tags: ["user"],
      security: [{ Bearer: [] }],
    },
    handler: whoami()
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
    handler: listUsers(userRepository)
  }
])
