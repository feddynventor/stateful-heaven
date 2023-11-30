import { uuid, pgTable, serial, varchar, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm/sql";

export const users = pgTable(
    "users", {
        uuid: uuid('uuid').primaryKey().default(sql`gen_random_uuid()`),
        cf: varchar("cod_fiscale", {length: 16}).unique(),
        password: varchar("password", {length: 56}).notNull(),
        fullname: varchar("full_name", {length: 256})
    }, (table) => ({
        cfIdx: index("cf_idx").on(table.cf, table.uuid),
    })
)