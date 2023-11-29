import { type RouteOptions } from 'fastify'

import { createUser, getUser } from '../controllers/user.ctrl'
import { IUserRepository } from '../../core/interfaces/user.iface'

import { getUserSchema, newUserSchema } from '../schemas/user.schema'

export const userRoutes = (userRepository: IUserRepository): RouteOptions[] => ([
  {
    method: 'GET',
    url: '/',
    schema: getUserSchema,
    handler: getUser(userRepository)
  },{
    method: 'POST',
    url: '/',
    schema: newUserSchema,
    handler: createUser(userRepository)
  }
])
