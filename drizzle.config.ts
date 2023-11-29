import type { Config } from "drizzle-kit"

// https://orm.drizzle.team/kit-docs/conf

export default {
  schema: './src/core/database/schema.ts',
  out: './migrations',
  dbCredentials: {
    //drizzle-toolkit entrypoint
    connectionString: "postgres://admin:admin@127.0.0.1:5432/testing",
  },
  driver: "pg",
} satisfies Config;