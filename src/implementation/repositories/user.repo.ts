import { User, UserPayload } from "../../core/entities/user";
import { IUserRepository } from "../../core/interfaces/user.iface";

import { db } from "../../core/database/connect";
import { users } from "../../core/database/schema";

import { eq } from "drizzle-orm";

export class UserRepository implements IUserRepository {
    async createUser(user: UserPayload): Promise<boolean | null> {
        return db
        .insert(users)
        .values({cf: user.cf, fullname: user.fullname})
        .then(res => {
            if (res.rowCount==1) return true
            else return false
        })
        .catch(err => {
            throw new Error()
        })
    }

    async getUser(id: string): Promise<User | null> {
        return db
        .select({fullname: users.fullname, cf:users.cf})
        .from(users)
        .where(eq(users.uuid, id))
        .then(res => {
            return res[0] as UserPayload
        })
        .catch(err => {
            return null
        })
    }
}