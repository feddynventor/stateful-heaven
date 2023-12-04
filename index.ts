import { createServer } from "./src/implementation/server";
import dotenv from 'dotenv'; 
dotenv.config();  // Load environment variables from .env file 

(async ()=>{
    if (process.env.API_PORT)
        (await createServer()).listen({port: parseInt(process.env.API_PORT), host: "0.0.0.0"})
    else
        (await createServer()).listen({port: 80, host: "0.0.0.0"})
})()