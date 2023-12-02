import { createServer } from "./src/implementation/server";

(async ()=>{
    (await createServer()).listen({port: 80, host: "0.0.0.0"})
})()