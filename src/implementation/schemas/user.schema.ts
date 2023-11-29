import { FastifySchema } from "fastify";
import { FromSchema } from "json-schema-to-ts";
import { type User } from "../../core/entities/user";

const getUserParams = {
    type: "object",
    properties: {
        id: { type: "string" },
    },
    required: ["id"],
} as const;
export type GetUserParams = FromSchema<typeof getUserParams>;

export const getUserSchema: FastifySchema = {
    description: 'Ritorna utente da id',
    tags: ['users'],
    querystring: getUserParams
}

const newUserParams = {
    type: "object",
    properties: {
        cf: { type: "string"},
        fullname: { type: "string" }
    },
    required: ["cf","fullname"],
} as const;
export type NewUserParams = FromSchema<typeof newUserParams>

export const newUserSchema: FastifySchema = {
    description: 'Aggiungi nuovo utente',
    tags: ['users'],
    body: newUserParams
}