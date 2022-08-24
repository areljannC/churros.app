// EXTERNAL IMPORTS
import 'module-alias/register';
import dotenv from 'dotenv';

// SHARED IMPORTS
import { config } from '@constants';
import { dbClient } from '@database';

// LOCAL IMPORTS
import server from './server';

dotenv.config();

(async () => {
  await dbClient.connect();

  server.listen(config.server.port, () => {
    console.log(`Server is running at https://localhost:${config.server.port}`);
  });
})();
