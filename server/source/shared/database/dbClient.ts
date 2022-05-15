// EXTERNAL IMPORTS
import { Client } from 'pg';

// SHARED IMPORTS
import { config } from '../constants';

const dbClient = new Client({
  user: config.db.user,
  password: config.db.password,
  host: config.db.host,
  port: config.db.port
});

export default dbClient;
