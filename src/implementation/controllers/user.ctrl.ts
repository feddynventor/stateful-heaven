import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify"

import { User } from "../../core/entities/user"
import { IUserRepository } from "../../core/interfaces/user.iface"

export const verifyUser = (
    userRepository: IUserRepository,
    server: FastifyInstance
) => async function (request: FastifyRequest, reply: FastifyReply) {
    await userRepository
        .verifyUser( request.body as User )
        .then(res => {
        if (res) reply.status(200)
            .send({ token: server.jwt.sign({
                payload: {uuid: (request.body as User).uuid},
                user: {uuid: (request.body as User).uuid, ...res}
            }) })
        else
            reply.status(401)
        })
        .catch(err => {
            reply.status(400).send(err)
        })
}

export const whoami = 
() => async function (request: FastifyRequest, reply: FastifyReply) {
    reply.status(200).send( request.user )
}

export const createUser = (
    userRepository: IUserRepository
) => async function (request: FastifyRequest, reply: FastifyReply) {
    await userRepository
        .createUser(request.body as User)
        .then(res => {
            reply.status(201)
        })
        .catch(err => {
            reply.status(400).send(err)
        })
}