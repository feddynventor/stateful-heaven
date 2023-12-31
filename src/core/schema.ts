import { uuid, pgTable, serial, varchar, index, pgEnum } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm/sql";

export const userRoles = pgEnum('roles', ['0','1','2']);

export const users = pgTable(
    "users", {
        uuid: uuid('uuid').primaryKey().default(sql`gen_random_uuid()`),
        email: varchar("email", {length: 16}).unique(),
        password: varchar("password", {length: 56}).notNull(),
        fullname: varchar("full_name", {length: 256}).notNull(),
        role: userRoles("roles").default("2").notNull()
    }, (table) => ({
        cfIdx: index("cf_idx").on(table.email, table.uuid),
    })
)