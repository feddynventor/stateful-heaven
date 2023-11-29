import { FastifyRequest, FastifyReply } from "fastify"

import { UserPayload } from "../../core/entities/user"
import { IUserRepository } from "../../core/interfaces/user.iface"

import { GetUserParams } from "../schemas/user.schema"

export const createUser = (
    userRepository: IUserRepository
) => async function (request: FastifyRequest, reply: FastifyReply) {
    await userRepository
        .createUser(request.body as UserPayload)
        .then(res => {
            reply.status(201)
        })
        .catch(err => {
            reply.status(503).send(err)
        })
}

export const getUser = (
    userRepository: IUserRepository
) => async function (
    request: FastifyRequest,
    reply: FastifyReply) {
    await userRepository
        .getUser( (request.query as GetUserParams).id )
        .then(res => {
            if (res) reply.status(200).send(res)
            else reply.status(404)
        })
        .catch(err => {
            reply.status(500)
        })
}