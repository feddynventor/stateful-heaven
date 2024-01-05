import fastify, { FastifyRequest, FastifyReply, FastifyInstance } from "fastify"

import { UserPayload, UserToken } from "../../core/entities/user"

import { IUserRepository } from "../../core/repositories/user.repo"

import { NewUserParams, VerifyUserParams } from "../schemas/user.schema"

export const verifyUser = (
    userRepository: IUserRepository,
    server: FastifyInstance
) => async function (request: FastifyRequest, reply: FastifyReply) {
    return userRepository
    .verifyUser( request.body as VerifyUserParams )
    .then(uuid => {
        const token = server.jwt.sign({
            payload: { uuid }
        })
        reply
        .setCookie('token', token) //TODO cookie opts
        .status(200)
        .prepare({ token })
    }).catch(err => {
        reply.status(400).send(err)
    })
}

export const whoami = 
() => async function (request: FastifyRequest, reply: FastifyReply) {
    reply
    .status(200)
    .prepare( (request.user as UserToken).user as UserPayload )
}

export const createUser = (
    userRepository: IUserRepository,
    server: FastifyInstance
) => async function (request: FastifyRequest, reply: FastifyReply) {
    await userRepository
    .createUser( request.body as NewUserParams )
    .then(uuid => {
        const token = server.jwt.sign({
            payload: { uuid }
        })
        reply
        .setCookie('token', token) //TODO cookie opts
        .status(200)
        .prepare({ token })
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
        reply.status(401).prepare({message: "Entry solo per admin"})
        return
    }
    await userRepository
    .listUsers()
    .then( users => {
        reply.status(200).prepare(users)
    })
    .catch( err => {
        reply.status(400).send({message: err.toString()})
    })
}