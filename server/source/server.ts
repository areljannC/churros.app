// EXTERNAL IMPORTS
import express, { Express } from 'express';

// LOCAL IMPORTS
import { route, router } from './router';

const server: Express = express();
server.use(express.json());
server.use(route, router);

export default server;
