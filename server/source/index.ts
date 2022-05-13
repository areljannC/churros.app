// EXTERNAL IMPORTS
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

// LOCAL IMPORTS
import { route, router } from './router'

dotenv.config();

const server: Express = express();
const port = process.env.PORT;

// Setup server router
server.use(route, router);

server.listen(port, () => {
  console.log(`Server is running at https://localhost:${port}`);
});
