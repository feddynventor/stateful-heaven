import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
 
// https://orm.drizzle.team/docs/quick-postgresql/node-postgres
const client = new Client({
  host: "127.0.0.1",
  port: 5432,
  user: "admin",
  password: "admin",
  database: "testing",
});
 
client.connect();
export const db = drizzle(client);