import { User, UserPayload } from "../../core/entities/user";
import { IUserRepository } from "../../core/interfaces/user.iface";

import { db } from "../../core/database/connect";
import { users } from "../../core/database/schema";

import { eq } from "drizzle-orm";
import { generate, verify } from "password-hash";

export class UserRepository implements IUserRepository {
    async createUser(u: User): Promise<boolean> {
        return db
        .insert(users)
        .values({
            cf: u.cf,
            password: generate(u.password),
            fullname: u.fullname
        })
        .then(res => {
            if (res.rowCount==1) return true
            else return false
        })
        .catch(err => {
            throw new Error(err)
        })
    }

    async verifyUser(u: User): Promise<UserPayload> {
        return db
        .select({
            password: users.password,
            fullname: users.fullname,
            cf: users.cf,
            // ...
        })
        .from(users).where(eq(users.cf, u.cf))
        .then(res => {
            if (verify(u.password, res[0].password)){
                const { password, ...rest} = res[0];
                return rest as UserPayload
            } else
                throw new Error("Password errata")
        })
        .catch(err => {
            throw new Error(err)
        })
    }
}