// EXTERNAL IMPORTS
import dotenv from 'dotenv';
import express, { Express } from 'express';

// SHARED IMPORTS
import { dbClient } from './shared/database';
import { config } from './shared/constants';

// LOCAL IMPORTS
import { route, router } from './router';

dotenv.config();

const server: Express = express();
server.use(express.json());
server.use(route, router);

(async () => {
  await dbClient.connect();

  server.listen(config.server.port, () => {
    console.log(`Server is running at https://localhost:${config.server.port}`);
  });
})();
