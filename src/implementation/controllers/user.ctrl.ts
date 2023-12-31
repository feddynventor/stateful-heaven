import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify"

import { UserPayload, UserToken } from "../../core/entities/user"

import { IUserRepository } from "../../core/repositories/user.repo"

import { NewUserParams, VerifyUserParams } from "../schemas/user.schema"

export const verifyUser = (
    userRepository: IUserRepository,
    server: FastifyInstance
) => async function (request: FastifyRequest, reply: FastifyReply) {
    await userRepository
    .verifyUser( request.body as VerifyUserParams )
    .then(uuid => {
        reply.status(200).send({
            token: server.jwt.sign({
                payload: { uuid }
            })
        })
    }).catch(err => {
        reply.status(400).send(err)
    })
}

export const whoami = 
() => async function (request: FastifyRequest, reply: FastifyReply) {
    reply.status(200).send((request.user as UserToken).user as UserPayload)
}

export const createUser = (
    userRepository: IUserRepository,
    server: FastifyInstance
) => async function (request: FastifyRequest, reply: FastifyReply) {
    await userRepository
    .createUser( request.body as NewUserParams )
    .then(uuid => {
        reply.status(200).send({
            token: server.jwt.sign({
                payload: { uuid }
            })
        })
    }).catch(err => {
        reply.status(400).send(err)
    })
}

export const deleteUser = (
    userRepository: IUserRepository
) => async function (request: FastifyRequest, reply: FastifyReply) {
    await userRepository
    .deleteUser( (request.user as UserToken).payload.uuid )
    .then( () => {
        reply.status(200)
    })
    .catch( err => {
        reply.status(400).send({message: err.toString()})
    })
}

export const listUsers = (
    userRepository: IUserRepository
) => async function (request: FastifyRequest, reply: FastifyReply) {
    if ((request.user as UserToken).user.role != 0) {
        reply.status(401).send({message: "Entry solo per admin"})
        return
    }
    await userRepository
    .listUsers()
    .then( users => {
        reply.status(200).send(users)
    })
    .catch( err => {
        reply.status(400).send({message: err.toString()})
    })
}