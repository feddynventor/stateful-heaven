import { createServer } from "./src/implementation/server";

(async ()=>{
    (await createServer()).listen({port: 8989, host: "0.0.0.0"})
})()