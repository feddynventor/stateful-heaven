import { Role, UserPayload } from "../../core/entities/user";

import { db } from "../connect";
import { users } from "../schema";

import { eq, sql } from "drizzle-orm";
import { generate, verify } from "password-hash";
import { NewUserParams, VerifyUserParams } from "../../implementation/schemas/user.schema";

export interface IUserRepository {
  getUser: (user_id: string) => Promise<UserPayload>
  deleteUser: (user_id: string, farmacia_uuid?: string) => Promise<void>
  createUser: (u: NewUserParams) => Promise<string>
  verifyUser: (u: VerifyUserParams) => Promise<string>
  listUsers: () => Promise<UserPayload[]>
}

export class UserRepository implements IUserRepository {
    async createUser(u: NewUserParams): Promise<string> {
        return db
        .insert(users)
        .values({
            email: u.email,
            password: generate(u.password),
            fullname: u.fullname,
            role: u.role,
        })
        .returning({
            insertedId: users.uuid
        })
        .then(res => {
            return res[0].insertedId
        })
    }

    async getUser(user_id: string): Promise<UserPayload> { //from Token
        return db.query.users.findFirst({
            //with: {}, customize your object with relations
            columns: {
                password: false,
                uuid: false,
            },
            where: eq(users.uuid, user_id),
            // extras: {} //https://github.com/drizzle-team/drizzle-orm/pull/1694
        }).then()
    }

    async deleteUser(user_id: string): Promise<void> {
        return db
        .delete(users)
        .where(eq(users.uuid, user_id))
        .then()
    }

    async verifyUser(u: VerifyUserParams): Promise<string> {
        // si conosce email e password, lo UUID viene usato per calcolare il token jwt
        return db.query.users.findFirst({
            where: eq(users.email, u.email)
        }).then( res => {
            if (!res) throw new Error("Utente inesistente")
            else if ( verify(u.password, res.password) ) //hash check
                return res.uuid
            else
                throw new Error("Password errata")
        })
    }

    async listUsers(): Promise<UserPayload[]> {
        return db.query.users.findMany({
            columns: {
                password: false,
                uuid: false,
            },
        }).then()
    }
}