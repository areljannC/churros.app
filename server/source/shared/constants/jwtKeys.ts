// EXTERNAL IMPORTS
import fs from 'fs';
import path from 'path';

export const privateKey = fs.readFileSync(
  path.resolve(__dirname, '.../../../../../jwtPrivate.key'),
  'utf8'
);
export const publicKey = fs.readFileSync(
  path.resolve(__dirname, '.../../../../../jwtPublic.key'),
  'utf8'
);
